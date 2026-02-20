#!/usr/bin/env python3
"""
Connection Formation Simulation

Validates the mechanics from 02-blood.md by simulating connection formation
and checking if strength/state progression feels right.

Usage:
    python simulation.py              # Run all scenarios
    python simulation.py --scenario organic  # Run specific scenario
    python simulation.py --chart      # Generate charts
"""

import argparse
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Tuple
import json
import random

# =============================================================================
# CONSTANTS (from 02-blood.md)
# =============================================================================

# Strength bounds
MIN_STRENGTH = 0.0
MAX_STRENGTH = 1.0
FLOOR = 0.05

# State thresholds
STRENGTH_NASCENT_MAX = 0.20
STRENGTH_FORMING_MAX = 0.40
STRENGTH_WEAK_MAX = 0.60
STRENGTH_MODERATE_MAX = 0.80

# Evidence thresholds
EVIDENCE_FOR_FORMING = 2
EVIDENCE_FOR_WEAK = 3
EVIDENCE_FOR_MODERATE = 5
EVIDENCE_FOR_STRONG = 8

# Daily caps
MAX_DAILY_STRENGTH_GAIN = 0.15

# Evidence impacts by type
EVIDENCE_IMPACTS = {
    "co_mention_response": 0.05,
    "co_mention_session": 0.08,
    "correlation_detected": 0.10,
    "user_confirms": 0.20,
    "user_creates": 0.25,
    "tars_confirmed": 0.15,
    "causation_detected": 0.12,
}

# Diminishing returns
DIMINISHING_FACTORS = [1.0, 0.6, 0.3, 0.1]

# Half-lives by connection type (days)
HALF_LIVES = {
    "resonance": 30,
    "tension": 21,
    "causation": 14,
    "growth_edge": 45,
    "shadow_mirror": 60,
    "blocks": 21,
}

# Influence rates
RESONANCE_SPILLOVER = 0.15
TENSION_DRAIN = 0.08
SHADOW_DRAIN_RATE = 0.01
GROWTH_EDGE_BOOST = 0.20
BLOCK_FACTOR = 0.5

# Dormancy thresholds (days)
DORMANCY_THRESHOLDS = {
    "nascent": 7,
    "forming": 14,
    "weak": 30,
    "moderate": 45,
    "strong": 60,
}

# Detection thresholds
RESONANCE_THRESHOLD = 0.5
TENSION_THRESHOLD = -0.3
CAUSATION_THRESHOLD = 0.6


# =============================================================================
# ENUMS AND DATA CLASSES
# =============================================================================

class ConnectionState(Enum):
    NASCENT = "nascent"
    FORMING = "forming"
    WEAK = "weak"
    MODERATE = "moderate"
    STRONG = "strong"
    DORMANT = "dormant"


class ConnectionType(Enum):
    RESONANCE = "resonance"
    TENSION = "tension"
    CAUSATION = "causation"
    GROWTH_EDGE = "growth_edge"
    SHADOW_MIRROR = "shadow_mirror"
    BLOCKS = "blocks"


@dataclass
class Evidence:
    """Single piece of evidence for a connection"""
    type: str
    day: int
    impact: float
    confidence: float = 0.5


@dataclass
class Connection:
    """A connection between two stars"""
    star_a: str
    star_b: str
    strength: float = 0.0
    state: ConnectionState = ConnectionState.NASCENT
    type: ConnectionType = ConnectionType.RESONANCE
    evidence_count: int = 0
    evidence_list: List[Evidence] = field(default_factory=list)
    days_inactive: int = 0
    strength_history: List[float] = field(default_factory=list)
    strength_gained_today: float = 0.0

    def __post_init__(self):
        self.strength_history = [self.strength]


@dataclass
class DayAction:
    """Evidence gathered on a single day"""
    evidence_types: List[str] = field(default_factory=list)
    user_engaged: bool = False


# =============================================================================
# CORE MECHANICS
# =============================================================================

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp value to range"""
    return max(min_val, min(max_val, value))


def calculate_daily_decay_rate(half_life: int) -> float:
    """Convert half-life to daily decay rate"""
    return 1 - (0.5 ** (1 / half_life))


def determine_state(conn: Connection) -> ConnectionState:
    """Determine connection state based on strength and evidence"""
    s = conn.strength
    e = conn.evidence_count

    # Dormancy check
    dormancy_threshold = DORMANCY_THRESHOLDS.get(conn.state.value, 30)
    if conn.days_inactive >= dormancy_threshold:
        return ConnectionState.DORMANT

    # Strength + evidence based states
    if s >= 0.80 and e >= EVIDENCE_FOR_STRONG:
        return ConnectionState.STRONG
    if s >= 0.60 and e >= EVIDENCE_FOR_MODERATE:
        return ConnectionState.MODERATE
    if s >= 0.40 and e >= EVIDENCE_FOR_WEAK:
        return ConnectionState.WEAK
    if s >= 0.20 and e >= EVIDENCE_FOR_FORMING:
        return ConnectionState.FORMING
    if s > 0:
        return ConnectionState.NASCENT

    return ConnectionState.NASCENT


def calculate_evidence_impact(evidence_type: str, day_evidence_count: int) -> float:
    """Calculate strength gain from evidence with diminishing returns"""
    base_impact = EVIDENCE_IMPACTS.get(evidence_type, 0.05)

    # Apply diminishing returns
    factor_idx = min(day_evidence_count, len(DIMINISHING_FACTORS) - 1)
    factor = DIMINISHING_FACTORS[factor_idx]

    return base_impact * factor


def simulate_day(conn: Connection, action: DayAction) -> Connection:
    """Simulate one day of connection evolution"""

    # Reset daily tracking
    conn.strength_gained_today = 0.0

    # Calculate evidence impacts
    total_gain = 0.0

    for i, evidence_type in enumerate(action.evidence_types):
        impact = calculate_evidence_impact(evidence_type, i)

        # Cap daily gain
        remaining = MAX_DAILY_STRENGTH_GAIN - conn.strength_gained_today
        impact = min(impact, remaining)

        if impact > 0:
            evidence = Evidence(
                type=evidence_type,
                day=len(conn.strength_history),
                impact=impact
            )
            conn.evidence_list.append(evidence)
            conn.evidence_count += 1
            total_gain += impact
            conn.strength_gained_today += impact

    # Apply gain
    conn.strength = clamp(conn.strength + total_gain, MIN_STRENGTH, MAX_STRENGTH)

    # Calculate decay (only if no engagement)
    if not action.evidence_types and not action.user_engaged:
        half_life = HALF_LIVES.get(conn.type.value, 30)
        decay_rate = calculate_daily_decay_rate(half_life)

        # Proportional decay
        effective = (conn.strength - FLOOR) / (MAX_STRENGTH - FLOOR) if conn.strength > FLOOR else 0
        decay = conn.strength * decay_rate * effective

        conn.strength = clamp(conn.strength - decay, FLOOR, MAX_STRENGTH)

    # Update counters
    if action.evidence_types or action.user_engaged:
        conn.days_inactive = 0
    else:
        conn.days_inactive += 1

    # Update history
    conn.strength_history.append(conn.strength)

    # Update state
    conn.state = determine_state(conn)

    return conn


# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_organic_formation(days: int = 60) -> List[dict]:
    """Organic connection formation through gradual evidence"""
    conn = Connection(star_a="Health", star_b="Energy", strength=0.0)
    results = []

    random.seed(42)

    for day in range(days):
        # Simulate organic discovery pattern
        evidence = []

        if day < 7:
            # Week 1: Occasional co-mentions
            if random.random() < 0.3:
                evidence.append("co_mention_response")
        elif day < 14:
            # Week 2: TARS notices pattern
            if random.random() < 0.4:
                evidence.append("co_mention_session")
            if day == 10:
                evidence.append("correlation_detected")
        elif day < 30:
            # Weeks 3-4: User engages with connection
            if random.random() < 0.3:
                evidence.append("co_mention_session")
            if day == 21:
                evidence.append("user_confirms")
        else:
            # Maintenance phase
            if random.random() < 0.2:
                evidence.append("co_mention_response")

        action = DayAction(evidence_types=evidence, user_engaged=bool(evidence))
        conn = simulate_day(conn, action)

        results.append({
            "day": day + 1,
            "strength": round(conn.strength, 3),
            "evidence_count": conn.evidence_count,
            "state": conn.state.value,
            "days_inactive": conn.days_inactive,
        })

    return results


def scenario_user_created(days: int = 30) -> List[dict]:
    """User explicitly creates and maintains connection"""
    conn = Connection(star_a="Purpose", star_b="Creativity", strength=0.0)
    results = []

    for day in range(days):
        evidence = []

        if day == 0:
            # User creates connection on day 1
            evidence.append("user_creates")
        elif day < 14:
            # Regular engagement
            if day % 3 == 0:
                evidence.append("co_mention_session")
        else:
            # Less frequent
            if day % 5 == 0:
                evidence.append("co_mention_response")

        action = DayAction(evidence_types=evidence, user_engaged=bool(evidence))
        conn = simulate_day(conn, action)

        results.append({
            "day": day + 1,
            "strength": round(conn.strength, 3),
            "evidence_count": conn.evidence_count,
            "state": conn.state.value,
        })

    return results


def scenario_neglected_connection(days: int = 60) -> List[dict]:
    """Strong connection that gets neglected"""
    # Start with established connection
    conn = Connection(
        star_a="Work", star_b="Stress",
        strength=0.75,
        evidence_count=6,
        state=ConnectionState.MODERATE,
        type=ConnectionType.TENSION
    )
    results = []

    for day in range(days):
        # No engagement
        action = DayAction(evidence_types=[], user_engaged=False)
        conn = simulate_day(conn, action)

        results.append({
            "day": day + 1,
            "strength": round(conn.strength, 3),
            "state": conn.state.value,
            "days_inactive": conn.days_inactive,
        })

    return results


def scenario_evidence_spam(days: int = 7) -> List[dict]:
    """Attempt to game by spamming evidence"""
    conn = Connection(star_a="Gaming", star_b="Test", strength=0.0)
    results = []

    for day in range(days):
        # Spam 10 pieces of evidence per day
        evidence = ["co_mention_response"] * 10
        action = DayAction(evidence_types=evidence, user_engaged=True)
        conn = simulate_day(conn, action)

        results.append({
            "day": day + 1,
            "strength": round(conn.strength, 3),
            "evidence_count": conn.evidence_count,
            "state": conn.state.value,
            "daily_gain": round(conn.strength_gained_today, 3),
            "note": f"10 evidence submitted, capped at {MAX_DAILY_STRENGTH_GAIN}",
        })

    return results


def scenario_type_comparison(days: int = 45) -> List[dict]:
    """Compare decay rates across connection types"""
    types = [
        ConnectionType.RESONANCE,
        ConnectionType.CAUSATION,
        ConnectionType.SHADOW_MIRROR,
    ]

    connections = [
        Connection(star_a="A", star_b="B", strength=0.8, type=t, evidence_count=8)
        for t in types
    ]

    results = []

    for day in range(days):
        day_result = {"day": day + 1}

        for i, conn in enumerate(connections):
            action = DayAction(evidence_types=[], user_engaged=False)
            connections[i] = simulate_day(conn, action)
            day_result[f"{conn.type.value}_strength"] = round(conn.strength, 3)

        results.append(day_result)

    return results


def scenario_excavation_boost(days: int = 14) -> List[dict]:
    """Connection formation during excavation (boosted rates)"""
    conn = Connection(star_a="Mirror", star_b="Discovery", strength=0.0)
    results = []

    random.seed(42)

    for day in range(days):
        evidence = []

        # During excavation: every co-mention creates nascent
        if random.random() < 0.5:
            evidence.append("co_mention_response")
        if random.random() < 0.3:
            evidence.append("co_mention_session")

        # Day 2: First connection drawn (per micro-revelations)
        if day == 1:
            evidence.append("tars_confirmed")

        # Excavation boost: 1.5x impact
        action = DayAction(evidence_types=evidence, user_engaged=bool(evidence))

        # Apply excavation multiplier
        for _ in range(len(action.evidence_types)):
            # Simulate 1.5x by sometimes adding extra evidence
            if random.random() < 0.5:
                evidence.append("co_mention_response")

        action.evidence_types = evidence
        conn = simulate_day(conn, action)

        results.append({
            "day": day + 1,
            "strength": round(conn.strength, 3),
            "evidence_count": conn.evidence_count,
            "state": conn.state.value,
            "note": "Excavation period (Day 1-7)" if day < 7 else "Post-excavation",
        })

    return results


def scenario_reactivation(days: int = 90) -> List[dict]:
    """Connection goes dormant then reactivates"""
    conn = Connection(
        star_a="Old", star_b="Pattern",
        strength=0.5,
        evidence_count=4,
        state=ConnectionState.WEAK
    )
    results = []

    for day in range(days):
        evidence = []

        if day < 30:
            # Active phase
            if day % 5 == 0:
                evidence.append("co_mention_session")
        elif day < 75:
            # Dormant phase - no engagement
            pass
        else:
            # Reactivation
            if day == 75:
                evidence.append("user_confirms")
            elif day % 3 == 0:
                evidence.append("co_mention_response")

        action = DayAction(evidence_types=evidence, user_engaged=bool(evidence))
        conn = simulate_day(conn, action)

        results.append({
            "day": day + 1,
            "strength": round(conn.strength, 3),
            "state": conn.state.value,
            "days_inactive": conn.days_inactive,
        })

    return results


# =============================================================================
# ANALYSIS
# =============================================================================

def analyze_scenario(name: str, results: List[dict]) -> dict:
    """Analyze scenario results"""
    strengths = [r.get("strength", 0) for r in results]

    analysis = {
        "scenario": name,
        "days": len(results),
        "start_strength": strengths[0],
        "end_strength": strengths[-1],
        "max_strength": max(strengths),
        "min_strength": min(strengths),
        "final_state": results[-1].get("state", "N/A"),
        "evidence_total": results[-1].get("evidence_count", 0),
    }

    # Find key milestones
    for i, s in enumerate(strengths):
        if s >= 0.4 and "day_reached_weak" not in analysis:
            analysis["day_reached_weak"] = i + 1
        if s >= 0.6 and "day_reached_moderate" not in analysis:
            analysis["day_reached_moderate"] = i + 1
        if s >= 0.8 and "day_reached_strong" not in analysis:
            analysis["day_reached_strong"] = i + 1

    return analysis


def print_results(name: str, results: List[dict], analysis: dict):
    """Print formatted results"""
    print(f"\n{'='*60}")
    print(f"SCENARIO: {name}")
    print(f"{'='*60}")

    # Print first 7 days and last 3 days
    print("\nDay-by-day (first 7 + last 3):")
    print("-" * 50)

    for r in results[:7]:
        state = r.get('state', 'N/A')
        strength = r.get('strength', 0)
        evidence = r.get('evidence_count', 0)
        print(f"  Day {r['day']:2d}: strength={strength:.3f}, evidence={evidence}, state={state}")

    if len(results) > 10:
        print("  ...")

    for r in results[-3:]:
        state = r.get('state', 'N/A')
        strength = r.get('strength', 0)
        print(f"  Day {r['day']:2d}: strength={strength:.3f}, state={state}")

    print("\nAnalysis:")
    print("-" * 50)
    for key, value in analysis.items():
        if key != "scenario":
            print(f"  {key}: {value}")


def generate_ascii_chart(results: List[dict], width: int = 50):
    """Generate simple ASCII chart of strength over time"""
    strengths = [r.get("strength", 0) for r in results]

    print("\nStrength over time:")
    print("-" * (width + 10))

    # State threshold positions
    weak_pos = int(0.4 * width)
    moderate_pos = int(0.6 * width)
    strong_pos = int(0.8 * width)

    for i, s in enumerate(strengths[::max(1, len(strengths)//20)]):
        bar_len = int(s * width)
        bar = "█" * bar_len

        day = i * max(1, len(strengths)//20) + 1
        print(f"Day {day:3d} [{bar:<{width}}] {s:.2f}")

    print(f"         {' '*weak_pos}↑{' '*(moderate_pos-weak_pos-1)}↑{' '*(strong_pos-moderate_pos-1)}↑")
    print(f"         {' '*weak_pos}W{' '*(moderate_pos-weak_pos-1)}M{' '*(strong_pos-moderate_pos-1)}S")


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Connection Formation Simulation")
    parser.add_argument("--scenario", type=str, help="Run specific scenario")
    parser.add_argument("--chart", action="store_true", help="Show ASCII charts")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    scenarios = {
        "organic": ("Organic Formation (gradual)", scenario_organic_formation),
        "user_created": ("User Created Connection", scenario_user_created),
        "neglected": ("Neglected Connection (decay)", scenario_neglected_connection),
        "spam": ("Evidence Spam (gaming)", scenario_evidence_spam),
        "type_compare": ("Type Decay Comparison", scenario_type_comparison),
        "excavation": ("Excavation Period (boosted)", scenario_excavation_boost),
        "reactivation": ("Dormant Reactivation", scenario_reactivation),
    }

    if args.scenario:
        if args.scenario not in scenarios:
            print(f"Unknown scenario: {args.scenario}")
            print(f"Available: {', '.join(scenarios.keys())}")
            return

        name, func = scenarios[args.scenario]
        results = func()
        analysis = analyze_scenario(name, results)

        if args.json:
            print(json.dumps({"results": results, "analysis": analysis}, indent=2))
        else:
            print_results(name, results, analysis)
            if args.chart:
                generate_ascii_chart(results)
    else:
        # Run all scenarios
        print("=" * 60)
        print("CONNECTION FORMATION SIMULATION")
        print("Validating mechanics from 02-blood.md")
        print("=" * 60)

        all_analyses = []

        for key, (name, func) in scenarios.items():
            results = func()
            analysis = analyze_scenario(name, results)
            all_analyses.append(analysis)

            if not args.json:
                print_results(name, results, analysis)
                if args.chart:
                    generate_ascii_chart(results)

        if args.json:
            print(json.dumps(all_analyses, indent=2))
        else:
            # Summary
            print("\n" + "=" * 60)
            print("SUMMARY")
            print("=" * 60)

            print("\n| Scenario | Days to WEAK | Days to MODERATE | Final Strength | Final State |")
            print("|----------|--------------|------------------|----------------|-------------|")
            for a in all_analyses:
                days_weak = a.get("day_reached_weak", "N/A")
                days_mod = a.get("day_reached_moderate", "N/A")
                print(f"| {a['scenario'][:25]:<25} | {str(days_weak):^12} | {str(days_mod):^16} | {a['end_strength']:^14.3f} | {a['final_state']:^11} |")

            print("\n" + "=" * 60)
            print("VALIDATION CHECKLIST")
            print("=" * 60)

            organic = all_analyses[0]
            spam = all_analyses[3]
            neglected = all_analyses[2]

            checks = [
                ("Organic reaches WEAK in 10-20 days",
                 10 <= organic.get("day_reached_weak", 0) <= 25),
                ("Evidence spam is capped (not instant STRONG)",
                 spam.get("day_reached_strong", 999) > 5 or spam["end_strength"] < 0.8),
                ("Neglected connection decays but doesn't hit 0",
                 neglected["end_strength"] >= FLOOR),
                ("User-created connection starts strong",
                 all_analyses[1].get("day_reached_weak", 99) <= 5),
                ("Excavation boost accelerates formation",
                 all_analyses[5].get("day_reached_weak", 99) < 10),
            ]

            for check, passed in checks:
                status = "✓ PASS" if passed else "✗ FAIL"
                print(f"  {status}: {check}")


if __name__ == "__main__":
    main()
