# Color System

**The complete color palette for S.T.A.R.S.**

> *Source: Extracted from [Visual Design Architecture](../../../ideation/_deep_research/visual_design_architecture.md)*

---

## Design Intent

S.T.A.R.S. serves users during vulnerable moments of self-reflection. The color system must:
- Create a **calming counterpoint** to stress
- Feel like **night sky darkness** where stars become visible
- Evoke **infinite possibility** rather than constraint
- Communicate **warmth** while maintaining **credibility**

---

## Primary Palette

| Name | Hex | Usage | Conveys |
|------|-----|-------|---------|
| **Deep Twilight** | `#2D3A4F` | Headers, primary buttons, navigation, brand moments | Depth, wisdom, trustworthiness, contemplation |
| **Soft Sage** | `#6B9080` | Progress indicators, growth elements, secondary buttons | Growth, nature, calm, health, balance |
| **Warm Coral** | `#E07A5F` | CTAs, highlights, achievement moments, energy states | Energy, warmth, action, encouragement |
| **Dawn Cream** | `#FAF8F5` | Light backgrounds, card backgrounds, light mode base | Openness, cleanliness, warmth, safety |
| **Dark Night** | `#121822` | Dark mode background | Night sky immersion |

---

## Extended Palette

### Twilight Scale (Primary)

| Token | Hex | Usage |
|-------|-----|-------|
| `twilight-50` | `#F0F2F5` | Background tints, hover states |
| `twilight-100` | `#D8DCE3` | Borders, dividers |
| `twilight-200` | `#B1B9C7` | Disabled states, placeholders, connection lines |
| `twilight-300` | `#8A96AB` | Secondary text, dim stars |
| `twilight-400` | `#63738F` | Body text |
| `twilight-500` | `#2D3A4F` | **Primary (base)** |
| `twilight-600` | `#242F40` | Emphasis, headings |
| `twilight-700` | `#1B2331` | High contrast text |
| `twilight-800` | `#121822` | Dark mode backgrounds |
| `twilight-900` | `#090C11` | Deep dark mode |

### Sage Scale (Secondary)

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-50` | `#F0F5F3` | Success backgrounds |
| `sage-100` | `#D4E3DD` | Progress bar tracks |
| `sage-200` | `#B8D1C7` | Light progress fills |
| `sage-300` | `#9CBFB1` | Medium emphasis |
| `sage-400` | `#83AB98` | Secondary elements |
| `sage-500` | `#6B9080` | **Primary (base)** |
| `sage-600` | `#567366` | Dark mode secondary |
| `sage-700` | `#40564D` | Text on light backgrounds |
| `sage-800` | `#2B3A33` | High contrast secondary |
| `sage-900` | `#151D1A` | Deep dark secondary |

### Coral Scale (Accent)

| Token | Hex | Usage |
|-------|-----|-------|
| `coral-50` | `#FEF4F1` | Warning/attention backgrounds |
| `coral-100` | `#FADDD5` | Light accent fills |
| `coral-200` | `#F5C6B9` | Hover states |
| `coral-300` | `#EBA78F` | Medium emphasis |
| `coral-400` | `#E58A74` | Secondary accent |
| `coral-500` | `#E07A5F` | **Primary (base)** |
| `coral-600` | `#C9674E` | Dark mode accent |
| `coral-700` | `#A3533F` | Text on light backgrounds |
| `coral-800` | `#7D3F30` | High contrast accent |
| `coral-900` | `#572B21` | Deep dark accent |

---

## Semantic Colors

### System States

| State | Background | Light | Main | Dark | Usage |
|-------|------------|-------|------|------|-------|
| **Success** | `#E8F5E9` | `#81C784` | `#4CAF50` | `#2E7D32` | Growth, completion, achievement |
| **Warning** | `#FFF8E1` | `#FFD54F` | `#FFC107` | `#F57F17` | Attention, caution |
| **Error** | `#FFEBEE` | `#EF9A9A` | `#F44336` | `#C62828` | Blockers, issues (use sparingly) |
| **Info** | `#E3F2FD` | `#64B5F6` | `#2196F3` | `#1565C0` | Neutral information, tips |
| **Insight** | `#F3E5F5` | `#CE93D8` | `#9C27B0` | `#6A1B9A` | Discoveries, revelations, aha moments |
| **Progress** | `#E0F7FA` | `#4DD0E1` | `#00BCD4` | `#00838F` | Journey, advancement, momentum |

---

## Dark Mode Palette

### Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-0` | `#0D1117` | App background (deepest) |
| `surface-1` | `#161B22` | Card backgrounds |
| `surface-2` | `#21262D` | Elevated cards, modals |
| `surface-3` | `#30363D` | Input fields, dropdowns |
| `surface-4` | `#484F58` | Borders, dividers |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#E6EDF3` | Headings, primary content |
| `text-secondary` | `#8B949E` | Body text, descriptions |
| `text-tertiary` | `#6E7681` | Placeholders, hints |
| `text-disabled` | `#484F58` | Disabled states |

### Accents (Adjusted for dark backgrounds)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-dark` | `#58A6FF` | Links, primary actions |
| `secondary-dark` | `#7EE787` | Success, growth elements |
| `accent-dark` | `#FFA198` | Highlights, CTAs |
| `insight-dark` | `#D2A8FF` | Insight moments |

### Overlays

| Token | Value | Usage |
|-------|-------|-------|
| `hover-overlay` | `rgba(255,255,255,0.05)` | Hover state |
| `active-overlay` | `rgba(255,255,255,0.10)` | Active/pressed state |
| `focus-ring` | `rgba(88,166,255,0.4)` | Focus indicators |

---

## Star Colors

| Star Type | Color Treatment | Meaning |
|-----------|----------------|---------|
| **☆ Bright Star** | Gold-coral center (`#E07A5F`), warm glow halo | Verified strength, proven through action |
| **✧ Dim Star** | Muted gray-blue (`#8A96AB`), subtle glow | Shadow aspect, inviting integration |
| **✦ Flickering Star** | Sage green (`#6B9080`) with gold hints | Emerging potential, not yet stable |
| **● Dark Star** | Deep purple-black (`#1E1B2E`), dark aura | Gravity well, pattern pulling away |

---

## "Digital Renaissance" Accent Colors

For the ethereal, intellectual aesthetic:

| Name | Hex | Usage |
|------|-----|-------|
| **Electric Teal** | `#2EB8AC` | Sharp, precise highlights |
| **Burnt Orange** | `#C86B4D` | Organic warmth accents |
| **Midnight Oil** | `#191919` | Rich, warm dark background |
| **Warm Black** | `#0F0E0E` | Deep espresso black |
| **Paper White** | `#F0F0F0` | Easy-on-eyes text |

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance Targets

| Element | Minimum Contrast Ratio |
|---------|----------------------|
| Normal text (<18px) | 4.5:1 |
| Large text (≥18px) | 3:1 |
| UI components | 3:1 |
| Focus indicators | 3:1 from background |

### Validated Combinations (Light Mode)

| Background | Text | Ratio | Pass |
|------------|------|-------|------|
| `#FAF8F5` | `#2D3A4F` | 9.2:1 | ✓ Primary |
| `#FAF8F5` | `#63738F` | 4.8:1 | ✓ Body |
| `#FFFFFF` | `#2D3A4F` | 10.1:1 | ✓ Cards |
| `#2D3A4F` | `#FFFFFF` | 10.1:1 | ✓ Buttons |
| `#6B9080` | `#FFFFFF` | 4.5:1 | ✓ Secondary buttons |

### Validated Combinations (Dark Mode)

| Background | Text | Ratio | Pass |
|------------|------|-------|------|
| `#0D1117` | `#E6EDF3` | 14.5:1 | ✓ Primary |
| `#0D1117` | `#8B949E` | 6.2:1 | ✓ Body |
| `#161B22` | `#E6EDF3` | 12.8:1 | ✓ Cards |
| `#21262D` | `#E6EDF3` | 10.9:1 | ✓ Elevated |

### Rules

- **Never use color alone** to convey meaning (add icons/text)
- Support system-level color inversion
- Provide high-contrast mode option
- Test with deuteranopia, protanopia, tritanopia simulations

---

*"Color is emotion, not decoration. Every color choice must correspond to a specific emotional or semantic meaning."*
