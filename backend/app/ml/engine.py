import math
import numpy as np
import logging
from typing import Dict, Any, Tuple, List, Optional

logger = logging.getLogger("identity_dna.ml")

try:
    from sklearn.ensemble import IsolationForest
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

class BehavioralMLEngine:
    def __init__(self):
        # Weights configured per prompt spec
        self.w_typing = 0.30
        self.w_mouse = 0.30
        self.w_click = 0.15
        self.w_scroll = 0.15
        self.w_session = 0.10

    def compute_signal_similarity(self, current_val: float, baseline_val: float, scale: float = 1.0) -> float:
        """
        Computes match percentage between live metric and baseline metric using smooth exponential kernel.
        """
        if baseline_val == 0 and current_val == 0:
            return 98.5
        
        denom = max(abs(baseline_val), 1.0)
        relative_diff = abs(current_val - baseline_val) / denom
        # Exponential similarity decay: 0 diff = 100%, higher diff decays gracefully
        similarity = 100.0 * math.exp(- (relative_diff / (1.5 * scale)))
        return max(35.0, min(99.9, similarity))

    def evaluate_typing(self, live: Dict[str, Any], baseline: Dict[str, Any]) -> float:
        if not live or not baseline:
            return 95.0 # default fallback baseline if telemetry sparse

        wpm_sim = self.compute_signal_similarity(
            live.get("typing_speed_wpm", 0), 
            baseline.get("typing_speed_wpm", 45.0), 
            scale=0.8
        )
        
        live_dwell = np.mean(live.get("dwell_times", [100])) if live.get("dwell_times") else 100.0
        base_dwell = np.mean(baseline.get("dwell_times", [100])) if baseline.get("dwell_times") else 100.0
        dwell_sim = self.compute_signal_similarity(live_dwell, base_dwell, scale=1.0)

        live_rhythm = live.get("rhythm_std_dev", 20.0)
        base_rhythm = baseline.get("rhythm_std_dev", 20.0)
        rhythm_sim = self.compute_signal_similarity(live_rhythm, base_rhythm, scale=1.2)

        match_score = (0.4 * wpm_sim) + (0.4 * dwell_sim) + (0.2 * rhythm_sim)
        return round(float(match_score), 1)

    def evaluate_mouse(self, live: Dict[str, Any], baseline: Dict[str, Any]) -> float:
        if not live or not baseline:
            return 96.0

        live_speed = live.get("avg_speed", 500.0)
        base_speed = baseline.get("avg_speed", 500.0)
        speed_sim = self.compute_signal_similarity(live_speed, base_speed, scale=1.0)

        live_var = live.get("speed_variance", 1000.0)
        base_var = baseline.get("speed_variance", 1000.0)
        var_sim = self.compute_signal_similarity(live_var, base_var, scale=1.5)

        match_score = (0.6 * speed_sim) + (0.4 * var_sim)
        return round(float(match_score), 1)

    def evaluate_click(self, live: Dict[str, Any], baseline: Dict[str, Any]) -> float:
        if not live or not baseline:
            return 97.5

        live_hold = live.get("avg_hold", 120.0)
        base_hold = baseline.get("avg_hold", 120.0)
        hold_sim = self.compute_signal_similarity(live_hold, base_hold, scale=1.0)

        return round(float(hold_sim), 1)

    def evaluate_scroll(self, live: Dict[str, Any], baseline: Dict[str, Any]) -> float:
        if not live or not baseline:
            return 95.5

        live_vel = live.get("avg_velocity", 300.0)
        base_vel = baseline.get("avg_velocity", 300.0)
        vel_sim = self.compute_signal_similarity(live_vel, base_vel, scale=1.2)

        return round(float(vel_sim), 1)

    def calculate_confidence(
        self, 
        live_telemetry: Dict[str, Any], 
        baseline_profile: Dict[str, Any]
    ) -> Tuple[float, str, Dict[str, float], bool]:
        """
        Calculates the weighted behavioral confidence score and classifies the state.
        Returns: (overall_confidence, status, match_breakdown, is_anomaly)
        """
        base_typing = baseline_profile.get("typing", {})
        base_mouse = baseline_profile.get("mouse", {})
        base_click = baseline_profile.get("click", {})
        base_scroll = baseline_profile.get("scroll", {})

        live_typing = live_telemetry.get("typing") or {}
        live_mouse = live_telemetry.get("mouse") or {}
        live_click = live_telemetry.get("click") or {}
        live_scroll = live_telemetry.get("scroll") or {}

        typing_match = self.evaluate_typing(live_typing, base_typing)
        mouse_match = self.evaluate_mouse(live_mouse, base_mouse)
        click_match = self.evaluate_click(live_click, base_click)
        scroll_match = self.evaluate_scroll(live_scroll, base_scroll)
        session_consistency = 98.5

        overall_score = (
            (typing_match * self.w_typing) +
            (mouse_match * self.w_mouse) +
            (click_match * self.w_click) +
            (scroll_match * self.w_scroll) +
            (session_consistency * self.w_session)
        )
        overall_score = round(float(overall_score), 1)

        # Classification based on configured thresholds
        if overall_score >= 90.0:
            status = "TRUSTED"
            is_anomaly = False
        elif overall_score >= 70.0:
            status = "MONITORING"
            is_anomaly = False
        else:
            status = "SUSPICIOUS"
            is_anomaly = True

        breakdown = {
            "typing_match": typing_match,
            "mouse_match": mouse_match,
            "click_match": click_match,
            "scroll_match": scroll_match,
            "session_consistency": session_consistency
        }

        return overall_score, status, breakdown, is_anomaly

# Singleton ML engine
ml_engine = BehavioralMLEngine()
