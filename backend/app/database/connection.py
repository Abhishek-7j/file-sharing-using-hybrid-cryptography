import os
import asyncio
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

logger = logging.getLogger("identity_dna.db")

class EmbeddedCollection:
    """In-memory collection with optional JSON persistence for instant zero-dependency execution."""
    def __init__(self, name: str, filepath: str):
        self.name = name
        self.filepath = filepath
        self.docs: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    self.docs = json.load(f)
            except Exception as e:
                logger.warning(f"Could not load JSON db {self.filepath}: {e}")
                self.docs = []

    def _save(self):
        try:
            os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self.docs, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving collection {self.name}: {e}")

    async def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        self.docs.append(doc_copy)
        self._save()
        class InsertResult:
            inserted_id = doc_copy["_id"]
        return InsertResult()

    async def find_one(self, filter_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for d in self.docs:
            match = True
            for k, v in filter_dict.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                return dict(d)
        return None

    def find(self, filter_dict: Optional[Dict[str, Any]] = None):
        filter_dict = filter_dict or {}
        matches = []
        for d in self.docs:
            match = True
            for k, v in filter_dict.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                matches.append(dict(d))
        
        class Cursor:
            def __init__(self, data):
                self.data = data
            def sort(self, key_or_list, direction=1):
                if isinstance(key_or_list, str):
                    key = key_or_list
                    rev = (direction == -1)
                elif isinstance(key_or_list, list) and len(key_or_list) > 0:
                    key = key_or_list[0][0]
                    rev = (key_or_list[0][1] == -1)
                else:
                    return self
                self.data = sorted(self.data, key=lambda x: str(x.get(key, '')), reverse=rev)
                return self
            def limit(self, count: int):
                self.data = self.data[:count]
                return self
            def to_list(self, length: Optional[int] = None):
                if length is not None:
                    return self.data[:length]
                return self.data
            def __iter__(self):
                return iter(self.data)
            async def __aiter__(self):
                for item in self.data:
                    yield item
        return Cursor(matches)

    async def update_one(self, filter_dict: Dict[str, Any], update_dict: Dict[str, Any], upsert: bool = False):
        target = await self.find_one(filter_dict)
        if target:
            for idx, d in enumerate(self.docs):
                if d.get("_id") == target.get("_id"):
                    if "$set" in update_dict:
                        self.docs[idx].update(update_dict["$set"])
                    else:
                        self.docs[idx].update(update_dict)
                    self._save()
                    break
        elif upsert:
            new_doc = dict(filter_dict)
            if "$set" in update_dict:
                new_doc.update(update_dict["$set"])
            else:
                new_doc.update(update_dict)
            await self.insert_one(new_doc)

    async def delete_many(self, filter_dict: Dict[str, Any]):
        new_docs = []
        for d in self.docs:
            match = True
            for k, v in filter_dict.items():
                if d.get(k) != v:
                    match = False
                    break
            if not match:
                new_docs.append(d)
        self.docs = new_docs
        self._save()

    async def count_documents(self, filter_dict: Dict[str, Any]) -> int:
        res = self.find(filter_dict)
        return len(res.data)

class FallbackDatabase:
    """Container for embedded JSON storage collections."""
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.collections: Dict[str, EmbeddedCollection] = {}

    def get_collection(self, name: str) -> EmbeddedCollection:
        if name not in self.collections:
            path = os.path.join(self.data_dir, f"{name}.json")
            self.collections[name] = EmbeddedCollection(name, path)
        return self.collections[name]

    def __getitem__(self, name: str) -> EmbeddedCollection:
        return self.get_collection(name)

# Database instance singleton
db_instance = None
is_mongo_connected = False

async def get_database():
    global db_instance, is_mongo_connected
    if db_instance is not None:
        return db_instance

    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DATABASE_NAME", "identity_dna")

    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=1000)
        # Check connection
        await client.admin.command('ping')
        logger.info(f"Connected to MongoDB at {mongo_url}")
        db_instance = client[db_name]
        is_mongo_connected = True
        return db_instance
    except Exception as e:
        logger.info(f"MongoDB not available ({e}), falling back to embedded persistent storage.")
        storage_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data_storage")
        db_instance = FallbackDatabase(storage_dir)
        is_mongo_connected = False
        return db_instance
