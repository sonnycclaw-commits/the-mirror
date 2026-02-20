"""
Phase Transitions Simulation

Validates phase progression timelines and regression behavior.
Run: python simulation.py
"""

import math
from dataclasses import dataclass, field
from typing import List
from enum import Enum

# =============================================================================
# CONSTANTS
# =============================================================================

# Star states (from constellation-states)
class StarState(Enum):
    NASCENT = "nascent"
    FLICKERING = "flickering"
    DIM = "dim"
    BRIGHT = "bright"
    DARK = "dark"
    DORMANT = "dormant"

# Phases
class Phase(Enum):
    SCATTERED = "SCATTERED"
    CONNECTING = "CONNECTING"
    EMERGING = "EMERGING"
    LUMINOUS = "LUMINOUS"

# Thresholds (from 02-blood.md)
CONNECTION_THRESHOLD_FORWARD = 3
DENSITY_THRESHOLD_FORWARD = 0.2
INTEGRATION_THRESHOLD = 0.5
BRIGHT_RATIO_CONNECTING = 0.3
DENSITY_THRESHOLD_CONNECTING = 0.4
LUMINOSITY_THRESHOLD = 0.7
BRIGHT_RATIO_EMERGING = 0.6
DARK_INFLUENCE_MAX = 0.2
STABILIZATION_DAYS = 14

HYSTERESIS_FACTOR = 0.7
REGRESSION_GRACE_CONNECTING = 7
REGRESSION_GRACE_EMERGING = 7
REGRESSION_GRACE_LUMINOUS = 14

BRIGHT_THRESHOLD = 0.7
DARK_INFLUENCE_WEIGHT = 0.2

# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class Star:
    brightness: float = 0.5
    state: StarState = StarState.FLICKERING
    connections: int = 0
    is_dark: bool = False

@dataclass
class Constellation:
    stars: List[Star] = field(default_factory=list)
    connections: List[tuple] = field(default_factory=list)  # (star_idx, star_idx, strength)
    phase: Phase = Phase.SCATTERED
    days_in_phase: int = 0
    days_below_threshold: int = 0

@dataclass
class Snapshot:
    day: int
    phase: str
    star_count: int
    connection_count: int
    connection_density: float
    bright_ratio: float
    integration: float
    luminosity: float
    progress: float

# =============================================================================
# METRIC CALCULATIONS
# =============================================================================

def get_active_stars(constellation):
    return [s for s in constellation.stars if s.state != StarState.DORMANT]

def calculate_connection_density(constellation):
    stars = get_active_stars(constellation)
    n = len(stars)
    if n < 2:
        return 0
    max_connections = n * (n - 1) / 2
    return len(constellation.connections) / max_connections

def calculate_bright_ratio(constellation):
    stars = get_active_stars(constellation)
    if not stars:
        return 0
    bright_count = len([s for s in stars if s.brightness >= BRIGHT_THRESHOLD])
    return bright_count / len(stars)

def calculate_dark_influence(constellation):
    stars = get_active_stars(constellation)
    if not stars:
        return 0
    total = 0
    for star in stars:
        if star.is_dark:
            intensity = 1 - star.brightness
            total += intensity * DARK_INFLUENCE_WEIGHT
    return min(total / len(stars), 1.0)

def calculate_integration(constellation):
    density = calculate_connection_density(constellation)
    stars = get_active_stars(constellation)

    if not stars:
        return 0

    # Brightness balance (low std = high balance)
    brightnesses = [s.brightness for s in stars]
    if len(brightnesses) > 1:
        mean_b = sum(brightnesses) / len(brightnesses)
        variance = sum((b - mean_b) ** 2 for b in brightnesses) / len(brightnesses)
        std_b = math.sqrt(variance)
    else:
        std_b = 0
    balance = 1 - std_b

    dark_influence = calculate_dark_influence(constellation)

    return density * 0.4 + balance * 0.3 + (1 - dark_influence) * 0.3

def calculate_luminosity(constellation):
    bright_ratio = calculate_bright_ratio(constellation)
    density = calculate_connection_density(constellation)
    dark_influence = calculate_dark_influence(constellation)

    # Simplified: assume all connections have strength 0.7
    connection_component = 0.7 * density * 0.25
    stability = 0.8  # Assume moderate stability

    return (bright_ratio * 0.4 +
            connection_component +
            stability * 0.2 -
            dark_influence * 0.15)

def calculate_progress(constellation, phase):
    density = calculate_connection_density(constellation)
    integration = calculate_integration(constellation)
    bright_ratio = calculate_bright_ratio(constellation)
    luminosity = calculate_luminosity(constellation)
    dark_influence = calculate_dark_influence(constellation)

    if phase == Phase.SCATTERED:
        conn_progress = len(constellation.connections) / CONNECTION_THRESHOLD_FORWARD
        return min(conn_progress, 1.0) * 100

    elif phase == Phase.CONNECTING:
        int_prog = integration / INTEGRATION_THRESHOLD
        br_prog = bright_ratio / BRIGHT_RATIO_CONNECTING
        dens_prog = density / DENSITY_THRESHOLD_CONNECTING
        return min((int_prog + br_prog + dens_prog) / 3, 1.0) * 100

    elif phase == Phase.EMERGING:
        lum_prog = luminosity / LUMINOSITY_THRESHOLD
        br_prog = bright_ratio / BRIGHT_RATIO_EMERGING
        dark_prog = 1 - (dark_influence / DARK_INFLUENCE_MAX) if dark_influence < DARK_INFLUENCE_MAX else 0
        stab_prog = min(constellation.days_in_phase / STABILIZATION_DAYS, 1.0)
        return min((lum_prog + br_prog + dark_prog + stab_prog) / 4, 1.0) * 100

    return 100  # LUMINOUS

# =============================================================================
# PHASE DETERMINATION
# =============================================================================

def check_advancement(constellation):
    phase = constellation.phase
    density = calculate_connection_density(constellation)
    integration = calculate_integration(constellation)
    bright_ratio = calculate_bright_ratio(constellation)
    luminosity = calculate_luminosity(constellation)
    dark_influence = calculate_dark_influence(constellation)

    if phase == Phase.SCATTERED:
        if (len(constellation.connections) >= CONNECTION_THRESHOLD_FORWARD or
            density >= DENSITY_THRESHOLD_FORWARD):
            return Phase.CONNECTING

    elif phase == Phase.CONNECTING:
        if (integration >= INTEGRATION_THRESHOLD and
            bright_ratio >= BRIGHT_RATIO_CONNECTING and
            density >= DENSITY_THRESHOLD_CONNECTING):
            return Phase.EMERGING

    elif phase == Phase.EMERGING:
        if (luminosity >= LUMINOSITY_THRESHOLD and
            bright_ratio >= BRIGHT_RATIO_EMERGING and
            dark_influence <= DARK_INFLUENCE_MAX and
            constellation.days_in_phase >= STABILIZATION_DAYS):
            return Phase.LUMINOUS

    return phase

def check_regression(constellation):
    phase = constellation.phase
    density = calculate_connection_density(constellation)
    integration = calculate_integration(constellation)
    bright_ratio = calculate_bright_ratio(constellation)
    luminosity = calculate_luminosity(constellation)

    if phase == Phase.CONNECTING:
        if (len(constellation.connections) < CONNECTION_THRESHOLD_FORWARD * HYSTERESIS_FACTOR and
            density < DENSITY_THRESHOLD_FORWARD * HYSTERESIS_FACTOR):
            if constellation.days_below_threshold >= REGRESSION_GRACE_CONNECTING:
                return Phase.SCATTERED

    elif phase == Phase.EMERGING:
        if (integration < INTEGRATION_THRESHOLD * HYSTERESIS_FACTOR or
            bright_ratio < BRIGHT_RATIO_CONNECTING * HYSTERESIS_FACTOR):
            if constellation.days_below_threshold >= REGRESSION_GRACE_EMERGING:
                return Phase.CONNECTING

    elif phase == Phase.LUMINOUS:
        if (luminosity < LUMINOSITY_THRESHOLD * HYSTERESIS_FACTOR or
            bright_ratio < BRIGHT_RATIO_EMERGING * HYSTERESIS_FACTOR):
            if constellation.days_below_threshold >= REGRESSION_GRACE_LUMINOUS:
                return Phase.EMERGING

    return phase

def update_phase(constellation):
    old_phase = constellation.phase

    # Check advancement first
    new_phase = check_advancement(constellation)
    if new_phase != old_phase:
        constellation.phase = new_phase
        constellation.days_in_phase = 0
        constellation.days_below_threshold = 0
        return

    # Check regression
    new_phase = check_regression(constellation)
    if new_phase != old_phase:
        constellation.phase = new_phase
        constellation.days_in_phase = 0
        constellation.days_below_threshold = 0
        return

    constellation.days_in_phase += 1

# =============================================================================
# SCENARIOS
# =============================================================================

def scenario_ideal_user(days: int = 120) -> List[Snapshot]:
    """Ideal user: steady star and connection growth, consistent brightness."""
    constellation = Constellation()
    snapshots = []

    for day in range(1, days + 1):
        # Simulate growth pattern
        if day <= 7:
            # Mirror phase: add stars, no connections
            if day <= 5:
                constellation.stars.append(Star(brightness=0.4))
        elif day <= 14:
            # Early Walk: add connections
            if len(constellation.connections) < 5 and len(constellation.stars) >= 2:
                constellation.connections.append((0, len(constellation.stars)-1, 0.7))
            # Brightness increases
            for star in constellation.stars:
                star.brightness = min(star.brightness + 0.02, 1.0)
                if star.brightness >= 0.7:
                    star.state = StarState.BRIGHT
        elif day <= 60:
            # Building: more stars, more connections, brightness growth
            if day % 7 == 0 and len(constellation.stars) < 10:
                constellation.stars.append(Star(brightness=0.5))
            if day % 3 == 0 and len(constellation.connections) < 20:
                n = len(constellation.stars)
                if n >= 2:
                    constellation.connections.append((day % n, (day + 1) % n, 0.7))
            for star in constellation.stars:
                star.brightness = min(star.brightness + 0.015, 1.0)
                if star.brightness >= 0.7:
                    star.state = StarState.BRIGHT
        else:
            # Maintenance: slow growth, maintain brightness
            for star in constellation.stars:
                star.brightness = min(star.brightness + 0.005, 1.0)
                if star.brightness >= 0.7:
                    star.state = StarState.BRIGHT

        update_phase(constellation)

        snapshots.append(Snapshot(
            day=day,
            phase=constellation.phase.value,
            star_count=len(constellation.stars),
            connection_count=len(constellation.connections),
            connection_density=round(calculate_connection_density(constellation), 3),
            bright_ratio=round(calculate_bright_ratio(constellation), 3),
            integration=round(calculate_integration(constellation), 3),
            luminosity=round(calculate_luminosity(constellation), 3),
            progress=round(calculate_progress(constellation, constellation.phase), 1)
        ))

    return snapshots

def scenario_struggling_user(days: int = 120) -> List[Snapshot]:
    """Struggling user: slow growth, inconsistent engagement."""
    constellation = Constellation()
    snapshots = []

    for day in range(1, days + 1):
        # Slow star growth
        if day % 14 == 0 and len(constellation.stars) < 6:
            constellation.stars.append(Star(brightness=0.3))

        # Occasional connections
        if day % 21 == 0 and len(constellation.stars) >= 2:
            n = len(constellation.stars)
            constellation.connections.append((0, n-1, 0.5))

        # Inconsistent brightness (sometimes up, sometimes down)
        for star in constellation.stars:
            if day % 3 == 0:
                star.brightness = min(star.brightness + 0.01, 0.6)
            elif day % 5 == 0:
                star.brightness = max(star.brightness - 0.005, 0.2)
            star.state = StarState.DIM if star.brightness < 0.5 else StarState.FLICKERING

        update_phase(constellation)

        snapshots.append(Snapshot(
            day=day,
            phase=constellation.phase.value,
            star_count=len(constellation.stars),
            connection_count=len(constellation.connections),
            connection_density=round(calculate_connection_density(constellation), 3),
            bright_ratio=round(calculate_bright_ratio(constellation), 3),
            integration=round(calculate_integration(constellation), 3),
            luminosity=round(calculate_luminosity(constellation), 3),
            progress=round(calculate_progress(constellation, constellation.phase), 1)
        ))

    return snapshots

def scenario_regression(days: int = 150) -> List[Snapshot]:
    """User achieves EMERGING, then regresses."""
    constellation = Constellation()
    snapshots = []

    # Fast-forward to EMERGING state
    constellation.stars = [Star(brightness=0.75, state=StarState.BRIGHT) for _ in range(8)]
    constellation.connections = [(i, i+1, 0.7) for i in range(7)]
    constellation.connections.extend([(0, 4), (1, 5), (2, 6)])  # 10 connections
    constellation.phase = Phase.EMERGING
    constellation.days_in_phase = 10

    for day in range(1, days + 1):
        if day <= 30:
            # Maintaining
            pass
        elif day <= 80:
            # Decline starts
            for star in constellation.stars:
                star.brightness = max(star.brightness - 0.008, 0.3)
                if star.brightness < 0.5:
                    star.state = StarState.DIM
            # Lose some connections
            if day % 10 == 0 and len(constellation.connections) > 3:
                constellation.connections.pop()
        else:
            # Partial recovery
            for star in constellation.stars:
                star.brightness = min(star.brightness + 0.005, 0.7)

        # Check if below threshold
        integration = calculate_integration(constellation)
        if integration < INTEGRATION_THRESHOLD * HYSTERESIS_FACTOR:
            constellation.days_below_threshold += 1
        else:
            constellation.days_below_threshold = 0

        update_phase(constellation)

        snapshots.append(Snapshot(
            day=day,
            phase=constellation.phase.value,
            star_count=len(constellation.stars),
            connection_count=len(constellation.connections),
            connection_density=round(calculate_connection_density(constellation), 3),
            bright_ratio=round(calculate_bright_ratio(constellation), 3),
            integration=round(calculate_integration(constellation), 3),
            luminosity=round(calculate_luminosity(constellation), 3),
            progress=round(calculate_progress(constellation, constellation.phase), 1)
        ))

    return snapshots

def scenario_luminous_achievement(days: int = 120) -> List[Snapshot]:
    """Optimal path to LUMINOUS."""
    constellation = Constellation()
    snapshots = []

    for day in range(1, days + 1):
        # Aggressive but realistic growth
        if day <= 7:
            constellation.stars.append(Star(brightness=0.5))
        elif day <= 21:
            if day % 2 == 0 and len(constellation.stars) < 10:
                constellation.stars.append(Star(brightness=0.6))
            # Build connections aggressively
            n = len(constellation.stars)
            if n >= 2 and len(constellation.connections) < n * (n-1) / 3:
                constellation.connections.append((day % n, (day * 2) % n, 0.8))
        else:
            # Focus on brightness
            for star in constellation.stars:
                star.brightness = min(star.brightness + 0.02, 1.0)
                if star.brightness >= 0.7:
                    star.state = StarState.BRIGHT

        update_phase(constellation)

        snapshots.append(Snapshot(
            day=day,
            phase=constellation.phase.value,
            star_count=len(constellation.stars),
            connection_count=len(constellation.connections),
            connection_density=round(calculate_connection_density(constellation), 3),
            bright_ratio=round(calculate_bright_ratio(constellation), 3),
            integration=round(calculate_integration(constellation), 3),
            luminosity=round(calculate_luminosity(constellation), 3),
            progress=round(calculate_progress(constellation, constellation.phase), 1)
        ))

    return snapshots

# =============================================================================
# MAIN
# =============================================================================

def print_scenario(name: str, snapshots: List[Snapshot], milestones: List[int] = None):
    print(f"\n{'='*70}")
    print(f"SCENARIO: {name}")
    print(f"{'='*70}")

    if milestones is None:
        milestones = [1, 7, 14, 30, 60, 90, 120]

    print(f"{'Day':>4} | {'Phase':>12} | {'Stars':>5} | {'Conns':>5} | {'Density':>7} | {'BrightR':>7} | {'Integ':>6} | {'Lumin':>6}")
    print("-" * 70)

    for snap in snapshots:
        if snap.day in milestones or snap.day == len(snapshots):
            print(f"{snap.day:>4} | {snap.phase:>12} | {snap.star_count:>5} | {snap.connection_count:>5} | {snap.connection_density:>7.3f} | {snap.bright_ratio:>7.3f} | {snap.integration:>6.3f} | {snap.luminosity:>6.3f}")

    # Find phase transitions
    print(f"\nPhase Transitions:")
    prev_phase = snapshots[0].phase
    for snap in snapshots:
        if snap.phase != prev_phase:
            print(f"  Day {snap.day}: {prev_phase} → {snap.phase}")
            prev_phase = snap.phase


def main():
    print("\n" + "="*70)
    print("PHASE TRANSITIONS SIMULATION")
    print("="*70)

    # Scenario 1: Ideal User
    results = scenario_ideal_user(120)
    print_scenario("Ideal User (steady engagement)", results)

    # Scenario 2: Struggling User
    results = scenario_struggling_user(120)
    print_scenario("Struggling User (inconsistent)", results)

    # Scenario 3: Regression
    results = scenario_regression(150)
    print_scenario("Regression (EMERGING → decline)", results,
                   [1, 30, 50, 70, 90, 110, 130, 150])

    # Scenario 4: Fast Path to Luminous
    results = scenario_luminous_achievement(120)
    print_scenario("Optimal Path to LUMINOUS", results)

    print("\n" + "="*70)
    print("SIMULATION COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
