"""
Experiment Selection System - MIRROR Simulation

Simulates the experiment selection algorithm from 02-blood.md to verify
"feel" and edge case behavior. Tests scenarios from 04-skin.md.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import random

# ============================================================================
# CONSTANTS FROM 02-blood.md
# ============================================================================

# Priority weights
W_URGENCY = 0.40
W_CAPACITY = 0.35
W_SUCCESS = 0.25

# Capacity weights
W_ENERGY = 0.30
W_TIME = 0.25
W_HISTORICAL = 0.20
W_LOAD = 0.25

# Base urgency by star state
BASE_URGENCY = {
    'FLICKERING': 0.90,
    'DARK_GROWING': 0.85,
    'DARK_STABLE': 0.75,
    'DIM_DECLINING': 0.70,
    'BRIGHT_DECLINING': 0.65,
    'DIM_STABLE': 0.50,
    'BRIGHT_STABLE': 0.20,
    'DORMANT': 0.10,
}

# Stress to energy mapping
STRESS_TO_ENERGY = {
    'LOW': 1.0,
    'MEDIUM': 0.7,
    'HIGH': 0.4,
    'CRISIS': 0.15,
}

# Stress penalties
STRESS_PENALTY = {
    'LOW': 0.0,
    'MEDIUM': 0.05,
    'HIGH': 0.15,
    'CRISIS': 0.35,
}

# Load headroom
LOAD_HEADROOM = {
    0: 1.0,
    1: 0.75,
    2: 0.45,
    3: 0.0,
}

# Difficulty modifiers for success probability
DIFFICULTY_SUCCESS_MOD = {
    'TINY': 1.10,
    'SMALL': 1.00,
    'MEDIUM': 0.85,
    'STRETCH': 0.60,
}

# Star state modifiers for success probability
STAR_STATE_SUCCESS_MOD = {
    'FLICKERING': 0.85,
    'DARK': 0.70,
    'DIM': 1.00,
    'BRIGHT': 1.10,
    'DORMANT': 0.90,
}

# Difficulty to minutes
DIFFICULTY_TIME = {
    'TINY': 0.5,
    'SMALL': 5,
    'MEDIUM': 20,
    'STRETCH': 45,
}

# Connection constants
GROWTH_EDGE_THRESHOLD = 0.65
GROWTH_EDGE_BONUS_MIN = 0.15
GROWTH_EDGE_BONUS_MAX = 0.25
RESONANCE_BONUS_PER_BRIGHT = 0.05
RESONANCE_BONUS_ACTIVE = 0.10
RESONANCE_BONUS_CAP = 0.15
TENSION_PENALTY = 0.20
CAUSATION_BOOST = 0.10
SHADOW_SURFACE_INTERVAL = 7
SHADOW_SURFACE_BONUS_BASE = 0.10
SHADOW_SURFACE_BONUS_RATE = 0.02
BLOCKER_THRESHOLD = 0.25

# Limits
MAX_ACTIVE = 3
MAX_QUEUED = 5
MAX_TEMPLATES_PER_STAR = 3
MAX_PER_STAR = 2
MAX_PER_DOMAIN = 3

# Defaults
DEFAULT_SUCCESS_RATE = 0.5
DEFAULT_BASE_PROB = 0.5


# ============================================================================
# DATA CLASSES
# ============================================================================

class Difficulty(Enum):
    TINY = 1
    SMALL = 2
    MEDIUM = 3
    STRETCH = 4


class StarState(Enum):
    FLICKERING = "FLICKERING"
    DARK = "DARK"
    DIM = "DIM"
    BRIGHT = "BRIGHT"
    DORMANT = "DORMANT"


class ConnectionType(Enum):
    GROWTH_EDGE = "GROWTH_EDGE"
    RESONANCE = "RESONANCE"
    TENSION = "TENSION"
    CAUSATION = "CAUSATION"
    SHADOW_MIRROR = "SHADOW_MIRROR"
    BLOCKS = "BLOCKS"


@dataclass
class Star:
    id: str
    name: str
    domain: str
    brightness: float = 0.3
    days_since_experiment: int = 0
    brightness_history: List[float] = field(default_factory=list)
    is_dark: bool = False
    has_active_experiment: bool = False

    @property
    def state(self) -> str:
        """Derive state from brightness and trajectory."""
        if self.brightness < 0.25:
            if self.is_dark:
                # Check if growing or stable
                if len(self.brightness_history) >= 3:
                    delta = self.brightness_history[-1] - self.brightness_history[-3]
                    if delta < -0.02:
                        return 'DARK_GROWING'
                return 'DARK_STABLE'
            return 'DARK_STABLE'
        elif self.brightness < 0.5:
            # DIM
            if len(self.brightness_history) >= 3:
                delta = self.brightness_history[-1] - self.brightness_history[-3]
                if delta < -0.02:
                    return 'DIM_DECLINING'
            return 'DIM_STABLE'
        elif self.brightness < 0.7:
            # Could be bright declining or dim
            if len(self.brightness_history) >= 3:
                delta = self.brightness_history[-1] - self.brightness_history[-3]
                if delta < -0.02:
                    return 'BRIGHT_DECLINING'
            return 'DIM_STABLE'
        else:
            # BRIGHT
            if len(self.brightness_history) >= 3:
                delta = self.brightness_history[-1] - self.brightness_history[-3]
                if delta < -0.02:
                    return 'BRIGHT_DECLINING'
            return 'BRIGHT_STABLE'

    @property
    def simple_state(self) -> str:
        """Simple state for success modifier lookup."""
        if self.brightness < 0.25:
            return 'DARK'
        elif self.brightness < 0.5:
            return 'DIM'
        elif self.brightness < 0.7:
            return 'DIM'
        else:
            return 'BRIGHT'


@dataclass
class Connection:
    type: ConnectionType
    source: Star
    target: Star
    strength: float = 1.0


@dataclass
class User:
    stress_state: str = 'LOW'
    active_experiment_count: int = 0
    overall_completion_rate: float = 0.5
    day_of_week_success: Dict[int, float] = field(default_factory=lambda: {i: 0.5 for i in range(7)})
    optimal_windows: List[Tuple[int, int]] = field(default_factory=lambda: [(6, 9), (12, 14), (18, 21)])
    worst_windows: List[Tuple[int, int]] = field(default_factory=lambda: [(22, 6)])
    available_minutes: int = 60
    template_history: Dict[str, float] = field(default_factory=dict)

    def is_in_optimal_window(self, hour: int) -> bool:
        for start, end in self.optimal_windows:
            if start <= hour < end:
                return True
        return False

    def is_in_worst_window(self, hour: int) -> bool:
        for start, end in self.worst_windows:
            if start <= hour or hour < end:
                return True
        return False


@dataclass
class Experiment:
    star: Star
    difficulty: str
    template_id: str = "generic"
    priority_score: float = 0.0
    urgency: float = 0.0
    capacity: float = 0.0
    success_prob: float = 0.0
    connection_bonus: float = 0.0


@dataclass
class SelectionContext:
    user: User
    stars: List[Star]
    connections: List[Connection]
    active_experiments: List[Experiment] = field(default_factory=list)
    last_surfaced: Dict[str, datetime] = field(default_factory=dict)
    current_hour: int = 10
    current_day_of_week: int = 1  # Monday


# ============================================================================
# FORMULA IMPLEMENTATIONS
# ============================================================================

def clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, value))


def trajectory_modifier(brightness_history: List[float]) -> float:
    """Compute modifier based on recent brightness direction."""
    if len(brightness_history) < 3:
        return 1.0

    delta = brightness_history[-1] - brightness_history[-3]

    if delta < -0.05:
        return 1.2
    elif delta < -0.02:
        return 1.1
    elif delta > 0.05:
        return 0.8
    elif delta > 0.02:
        return 0.9
    else:
        return 1.0


def time_modifier(days_since_last_experiment: int) -> float:
    """Boost urgency for neglected stars."""
    if days_since_last_experiment <= 3:
        return 1.0
    elif days_since_last_experiment <= 7:
        return 1.0 + 0.05 * (days_since_last_experiment - 3)
    elif days_since_last_experiment <= 14:
        return 1.2 + 0.02 * (days_since_last_experiment - 7)
    else:
        return 1.5


def connection_modifier(star: Star, connections: List[Connection]) -> float:
    """Modify urgency based on connection network."""
    modifier = 1.0

    for conn in connections:
        if conn.target.id != star.id and conn.source.id != star.id:
            continue

        if conn.type == ConnectionType.BLOCKS and conn.source.brightness <= BLOCKER_THRESHOLD:
            modifier *= 1.3
        elif conn.type == ConnectionType.GROWTH_EDGE and conn.source.brightness > 0.6:
            modifier *= 1.1
        elif conn.type == ConnectionType.SHADOW_MIRROR and star.is_dark:
            modifier *= 1.2
        elif conn.type == ConnectionType.CAUSATION and conn.source.brightness > 0.6:
            modifier *= 1.1

    return clamp(modifier, 0.7, 1.3)


def calculate_urgency(star: Star, connections: List[Connection]) -> float:
    """Calculate urgency for a star."""
    base = BASE_URGENCY.get(star.state, 0.5)
    trajectory = trajectory_modifier(star.brightness_history)
    conn = connection_modifier(star, connections)
    time = time_modifier(star.days_since_experiment)

    urgency = base * trajectory * conn * time
    return clamp(urgency, 0.0, 1.0)


def energy_level(user: User, hour: int, day_of_week: int) -> float:
    """Estimate user energy from signals."""
    base = STRESS_TO_ENERGY[user.stress_state]

    if user.is_in_optimal_window(hour):
        base *= 1.1
    elif user.is_in_worst_window(hour):
        base *= 0.7

    # Avoid division by zero for failing users
    if user.overall_completion_rate > 0:
        day_modifier = user.day_of_week_success.get(day_of_week, 0.5) / user.overall_completion_rate
        day_modifier = clamp(day_modifier, 0.7, 1.3)
    else:
        day_modifier = 1.0  # No adjustment when we can't compute ratio

    return clamp(base * day_modifier, 0.0, 1.0)


def time_availability(user: User, difficulty: str) -> float:
    """Score how well experiment fits available time."""
    required = DIFFICULTY_TIME.get(difficulty, 5)
    available = user.available_minutes

    if available >= required * 2:
        return 1.0
    elif available >= required * 1.5:
        return 0.85
    elif available >= required:
        return 0.6
    else:
        return 0.2


def historical_success(user: User, template_id: str) -> float:
    """Success rate for similar experiments."""
    if template_id in user.template_history:
        return user.template_history[template_id]
    return DEFAULT_SUCCESS_RATE


def calculate_capacity(_user: User, experiment: Experiment, context: SelectionContext) -> float:
    """Calculate capacity fit for user and experiment."""
    E = energy_level(_user, context.current_hour, context.current_day_of_week)
    T = time_availability(_user, experiment.difficulty)
    H = historical_success(_user, experiment.template_id)
    L = LOAD_HEADROOM.get(_user.active_experiment_count, 0.0)

    weighted = (E * W_ENERGY) + (T * W_TIME) + (H * W_HISTORICAL) + (L * W_LOAD)
    penalty = STRESS_PENALTY.get(_user.stress_state, 0.0)

    return clamp(weighted - penalty, 0.0, 1.0)


def recency_modifier(_user: User, days_since_similar: Optional[int]) -> float:  # noqa: ARG001
    """Boost if similar experiment completed recently."""
    del _user  # Interface compatibility - not used in this implementation
    if days_since_similar is None:
        return 0.95

    if days_since_similar <= 1:
        return 1.2
    elif days_since_similar <= 3:
        return 1.1
    elif days_since_similar <= 7:
        return 1.0
    else:
        return 0.9


def template_modifier(user: User, template_id: str) -> float:
    """Adjust based on template-specific history."""
    if template_id not in user.template_history:
        return 1.0

    rate = user.template_history[template_id]
    return clamp(rate * 1.2, 0.5, 1.3)


def calculate_success_probability(user: User, experiment: Experiment, days_since_similar: Optional[int] = None) -> float:
    """Calculate success probability for experiment."""
    base = clamp(user.overall_completion_rate, 0.2, 0.95)
    diff_mod = DIFFICULTY_SUCCESS_MOD.get(experiment.difficulty, 1.0)
    temp_mod = template_modifier(user, experiment.template_id)
    star_mod = STAR_STATE_SUCCESS_MOD.get(experiment.star.simple_state, 1.0)
    rec_mod = recency_modifier(user, days_since_similar)

    prob = base * diff_mod * temp_mod * star_mod * rec_mod
    return clamp(prob, 0.05, 0.95)


def growth_edge_bonus(star: Star, connections: List[Connection]) -> float:
    """Bonus from GROWTH_EDGE connections."""
    bonus = 0.0

    for conn in connections:
        if conn.type == ConnectionType.GROWTH_EDGE and conn.target.id == star.id:
            if conn.source.brightness >= GROWTH_EDGE_THRESHOLD:
                source_bonus = GROWTH_EDGE_BONUS_MIN + \
                    (GROWTH_EDGE_BONUS_MAX - GROWTH_EDGE_BONUS_MIN) * \
                    (conn.source.brightness - GROWTH_EDGE_THRESHOLD) / (1.0 - GROWTH_EDGE_THRESHOLD)
                bonus = max(bonus, source_bonus)

    return bonus


def resonance_bonus(star: Star, connections: List[Connection]) -> float:
    """Bonus from RESONANCE connections."""
    bonus = 0.0

    for conn in connections:
        if conn.type != ConnectionType.RESONANCE:
            continue

        partner = None
        if conn.source.id == star.id:
            partner = conn.target
        elif conn.target.id == star.id:
            partner = conn.source
        else:
            continue

        if partner.brightness >= 0.7:
            bonus += RESONANCE_BONUS_PER_BRIGHT
        if partner.has_active_experiment:
            bonus += RESONANCE_BONUS_ACTIVE

    return min(bonus, RESONANCE_BONUS_CAP)


def tension_penalty(star: Star, active_experiments: List[Experiment], connections: List[Connection]) -> float:
    """Penalty for tension with active experiments."""
    for exp in active_experiments:
        for conn in connections:
            if conn.type == ConnectionType.TENSION:
                if (conn.source.id == star.id and conn.target.id == exp.star.id) or \
                   (conn.target.id == star.id and conn.source.id == exp.star.id):
                    return TENSION_PENALTY
    return 0.0


def causation_boost(star: Star, connections: List[Connection]) -> float:
    """Boost for cause star when effect needs help."""
    for conn in connections:
        if conn.type == ConnectionType.CAUSATION and conn.source.id == star.id:
            # Calculate target urgency
            target_urgency = calculate_urgency(conn.target, connections)
            if target_urgency >= 0.6:
                return CAUSATION_BOOST
    return 0.0


def shadow_mirror_bonus(star: Star, connections: List[Connection], last_surfaced: Dict[str, datetime], current_time: datetime) -> float:
    """Bonus for shadow stars needing surfacing."""
    if not star.is_dark:
        return 0.0

    has_shadow_mirror = False
    for conn in connections:
        if conn.type == ConnectionType.SHADOW_MIRROR:
            if conn.source.id == star.id or conn.target.id == star.id:
                has_shadow_mirror = True
                break

    if not has_shadow_mirror:
        return 0.0

    last_surface = last_surfaced.get(star.id)
    if last_surface is None:
        days_since = 14  # Assume long ago if never surfaced
    else:
        days_since = (current_time - last_surface).days

    if days_since >= SHADOW_SURFACE_INTERVAL:
        return SHADOW_SURFACE_BONUS_BASE + SHADOW_SURFACE_BONUS_RATE * min(days_since - SHADOW_SURFACE_INTERVAL, 14)

    return 0.0


def is_blocked(star: Star, connections: List[Connection]) -> bool:
    """Check if star is blocked by active blocker."""
    for conn in connections:
        if conn.type == ConnectionType.BLOCKS and conn.target.id == star.id:
            if conn.source.brightness <= BLOCKER_THRESHOLD:
                return True
    return False


def calculate_connection_bonus(star: Star, context: SelectionContext, current_time: datetime) -> Optional[float]:
    """Calculate total connection bonus/penalty."""
    if is_blocked(star, context.connections):
        return None  # Blocked - filter out

    bonus = 0.0
    bonus += growth_edge_bonus(star, context.connections)
    bonus += resonance_bonus(star, context.connections)
    bonus += causation_boost(star, context.connections)
    bonus += shadow_mirror_bonus(star, context.connections, context.last_surfaced, current_time)

    penalty = tension_penalty(star, context.active_experiments, context.connections)

    return bonus - penalty


def select_difficulty(star: Star, user: User) -> str:
    """Choose appropriate difficulty."""
    if user.stress_state == 'CRISIS':
        return 'TINY'

    capacity_score = (STRESS_TO_ENERGY[user.stress_state] * W_ENERGY +
                      LOAD_HEADROOM.get(user.active_experiment_count, 0) * W_LOAD)

    if capacity_score < 0.3:
        return 'TINY'

    state_to_difficulty = {
        'FLICKERING': 'TINY',
        'DARK_GROWING': 'TINY',
        'DARK_STABLE': 'TINY',
        'DIM_DECLINING': 'SMALL',
        'DIM_STABLE': 'SMALL',
        'BRIGHT_DECLINING': 'SMALL',
        'BRIGHT_STABLE': 'MEDIUM',
        'DORMANT': 'TINY',
    }

    base_difficulty = state_to_difficulty.get(star.state, 'SMALL')

    if capacity_score < 0.5 and base_difficulty in ['MEDIUM', 'STRETCH']:
        return 'SMALL'

    return base_difficulty


def generate_experiment(star: Star, user: User, context: SelectionContext, current_time: datetime) -> Optional[Experiment]:
    """Generate a single experiment for a star."""
    difficulty = select_difficulty(star, user)

    exp = Experiment(
        star=star,
        difficulty=difficulty,
        template_id=f"{star.domain}-{difficulty.lower()}"
    )

    # Calculate components
    exp.urgency = calculate_urgency(star, context.connections)
    exp.capacity = calculate_capacity(user, exp, context)
    exp.success_prob = calculate_success_probability(user, exp)
    connection_bonus_result = calculate_connection_bonus(star, context, current_time)

    if connection_bonus_result is None:
        return None  # Blocked

    assert connection_bonus_result is not None  # Type narrowing for Pyright
    exp.connection_bonus = connection_bonus_result

    # Calculate priority
    exp.priority_score = (
        (exp.urgency * W_URGENCY) +
        (exp.capacity * W_CAPACITY) +
        (exp.success_prob * W_SUCCESS) +
        exp.connection_bonus
    )
    exp.priority_score = clamp(exp.priority_score, 0.0, 1.0)

    return exp


def select_experiments(context: SelectionContext, current_time: datetime) -> List[Experiment]:
    """Main selection function."""
    available_slots = MAX_ACTIVE - context.user.active_experiment_count
    if available_slots <= 0:
        return []

    candidates = []

    for star in context.stars:
        if is_blocked(star, context.connections):
            continue

        exp = generate_experiment(star, context.user, context, current_time)
        if exp is not None:
            candidates.append(exp)

    # Sort by priority
    candidates.sort(key=lambda e: e.priority_score, reverse=True)

    # Apply diversity filter
    filtered = []
    star_counts: Dict[str, int] = {}
    domain_counts: Dict[str, int] = {}

    for candidate in candidates:
        star_id = candidate.star.id
        domain = candidate.star.domain

        if star_counts.get(star_id, 0) >= MAX_PER_STAR:
            continue
        if domain_counts.get(domain, 0) >= MAX_PER_DOMAIN:
            continue

        filtered.append(candidate)
        star_counts[star_id] = star_counts.get(star_id, 0) + 1
        domain_counts[domain] = domain_counts.get(domain, 0) + 1

    return filtered[:available_slots]


# ============================================================================
# SIMULATION SCENARIOS
# ============================================================================

def create_new_user_scenario() -> Tuple[SelectionContext, str]:
    """Day 1-7: New user journey."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="relationships", name="Relationships", domain="relationships", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="soul", name="Soul", domain="soul", brightness=0.3, brightness_history=[0.3]*3),
    ]

    user = User(
        stress_state='LOW',
        active_experiment_count=0,
        overall_completion_rate=0.5,  # Default for new user
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=[],
    )

    return context, "New User Journey (Day 1-7)"


def create_all_dark_scenario() -> Tuple[SelectionContext, str]:
    """All stars are dark - test sabbatical mode trigger."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.15,
             brightness_history=[0.25, 0.20, 0.15], is_dark=True, days_since_experiment=10),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.10,
             brightness_history=[0.20, 0.15, 0.10], is_dark=True, days_since_experiment=14),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.20,
             brightness_history=[0.30, 0.25, 0.20], is_dark=True, days_since_experiment=7),
        Star(id="relationships", name="Relationships", domain="relationships", brightness=0.12,
             brightness_history=[0.25, 0.18, 0.12], is_dark=True, days_since_experiment=21),
        Star(id="soul", name="Soul", domain="soul", brightness=0.18,
             brightness_history=[0.28, 0.22, 0.18], is_dark=True, days_since_experiment=30),
    ]

    # Add SHADOW_MIRROR connections between dark stars
    connections = [
        Connection(type=ConnectionType.SHADOW_MIRROR, source=stars[0], target=stars[1]),
        Connection(type=ConnectionType.SHADOW_MIRROR, source=stars[2], target=stars[3]),
    ]

    user = User(
        stress_state='HIGH',
        active_experiment_count=0,
        overall_completion_rate=0.3,
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "All-Dark Constellation"


def create_perfect_user_scenario() -> Tuple[SelectionContext, str]:
    """100% completion rate, all bright stars."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.85,
             brightness_history=[0.80, 0.82, 0.85], days_since_experiment=1),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.90,
             brightness_history=[0.87, 0.88, 0.90], days_since_experiment=1),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.75,
             brightness_history=[0.70, 0.72, 0.75], days_since_experiment=2),
        Star(id="relationships", name="Relationships", domain="relationships", brightness=0.88,
             brightness_history=[0.85, 0.86, 0.88], days_since_experiment=1),
        Star(id="soul", name="Soul", domain="soul", brightness=0.92,
             brightness_history=[0.90, 0.91, 0.92], days_since_experiment=0),
    ]

    # GROWTH_EDGE from bright to less bright
    connections = [
        Connection(type=ConnectionType.GROWTH_EDGE, source=stars[4], target=stars[2]),
        Connection(type=ConnectionType.RESONANCE, source=stars[0], target=stars[3]),
    ]

    user = User(
        stress_state='LOW',
        active_experiment_count=0,
        overall_completion_rate=1.0,  # Perfect!
        template_history={"health-tiny": 1.0, "wealth-small": 1.0, "purpose-medium": 1.0},
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "Perfect User (100% completion)"


def create_failing_user_scenario() -> Tuple[SelectionContext, str]:
    """0% completion rate, struggling."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.25,
             brightness_history=[0.35, 0.30, 0.25], days_since_experiment=3),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.30,
             brightness_history=[0.40, 0.35, 0.30], days_since_experiment=5),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.20,
             brightness_history=[0.30, 0.25, 0.20], is_dark=True, days_since_experiment=7),
        Star(id="relationships", name="Relationships", domain="relationships", brightness=0.28,
             brightness_history=[0.35, 0.32, 0.28], days_since_experiment=4),
        Star(id="soul", name="Soul", domain="soul", brightness=0.35,
             brightness_history=[0.40, 0.38, 0.35], days_since_experiment=6),
    ]

    connections = []

    user = User(
        stress_state='HIGH',
        active_experiment_count=1,
        overall_completion_rate=0.0,  # Never completes
        template_history={"health-tiny": 0.1, "wealth-tiny": 0.1},
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "Failing User (0% completion)"


def create_high_stress_scenario() -> Tuple[SelectionContext, str]:
    """User in crisis mode."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.45,
             brightness_history=[0.50, 0.48, 0.45], days_since_experiment=2),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.60,
             brightness_history=[0.62, 0.61, 0.60], days_since_experiment=1),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.35,
             brightness_history=[0.40, 0.38, 0.35], days_since_experiment=5),
    ]

    connections = []

    user = User(
        stress_state='CRISIS',
        active_experiment_count=0,
        overall_completion_rate=0.6,
        available_minutes=10,  # Very limited time
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "High Stress Period (CRISIS)"


def create_blocking_connection_scenario() -> Tuple[SelectionContext, str]:
    """Test BLOCKS connection filtering."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.15,
             brightness_history=[0.20, 0.18, 0.15], is_dark=True, days_since_experiment=10),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.60,
             brightness_history=[0.58, 0.59, 0.60], days_since_experiment=2),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.50,
             brightness_history=[0.48, 0.49, 0.50], days_since_experiment=3),
    ]

    # Dark health star blocks wealth
    connections = [
        Connection(type=ConnectionType.BLOCKS, source=stars[0], target=stars[1]),
    ]

    user = User(
        stress_state='LOW',
        active_experiment_count=0,
        overall_completion_rate=0.7,
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "Blocking Connection (Health blocks Wealth)"


def create_growth_edge_scenario() -> Tuple[SelectionContext, str]:
    """Test GROWTH_EDGE bonus."""
    stars = [
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.80,
             brightness_history=[0.75, 0.78, 0.80], days_since_experiment=1),
        Star(id="health", name="Health", domain="health", brightness=0.35,
             brightness_history=[0.32, 0.33, 0.35], days_since_experiment=4),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.40,
             brightness_history=[0.38, 0.39, 0.40], days_since_experiment=5),
    ]

    # Bright purpose enables growth for health
    connections = [
        Connection(type=ConnectionType.GROWTH_EDGE, source=stars[0], target=stars[1]),
    ]

    user = User(
        stress_state='LOW',
        active_experiment_count=0,
        overall_completion_rate=0.7,
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "Growth Edge (Purpose -> Health)"


def create_tension_scenario() -> Tuple[SelectionContext, str]:
    """Test TENSION penalty when active experiment exists."""
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.50,
             brightness_history=[0.48, 0.49, 0.50], days_since_experiment=2, has_active_experiment=True),
        Star(id="work", name="Work", domain="wealth", brightness=0.55,
             brightness_history=[0.52, 0.53, 0.55], days_since_experiment=3),
        Star(id="rest", name="Rest", domain="soul", brightness=0.45,
             brightness_history=[0.43, 0.44, 0.45], days_since_experiment=4),
    ]

    # Work and rest are in tension
    connections = [
        Connection(type=ConnectionType.TENSION, source=stars[1], target=stars[2]),
    ]

    active_exp = Experiment(star=stars[0], difficulty='SMALL')

    user = User(
        stress_state='LOW',
        active_experiment_count=1,
        overall_completion_rate=0.7,
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
        active_experiments=[active_exp],
    )

    return context, "Tension Between Work and Rest"


def create_equal_priority_scenario() -> Tuple[SelectionContext, str]:
    """Test tie-breaking with equal priorities."""
    stars = [
        Star(id="star1", name="Star 1", domain="health", brightness=0.45,
             brightness_history=[0.43, 0.44, 0.45], days_since_experiment=3),
        Star(id="star2", name="Star 2", domain="wealth", brightness=0.45,
             brightness_history=[0.43, 0.44, 0.45], days_since_experiment=3),
        Star(id="star3", name="Star 3", domain="purpose", brightness=0.45,
             brightness_history=[0.43, 0.44, 0.45], days_since_experiment=3),
    ]

    connections = []

    user = User(
        stress_state='LOW',
        active_experiment_count=0,
        overall_completion_rate=0.5,
    )

    context = SelectionContext(
        user=user,
        stars=stars,
        connections=connections,
    )

    return context, "Equal Priority Stars"


# ============================================================================
# SIMULATION RUNNER
# ============================================================================

def print_experiment_details(exp: Experiment, rank: int):
    """Print detailed experiment info."""
    print(f"\n  #{rank}: {exp.star.name} ({exp.star.domain})")
    print(f"      Difficulty: {exp.difficulty}")
    print(f"      Priority Score: {exp.priority_score:.3f}")
    print(f"        - Urgency:    {exp.urgency:.3f} (w={W_URGENCY})")
    print(f"        - Capacity:   {exp.capacity:.3f} (w={W_CAPACITY})")
    print(f"        - Success:    {exp.success_prob:.3f} (w={W_SUCCESS})")
    print(f"        - Conn Bonus: {exp.connection_bonus:.3f}")
    print(f"      Star State: {exp.star.state}")
    print(f"      Star Brightness: {exp.star.brightness:.2f}")


def run_scenario(context: SelectionContext, name: str) -> Dict:
    """Run a single scenario and return results."""
    print(f"\n{'='*60}")
    print(f"SCENARIO: {name}")
    print('='*60)

    # Print context
    print(f"\nUser State:")
    print(f"  Stress: {context.user.stress_state}")
    print(f"  Active Experiments: {context.user.active_experiment_count}")
    print(f"  Completion Rate: {context.user.overall_completion_rate:.0%}")
    print(f"  Available Minutes: {context.user.available_minutes}")

    print(f"\nStars:")
    for star in context.stars:
        print(f"  - {star.name}: brightness={star.brightness:.2f}, state={star.state}, days_since={star.days_since_experiment}")

    print(f"\nConnections:")
    if context.connections:
        for conn in context.connections:
            print(f"  - {conn.source.name} --[{conn.type.value}]--> {conn.target.name}")
    else:
        print("  (none)")

    # Run selection
    current_time = datetime.now()
    selected = select_experiments(context, current_time)

    print(f"\n--- SELECTION RESULTS ---")
    print(f"Selected {len(selected)} experiment(s):")

    for i, exp in enumerate(selected):
        print_experiment_details(exp, i + 1)

    # Return structured results
    return {
        'scenario': name,
        'user_stress': context.user.stress_state,
        'num_stars': len(context.stars),
        'num_connections': len(context.connections),
        'selected_count': len(selected),
        'selections': [
            {
                'star': exp.star.name,
                'difficulty': exp.difficulty,
                'priority': exp.priority_score,
                'urgency': exp.urgency,
                'capacity': exp.capacity,
                'success': exp.success_prob,
                'connection_bonus': exp.connection_bonus,
            }
            for exp in selected
        ],
    }


def simulate_user_journey(days: int = 7):
    """Simulate a new user's first week."""
    print(f"\n{'='*60}")
    print("MULTI-DAY SIMULATION: New User First Week")
    print('='*60)

    # Initialize stars
    stars = [
        Star(id="health", name="Health", domain="health", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="wealth", name="Wealth", domain="wealth", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="purpose", name="Purpose", domain="purpose", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="relationships", name="Relationships", domain="relationships", brightness=0.3, brightness_history=[0.3]*3),
        Star(id="soul", name="Soul", domain="soul", brightness=0.3, brightness_history=[0.3]*3),
    ]

    user = User(
        stress_state='LOW',
        active_experiment_count=0,
        overall_completion_rate=0.5,
    )

    context = SelectionContext(user=user, stars=stars, connections=[])

    # Brightness gain constants from brightness-decay scripture
    BASE_EXPERIMENT_IMPACT = 0.03
    DIFFICULTY_GAIN = {'TINY': 0.5, 'SMALL': 0.75, 'MEDIUM': 1.0, 'STRETCH': 1.5}

    results = []

    for day in range(1, days + 1):
        print(f"\n--- Day {day} ---")
        current_time = datetime.now() + timedelta(days=day-1)

        # Reset active count for simplicity
        user.active_experiment_count = 0
        for star in stars:
            star.has_active_experiment = False

        # Select experiments
        selected = select_experiments(context, current_time)

        print(f"Selected {len(selected)} experiments:")
        for exp in selected:
            print(f"  - {exp.star.name} ({exp.difficulty}): priority={exp.priority_score:.3f}")

        # Simulate 70% completion rate
        for exp in selected:
            if random.random() < 0.7:  # 70% chance of completion
                gain = BASE_EXPERIMENT_IMPACT * DIFFICULTY_GAIN.get(exp.difficulty, 0.75)
                exp.star.brightness = clamp(exp.star.brightness + gain, 0.05, 1.0)
                exp.star.brightness_history.append(exp.star.brightness)
                exp.star.days_since_experiment = 0
                print(f"    COMPLETED: {exp.star.name} -> brightness={exp.star.brightness:.3f}")

                # Update user success rate
                if user.overall_completion_rate < 0.95:
                    user.overall_completion_rate = min(0.95, user.overall_completion_rate + 0.05)
            else:
                exp.star.days_since_experiment += 1
                print(f"    SKIPPED: {exp.star.name}")

        # Update days since for non-selected stars
        selected_ids = {exp.star.id for exp in selected}
        for star in stars:
            if star.id not in selected_ids:
                star.days_since_experiment += 1

        day_result = {
            'day': day,
            'selections': [(exp.star.name, exp.difficulty, exp.priority_score) for exp in selected],
            'star_brightness': {star.name: star.brightness for star in stars},
        }
        results.append(day_result)

    print("\n--- FINAL STATE ---")
    for star in stars:
        print(f"  {star.name}: brightness={star.brightness:.3f}, state={star.state}")

    return results


def run_all_scenarios():
    """Run all test scenarios."""
    scenarios = [
        create_new_user_scenario,
        create_all_dark_scenario,
        create_perfect_user_scenario,
        create_failing_user_scenario,
        create_high_stress_scenario,
        create_blocking_connection_scenario,
        create_growth_edge_scenario,
        create_tension_scenario,
        create_equal_priority_scenario,
    ]

    all_results = []

    for scenario_fn in scenarios:
        context, name = scenario_fn()
        result = run_scenario(context, name)
        all_results.append(result)

    return all_results


def sensitivity_analysis():
    """Test sensitivity to weight changes."""
    print(f"\n{'='*60}")
    print("SENSITIVITY ANALYSIS")
    print('='*60)

    # Base scenario
    context, _ = create_new_user_scenario()
    current_time = datetime.now()

    # Test different weight combinations
    weight_configs = [
        (0.40, 0.35, 0.25, "Default (0.40/0.35/0.25)"),
        (0.60, 0.25, 0.15, "Urgency-heavy (0.60/0.25/0.15)"),
        (0.25, 0.50, 0.25, "Capacity-heavy (0.25/0.50/0.25)"),
        (0.25, 0.25, 0.50, "Success-heavy (0.25/0.25/0.50)"),
        (0.33, 0.34, 0.33, "Equal weights (0.33/0.34/0.33)"),
    ]

    global W_URGENCY, W_CAPACITY, W_SUCCESS

    for w_u, w_c, w_s, name in weight_configs:
        print(f"\n--- {name} ---")
        W_URGENCY, W_CAPACITY, W_SUCCESS = w_u, w_c, w_s

        selected = select_experiments(context, current_time)

        for i, exp in enumerate(selected[:3]):
            print(f"  #{i+1}: {exp.star.name} - priority={exp.priority_score:.3f}")

    # Reset to defaults
    W_URGENCY, W_CAPACITY, W_SUCCESS = 0.40, 0.35, 0.25


if __name__ == "__main__":
    print("="*60)
    print("EXPERIMENT SELECTION SYSTEM - MIRROR SIMULATION")
    print("="*60)

    # Run all scenarios
    results = run_all_scenarios()

    # Run multi-day simulation
    journey_results = simulate_user_journey(days=7)

    # Run sensitivity analysis
    sensitivity_analysis()

    print("\n" + "="*60)
    print("SIMULATION COMPLETE")
    print("="*60)
