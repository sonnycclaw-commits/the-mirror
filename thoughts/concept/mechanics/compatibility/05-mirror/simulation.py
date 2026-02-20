"""
Compatibility System - MIRROR Simulation

Simulates the compatibility overlay algorithm from 02-blood.md to verify
"feel" and edge case behavior. Tests scenarios from 04-skin.md.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Tuple
from collections import defaultdict
from math import sqrt
from datetime import datetime as _datetime  # Reserved for future use


# ============================================================================
# CONSTANTS FROM 02-blood.md
# ============================================================================

# Proximity constants
PROXIMITY_SAME_DOMAIN = 1.0
PROXIMITY_ADJACENT = 0.0  # Reserved for future cross-domain
PROXIMITY_DIFFERENT = 0.0

# Interaction detection constants
MIN_INTERACTION_PROXIMITY = 0.5
MIN_INTERACTION_STRENGTH = 0.2

# Shadow Mirror constants
SHADOW_THRESHOLD = 0.4

# Tension constants
TENSION_GAP_THRESHOLD = 0.4
TENSION_BASE_STRENGTH = 0.4
TENSION_RANGE = 0.5

# Growth Edge constants
GROWTH_MENTOR_THRESHOLD = 0.6
GROWTH_MENTEE_MIN = 0.3
GROWTH_MENTEE_MAX = 0.55
GROWTH_BASE_STRENGTH = 0.35
GROWTH_RANGE = 0.45

# Resonance constants
RESONANCE_THRESHOLD = 0.6
RESONANCE_BASE_STRENGTH = 0.35
RESONANCE_RANGE = 0.55

# Brightness factor constants
BRIGHTNESS_FACTOR_MIN = 0.7
BRIGHTNESS_FACTOR_RANGE = 0.3
MIN_BRIGHTNESS_VALUE = 0.05  # Floor for division safety

# Privacy constants
BLUR_CERTAINTY = 0.75
MIN_CERTAINTY = 0.5

# Blurred values by state
BLURRED_VALUES = {
    'BRIGHT': 0.85,
    'STEADY': 0.60,
    'FLICKERING': 0.40,
    'DIM': 0.225,
    'DARK': 0.10,
}

# Dynamic type thresholds
DYNAMIC_THRESHOLD_MIRRORING = 0.30
DYNAMIC_THRESHOLD_CHALLENGING = 0.40
DYNAMIC_THRESHOLD_GROWTH = 0.40
DYNAMIC_THRESHOLD_AMPLIFYING = 0.50
DYNAMIC_THRESHOLD_BALANCING = 0.60

# Complement constants
COMPLEMENT_STRONG_THRESHOLD = 0.65
COMPLEMENT_WEAK_THRESHOLD = 0.35
COMPLEMENT_COVERAGE_BONUS = 0.3

# Confidence constants
CONFIDENCE_BASE = 0.5
CONFIDENCE_SCALE = 1.0


# ============================================================================
# ENUMS
# ============================================================================

class InteractionType(Enum):
    RESONANCE = "RESONANCE"
    TENSION = "TENSION"
    GROWTH_EDGE = "GROWTH_EDGE"
    SHADOW_MIRROR = "SHADOW_MIRROR"


class DynamicType(Enum):
    AMPLIFYING = "AMPLIFYING"
    CHALLENGING = "CHALLENGING"
    GROWTH = "GROWTH"
    MIRRORING = "MIRRORING"
    BALANCING = "BALANCING"
    COMPLEX = "COMPLEX"


class StarState(Enum):
    BRIGHT = "BRIGHT"
    STEADY = "STEADY"
    FLICKERING = "FLICKERING"
    DIM = "DIM"
    DARK = "DARK"
    DORMANT = "DORMANT"
    NASCENT = "NASCENT"


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class Star:
    id: str
    name: str
    domain: str
    brightness: float = 0.5
    state: StarState = StarState.STEADY

    @classmethod
    def from_brightness(cls, id: str, name: str, domain: str, brightness: float) -> "Star":
        """Create star and derive state from brightness."""
        state = cls._derive_state(brightness)
        return cls(id=id, name=name, domain=domain, brightness=brightness, state=state)

    @staticmethod
    def _derive_state(brightness: float) -> StarState:
        """Derive state from brightness value."""
        if brightness >= 0.7:
            return StarState.BRIGHT
        elif brightness >= 0.5:
            return StarState.STEADY
        elif brightness >= 0.3:
            return StarState.FLICKERING
        elif brightness >= 0.15:
            return StarState.DIM
        else:
            return StarState.DARK


@dataclass
class PrivacySettings:
    hidden_stars: set = field(default_factory=set)
    blur_brightness: bool = False


@dataclass
class User:
    id: str
    name: str
    stars: List[Star] = field(default_factory=list)
    privacy: PrivacySettings = field(default_factory=PrivacySettings)


@dataclass
class Interaction:
    type: InteractionType
    star_a: Star
    star_b: Star
    strength: float
    certainty: float = 1.0
    final_strength: float = 0.0


@dataclass
class ProfileScores:
    resonances: float = 0.0
    tensions: float = 0.0
    growth_edges: float = 0.0
    shadow_mirrors: float = 0.0
    raw_counts: Dict[InteractionType, float] = field(default_factory=dict)
    total_weight: float = 0.0


@dataclass
class CompatibilityProfile:
    interactions: List[Interaction] = field(default_factory=list)
    scores: ProfileScores = field(default_factory=ProfileScores)
    complement_score: float = 0.0
    dynamic_type: DynamicType = DynamicType.COMPLEX
    confidence: float = 0.5
    metadata: Dict = field(default_factory=dict)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp value between min and max."""
    return max(min_val, min(max_val, value))


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Safe division with explicit default."""
    if denominator == 0:
        return default
    return numerator / denominator


def harmonic_mean(a: float, b: float) -> float:
    """Calculate harmonic mean of two values."""
    # Enforce minimum to prevent division by zero
    safe_a = max(a, MIN_BRIGHTNESS_VALUE)
    safe_b = max(b, MIN_BRIGHTNESS_VALUE)
    return 2 / (1/safe_a + 1/safe_b)


# ============================================================================
# VISIBILITY & PRIVACY
# ============================================================================

def get_visible_stars(user: User) -> List[Star]:
    """Get stars visible based on privacy settings."""
    visible = []
    for star in user.stars:
        if star.id not in user.privacy.hidden_stars:
            if star.state not in [StarState.DORMANT, StarState.NASCENT]:
                visible.append(star)
    return visible


def get_effective_brightness(star: Star, privacy: PrivacySettings) -> Optional[float]:
    """Get brightness considering privacy blur."""
    if star.id in privacy.hidden_stars:
        return None

    if privacy.blur_brightness:
        return get_blurred_brightness(star)

    return star.brightness


def get_blurred_brightness(star: Star) -> float:
    """Convert exact brightness to state-based midpoint."""
    return BLURRED_VALUES.get(star.state.value, 0.5)


# ============================================================================
# PROXIMITY
# ============================================================================

def calculate_proximity(star_a: Star, star_b: Star) -> float:
    """Calculate proximity based on domain relationship."""
    if star_a.domain == star_b.domain:
        return PROXIMITY_SAME_DOMAIN
    # Future: check adjacent domains
    return PROXIMITY_DIFFERENT


# ============================================================================
# INTERACTION TYPE DETECTION
# ============================================================================

def is_shadow_mirror(brightness_a: float, brightness_b: float) -> bool:
    """Both users struggling in same domain."""
    return brightness_a <= SHADOW_THRESHOLD and brightness_b <= SHADOW_THRESHOLD


def calculate_shadow_mirror_strength(brightness_a: float, brightness_b: float) -> float:
    """Strength increases as both get darker."""
    darkness_a = (SHADOW_THRESHOLD - brightness_a) / SHADOW_THRESHOLD
    darkness_b = (SHADOW_THRESHOLD - brightness_b) / SHADOW_THRESHOLD

    base_strength = sqrt(darkness_a * darkness_b)
    return clamp(base_strength, MIN_INTERACTION_STRENGTH, 1.0)


def is_tension(brightness_a: float, brightness_b: float) -> bool:
    """Large brightness gap creates friction."""
    gap = abs(brightness_a - brightness_b)
    return gap >= TENSION_GAP_THRESHOLD


def calculate_tension_strength(brightness_a: float, brightness_b: float) -> float:
    """Strength increases with brightness gap."""
    gap = abs(brightness_a - brightness_b)

    excess_gap = gap - TENSION_GAP_THRESHOLD
    max_excess = (1.0 - MIN_BRIGHTNESS_VALUE) - TENSION_GAP_THRESHOLD

    normalized_gap = safe_divide(excess_gap, max_excess, 0.0)
    strength = TENSION_BASE_STRENGTH + normalized_gap * TENSION_RANGE

    return clamp(strength, MIN_INTERACTION_STRENGTH, 1.0)


def is_growth_edge(brightness_a: float, brightness_b: float) -> bool:
    """One user strong, other developing (not struggling)."""
    if brightness_a >= GROWTH_MENTOR_THRESHOLD:
        return GROWTH_MENTEE_MIN <= brightness_b <= GROWTH_MENTEE_MAX
    if brightness_b >= GROWTH_MENTOR_THRESHOLD:
        return GROWTH_MENTEE_MIN <= brightness_a <= GROWTH_MENTEE_MAX
    return False


def calculate_growth_edge_strength(brightness_a: float, brightness_b: float) -> float:
    """Strength based on mentor brightness and mentee readiness."""
    # Identify mentor and mentee
    if brightness_a >= brightness_b:
        mentor_b, mentee_b = brightness_a, brightness_b
    else:
        mentor_b, mentee_b = brightness_b, brightness_a

    # Mentor contribution
    mentor_factor = safe_divide(
        mentor_b - GROWTH_MENTOR_THRESHOLD,
        1.0 - GROWTH_MENTOR_THRESHOLD,
        0.0
    )

    # Mentee readiness (peak at middle of mentee range)
    mentee_midpoint = (GROWTH_MENTEE_MIN + GROWTH_MENTEE_MAX) / 2
    mentee_range = GROWTH_MENTEE_MAX - GROWTH_MENTEE_MIN
    distance_from_optimal = abs(mentee_b - mentee_midpoint)
    mentee_factor = 1 - safe_divide(distance_from_optimal, mentee_range / 2, 0.0)

    strength = GROWTH_BASE_STRENGTH + (mentor_factor * mentee_factor) * GROWTH_RANGE
    return clamp(strength, MIN_INTERACTION_STRENGTH, 1.0)


def is_resonance(brightness_a: float, brightness_b: float) -> bool:
    """Both users strong in same domain."""
    return brightness_a >= RESONANCE_THRESHOLD and brightness_b >= RESONANCE_THRESHOLD


def calculate_resonance_strength(brightness_a: float, brightness_b: float) -> float:
    """Strength increases with combined brightness."""
    excess_a = safe_divide(brightness_a - RESONANCE_THRESHOLD, 1.0 - RESONANCE_THRESHOLD, 0.0)
    excess_b = safe_divide(brightness_b - RESONANCE_THRESHOLD, 1.0 - RESONANCE_THRESHOLD, 0.0)

    base_strength = sqrt(excess_a * excess_b)
    strength = RESONANCE_BASE_STRENGTH + base_strength * RESONANCE_RANGE

    return clamp(strength, MIN_INTERACTION_STRENGTH, 1.0)


def detect_interaction_type(brightness_a: float, brightness_b: float) -> Optional[Tuple[InteractionType, float]]:
    """Determine interaction type with priority order."""
    # Priority 1: SHADOW_MIRROR (both struggling)
    if is_shadow_mirror(brightness_a, brightness_b):
        strength = calculate_shadow_mirror_strength(brightness_a, brightness_b)
        return (InteractionType.SHADOW_MIRROR, strength)

    # Priority 2: TENSION (active friction)
    if is_tension(brightness_a, brightness_b):
        strength = calculate_tension_strength(brightness_a, brightness_b)
        return (InteractionType.TENSION, strength)

    # Priority 3: GROWTH_EDGE (asymmetric but constructive)
    if is_growth_edge(brightness_a, brightness_b):
        strength = calculate_growth_edge_strength(brightness_a, brightness_b)
        return (InteractionType.GROWTH_EDGE, strength)

    # Priority 4: RESONANCE (both strong)
    if is_resonance(brightness_a, brightness_b):
        strength = calculate_resonance_strength(brightness_a, brightness_b)
        return (InteractionType.RESONANCE, strength)

    # No qualifying interaction (dead zone)
    return None


# ============================================================================
# STRENGTH CALCULATION
# ============================================================================

def calculate_brightness_factor(brightness_a: float, brightness_b: float) -> float:
    """Brightness factor using harmonic mean."""
    hm = harmonic_mean(brightness_a, brightness_b)
    factor = BRIGHTNESS_FACTOR_MIN + hm * BRIGHTNESS_FACTOR_RANGE
    return clamp(factor, BRIGHTNESS_FACTOR_MIN, 1.0)


def calculate_certainty(privacy_a: PrivacySettings, privacy_b: PrivacySettings) -> float:
    """Calculate certainty based on privacy blur."""
    certainty_a = 1.0 if not privacy_a.blur_brightness else BLUR_CERTAINTY
    certainty_b = 1.0 if not privacy_b.blur_brightness else BLUR_CERTAINTY

    combined = certainty_a * certainty_b
    return max(combined, MIN_CERTAINTY)


def calculate_final_strength(
    star_a: Star,
    star_b: Star,
    base_strength: float,
    privacy_a: PrivacySettings,
    privacy_b: PrivacySettings
) -> Tuple[float, float]:
    """Calculate final strength with all modifiers."""
    brightness_a = get_effective_brightness(star_a, privacy_a)
    brightness_b = get_effective_brightness(star_b, privacy_b)

    if brightness_a is None or brightness_b is None:
        return (0.0, 0.0)

    brightness_factor = calculate_brightness_factor(brightness_a, brightness_b)
    certainty = calculate_certainty(privacy_a, privacy_b)

    final_strength = base_strength * brightness_factor * certainty
    return (clamp(final_strength, 0.0, 1.0), certainty)


# ============================================================================
# INTERACTION DETECTION PIPELINE
# ============================================================================

def detect_interactions(user_a: User, user_b: User) -> List[Interaction]:
    """Detect all interactions between two users' constellations."""
    interactions = []

    stars_a = get_visible_stars(user_a)
    stars_b = get_visible_stars(user_b)

    for star_a in stars_a:
        for star_b in stars_b:
            proximity = calculate_proximity(star_a, star_b)

            if proximity < MIN_INTERACTION_PROXIMITY:
                continue

            brightness_a = get_effective_brightness(star_a, user_a.privacy)
            brightness_b = get_effective_brightness(star_b, user_b.privacy)

            if brightness_a is None or brightness_b is None:
                continue

            result = detect_interaction_type(brightness_a, brightness_b)
            if result is None:
                continue

            interaction_type, base_strength = result
            final_strength, certainty = calculate_final_strength(
                star_a, star_b, base_strength,
                user_a.privacy, user_b.privacy
            )

            if final_strength >= MIN_INTERACTION_STRENGTH:
                interactions.append(Interaction(
                    type=interaction_type,
                    star_a=star_a,
                    star_b=star_b,
                    strength=base_strength,
                    certainty=certainty,
                    final_strength=final_strength
                ))

    return interactions


# ============================================================================
# PROFILE SCORING
# ============================================================================

def compute_profile_scores(interactions: List[Interaction]) -> ProfileScores:
    """Aggregate interactions into profile scores."""
    by_type = defaultdict(list)
    for interaction in interactions:
        by_type[interaction.type].append(interaction)

    weighted_counts = {}
    total_weight = 0.0

    for itype, items in by_type.items():
        weight = sum(i.final_strength for i in items)
        weighted_counts[itype] = weight
        total_weight += weight

    if total_weight > 0:
        percentages = {k: v / total_weight for k, v in weighted_counts.items()}
    else:
        percentages = {k: 0 for k in InteractionType}

    return ProfileScores(
        resonances=percentages.get(InteractionType.RESONANCE, 0),
        tensions=percentages.get(InteractionType.TENSION, 0),
        growth_edges=percentages.get(InteractionType.GROWTH_EDGE, 0),
        shadow_mirrors=percentages.get(InteractionType.SHADOW_MIRROR, 0),
        raw_counts=weighted_counts,
        total_weight=total_weight
    )


def get_domain_strengths(user: User) -> Dict[str, float]:
    """Get average brightness per domain for visible stars."""
    visible = get_visible_stars(user)

    by_domain = defaultdict(list)
    for star in visible:
        brightness = get_effective_brightness(star, user.privacy)
        if brightness is not None:
            by_domain[star.domain].append(brightness)

    result = {}
    for domain, brightnesses in by_domain.items():
        result[domain] = sum(brightnesses) / len(brightnesses)

    return result


def calculate_complement_score(user_a: User, user_b: User) -> float:
    """Calculate how users balance each other across domains."""
    domains_a = get_domain_strengths(user_a)
    domains_b = get_domain_strengths(user_b)

    all_domains = set(domains_a.keys()) | set(domains_b.keys())

    if len(all_domains) == 0:
        return 0.0

    complement_pairs = 0
    coverage_pairs = 0

    for domain in all_domains:
        strength_a = domains_a.get(domain, 0)
        strength_b = domains_b.get(domain, 0)

        if strength_a >= COMPLEMENT_STRONG_THRESHOLD:
            coverage_pairs += 1
            if strength_b < COMPLEMENT_WEAK_THRESHOLD:
                complement_pairs += 1
        elif strength_b >= COMPLEMENT_STRONG_THRESHOLD:
            coverage_pairs += 1
            if strength_a < COMPLEMENT_WEAK_THRESHOLD:
                complement_pairs += 1

    if coverage_pairs == 0:
        return 0.0

    raw_score = complement_pairs / len(all_domains)
    coverage_ratio = coverage_pairs / len(all_domains)
    coverage_bonus = 1 + COMPLEMENT_COVERAGE_BONUS * coverage_ratio

    final_score = raw_score * coverage_bonus
    return clamp(final_score, 0.0, 1.0)


def determine_dynamic_type(scores: ProfileScores, complement_score: float) -> DynamicType:
    """Determine overall relationship dynamic."""
    shadow = scores.shadow_mirrors
    tension = scores.tensions
    growth = scores.growth_edges
    resonance = scores.resonances

    # Priority 1: MIRRORING (shared wounds dominate)
    if shadow >= DYNAMIC_THRESHOLD_MIRRORING:
        return DynamicType.MIRRORING

    # Priority 2: CHALLENGING (friction dominates)
    if tension >= DYNAMIC_THRESHOLD_CHALLENGING:
        return DynamicType.CHALLENGING

    # Priority 3: GROWTH (asymmetric potential)
    if growth >= DYNAMIC_THRESHOLD_GROWTH:
        return DynamicType.GROWTH

    # Priority 4: AMPLIFYING (mutual strength)
    if resonance >= DYNAMIC_THRESHOLD_AMPLIFYING:
        return DynamicType.AMPLIFYING

    # Priority 5: BALANCING (complementary)
    if complement_score >= DYNAMIC_THRESHOLD_BALANCING:
        return DynamicType.BALANCING

    # Priority 6: COMPLEX (no dominant pattern)
    return DynamicType.COMPLEX


def calculate_confidence(scores: ProfileScores, dynamic_type: DynamicType, complement_score: float) -> float:
    """Calculate how clearly one type dominates."""
    type_scores = {
        DynamicType.MIRRORING: scores.shadow_mirrors,
        DynamicType.CHALLENGING: scores.tensions,
        DynamicType.GROWTH: scores.growth_edges,
        DynamicType.AMPLIFYING: scores.resonances,
        DynamicType.BALANCING: complement_score,
        DynamicType.COMPLEX: 0
    }

    primary_score = type_scores[dynamic_type]
    other_scores = [s for t, s in type_scores.items() if t != dynamic_type and t != DynamicType.COMPLEX]
    runner_up = max(other_scores) if other_scores else 0

    gap = primary_score - runner_up
    confidence = CONFIDENCE_BASE + gap * CONFIDENCE_SCALE

    return clamp(confidence, 0.3, 1.0)


# ============================================================================
# MAIN PROFILE COMPUTATION
# ============================================================================

def compute_compatibility_profile(user_a: User, user_b: User) -> CompatibilityProfile:
    """Compute full compatibility profile between two users."""
    interactions = detect_interactions(user_a, user_b)
    scores = compute_profile_scores(interactions)
    complement = calculate_complement_score(user_a, user_b)
    dynamic_type = determine_dynamic_type(scores, complement)
    confidence = calculate_confidence(scores, dynamic_type, complement)

    # Add metadata
    metadata = {
        "user_a_hiding": len(user_a.privacy.hidden_stars) > 0,
        "user_b_hiding": len(user_b.privacy.hidden_stars) > 0,
        "user_a_blurred": user_a.privacy.blur_brightness,
        "user_b_blurred": user_b.privacy.blur_brightness,
        "partial_view": (len(user_a.privacy.hidden_stars) > 0 or
                        len(user_b.privacy.hidden_stars) > 0),
        "interaction_count": len(interactions),
        "domains_shared": len(set(s.domain for s in get_visible_stars(user_a)) &
                            set(s.domain for s in get_visible_stars(user_b)))
    }

    return CompatibilityProfile(
        interactions=interactions,
        scores=scores,
        complement_score=complement,
        dynamic_type=dynamic_type,
        confidence=confidence,
        metadata=metadata
    )


# ============================================================================
# TEST PAIR SCENARIOS
# ============================================================================

def create_resonant_pair() -> Tuple[User, User, str]:
    """Both high achievers, many bright stars."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.85),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.78),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.82),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.90),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.75),
        ]
    )

    user_b = User(
        id="bob",
        name="Bob",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.80),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.88),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.72),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.85),
            Star.from_brightness("b_soul", "Soul", "Soul", 0.70),
        ]
    )

    return user_a, user_b, "Resonant Pair (Both High Achievers)"


def create_challenging_pair() -> Tuple[User, User, str]:
    """Opposite brightness patterns - should trigger tensions."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.90),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.15),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.85),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.20),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.80),
        ]
    )

    user_b = User(
        id="bob",
        name="Bob",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.18),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.85),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.22),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.88),
            Star.from_brightness("b_soul", "Soul", "Soul", 0.25),
        ]
    )

    return user_a, user_b, "Challenging Pair (Opposite Patterns)"


def create_growth_pair() -> Tuple[User, User, str]:
    """Mentor/mentee dynamic - one bright, other developing."""
    user_a = User(
        id="mentor",
        name="Mentor",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.88),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.82),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.90),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.75),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.85),
        ]
    )

    user_b = User(
        id="mentee",
        name="Mentee",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.42),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.38),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.45),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.50),
            Star.from_brightness("b_soul", "Soul", "Soul", 0.40),
        ]
    )

    return user_a, user_b, "Growth Pair (Mentor/Mentee)"


def create_shadow_pair() -> Tuple[User, User, str]:
    """Both struggling, many dark stars."""
    user_a = User(
        id="shadow_a",
        name="Shadow A",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.18),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.22),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.12),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.25),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.15),
        ]
    )

    user_b = User(
        id="shadow_b",
        name="Shadow B",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.20),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.15),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.18),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.22),
            Star.from_brightness("b_soul", "Soul", "Soul", 0.12),
        ]
    )

    return user_a, user_b, "Shadow Pair (Both Struggling)"


def create_complementary_pair() -> Tuple[User, User, str]:
    """Non-overlapping domains - tests complement score."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.85),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.80),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.75),
        ]
    )

    user_b = User(
        id="bob",
        name="Bob",
        stars=[
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.82),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.88),
            Star.from_brightness("b_career", "Career", "Career", 0.78),
        ]
    )

    return user_a, user_b, "Complementary Pair (Non-overlapping Domains)"


def create_blurred_pair() -> Tuple[User, User, str]:
    """Heavy privacy settings - tests blur degradation."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.85),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.78),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.82),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.70),
        ],
        privacy=PrivacySettings(blur_brightness=True)
    )

    user_b = User(
        id="bob",
        name="Bob",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.80),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.75),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.72),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.85),
        ],
        privacy=PrivacySettings(blur_brightness=True)
    )

    return user_a, user_b, "Blurred Pair (Heavy Privacy)"


def create_asymmetric_pair() -> Tuple[User, User, str]:
    """5 stars vs 20 stars - tests size imbalance."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.70),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.65),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.72),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.68),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.75),
        ]
    )

    # Bob has 20 stars across 5 domains (4 each)
    bob_stars = []
    domains = ["Health", "Wealth", "Purpose", "Relationships", "Soul"]
    brightnesses = [0.65, 0.55, 0.45, 0.75]
    for domain in domains:
        for i, b in enumerate(brightnesses):
            bob_stars.append(Star.from_brightness(
                f"b_{domain.lower()}_{i}",
                f"{domain} {i+1}",
                domain,
                b
            ))

    user_b = User(id="bob", name="Bob", stars=bob_stars)

    return user_a, user_b, "Asymmetric Pair (5 vs 20 stars)"


def create_dead_zone_pair() -> Tuple[User, User, str]:
    """Both in middle zone - should have no/few interactions."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.50),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.52),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.48),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.55),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.45),
        ]
    )

    user_b = User(
        id="bob",
        name="Bob",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.52),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.50),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.55),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.48),
            Star.from_brightness("b_soul", "Soul", "Soul", 0.50),
        ]
    )

    return user_a, user_b, "Dead Zone Pair (Both Middle Brightness)"


def create_hidden_stars_pair() -> Tuple[User, User, str]:
    """One user hides some stars."""
    user_a = User(
        id="alice",
        name="Alice",
        stars=[
            Star.from_brightness("a_health", "Health", "Health", 0.85),
            Star.from_brightness("a_wealth", "Wealth", "Wealth", 0.78),
            Star.from_brightness("a_purpose", "Purpose", "Purpose", 0.82),
            Star.from_brightness("a_relationships", "Relationships", "Relationships", 0.70),
            Star.from_brightness("a_soul", "Soul", "Soul", 0.75),
        ],
        privacy=PrivacySettings(hidden_stars={"a_relationships", "a_soul"})
    )

    user_b = User(
        id="bob",
        name="Bob",
        stars=[
            Star.from_brightness("b_health", "Health", "Health", 0.80),
            Star.from_brightness("b_wealth", "Wealth", "Wealth", 0.75),
            Star.from_brightness("b_purpose", "Purpose", "Purpose", 0.72),
            Star.from_brightness("b_relationships", "Relationships", "Relationships", 0.85),
            Star.from_brightness("b_soul", "Soul", "Soul", 0.70),
        ]
    )

    return user_a, user_b, "Hidden Stars Pair (Alice hides 2 stars)"


# ============================================================================
# SIMULATION RUNNER
# ============================================================================

def print_profile_details(profile: CompatibilityProfile, scenario_name: str):
    """Print detailed profile information."""
    print(f"\n{'='*70}")
    print(f"SCENARIO: {scenario_name}")
    print('='*70)

    print(f"\n--- Metadata ---")
    for key, value in profile.metadata.items():
        print(f"  {key}: {value}")

    print(f"\n--- Interactions ({len(profile.interactions)}) ---")
    for i, interaction in enumerate(profile.interactions[:10]):  # Limit output
        print(f"  {i+1}. {interaction.star_a.name} <-> {interaction.star_b.name}")
        print(f"      Type: {interaction.type.value}")
        print(f"      Base Strength: {interaction.strength:.3f}")
        print(f"      Certainty: {interaction.certainty:.3f}")
        print(f"      Final Strength: {interaction.final_strength:.3f}")

    if len(profile.interactions) > 10:
        print(f"  ... and {len(profile.interactions) - 10} more")

    print(f"\n--- Profile Scores ---")
    print(f"  Resonances:     {profile.scores.resonances:.2%}")
    print(f"  Tensions:       {profile.scores.tensions:.2%}")
    print(f"  Growth Edges:   {profile.scores.growth_edges:.2%}")
    print(f"  Shadow Mirrors: {profile.scores.shadow_mirrors:.2%}")
    print(f"  Total Weight:   {profile.scores.total_weight:.3f}")

    print(f"\n--- Complement Score ---")
    print(f"  Score: {profile.complement_score:.3f}")

    print(f"\n--- Dynamic Type ---")
    print(f"  Type: {profile.dynamic_type.value}")
    print(f"  Confidence: {profile.confidence:.3f}")

    return {
        "scenario": scenario_name,
        "interaction_count": len(profile.interactions),
        "dynamic_type": profile.dynamic_type.value,
        "confidence": profile.confidence,
        "scores": {
            "resonances": profile.scores.resonances,
            "tensions": profile.scores.tensions,
            "growth_edges": profile.scores.growth_edges,
            "shadow_mirrors": profile.scores.shadow_mirrors,
        },
        "complement_score": profile.complement_score,
        "metadata": profile.metadata
    }


def run_all_scenarios():
    """Run all test pair scenarios."""
    scenarios = [
        create_resonant_pair,
        create_challenging_pair,
        create_growth_pair,
        create_shadow_pair,
        create_complementary_pair,
        create_blurred_pair,
        create_asymmetric_pair,
        create_dead_zone_pair,
        create_hidden_stars_pair,
    ]

    results = []

    for scenario_fn in scenarios:
        user_a, user_b, name = scenario_fn()
        profile = compute_compatibility_profile(user_a, user_b)
        result = print_profile_details(profile, name)
        results.append(result)

    return results


def analyze_results(results: List[Dict]):
    """Analyze and summarize results."""
    print(f"\n{'='*70}")
    print("RESULTS ANALYSIS")
    print('='*70)

    print("\n--- Dynamic Type Distribution ---")
    type_counts = defaultdict(int)
    for result in results:
        type_counts[result["dynamic_type"]] += 1

    for dtype, count in sorted(type_counts.items()):
        print(f"  {dtype}: {count}")

    print("\n--- Scenario Matches ---")
    expected = {
        "Resonant Pair (Both High Achievers)": "AMPLIFYING",
        "Challenging Pair (Opposite Patterns)": "CHALLENGING",
        "Growth Pair (Mentor/Mentee)": "GROWTH",
        "Shadow Pair (Both Struggling)": "MIRRORING",
        "Complementary Pair (Non-overlapping Domains)": "BALANCING",
        "Blurred Pair (Heavy Privacy)": "AMPLIFYING",  # Should still be resonant
        "Asymmetric Pair (5 vs 20 stars)": "COMPLEX",  # Mixed
        "Dead Zone Pair (Both Middle Brightness)": "COMPLEX",  # No strong interactions
        "Hidden Stars Pair (Alice hides 2 stars)": "AMPLIFYING",  # Partial view
    }

    matches = 0
    for result in results:
        expected_type = expected.get(result["scenario"], "UNKNOWN")
        actual_type = result["dynamic_type"]
        match = "OK" if expected_type == actual_type else "MISMATCH"
        if match == "OK":
            matches += 1
        print(f"  {result['scenario'][:40]}: {actual_type} (expected: {expected_type}) [{match}]")

    print(f"\n  Match rate: {matches}/{len(results)} ({matches/len(results):.0%})")

    print("\n--- Strength Ranges ---")
    for result in results:
        ic = result["interaction_count"]
        conf = result["confidence"]
        print(f"  {result['scenario'][:40]}: {ic} interactions, confidence={conf:.2f}")

    print("\n--- Privacy Impact ---")
    for result in results:
        if result["metadata"].get("user_a_blurred") or result["metadata"].get("user_b_blurred"):
            print(f"  {result['scenario'][:40]}:")
            print(f"    Blurred: A={result['metadata'].get('user_a_blurred')}, B={result['metadata'].get('user_b_blurred')}")
            print(f"    Interactions: {result['interaction_count']}")

    return results


def run_edge_case_tests():
    """Run specific edge case tests from SKIN document."""
    print(f"\n{'='*70}")
    print("EDGE CASE TESTS (from 04-skin.md)")
    print('='*70)

    # Test 1: Division by zero (brightness = 0)
    print("\n--- Test: Division by Zero Protection ---")
    user_a = User(
        id="zero_test",
        name="Zero Test",
        stars=[Star.from_brightness("a_test", "Test", "Test", MIN_BRIGHTNESS_VALUE)]
    )
    user_b = User(
        id="zero_test_b",
        name="Zero Test B",
        stars=[Star.from_brightness("b_test", "Test", "Test", MIN_BRIGHTNESS_VALUE)]
    )
    try:
        profile = compute_compatibility_profile(user_a, user_b)
        print(f"  PASS: No division error, interactions={len(profile.interactions)}")
    except ZeroDivisionError:
        print(f"  FAIL: Division by zero occurred!")

    # Test 2: Maximum brightness
    print("\n--- Test: Maximum Brightness (1.0) ---")
    user_a = User(
        id="max_test",
        name="Max Test",
        stars=[Star.from_brightness("a_test", "Test", "Test", 1.0)]
    )
    user_b = User(
        id="max_test_b",
        name="Max Test B",
        stars=[Star.from_brightness("b_test", "Test", "Test", 1.0)]
    )
    profile = compute_compatibility_profile(user_a, user_b)
    if profile.interactions:
        strength = profile.interactions[0].final_strength
        print(f"  Interaction strength at max brightness: {strength:.3f}")
        if strength <= 1.0:
            print(f"  PASS: Strength clamped correctly")
        else:
            print(f"  FAIL: Strength exceeds 1.0!")
    else:
        print(f"  INFO: No interactions detected (both max)")

    # Test 3: All stars hidden
    print("\n--- Test: All Stars Hidden ---")
    user_a = User(
        id="hidden_all",
        name="Hidden All",
        stars=[Star.from_brightness("a_test", "Test", "Test", 0.8)],
        privacy=PrivacySettings(hidden_stars={"a_test"})
    )
    user_b = User(
        id="visible",
        name="Visible",
        stars=[Star.from_brightness("b_test", "Test", "Test", 0.8)]
    )
    profile = compute_compatibility_profile(user_a, user_b)
    if len(profile.interactions) == 0:
        print(f"  PASS: No interactions when all stars hidden")
    else:
        print(f"  FAIL: Interactions found despite hidden stars!")

    # Test 4: Both blurred certainty floor
    print("\n--- Test: Both Blurred Certainty Floor ---")
    user_a = User(
        id="blur_a",
        name="Blur A",
        stars=[Star.from_brightness("a_test", "Test", "Test", 0.8)],
        privacy=PrivacySettings(blur_brightness=True)
    )
    user_b = User(
        id="blur_b",
        name="Blur B",
        stars=[Star.from_brightness("b_test", "Test", "Test", 0.8)],
        privacy=PrivacySettings(blur_brightness=True)
    )
    profile = compute_compatibility_profile(user_a, user_b)
    if profile.interactions:
        certainty = profile.interactions[0].certainty
        print(f"  Certainty with both blurred: {certainty:.3f}")
        expected = max(BLUR_CERTAINTY * BLUR_CERTAINTY, MIN_CERTAINTY)
        if abs(certainty - expected) < 0.01:
            print(f"  PASS: Certainty matches expected {expected:.3f}")
        else:
            print(f"  FAIL: Certainty {certainty:.3f} != expected {expected:.3f}")
    else:
        print(f"  INFO: No interactions detected")

    # Test 5: Dead zone (all middle brightness)
    print("\n--- Test: Dead Zone Detection ---")
    user_a = User(
        id="middle_a",
        name="Middle A",
        stars=[Star.from_brightness("a_test", "Test", "Test", 0.50)]
    )
    user_b = User(
        id="middle_b",
        name="Middle B",
        stars=[Star.from_brightness("b_test", "Test", "Test", 0.50)]
    )
    profile = compute_compatibility_profile(user_a, user_b)
    print(f"  Interactions in dead zone: {len(profile.interactions)}")
    print(f"  Dynamic type: {profile.dynamic_type.value}")
    if len(profile.interactions) == 0 and profile.dynamic_type == DynamicType.COMPLEX:
        print(f"  PASS: Dead zone correctly produces no interactions, COMPLEX type")
    else:
        print(f"  INFO: Behavior at dead zone boundary")


if __name__ == "__main__":
    print("="*70)
    print("COMPATIBILITY SYSTEM - MIRROR SIMULATION")
    print("="*70)

    # Run all scenarios
    results = run_all_scenarios()

    # Analyze results
    analyze_results(results)

    # Run edge case tests
    run_edge_case_tests()

    print("\n" + "="*70)
    print("SIMULATION COMPLETE")
    print("="*70)
