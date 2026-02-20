# Mobile Considerations

**Ensuring S.T.A.R.S. performs across all devices**

---

## Design Intent

S.T.A.R.S. must be beautiful on every device, from flagship phones to budget Android devices. Performance is not a nice-to-have—a sluggish experience breaks the sacred, contemplative feeling we're creating.

---

## Performance Targets

| Device Tier | FPS Target | Star Limit | Particles | Post-processing |
|-------------|------------|------------|-----------|-----------------|
| High-end (iPhone 14+, Pixel 7+) | 60 | 200 | 2000 | Full |
| Mid-range (iPhone 11, Pixel 5) | 45 | 150 | 1000 | Reduced |
| Low-end (Budget Android) | 30 | 100 | 500 | Minimal |

---

## Rendering Optimizations

### Device Pixel Ratio (DPR)

**Clamp to 2.** Never render at 3x on high-end screens—the visual difference is minimal but battery/performance cost is significant.

```javascript
<Canvas dpr={[1, 2]}>
```

### Geometry Simplification

| Element | High-end | Low-end |
|---------|----------|---------|
| Sky sphere segments | 64×64 | 32×32 |
| Star geometry | Icosahedron (20 faces) | Custom low-poly (12 faces) |
| Connection curve points | 50 | 20 |

### Instanced Rendering

Mandatory for stars:
```javascript
<instancedMesh args={[geometry, material, starCount]}>
```

### Frustum Culling

Automatically cull stars outside viewport. Three.js handles this, but ensure:
- Stars have proper bounding spheres
- Don't force all stars to render every frame

---

## Post-Processing Tiers

### Full (High-end)

```javascript
<EffectComposer>
  <ChromaticAberration />
  <DepthOfField />
  <Bloom />
  <Noise />
  <Vignette />
</EffectComposer>
```

### Reduced (Mid-range)

```javascript
<EffectComposer>
  <Bloom intensity={0.3} />
  <Vignette />
</EffectComposer>
```

### Minimal (Low-end)

```javascript
// No post-processing
// Use sprite-based glow textures instead of bloom
```

---

## Touch Targets

All interactive elements must have **minimum 44×44px hit areas**, per WCAG guidelines.

| Element | Visible Size | Hit Area |
|---------|--------------|----------|
| Star | 24-32px | 44×44px invisible sphere |
| HUD buttons | 32px icon | 44×44px |
| Date scrubber thumb | 20×40px | 44×44px |

---

## Gestures

| Gesture | Action |
|---------|--------|
| Single tap | Select star |
| Double tap | Zoom to star |
| Pinch | Zoom in/out |
| Two-finger drag | Pan (if enabled) |
| Swipe down (on tablet) | Access previous day |

### Gesture Thresholds

- Tap: < 200ms, < 10px movement
- Long press: > 500ms
- Swipe: > 50px in < 300ms

---

## Reduced Motion

Respect system preference:

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable:
  // - Parallax camera sway
  // - Ambient star pulse
  // - Connection shimmer
  // - Particle drift

  // Keep:
  // - Essential state feedback (button press)
  // - Navigation transitions (instant or crossfade)
}
```

---

## Battery Considerations

### Aggressive Power Saving

When battery is low or device is warm:
- Reduce particle count by 50%
- Lower FPS target to 30
- Disable post-processing

```javascript
navigator.getBattery?.().then(battery => {
  if (battery.level < 0.2) {
    enablePowerSaving();
  }
});
```

### Background Behavior

- Pause all animations when app is backgrounded
- Release WebGL context if hidden for > 30 seconds
- Resume smoothly on return

---

## Memory Management

### Texture Budgets

| Texture | Resolution | Count |
|---------|------------|-------|
| Star sprites | 64×64 | 4 types |
| Noise texture | 256×256 | 1 |
| Grain overlay | 512×512 | 1 |
| Nebula (optional) | 1024×1024 | 1 |

### Dispose Resources

```javascript
useEffect(() => {
  return () => {
    // Clean up on unmount
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };
}, []);
```

---

## Network Considerations

### Initial Load

- Critical path: Core HTML/CSS/JS for first paint
- Deferred: Three.js, textures, sounds
- Show skeleton UI while 3D initializes

### Progressive Enhancement

1. **Immediate:** Static constellation image (fallback)
2. **First 3D render:** Stars visible, no effects
3. **Full experience:** All post-processing, particles, animations

---

## Device Detection

### Capability Detection

```javascript
const detectPerformanceTier = () => {
  const gpu = getGPUTier(); // from gpu-tier library
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;

  if (gpu.tier >= 3 && memory >= 8 && cores >= 8) {
    return 'high';
  } else if (gpu.tier >= 2 && memory >= 4 && cores >= 4) {
    return 'medium';
  } else {
    return 'low';
  }
};
```

### Fallback Decisions

| Tier | Decisions |
|------|-----------|
| Low | No post-processing, reduced particles, simplified shaders |
| Medium | Reduced bloom, standard particles, full shaders |
| High | Full experience |

---

## Testing Matrix

### Priority Devices

| Platform | Device | Notes |
|----------|--------|-------|
| iOS | iPhone 12/14/15 | Primary target |
| iOS | iPhone SE | Low-end iOS baseline |
| Android | Pixel 6/7 | Reference Android |
| Android | Samsung A53 | Mid-range baseline |
| Android | Older budget device | Low-end stress test |

### Test Scenarios

- [ ] Cold start performance
- [ ] 100+ stars rendered
- [ ] Phase transition animation
- [ ] Birth Chart reveal (intensive moment)
- [ ] Extended session (30+ minutes)
- [ ] Low battery behavior
- [ ] Background/foreground switching

---

*"A beautiful experience that performs poorly is not a beautiful experience."*
