const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  getToken() {
    return localStorage.getItem('identity_dna_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...(options.headers || {}) };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`API Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth API
  async login(username_or_email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username_or_email, password }),
    });
  }

  async register(name, email, username, password) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, username, password }),
    });
  }

  async getMe() {
    return this.request('/me');
  }

  // Behavior API
  async saveBaseline(baselineData) {
    return this.request('/behavior/baseline', {
      method: 'POST',
      body: JSON.stringify(baselineData),
    });
  }

  async analyzeBehavior(telemetryPayload) {
    return this.request('/behavior/analyze', {
      method: 'POST',
      body: JSON.stringify(telemetryPayload),
    });
  }

  async getConfidence() {
    return this.request('/behavior/confidence');
  }

  async getStatus() {
    return this.request('/behavior/status');
  }

  // Security Events & History
  async getSecurityEvents() {
    return this.request('/security/events');
  }

  async createSecurityEvent(eventData) {
    return this.request('/security/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getLoginHistory() {
    return this.request('/login-history');
  }
}

export const api = new ApiService();
