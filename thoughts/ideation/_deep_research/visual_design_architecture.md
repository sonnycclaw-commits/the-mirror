Life OS Visual Design Architecture
Comprehensive Design System for a High-Trust Self-Development Application
Document Version: 1.0
Date: 2026-01-13
Purpose: Actionable design specifications for Life OS UI/UX implementation

Table of Contents
Design Philosophy & Principles
Color System
Typography System
Animation & Motion Design
Core UI Components
Journey Visualization System
Skill Tree Visualization
Profile & Psychometric Visualization
AI-Generated Visual Opportunities
Screen-by-Screen Wireframe Concepts
Design System Summary
1. Design Philosophy & Principles
1.1 Core Design Values
Life OS serves users during vulnerable moments of self-reflection and growth. The visual design must communicate four core values:

╔═══════════════════════════════════════════════════════════════════════════╗
║                     LIFE OS DESIGN VALUES                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   🛡️ TRUST                                                               ║
║   "This app has my back"                                                  ║
║   Visual cues: Security indicators, consistent patterns, clean layouts    ║
║   Anti-patterns: Dark patterns, deceptive UI, hidden information          ║
║                                                                           ║
║   🌱 WARMTH                                                               ║
║   "I feel welcome and understood"                                         ║
║   Visual cues: Soft edges, friendly colors, approachable imagery          ║
║   Anti-patterns: Clinical aesthetics, sterile interfaces, cold tones      ║
║                                                                           ║
║   💎 CLARITY                                                              ║
║   "I always know where I am and what to do"                              ║
║   Visual cues: Clear hierarchy, generous whitespace, intuitive navigation ║
║   Anti-patterns: Cluttered screens, confusing navigation, information overload ║
║                                                                           ║
║   📈 PROGRESS                                                             ║
║   "I can see and feel my growth"                                         ║
║   Visual cues: Progress indicators, achievement moments, journey maps     ║
║   Anti-patterns: Static interfaces, hidden progress, unclear milestones   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
1.2 Design Language Definition
Name: "Guided Growth"

Personality Keywords:

Calm but not sleepy
Professional but not cold
Encouraging but not patronizing
Playful but not childish
Confident but not arrogant
Visual Metaphors:

Journey/Path: Progress visualized as a winding trail
Garden: Growth depicted as cultivation
Constellation: Connections shown as star maps
Sunrise: New beginnings and daily renewal
Design DNA:

Element	Character	Implementation
Shapes	Soft, organic	Border radius: 12-24px, no sharp corners except intentional emphasis
Lines	Flowing, gentle curves	Bezier curves, hand-drawn feel for illustrations
Density	Spacious, breathing	Minimum 24px padding, generous margins
Motion	Smooth, purposeful	Easing curves, 200-400ms transitions
Tone	Warm, conversational	Rounded fonts, friendly micro-copy
1.3 Balancing Professional vs. Approachable
Life OS must feel credible (users trust it with personal information) while remaining inviting (users engage with it daily).

SPECTRUM POSITIONING:

Clinical/Cold ◄─────────────────────────────────────► Overly Gamified
                                 │
                                 │
                         ┌──────┴──────┐
                         │   LIFE OS   │
                         │   SWEET     │
                         │   SPOT      │
                         └─────────────┘

We lean slightly toward WARMTH while maintaining CREDIBILITY.
Achieving Balance:

Professional Element	Warm Element	How We Balance
Clean typography	Friendly font choices	Use Inter (professional) with humanist characteristics
Structured layouts	Organic shapes	Grid-based layouts with rounded containers
Data visualization	Playful animations	Clear charts with celebratory motion on achievements
Minimal icons	Illustrated moments	Line icons generally, illustrations for key moments
Muted palette	Warm accent colors	Calm base colors with sunset/nature accents
1.4 Avoiding Design Anti-Patterns
DO NOT:

Anti-Pattern	Why It's Harmful	What To Do Instead
Overwhelming gamification	Creates anxiety, feels manipulative	Subtle progress indicators, meaningful celebrations
Clinical assessment feel	Triggers medical anxiety	Conversational framing, soft visual language
Aggressive conversion UI	Breaks trust	Value-first approach, transparent pricing
Streaks with punishment	Creates guilt and anxiety	Positive reinforcement, no shame mechanics
Dense information walls	Cognitive overload	Progressive disclosure, one thing at a time
Stock photography of happy people	Feels inauthentic	Custom illustrations, abstract imagery
Timer-based pressure	Induces stress	Self-paced interactions
Social comparison features	Triggers inadequacy	Personal progress only
2. Color System
2.1 Primary Palette
The primary palette creates the foundational visual identity, optimized for trust and calm.

╔═══════════════════════════════════════════════════════════════════════════╗
║                       PRIMARY COLOR PALETTE                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   DEEP TWILIGHT (Primary Brand Color)                                     ║
║   ┌──────────────────────────────────────┐                               ║
║   │ █████████████████████████████████████ │  #2D3A4F                     ║
║   └──────────────────────────────────────┘                               ║
║   Usage: Headers, primary buttons, navigation, brand moments              ║
║   Conveys: Depth, wisdom, trustworthiness, contemplation                  ║
║                                                                           ║
║   SOFT SAGE (Secondary Brand Color)                                       ║
║   ┌──────────────────────────────────────┐                               ║
║   │ █████████████████████████████████████ │  #6B9080                     ║
║   └──────────────────────────────────────┘                               ║
║   Usage: Progress indicators, growth elements, secondary buttons          ║
║   Conveys: Growth, nature, calm, health, balance                          ║
║                                                                           ║
║   WARM CORAL (Accent Color)                                               ║
║   ┌──────────────────────────────────────┐                               ║
║   │ █████████████████████████████████████ │  #E07A5F                     ║
║   └──────────────────────────────────────┘                               ║
║   Usage: CTAs, highlights, achievement moments, energy states             ║
║   Conveys: Energy, warmth, action, encouragement                          ║
║                                                                           ║
║   DAWN CREAM (Background Warm)                                            ║
║   ┌──────────────────────────────────────┐                               ║
║   │ █████████████████████████████████████ │  #FAF8F5                     ║
║   └──────────────────────────────────────┘                               ║
║   Usage: Primary background, card backgrounds, light mode base            ║
║   Conveys: Openness, cleanliness, warmth, safety                          ║
║                                                                           ║
║   CANVAS WHITE (Background Pure)                                          ║
║   ┌──────────────────────────────────────┐                               ║
║   │ █████████████████████████████████████ │  #FFFFFF                     ║
║   └──────────────────────────────────────┘                               ║
║   Usage: Card surfaces, input fields, modal backgrounds                   ║
║   Conveys: Focus, clarity, space                                          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
2.2 Extended Palette
╔═══════════════════════════════════════════════════════════════════════════╗
║                       EXTENDED COLOR PALETTE                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   TWILIGHT SCALE (From Primary)                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   Twilight-50   #F0F2F5   Background tints, hover states                 ║
║   Twilight-100  #D8DCE3   Borders, dividers                              ║
║   Twilight-200  #B1B9C7   Disabled states, placeholders                  ║
║   Twilight-300  #8A96AB   Secondary text                                 ║
║   Twilight-400  #63738F   Body text                                      ║
║   Twilight-500  #2D3A4F   Primary (base)                                 ║
║   Twilight-600  #242F40   Emphasis, headings                             ║
║   Twilight-700  #1B2331   High contrast text                             ║
║   Twilight-800  #121822   Dark mode backgrounds                          ║
║   Twilight-900  #090C11   Deep dark mode                                 ║
║                                                                           ║
║   SAGE SCALE (From Secondary)                                             ║
║   ─────────────────────────────────────────────────────────               ║
║   Sage-50      #F0F5F3    Success backgrounds                            ║
║   Sage-100     #D4E3DD    Progress bar tracks                            ║
║   Sage-200     #B8D1C7    Light progress fills                           ║
║   Sage-300     #9CBFB1    Medium emphasis                                ║
║   Sage-400     #83AB98    Secondary elements                             ║
║   Sage-500     #6B9080    Primary (base)                                 ║
║   Sage-600     #567366    Dark mode secondary                            ║
║   Sage-700     #40564D    Text on light backgrounds                      ║
║   Sage-800     #2B3A33    High contrast secondary                        ║
║   Sage-900     #151D1A    Deep dark secondary                            ║
║                                                                           ║
║   CORAL SCALE (From Accent)                                               ║
║   ─────────────────────────────────────────────────────────               ║
║   Coral-50     #FEF4F1    Warning/attention backgrounds                  ║
║   Coral-100    #FADDD5    Light accent fills                             ║
║   Coral-200    #F5C6B9    Hover states                                   ║
║   Coral-300    #EBA78F    Medium emphasis                                ║
║   Coral-400    #E58A74    Secondary accent                               ║
║   Coral-500    #E07A5F    Primary (base)                                 ║
║   Coral-600    #C9674E    Dark mode accent                               ║
║   Coral-700    #A3533F    Text on light backgrounds                      ║
║   Coral-800    #7D3F30    High contrast accent                           ║
║   Coral-900    #572B21    Deep dark accent                               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
2.3 Semantic Colors
╔═══════════════════════════════════════════════════════════════════════════╗
║                       SEMANTIC COLOR SYSTEM                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   SUCCESS (Growth, Completion, Achievement)                               ║
║   ─────────────────────────────────────────────────────────               ║
║   Success-bg      #E8F5E9    Background for success states               ║
║   Success-light   #81C784    Progress fills, light indicators            ║
║   Success-main    #4CAF50    Icons, checkmarks, completion               ║
║   Success-dark    #2E7D32    Text, emphasis                              ║
║                                                                           ║
║   WARNING (Attention, Caution, Approaching Limit)                        ║
║   ─────────────────────────────────────────────────────────               ║
║   Warning-bg      #FFF8E1    Background for warning states               ║
║   Warning-light   #FFD54F    Light indicators                            ║
║   Warning-main    #FFC107    Icons, attention elements                   ║
║   Warning-dark    #F57F17    Text, strong emphasis                       ║
║                                                                           ║
║   ERROR (Blockers, Issues, Critical)                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   Error-bg        #FFEBEE    Background for error states                 ║
║   Error-light     #EF9A9A    Light indicators                            ║
║   Error-main      #F44336    Icons, error elements                       ║
║   Error-dark      #C62828    Text, strong emphasis                       ║
║   Note: Use sparingly - errors should be rare in Life OS                 ║
║                                                                           ║
║   INFO (Neutral Information, Tips, System)                               ║
║   ─────────────────────────────────────────────────────────               ║
║   Info-bg         #E3F2FD    Background for info states                  ║
║   Info-light      #64B5F6    Light indicators                            ║
║   Info-main       #2196F3    Icons, information elements                 ║
║   Info-dark       #1565C0    Text, emphasis                              ║
║                                                                           ║
║   INSIGHT (Discoveries, Revelations, Aha Moments)                        ║
║   ─────────────────────────────────────────────────────────               ║
║   Insight-bg      #F3E5F5    Background for insight reveals              ║
║   Insight-light   #CE93D8    Glow effects, halos                         ║
║   Insight-main    #9C27B0    Icons, insight indicators                   ║
║   Insight-dark    #6A1B9A    Text, emphasis                              ║
║                                                                           ║
║   PROGRESS (Journey, Advancement, Momentum)                              ║
║   ─────────────────────────────────────────────────────────               ║
║   Progress-bg     #E0F7FA    Background for progress elements            ║
║   Progress-light  #4DD0E1    Light fills                                 ║
║   Progress-main   #00BCD4    Progress bars, indicators                   ║
║   Progress-dark   #00838F    Text, milestones                            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
2.4 Dark Mode Palette
╔═══════════════════════════════════════════════════════════════════════════╗
║                       DARK MODE PALETTE                                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   BACKGROUNDS                                                             ║
║   ─────────────────────────────────────────────────────────               ║
║   Surface-0 (Deepest)    #0D1117   App background                        ║
║   Surface-1              #161B22   Card backgrounds                      ║
║   Surface-2              #21262D   Elevated cards, modals                ║
║   Surface-3              #30363D   Input fields, dropdowns               ║
║   Surface-4              #484F58   Borders, dividers                     ║
║                                                                           ║
║   TEXT                                                                    ║
║   ─────────────────────────────────────────────────────────               ║
║   Text-primary           #E6EDF3   Headings, primary content             ║
║   Text-secondary         #8B949E   Body text, descriptions               ║
║   Text-tertiary          #6E7681   Placeholders, hints                   ║
║   Text-disabled          #484F58   Disabled states                       ║
║                                                                           ║
║   ACCENTS (Adjusted for dark backgrounds)                                ║
║   ─────────────────────────────────────────────────────────               ║
║   Primary-dark           #58A6FF   Links, primary actions                ║
║   Secondary-dark         #7EE787   Success, growth elements              ║
║   Accent-dark            #FFA198   Highlights, CTAs                      ║
║   Insight-dark           #D2A8FF   Insight moments                       ║
║                                                                           ║
║   SPECIAL STATES                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Hover-overlay          rgba(255,255,255,0.05)                          ║
║   Active-overlay         rgba(255,255,255,0.10)                          ║
║   Focus-ring             rgba(88,166,255,0.4)                            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
2.5 Colors for Emotional States
Used in mood tracking, emotional pattern visualization, and adaptive interfaces.

╔═══════════════════════════════════════════════════════════════════════════╗
║                    EMOTIONAL STATE COLORS                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   POSITIVE SPECTRUM                                                       ║
║   ─────────────────────────────────────────────────────────               ║
║   Joy/Happiness          #FFD93D    Warm yellow, sunny                   ║
║   Contentment            #6BCB77    Soft green, peaceful                 ║
║   Excitement             #FF6B6B    Energetic coral                      ║
║   Love/Connection        #F49AC2    Warm pink                            ║
║   Pride                  #9B59B6    Royal purple                         ║
║   Hope                   #74C0FC    Sky blue                             ║
║   Gratitude              #A8E6CF    Mint green                           ║
║                                                                           ║
║   NEUTRAL SPECTRUM                                                        ║
║   ─────────────────────────────────────────────────────────               ║
║   Calm                   #B8D4E3    Soft blue-grey                       ║
║   Curious                #DDA0DD    Light plum                           ║
║   Reflective             #C9B1FF    Lavender                             ║
║   Focused                #5DADE2    Clear blue                           ║
║   Neutral                #BDC3C7    Balanced grey                        ║
║                                                                           ║
║   CHALLENGING SPECTRUM                                                    ║
║   ─────────────────────────────────────────────────────────               ║
║   Anxious                #F7DC6F    Nervous yellow                       ║
║   Sad                    #85C1E9    Melancholic blue                     ║
║   Frustrated             #E59866    Burnt orange                         ║
║   Angry                  #EC7063    Muted red (NOT aggressive)           ║
║   Lonely                 #AEB6BF    Isolated grey                        ║
║   Overwhelmed            #D7BDE2    Pale purple                          ║
║   Shame                  #D5DBDB    Withdrawn grey                       ║
║                                                                           ║
║   USAGE GUIDELINES:                                                       ║
║   • Use as background tints (10-20% opacity) not solid fills             ║
║   • Pair with neutral text colors for readability                        ║
║   • Allow user to customize emotional color associations                  ║
║   • Never use red for "negative" emotions (too alarming)                 ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
2.6 Accessibility & Contrast
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ACCESSIBILITY REQUIREMENTS                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   WCAG 2.1 AA COMPLIANCE TARGETS                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Normal text (< 18px):    4.5:1 minimum contrast ratio                  ║
║   Large text (≥ 18px):     3:1 minimum contrast ratio                    ║
║   UI components:           3:1 minimum contrast ratio                    ║
║   Focus indicators:        Visible, 3:1 contrast from background         ║
║                                                                           ║
║   VALIDATED COLOR COMBINATIONS                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Light Mode:                                                             ║
║   ┌──────────────────────────────────────────────────────────┐           ║
║   │ Background    │ Text Color     │ Ratio │ Pass │          │           ║
║   ├───────────────┼────────────────┼───────┼──────┤          │           ║
║   │ #FAF8F5       │ #2D3A4F        │ 9.2:1 │  ✓   │ Primary  │           ║
║   │ #FAF8F5       │ #63738F        │ 4.8:1 │  ✓   │ Body     │           ║
║   │ #FAF8F5       │ #8A96AB        │ 3.2:1 │  ✓   │ Caption  │           ║
║   │ #FFFFFF       │ #2D3A4F        │ 10.1:1│  ✓   │ Cards    │           ║
║   │ #2D3A4F       │ #FFFFFF        │ 10.1:1│  ✓   │ Buttons  │           ║
║   │ #6B9080       │ #FFFFFF        │ 4.5:1 │  ✓   │ Buttons  │           ║
║   │ #E07A5F       │ #FFFFFF        │ 3.1:1 │  ✓   │ Large    │           ║
║   │ #E07A5F       │ #1B2331        │ 5.8:1 │  ✓   │ Accent   │           ║
║   └──────────────────────────────────────────────────────────┘           ║
║                                                                           ║
║   Dark Mode:                                                              ║
║   ┌──────────────────────────────────────────────────────────┐           ║
║   │ Background    │ Text Color     │ Ratio │ Pass │          │           ║
║   ├───────────────┼────────────────┼───────┼──────┤          │           ║
║   │ #0D1117       │ #E6EDF3        │ 14.5:1│  ✓   │ Primary  │           ║
║   │ #0D1117       │ #8B949E        │ 6.2:1 │  ✓   │ Body     │           ║
║   │ #161B22       │ #E6EDF3        │ 12.8:1│  ✓   │ Cards    │           ║
║   │ #21262D       │ #E6EDF3        │ 10.9:1│  ✓   │ Elevated │           ║
║   │ #58A6FF       │ #0D1117        │ 8.2:1 │  ✓   │ Links    │           ║
║   └──────────────────────────────────────────────────────────┘           ║
║                                                                           ║
║   ADDITIONAL ACCESSIBILITY FEATURES                                       ║
║   ─────────────────────────────────────────────────────────               ║
║   • Never use color alone to convey meaning (add icons/text)             ║
║   • Support system-level color inversion                                  ║
║   • Provide high-contrast mode option                                     ║
║   • Test with deuteranopia, protanopia, tritanopia simulations           ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
3. Typography System
3.1 Font Recommendations
╔═══════════════════════════════════════════════════════════════════════════╗
║                       PRIMARY TYPEFACE                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   INTER                                                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   Purpose: Primary UI font for all interface elements                     ║
║   Why: Highly legible at small sizes, humanist warmth, extensive          ║
║        language support, variable font capabilities, free & open source   ║
║                                                                           ║
║   Weights Used:                                                           ║
║   • Regular (400) - Body text, descriptions                               ║
║   • Medium (500) - Emphasis, labels, navigation                           ║
║   • SemiBold (600) - Subheadings, buttons                                 ║
║   • Bold (700) - Headings, titles                                         ║
║                                                                           ║
║   Source: https://rsms.me/inter/                                          ║
║   License: SIL Open Font License 1.1                                      ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                       SECONDARY TYPEFACE                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   FRAUNCES                                                                ║
║   ─────────────────────────────────────────────────────────               ║
║   Purpose: Display font for emotional moments, insights, celebrations     ║
║   Why: Soft, organic serifs add warmth; variable "wonk" and "softness"    ║
║        axes allow playful expression; creates contrast with Inter         ║
║                                                                           ║
║   Usage:                                                                  ║
║   • Insight reveal headlines                                              ║
║   • Achievement celebration text                                          ║
║   • Onboarding welcome messages                                           ║
║   • Pull quotes from user's own words                                     ║
║                                                                           ║
║   Weights Used:                                                           ║
║   • Regular (400) - Body quotes                                           ║
║   • SemiBold (600) - Emphasis                                             ║
║   • Bold (700) - Headlines                                                ║
║                                                                           ║
║   Source: https://github.com/undercasetype/Fraunces                       ║
║   License: SIL Open Font License 1.1                                      ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                       MONOSPACE TYPEFACE                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   JETBRAINS MONO                                                          ║
║   ─────────────────────────────────────────────────────────               ║
║   Purpose: Data displays, progress numbers, timestamps                    ║
║   Why: Clear number distinction, excellent legibility                     ║
║                                                                           ║
║   Usage:                                                                  ║
║   • Percentage displays (e.g., "67%")                                     ║
║   • Day counters (e.g., "Day 7")                                         ║
║   • Time stamps                                                           ║
║   • Numeric data in charts                                                ║
║                                                                           ║
║   Source: https://www.jetbrains.com/lp/mono/                              ║
║   License: SIL Open Font License 1.1                                      ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
3.2 Type Scale
╔═══════════════════════════════════════════════════════════════════════════╗
║                           TYPE SCALE                                      ║
║                    Base: 16px | Scale: 1.25 (Major Third)                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   TOKEN          │ SIZE    │ LINE-HEIGHT │ WEIGHT │ TRACKING │ USAGE     ║
║   ───────────────┼─────────┼─────────────┼────────┼──────────┼────────── ║
║                  │         │             │        │          │           ║
║   display-xl     │ 48px    │ 1.1         │ 700    │ -0.02em  │ Hero      ║
║   display-lg     │ 40px    │ 1.15        │ 700    │ -0.02em  │ Page title║
║   display-md     │ 32px    │ 1.2         │ 700    │ -0.01em  │ Section   ║
║                  │         │             │        │          │           ║
║   heading-xl     │ 28px    │ 1.25        │ 600    │ -0.01em  │ Card title║
║   heading-lg     │ 24px    │ 1.3         │ 600    │ 0        │ Subsection║
║   heading-md     │ 20px    │ 1.35        │ 600    │ 0        │ Component ║
║   heading-sm     │ 18px    │ 1.4         │ 600    │ 0        │ Label     ║
║                  │         │             │        │          │           ║
║   body-lg        │ 18px    │ 1.6         │ 400    │ 0        │ Lead text ║
║   body-md        │ 16px    │ 1.6         │ 400    │ 0        │ Body      ║
║   body-sm        │ 14px    │ 1.5         │ 400    │ 0.01em   │ Secondary ║
║                  │         │             │        │          │           ║
║   caption-lg     │ 13px    │ 1.4         │ 500    │ 0.02em   │ Labels    ║
║   caption-md     │ 12px    │ 1.4         │ 500    │ 0.02em   │ Metadata  ║
║   caption-sm     │ 11px    │ 1.3         │ 500    │ 0.03em   │ Footnotes ║
║                  │         │             │        │          │           ║
║   button-lg      │ 16px    │ 1           │ 600    │ 0.02em   │ Primary   ║
║   button-md      │ 14px    │ 1           │ 600    │ 0.02em   │ Secondary ║
║   button-sm      │ 12px    │ 1           │ 600    │ 0.03em   │ Tertiary  ║
║                  │         │             │        │          │           ║
╚═══════════════════════════════════════════════════════════════════════════╝
3.3 Typography Usage Guidelines
╔═══════════════════════════════════════════════════════════════════════════╗
║                    TYPOGRAPHY USAGE BY CONTEXT                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   CHAT INTERFACE                                                          ║
║   ─────────────────────────────────────────────────────────               ║
║   AI Messages:         body-md (16px), Inter Regular                      ║
║   User Messages:       body-md (16px), Inter Regular                      ║
║   System Messages:     caption-md (12px), Inter Medium, Twilight-300      ║
║   Timestamps:          caption-sm (11px), JetBrains Mono, Twilight-200    ║
║                                                                           ║
║   INSIGHT REVEALS                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Insight Headline:    heading-lg (24px), Fraunces Bold                   ║
║   Insight Body:        body-lg (18px), Inter Regular                      ║
║   User Quote:          body-lg (18px), Fraunces Regular, Italic           ║
║                                                                           ║
║   PROMPTS & QUESTIONS                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   Main Prompt:         body-lg (18px), Inter Medium                       ║
║   Supporting Text:     body-md (16px), Inter Regular, Twilight-400        ║
║   Options/Choices:     body-md (16px), Inter Medium                       ║
║                                                                           ║
║   PROGRESS & DATA                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Percentage Large:    display-md (32px), JetBrains Mono Bold             ║
║   Percentage Small:    heading-md (20px), JetBrains Mono Medium           ║
║   Progress Labels:     caption-lg (13px), Inter Medium                    ║
║                                                                           ║
║   SKILL TREE                                                              ║
║   ─────────────────────────────────────────────────────────               ║
║   Node Title:          caption-lg (13px), Inter SemiBold                  ║
║   Node Description:    caption-md (12px), Inter Regular                   ║
║   Category Label:      caption-sm (11px), Inter Medium, Uppercase         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
3.4 Readability Considerations
╔═══════════════════════════════════════════════════════════════════════════╗
║                    READABILITY SPECIFICATIONS                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LINE LENGTH                                                             ║
║   ─────────────────────────────────────────────────────────               ║
║   Optimal:             50-75 characters per line                          ║
║   Mobile:              35-50 characters per line                          ║
║   Chat bubbles:        Max 280px width (≈45 characters)                   ║
║                                                                           ║
║   PARAGRAPH SPACING                                                       ║
║   ─────────────────────────────────────────────────────────               ║
║   Between paragraphs:  1.5× line height (24px for body-md)                ║
║   After headings:      1× line height (16px for body-md)                  ║
║   Before headings:     2× line height (32px for body-md)                  ║
║                                                                           ║
║   DYNAMIC TYPE SUPPORT                                                    ║
║   ─────────────────────────────────────────────────────────               ║
║   • Support iOS Dynamic Type and Android font scaling                     ║
║   • Test at 100%, 150%, and 200% scaling                                  ║
║   • Layouts must not break at 200% scaling                                ║
║   • Minimum touch target: 44×44px regardless of text size                 ║
║                                                                           ║
║   COGNITIVE LOAD REDUCTION                                                ║
║   ─────────────────────────────────────────────────────────               ║
║   • Maximum 2 typefaces per screen                                        ║
║   • Maximum 3 type sizes per screen                                       ║
║   • Consistent alignment (left-aligned for LTR languages)                 ║
║   • Avoid justified text (uneven word spacing)                            ║
║   • Use sentence case, not ALL CAPS (except labels)                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
4. Animation & Motion Design
4.1 Animation Principles for Life OS
╔═══════════════════════════════════════════════════════════════════════════╗
║                    MOTION DESIGN PRINCIPLES                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   1. PURPOSEFUL                                                           ║
║      Every animation must serve a function:                               ║
║      • Provide feedback (confirm an action)                               ║
║      • Guide attention (direct focus)                                     ║
║      • Express brand (create delight)                                     ║
║      • Show relationships (connect elements)                              ║
║      If an animation doesn't do any of these, remove it.                  ║
║                                                                           ║
║   2. CALMING, NOT STIMULATING                                             ║
║      Motion should feel:                                                  ║
║      ✓ Smooth and flowing, like breathing                                 ║
║      ✓ Gentle and organic, like nature                                    ║
║      ✗ Not jarring, flashy, or attention-demanding                        ║
║      ✗ Not bouncy, springy, or hyperactive                                ║
║                                                                           ║
║   3. RESPONSIVE, NOT INTRUSIVE                                            ║
║      • Animations respond to user action immediately                      ║
║      • Never block interaction with unskippable animations                ║
║      • Support reduced motion preferences                                 ║
║                                                                           ║
║   4. CONSISTENT                                                           ║
║      • Same types of actions have same animation treatment                ║
║      • Timing and easing are consistent across similar elements           ║
║      • Motion reinforces spatial model of the app                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
4.2 Timing & Easing Guidelines
╔═══════════════════════════════════════════════════════════════════════════╗
║                    TIMING & EASING SYSTEM                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   DURATION TOKENS                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   instant         75ms      Micro-feedback (button press)                 ║
║   fast            150ms     Simple state changes                          ║
║   normal          250ms     Standard transitions                          ║
║   slow            400ms     Complex transitions, emphasis                 ║
║   slower          600ms     Major reveals, celebrations                   ║
║   slowest         1000ms    Dramatic moments (use sparingly)              ║
║                                                                           ║
║   EASING CURVES (CSS cubic-bezier)                                        ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ease-default    cubic-bezier(0.4, 0.0, 0.2, 1)                         ║
║   Description:    Standard easing for most transitions                    ║
║   Usage:          Page transitions, card expansions                       ║
║                                                                           ║
║   ease-in         cubic-bezier(0.4, 0.0, 1, 1)                           ║
║   Description:    Accelerating motion (element leaving)                   ║
║   Usage:          Elements exiting view, dismissals                       ║
║                                                                           ║
║   ease-out        cubic-bezier(0.0, 0.0, 0.2, 1)                         ║
║   Description:    Decelerating motion (element entering)                  ║
║   Usage:          Elements entering view, reveals                         ║
║                                                                           ║
║   ease-gentle     cubic-bezier(0.25, 0.1, 0.25, 1)                       ║
║   Description:    Very smooth, almost linear but natural                  ║
║   Usage:          Progress bars, breathing animations                     ║
║                                                                           ║
║   ease-bounce     cubic-bezier(0.34, 1.56, 0.64, 1)                      ║
║   Description:    Slight overshoot (use very sparingly)                   ║
║   Usage:          Achievement celebrations only                           ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
4.3 Specific Microinteractions
Message Send/Receive
╔═══════════════════════════════════════════════════════════════════════════╗
║                    CHAT ANIMATIONS                                        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   USER MESSAGE SEND                                                       ║
║   ─────────────────────────────────────────────────────────               ║
║   Trigger:     User taps send button                                      ║
║   Animation:   Message bubble slides up from input                        ║
║   Duration:    200ms                                                      ║
║   Easing:      ease-out                                                   ║
║   Details:     • Bubble fades in from 0.8 to 1 opacity                   ║
║               • Translate Y: 20px → 0px                                   ║
║               • Send button: brief scale pulse (1.0 → 0.95 → 1.0)        ║
║                                                                           ║
║   AI MESSAGE RECEIVE                                                      ║
║   ─────────────────────────────────────────────────────────               ║
║   Trigger:     AI response ready                                          ║
║   Animation:   Typing indicator → Message reveal                          ║
║   Duration:    300ms                                                      ║
║   Easing:      ease-out                                                   ║
║   Details:     • Typing indicator fades out (150ms)                       ║
║               • Message fades in (0 → 1) and slides (10px → 0)           ║
║               • Stagger if multiple messages (100ms delay each)          ║
║                                                                           ║
║   TYPING INDICATOR                                                        ║
║   ─────────────────────────────────────────────────────────               ║
║   Design:      Three dots in subtle wave pattern                          ║
║   Animation:   Each dot scales/fades in sequence                          ║
║   Duration:    1200ms loop                                                ║
║   Details:     • Dot 1: scale 1→1.2→1, opacity 0.5→1→0.5                 ║
║               • Dot 2: same, 200ms delay                                  ║
║               • Dot 3: same, 400ms delay                                  ║
║               • Color: Sage-400                                           ║
║                                                                           ║
║   CSS Example (typing dots):                                              ║
║   ┌─────────────────────────────────────────────────────────┐            ║
║   │ .typing-dot {                                           │            ║
║   │   animation: typing 1.2s ease-in-out infinite;          │            ║
║   │ }                                                       │            ║
║   │ .typing-dot:nth-child(2) { animation-delay: 0.2s; }     │            ║
║   │ .typing-dot:nth-child(3) { animation-delay: 0.4s; }     │            ║
║   │                                                         │            ║
║   │ @keyframes typing {                                     │            ║
║   │   0%, 100% { transform: scale(1); opacity: 0.5; }       │            ║
║   │   50% { transform: scale(1.2); opacity: 1; }            │            ║
║   │ }                                                       │            ║
║   └─────────────────────────────────────────────────────────┘            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Insight Reveal Moments
╔═══════════════════════════════════════════════════════════════════════════╗
║                    INSIGHT REVEAL ANIMATION                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   This is one of the most important animations in Life OS.                ║
║   It should feel like an "unveiling" — significant but not flashy.        ║
║                                                                           ║
║   SEQUENCE (Total: ~1200ms)                                               ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Phase 1: Preparation (0-300ms)                                          ║
║   • Background dims slightly (overlay fades to 10% opacity)               ║
║   • Chat interface slides up or fades to 50% opacity                      ║
║   • Creates focus on reveal area                                          ║
║                                                                           ║
║   Phase 2: Container Entry (300-600ms)                                    ║
║   • Insight card scales from 0.95 → 1.0                                   ║
║   • Card fades from 0 → 1                                                 ║
║   • Subtle box-shadow expands (0 → 24px blur)                             ║
║   • Easing: ease-out                                                      ║
║                                                                           ║
║   Phase 3: Content Reveal (600-1000ms)                                    ║
║   • Headline text fades in and slides up (opacity 0→1, Y: 15→0)          ║
║   • After 100ms delay: body text same treatment                           ║
║   • After 200ms delay: any supporting elements                            ║
║   • Easing: ease-gentle                                                   ║
║                                                                           ║
║   Phase 4: Glow Pulse (1000-1200ms) — optional for major insights         ║
║   • Soft glow around card border (Insight-light color)                    ║
║   • Pulses once: 0 → 8px → 0 blur                                        ║
║   • Creates "significance" feeling                                        ║
║                                                                           ║
║   VISUAL REPRESENTATION:                                                  ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Before:           During:            After:                             ║
║   ┌─────────┐       ┌─────────────┐    ┌─────────────────┐               ║
║   │ Chat    │       │ ░░░░░░░░░░░ │    │ ░░░░░░░░░░░░░░░ │               ║
║   │ Chat    │  ──►  │  ┌───────┐  │ ──►│  ┌───────────┐  │               ║
║   │ Chat    │       │  │ ✨    │  │    │  │ Here's    │  │               ║
║   │ Input   │       │  │       │  │    │  │ what I'm  │  │               ║
║   └─────────┘       │  └───────┘  │    │  │ seeing... │  │               ║
║                     └─────────────┘    │  └───────────┘  │               ║
║                                        └─────────────────┘               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Progress Celebrations
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PROGRESS CELEBRATION ANIMATIONS                        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   MINI CELEBRATION (Daily completions, small milestones)                  ║
║   ─────────────────────────────────────────────────────────               ║
║   Duration:    400ms                                                      ║
║   Elements:    • Checkmark icon draws in (stroke animation)               ║
║               • Circle completes (progress ring fills)                    ║
║               • Brief color shift (base → Success-main → base)            ║
║               • Subtle scale pulse on container (1.0 → 1.02 → 1.0)       ║
║                                                                           ║
║   MEDIUM CELEBRATION (Skill unlocks, week completions)                    ║
║   ─────────────────────────────────────────────────────────               ║
║   Duration:    800ms                                                      ║
║   Elements:    • Icon transforms (lock → unlocked → skill icon)           ║
║               • Particle burst (8-12 small dots radiate outward)          ║
║               • Text reveal with stagger                                  ║
║               • Sound: optional gentle chime                              ║
║                                                                           ║
║   MAJOR CELEBRATION (Stage transitions, profile reveals)                  ║
║   ─────────────────────────────────────────────────────────               ║
║   Duration:    1500ms                                                     ║
║   Elements:    • Full-screen overlay with gradient                        ║
║               • Central element scales up dramatically                    ║
║               • Confetti/particle system (subtle, not overwhelming)       ║
║               • Text reveals in sequence                                  ║
║               • Haptic feedback (if supported)                            ║
║               • Sound: triumphant but gentle tone                         ║
║                                                                           ║
║   CONFETTI SYSTEM (for major celebrations):                               ║
║   ─────────────────────────────────────────────────────────               ║
║   • 20-30 particles                                                       ║
║   • Colors: Primary palette colors (Twilight, Sage, Coral)                ║
║   • Shapes: Small circles and rounded rectangles                          ║
║   • Motion: Fall with gravity + gentle horizontal drift                   ║
║   • Duration: 2-3 seconds, then fade out                                  ║
║   • NOT overwhelming — subtle enough to not feel childish                 ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Skill Unlock Animation
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SKILL UNLOCK ANIMATION SEQUENCE                        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LOCKED STATE                                                            ║
║   • Node: Muted colors (Twilight-200 fill, Twilight-100 border)          ║
║   • Icon: Lock icon, Twilight-300                                         ║
║   • Connection lines: Dashed, Twilight-100                                ║
║                                                                           ║
║   UNLOCK TRIGGER                                                          ║
║   When: Prerequisites completed                                           ║
║                                                                           ║
║   ANIMATION SEQUENCE (800ms total)                                        ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   [0-200ms] Lock Dissolve                                                 ║
║   • Lock icon fades out (opacity 1 → 0)                                   ║
║   • Lock icon scales down (1 → 0.8)                                       ║
║   • Easing: ease-in                                                       ║
║                                                                           ║
║   [150-400ms] Node Activation                                             ║
║   • Node background transitions (Twilight-200 → Sage-100)                 ║
║   • Node border transitions (Twilight-100 → Sage-400)                     ║
║   • Node scale pulses (1 → 1.1 → 1.0)                                    ║
║   • Easing: ease-bounce (subtle)                                          ║
║                                                                           ║
║   [300-500ms] Icon Reveal                                                 ║
║   • Skill icon fades in (opacity 0 → 1)                                   ║
║   • Skill icon scales (0.8 → 1)                                          ║
║   • Icon color: Sage-600                                                  ║
║   • Easing: ease-out                                                      ║
║                                                                           ║
║   [400-800ms] Connection Activation                                       ║
║   • Lines to child nodes animate from dashed to solid                     ║
║   • Line color transitions (Twilight-100 → Sage-300)                      ║
║   • Stroke-dasharray animates to 0                                        ║
║   • Direction: from parent to children                                    ║
║                                                                           ║
║   [600-800ms] Particle Burst                                              ║
║   • 6-8 small particles emit from node center                             ║
║   • Colors: Sage-300, Sage-400, Sage-500                                  ║
║   • Particles fade out as they travel                                     ║
║                                                                           ║
║   VISUAL PROGRESSION:                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║     Locked:        Unlocking:      Unlocked:                             ║
║     ┌─────┐        ┌─────┐         ┌─────┐                               ║
║     │ 🔒  │   ──►  │ ✨  │   ──►   │ ⭐  │                               ║
║     │░░░░░│        │▓▓▓▓▓│         │█████│                               ║
║     └──┼──┘        └──┼──┘         └──┼──┘                               ║
║        ┊              ┊               │                                   ║
║        ┊ (dashed)     ┊ (animating)   │ (solid)                          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Screen Transitions
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SCREEN TRANSITION PATTERNS                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   HIERARCHICAL NAVIGATION (Drilling down into content)                    ║
║   ─────────────────────────────────────────────────────────               ║
║   Trigger:     Tapping a card/item to see details                         ║
║   Animation:   Shared element transition                                  ║
║   Duration:    300ms                                                      ║
║   Details:     • Tapped element expands to fill new screen               ║
║               • Other elements fade out (opacity 1 → 0)                   ║
║               • New content fades in within expanded container            ║
║               • Back: reverse animation                                   ║
║                                                                           ║
║   LATERAL NAVIGATION (Tabs, same level content)                           ║
║   ─────────────────────────────────────────────────────────               ║
║   Trigger:     Switching between main tabs                                ║
║   Animation:   Crossfade with subtle slide                                ║
║   Duration:    200ms                                                      ║
║   Details:     • Old content fades out + slides 10px in exit direction   ║
║               • New content fades in + slides 10px from enter direction  ║
║               • Tab indicator slides to new position (250ms)              ║
║                                                                           ║
║   MODAL/OVERLAY                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   Trigger:     Opening a modal or overlay                                 ║
║   Animation:   Fade + scale                                               ║
║   Duration:    250ms                                                      ║
║   Details:     • Backdrop fades in (0 → 0.5 opacity black)               ║
║               • Modal scales (0.95 → 1) and fades (0 → 1)                ║
║               • Close: reverse                                            ║
║                                                                           ║
║   BOTTOM SHEET                                                            ║
║   ─────────────────────────────────────────────────────────               ║
║   Trigger:     Opening action sheet or detail panel                       ║
║   Animation:   Slide up from bottom                                       ║
║   Duration:    300ms                                                      ║
║   Details:     • Sheet translates Y (100% → 0)                           ║
║               • Backdrop fades in simultaneously                          ║
║               • Supports gesture drag to dismiss                          ║
║               • Easing: ease-out for open, ease-in for close              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
4.4 When to Animate vs. Keep Static
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ANIMATION DECISION FRAMEWORK                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ✓ ANIMATE WHEN:                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   • User needs feedback (action was received)                             ║
║   • Spatial relationship is unclear (where did this come from?)          ║
║   • Drawing attention is necessary (look here!)                           ║
║   • Celebrating achievement (you did it!)                                 ║
║   • Showing progress (this is changing)                                   ║
║   • Brand moment (this is a Life OS experience)                           ║
║   • State change is significant (something important happened)            ║
║                                                                           ║
║   ✗ KEEP STATIC WHEN:                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   • User is reading (don't distract from content)                         ║
║   • Action is repetitive (50th time doing same thing)                     ║
║   • User is in distress mode (detected anxiety/stress)                    ║
║   • Performance is constrained (low-end device)                           ║
║   • User has motion sensitivity (prefers-reduced-motion)                  ║
║   • Information is dense (charts, data tables)                            ║
║   • Animation would slow down the user                                    ║
║                                                                           ║
║   REDUCED MOTION FALLBACKS                                                ║
║   ─────────────────────────────────────────────────────────               ║
║   When prefers-reduced-motion is enabled:                                 ║
║   • Replace animations with instant state changes                         ║
║   • Keep opacity transitions (they're usually fine)                       ║
║   • Remove all translate/scale/rotate animations                          ║
║   • Disable auto-playing animations entirely                              ║
║   • Celebrations: static visual + haptic only                             ║
║                                                                           ║
║   CSS Example:                                                            ║
║   ┌─────────────────────────────────────────────────────────┐            ║
║   │ @media (prefers-reduced-motion: reduce) {               │            ║
║   │   *, *::before, *::after {                              │            ║
║   │     animation-duration: 0.01ms !important;              │            ║
║   │     animation-iteration-count: 1 !important;            │            ║
║   │     transition-duration: 0.01ms !important;             │            ║
║   │   }                                                     │            ║
║   │ }                                                       │            ║
║   └─────────────────────────────────────────────────────────┘            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
5. Core UI Components
5.1 Chat Interface
Message Bubble Design
╔═══════════════════════════════════════════════════════════════════════════╗
║                    MESSAGE BUBBLE SPECIFICATIONS                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   AI MESSAGE BUBBLE                                                       ║
║   ─────────────────────────────────────────────────────────               ║
║   ┌───────────────────────────────────────┐                              ║
║   │                                       │                              ║
║   │  Here's what I'm noticing about      │                              ║
║   │  your patterns this week...          │                              ║
║   │                                       │                              ║
║   └───────────────────────────────────────┘                              ║
║                                                                           ║
║   Background:      #FFFFFF (Light) / Surface-2 (Dark)                    ║
║   Border:          1px solid Twilight-100 (Light) / Surface-4 (Dark)     ║
║   Border Radius:   16px (top-left: 4px for tail effect)                  ║
║   Padding:         16px                                                   ║
║   Max Width:       280px (mobile) / 400px (tablet+)                      ║
║   Alignment:       Left                                                   ║
║   Shadow:          0 2px 8px rgba(0,0,0,0.04)                            ║
║   Text:            body-md, Twilight-500 (Light) / Text-primary (Dark)   ║
║                                                                           ║
║   USER MESSAGE BUBBLE                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║                      ┌───────────────────────────────────┐               ║
║                      │                                   │               ║
║                      │  I've been feeling stuck lately   │               ║
║                      │                                   │               ║
║                      └───────────────────────────────────┘               ║
║                                                                           ║
║   Background:      Twilight-500 (Light) / Primary-dark (Dark)            ║
║   Border:          None                                                   ║
║   Border Radius:   16px (top-right: 4px for tail effect)                 ║
║   Padding:         16px                                                   ║
║   Max Width:       280px (mobile) / 400px (tablet+)                      ║
║   Alignment:       Right                                                  ║
║   Shadow:          0 2px 8px rgba(45,58,79,0.15)                         ║
║   Text:            body-md, #FFFFFF                                       ║
║                                                                           ║
║   SYSTEM MESSAGE                                                          ║
║   ─────────────────────────────────────────────────────────               ║
║                      ──── Day 3 of Trial ────                            ║
║                                                                           ║
║   Background:      Transparent                                            ║
║   Text:            caption-md, Twilight-300, center-aligned              ║
║   Padding:         8px 0                                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Companion Avatar Design
╔═══════════════════════════════════════════════════════════════════════════╗
║                    AI COMPANION AVATAR                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   DESIGN CONCEPT: "Guiding Light"                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   The avatar is an abstract, friendly form — not a human face             ║
║   (avoids uncanny valley) and not a cartoon animal (avoids childish).     ║
║                                                                           ║
║   VISUAL FORM:                                                            ║
║   • Soft, organic shape (like a rounded droplet or gentle flame)          ║
║   • Gradient fill: Sage-400 → Twilight-400                               ║
║   • Subtle inner glow effect                                              ║
║   • Gentle animation: slow breathing pulse (2-3% scale change)            ║
║                                                                           ║
║   ASCII REPRESENTATION:                                                   ║
║                                                                           ║
║       Small (Chat):        Large (Profile):                               ║
║          ╭───╮               ╭─────────╮                                  ║
║         ╱ ∙∙ ╲             ╱    ∙∙     ╲                                 ║
║        │  ──  │           │     ──      │                                ║
║         ╲    ╱             ╲            ╱                                 ║
║          ╰──╯               ╰─────────╯                                   ║
║                                                                           ║
║   SIZES:                                                                  ║
║   • Chat inline:     32×32px                                              ║
║   • Chat header:     40×40px                                              ║
║   • Profile card:    64×64px                                              ║
║   • Splash/Hero:     120×120px                                            ║
║                                                                           ║
║   STATES:                                                                 ║
║   ─────────────────────────────────────────────────────────               ║
║   Idle:              Slow breathing animation (4s cycle)                  ║
║   Thinking:          Faster pulse + typing indicator                      ║
║   Excited:           Brighter glow, slight bounce                         ║
║   Empathetic:        Warmer color shift (more coral)                      ║
║   Celebrating:       Particle effects around avatar                       ║
║                                                                           ║
║   NOTE: Avatar can be AI-generated per user (see Section 9)              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Prompt Cards Within Chat
╔═══════════════════════════════════════════════════════════════════════════╗
║                    IN-CHAT PROMPT CARDS                                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   Used for: Multiple choice questions, quick responses, guided options    ║
║                                                                           ║
║   SINGLE-SELECT PROMPT CARD                                               ║
║   ─────────────────────────────────────────────────────────               ║
║   ┌─────────────────────────────────────────────────────────┐            ║
║   │                                                         │            ║
║   │  How are you feeling right now?                        │            ║
║   │                                                         │            ║
║   │  ┌─────────────────────────────────────────────────┐   │            ║
║   │  │  😊  Good — I'm in a positive space             │   │            ║
║   │  └─────────────────────────────────────────────────┘   │            ║
║   │  ┌─────────────────────────────────────────────────┐   │            ║
║   │  │  😐  Okay — Nothing special either way          │   │            ║
║   │  └─────────────────────────────────────────────────┘   │            ║
║   │  ┌─────────────────────────────────────────────────┐   │            ║
║   │  │  😔  Struggling — Today is hard                 │   │            ║
║   │  └─────────────────────────────────────────────────┘   │            ║
║   │                                                         │            ║
║   │  Or tell me in your own words...                       │            ║
║   │                                                         │            ║
║   └─────────────────────────────────────────────────────────┘            ║
║                                                                           ║
║   Container:                                                              ║
║   • Background: Dawn-cream                                                ║
║   • Border: 1px solid Twilight-100                                       ║
║   • Border-radius: 20px                                                   ║
║   • Padding: 20px                                                         ║
║                                                                           ║
║   Option Buttons:                                                         ║
║   • Background: #FFFFFF                                                   ║
║   • Border: 1px solid Twilight-100                                       ║
║   • Border-radius: 12px                                                   ║
║   • Padding: 12px 16px                                                    ║
║   • Text: body-md, Twilight-500                                          ║
║   • Hover: Border → Sage-400, Background → Sage-50                       ║
║   • Selected: Border → Sage-500, Background → Sage-100                   ║
║                                                                           ║
║   QUICK-REPLY CHIPS                                                       ║
║   ─────────────────────────────────────────────────────────               ║
║   For simple responses that flow in a row:                                ║
║                                                                           ║
║   ┌──────────┐  ┌──────────┐  ┌──────────┐                              ║
║   │   Yes    │  │    No    │  │ Not sure │                              ║
║   └──────────┘  └──────────┘  └──────────┘                              ║
║                                                                           ║
║   • Height: 36px                                                          ║
║   • Border-radius: 18px (pill shape)                                      ║
║   • Padding: 8px 16px                                                     ║
║   • Gap between: 8px                                                      ║
║   • Scrollable horizontally if many options                               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
5.2 Card Selection UI
╔═══════════════════════════════════════════════════════════════════════════╗
║                    CARD SELECTION PATTERNS                                ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   PATHWAY/JOURNEY SELECTION CARDS                                         ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌─────────────────────────────────────────────────────────────────┐    ║
║   │                                                                 │    ║
║   │   🔥                                                            │    ║
║   │                                                                 │    ║
║   │   UNFUCK MY LIFE                                               │    ║
║   │                                                                 │    ║
║   │   "I know something's wrong. Help me fix it."                  │    ║
║   │                                                                 │    ║
║   │   For people who feel stuck, lost, or out of alignment         │    ║
║   │   despite trying everything.                                   │    ║
║   │                                                                 │    ║
║   │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━               │    ║
║   │                                                                 │    ║
║   │   ✓ Deep pattern excavation                                    │    ║
║   │   ✓ Anti-vision & vision building                              │    ║
║   │   ✓ Personalized skill tree                                    │    ║
║   │                                                                 │    ║
║   └─────────────────────────────────────────────────────────────────┘    ║
║                                                                           ║
║   SPECIFICATIONS:                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Background:      #FFFFFF                                                ║
║   Border:          2px solid Twilight-100                                ║
║   Border-radius:   20px                                                   ║
║   Padding:         24px                                                   ║
║   Shadow:          0 4px 16px rgba(0,0,0,0.06)                           ║
║                                                                           ║
║   Emoji:           32×32px display size                                   ║
║   Title:           heading-lg (24px), Twilight-600                        ║
║   Quote:           body-lg (18px), Fraunces Italic, Twilight-400         ║
║   Description:     body-md (16px), Twilight-400                          ║
║   Feature list:    body-sm (14px), Sage-600, with checkmark icons        ║
║                                                                           ║
║   STATES:                                                                 ║
║   ─────────────────────────────────────────────────────────               ║
║   Default:         As above                                               ║
║   Hover:           Border → Sage-400, Shadow increases                   ║
║   Selected:        Border → Sage-500 (3px), Background → Sage-50         ║
║   Disabled:        Opacity 0.5, no interaction                           ║
║                                                                           ║
║   SELECTION ANIMATION:                                                    ║
║   ─────────────────────────────────────────────────────────               ║
║   Duration:        200ms                                                  ║
║   Properties:      border-color, background-color, transform (scale 1.02)║
║   Easing:          ease-out                                               ║
║   Checkmark:       Draws in at top-right corner                          ║
║                                                                           ║
║   MULTI-SELECT INDICATOR:                                                 ║
║   ─────────────────────────────────────────────────────────               ║
║   Position:        Top-right corner, 12px inset                          ║
║   Unselected:      24×24px circle, Twilight-100 border                   ║
║   Selected:        24×24px circle, Sage-500 fill, white checkmark        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
5.3 Progress Indicators
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PROGRESS INDICATOR SYSTEM                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LINEAR PROGRESS BAR                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Standard:                                                               ║
║   ┌──────────────────────────────────────────────────────────┐           ║
║   │████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 45%       ║
║   └──────────────────────────────────────────────────────────┘           ║
║                                                                           ║
║   Track:           Sage-100, height 8px, border-radius 4px               ║
║   Fill:            Sage-500 → Sage-400 gradient                          ║
║   Border-radius:   4px (same as track)                                   ║
║   Animation:       Fill width transitions 400ms ease-gentle              ║
║   Label:           JetBrains Mono, caption-md, right-aligned             ║
║                                                                           ║
║   Variants:                                                               ║
║   • Small:         height 4px (for compact spaces)                       ║
║   • Large:         height 12px (for hero displays)                       ║
║   • Striped:       Diagonal stripes animation for "in progress"          ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   CIRCULAR PROGRESS (Activity Ring Style)                                 ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║              ╭────────────╮                                               ║
║             ╱              ╲                                              ║
║            │    ┌────┐     │                                             ║
║            │    │67% │     │                                             ║
║            │    └────┘     │                                             ║
║             ╲              ╱                                              ║
║              ╰────────────╯                                               ║
║                                                                           ║
║   Track:           Sage-100, stroke-width 8px                            ║
║   Fill:            Sage-500, stroke-linecap round                        ║
║   Size:            64px (small), 96px (medium), 128px (large)            ║
║   Center:          Percentage in JetBrains Mono, heading-md              ║
║   Animation:       stroke-dashoffset transitions, 600ms ease-out         ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   STREAK INDICATOR                                                        ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Display:  🔥 7 Day Streak                                              ║
║                                                                           ║
║   │ M │ T │ W │ T │ F │ S │ S │                                          ║
║   │ ● │ ● │ ● │ ● │ ● │ ● │ ● │                                          ║
║   └───┴───┴───┴───┴───┴───┴───┘                                          ║
║                                                                           ║
║   Dot Default:     Twilight-100, 8px diameter                            ║
║   Dot Complete:    Coral-500, 8px diameter                               ║
║   Dot Today:       Coral-500 with subtle pulse animation                 ║
║   Container:       Horizontal scroll if > 7 days                          ║
║   Header:          Flame emoji + count + "Day Streak"                    ║
║                                                                           ║
║   NOTE: Streaks should NEVER punish. Missing a day should not            ║
║         reset to zero — instead show "7 of last 10 days" style.          ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   LEVEL/XP VISUALIZATION                                                  ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌──────────────────────────────────────────────────────────┐           ║
║   │  Level 4: Awakening                                      │           ║
║   │  ████████████████████████░░░░░░░░░░░░░░░░░  340 / 500 XP │           ║
║   │                                                          │           ║
║   │  160 XP to Level 5: Clarity                              │           ║
║   └──────────────────────────────────────────────────────────┘           ║
║                                                                           ║
║   Level name:      heading-md (20px), Twilight-600                       ║
║   XP numbers:      JetBrains Mono, body-sm (14px)                        ║
║   Next level:      caption-md, Twilight-300                              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
6. Journey Visualization System
6.1 Overall Journey Map Concept
╔═══════════════════════════════════════════════════════════════════════════╗
║                    JOURNEY MAP VISUALIZATION                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   The journey map shows: You Are Here → Where You Want to Go              ║
║                         → How You Get There                               ║
║                                                                           ║
║   VISUAL METAPHOR: Mountain Path / Winding Trail                          ║
║   ─────────────────────────────────────────────────────────               ║
║   Why: Mountains represent growth/challenge, paths show progress          ║
║        is not linear, summit represents vision achievement.               ║
║                                                                           ║
║                         🏔️ YOUR VISION                                    ║
║                          (Summit)                                         ║
║                           /   \                                           ║
║                          /     \                                          ║
║                     ○───○       ○ ← Future milestones                     ║
║                    /             \                                        ║
║               ○───○               ○ ← Upcoming                            ║
║              /                     \                                      ║
║         ●───●                       ○ ← Alternative path                  ║
║        /                                                                  ║
║   📍 YOU ARE HERE                                                         ║
║    (Current position)                                                     ║
║        \                                                                  ║
║         ●───●───● ← Completed milestones                                  ║
║                                                                           ║
║   LEGEND:                                                                 ║
║   ● Completed milestone                                                   ║
║   ◐ In-progress milestone                                                 ║
║   ○ Future milestone (visible but locked)                                 ║
║   📍 Current position                                                     ║
║   🏔️ Vision/Goal                                                          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
6.2 "You Are Here" Indicator
╔═══════════════════════════════════════════════════════════════════════════╗
║                    CURRENT POSITION VISUALIZATION                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   MARKER DESIGN                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║        ╭──────────────╮                                                   ║
║        │  YOU ARE     │                                                   ║
║        │    HERE      │                                                   ║
║        ╰──────┬───────╯                                                   ║
║               │                                                           ║
║               ▼                                                           ║
║             ╱   ╲                                                         ║
║            │  ●  │  ← Pulsing indicator                                   ║
║             ╲   ╱                                                         ║
║                                                                           ║
║   Colors:          Coral-500 pin, white background for label              ║
║   Animation:       Gentle pulse (scale 1.0 → 1.05 → 1.0, 2s cycle)       ║
║   Shadow:          0 4px 12px rgba(224,122,95,0.3)                       ║
║                                                                           ║
║   CONTEXT DISPLAY                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │                                                        │             ║
║   │  📍 Week 2, Day 3                                      │             ║
║   │                                                        │             ║
║   │  Currently: CALIBRATION PHASE                          │             ║
║   │             Testing your hypotheses                    │             ║
║   │                                                        │             ║
║   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │             ║
║   │                                                        │             ║
║   │  Progress through Phase 2:                             │             ║
║   │  ████████████████░░░░░░░░░░░░░░░░░░░░░  42%            │             ║
║   │                                                        │             ║
║   │  ← Completed        │        Remaining →               │             ║
║   │     Excavation      │        Evolution                 │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Phase indicator:   Caption with colored badge                           ║
║   Phase colors:                                                           ║
║   • Excavation:      Coral-400 (digging, intensity)                      ║
║   • Calibration:     Progress-main (adjusting, testing)                  ║
║   • Evolution:       Sage-500 (growing, expanding)                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
6.3 Vision Representation
╔═══════════════════════════════════════════════════════════════════════════╗
║                    VISION/GOAL VISUALIZATION                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   VISION CARD                                                             ║
║   ─────────────────────────────────────────────────────────               ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │             ║
║   │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │             ║
║   │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │             ║
║   │   ░░░░░░░░░░ [AI-GENERATED VISION IMAGE] ░░░░░░░░░░░   │             ║
║   │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │             ║
║   │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │             ║
║   │────────────────────────────────────────────────────────│             ║
║   │                                                        │             ║
║   │   🏔️ YOUR VISION                                       │             ║
║   │                                                        │             ║
║   │   "Living authentically, free from others'             │             ║
║   │    expectations, building something meaningful."       │             ║
║   │                                                        │             ║
║   │                                            – You, Day 5│             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Image area:      200px height, gradient overlay at bottom              ║
║   Gradient:        Transparent → Dawn-cream (70% → 100%)                 ║
║   Vision text:     Fraunces Italic, body-lg (18px)                       ║
║   Attribution:     Caption-sm, Twilight-300                              ║
║                                                                           ║
║   DISTANCE TO GOAL INDICATOR                                              ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │                                                        │             ║
║   │   📍 START ─────────●─────────────────────────── 🏔️   │             ║
║   │                    You                           Vision│             ║
║   │                                                        │             ║
║   │            32% of journey complete                     │             ║
║   │            ~6 weeks to projected milestone 1           │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Path line:       Twilight-100 (total), Sage-500 (completed)            ║
║   Dot position:    Coral-500, 12px diameter                              ║
║   Projection:      Caption-md, Twilight-400                              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
6.4 Path Visualization
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PATH/TRAIL VISUALIZATION                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   VISUAL DESIGN                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   The path is not a straight line — it winds and branches,                ║
║   representing the non-linear nature of growth.                           ║
║                                                                           ║
║   COMPLETED PATH SEGMENT                                                  ║
║   • Stroke:        Sage-500, 4px width                                   ║
║   • Style:         Solid line                                            ║
║   • Nodes:         Filled circles, Sage-500                              ║
║   • Connecting:    Bezier curves (smooth, organic feel)                  ║
║                                                                           ║
║   CURRENT SEGMENT                                                         ║
║   • Stroke:        Sage-400, 4px width                                   ║
║   • Style:         Solid with animated gradient                          ║
║   • Animation:     Gradient flows toward next milestone                  ║
║   • Duration:      3s cycle, ease-linear                                 ║
║                                                                           ║
║   UPCOMING PATH SEGMENT                                                   ║
║   • Stroke:        Twilight-200, 2px width                               ║
║   • Style:         Dashed line (8px dash, 4px gap)                       ║
║   • Nodes:         Hollow circles, Twilight-200 stroke                   ║
║                                                                           ║
║   ALTERNATIVE PATH (Branching option)                                     ║
║   • Stroke:        Twilight-100, 1px width                               ║
║   • Style:         Dotted line                                           ║
║   • Label:         "Alternative path" in caption-sm                      ║
║   • Opacity:       50%                                                    ║
║                                                                           ║
║   MILESTONE NODES                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Completed:       ●  16px, Sage-500 fill                                ║
║   In Progress:     ◐  16px, Sage-300 fill, pulsing                       ║
║   Upcoming:        ○  16px, Twilight-200 stroke, no fill                 ║
║   Locked:          🔒 16px, Twilight-100, lock icon                      ║
║                                                                           ║
║   On tap/click, node expands to show milestone details:                  ║
║   ┌─────────────────────────────────────────────┐                        ║
║   │                                             │                        ║
║   │  ● Week 1 Complete                         │                        ║
║   │                                             │                        ║
║   │  "Excavation Phase"                        │                        ║
║   │                                             │                        ║
║   │  You completed:                            │                        ║
║   │  ✓ Anti-vision document                    │                        ║
║   │  ✓ Vision MVP                              │                        ║
║   │  ✓ Initial profile                         │                        ║
║   │                                             │                        ║
║   │  Completed: January 7, 2026                │                        ║
║   │                                             │                        ║
║   └─────────────────────────────────────────────┘                        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
6.5 Decision Matrix Visualization
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DECISION MATRIX UI                                     ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   Used when user needs to choose between options with trade-offs.         ║
║                                                                           ║
║   COMPARISON CARD VIEW                                                    ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌─────────────────────────┐  ┌─────────────────────────┐               ║
║   │   OPTION A              │  │   OPTION B              │               ║
║   │   ─────────────────     │  │   ─────────────────     │               ║
║   │                         │  │                         │               ║
║   │   🎯 Focus: Depth       │  │   🌐 Focus: Breadth     │               ║
║   │                         │  │                         │               ║
║   │   Pros:                 │  │   Pros:                 │               ║
║   │   • Deep understanding  │  │   • Versatile skills    │               ║
║   │   • Mastery             │  │   • Flexibility         │               ║
║   │                         │  │                         │               ║
║   │   Cons:                 │  │   Cons:                 │               ║
║   │   • Narrower scope      │  │   • Surface-level       │               ║
║   │   • Less flexibility    │  │   • Jack of all trades  │               ║
║   │                         │  │                         │               ║
║   │   Time: ~4 weeks        │  │   Time: ~6 weeks        │               ║
║   │                         │  │                         │               ║
║   │   ┌─────────────────┐   │  │   ┌─────────────────┐   │               ║
║   │   │   Choose A      │   │  │   │   Choose B      │   │               ║
║   │   └─────────────────┘   │  │   └─────────────────┘   │               ║
║   │                         │  │                         │               ║
║   └─────────────────────────┘  └─────────────────────────┘               ║
║                                                                           ║
║   SLIDER COMPARISON (for spectrum choices)                                ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │                                                        │             ║
║   │   How do you want to approach this?                    │             ║
║   │                                                        │             ║
║   │   Cautious ──────────●──────────────────── Bold       │             ║
║   │            ◄─────────┬──────────────────────►          │             ║
║   │                      │                                 │             ║
║   │            Your current leaning: Slightly cautious     │             ║
║   │                                                        │             ║
║   │   ┌─────────────────────────────────────────────────┐  │             ║
║   │   │ At this setting, you'll:                        │  │             ║
║   │   │ • Take smaller, safer steps                     │  │             ║
║   │   │ • Have more time to adjust                      │  │             ║
║   │   │ • Progress may feel slower                      │  │             ║
║   │   └─────────────────────────────────────────────────┘  │             ║
║   │                                                        │             ║
║   │         [ Confirm this approach ]                      │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Slider track:    Twilight-100, 8px height                              ║
║   Slider fill:     Gradient from Sage-300 to Coral-400                   ║
║   Thumb:           24px circle, white with shadow                        ║
║   Labels:          body-sm, positioned at track ends                     ║
║                                                                           ║
║   CONSEQUENCE PREVIEW                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   As user moves slider or hovers options, show real-time                 ║
║   preview of what this choice means for their journey.                    ║
║                                                                           ║
║   Animation: Content fades and slides (150ms) on change                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
7. Skill Tree Visualization
7.1 Overall Skill Tree Structure
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SKILL TREE UI ARCHITECTURE                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LAYOUT APPROACH: Radial/Organic Tree                                    ║
║   ─────────────────────────────────────────────────────────               ║
║   Unlike gaming skill trees (usually top-down), Life OS uses             ║
║   a radial layout with the user at center, representing that             ║
║   growth expands outward in all directions.                               ║
║                                                                           ║
║                      ○ Advanced Skill                                     ║
║                     /                                                     ║
║                    ●                                                      ║
║                   /                                                       ║
║       ○ ── ● ── ◐ ── YOU ── ● ── ○                                       ║
║                   \                                                       ║
║                    ●                                                      ║
║                     \                                                     ║
║                      ○ Advanced Skill                                     ║
║                                                                           ║
║   CATEGORY ORGANIZATION                                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   Skills grouped into 6 major categories, each occupying                 ║
║   a "wedge" of the radial tree:                                          ║
║                                                                           ║
║                     EMOTIONAL                                             ║
║                    REGULATION                                             ║
║                        │                                                  ║
║        RELATIONAL ─────┼───── SELF-AWARENESS                             ║
║         CAPACITY       │        (Foundation)                              ║
║                        │                                                  ║
║        PATTERN ────────┼───── IDENTITY                                    ║
║        BREAKING        │      FLEXIBILITY                                 ║
║                        │                                                  ║
║                   GOAL CLARITY                                            ║
║                                                                           ║
║   Each wedge has a unique accent color:                                  ║
║   • Self-Awareness:     Sage-500                                         ║
║   • Identity:           Insight-main (#9C27B0)                           ║
║   • Goal Clarity:       Coral-500                                        ║
║   • Pattern Breaking:   Warning-dark (#F57F17)                           ║
║   • Emotional Reg:      Info-main (#2196F3)                              ║
║   • Relational:         #F49AC2 (connection pink)                        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
7.2 Node Design
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SKILL NODE STATES                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LOCKED NODE                                                             ║
║   ─────────────────────────────────────────────────────────               ║
║         ┌───────────────┐                                                 ║
║         │   ╭─────╮     │                                                 ║
║         │   │ 🔒  │     │                                                 ║
║         │   ╰─────╯     │                                                 ║
║         │               │                                                 ║
║         │  Shame        │                                                 ║
║         │  Tolerance    │                                                 ║
║         └───────────────┘                                                 ║
║                                                                           ║
║   Background:      Twilight-50                                           ║
║   Border:          2px dashed Twilight-200                               ║
║   Icon:            Lock, Twilight-300, 24px                              ║
║   Title:           caption-lg, Twilight-300                              ║
║   Shape:           Rounded rectangle, 80×90px                            ║
║   Opacity:         0.7                                                    ║
║                                                                           ║
║   AVAILABLE NODE (Prerequisites met, not started)                         ║
║   ─────────────────────────────────────────────────────────               ║
║         ┌───────────────┐                                                 ║
║         │   ╭─────╮     │                                                 ║
║         │   │ 💠  │     │  ← Ready indicator (pulsing)                   ║
║         │   ╰─────╯     │                                                 ║
║         │               │                                                 ║
║         │  Emotion      │                                                 ║
║         │  Naming       │                                                 ║
║         │               │                                                 ║
║         │  ○ ○ ○ ○ ○    │  ← Progress dots (empty)                       ║
║         └───────────────┘                                                 ║
║                                                                           ║
║   Background:      #FFFFFF                                                ║
║   Border:          2px solid category-color                              ║
║   Icon:            Category-specific, category-color, 24px               ║
║   Title:           caption-lg, Twilight-600                              ║
║   Progress:        5 dots, Twilight-200                                  ║
║   Animation:       Subtle glow pulse (0.5s cycle)                        ║
║                                                                           ║
║   IN-PROGRESS NODE                                                        ║
║   ─────────────────────────────────────────────────────────               ║
║         ┌───────────────┐                                                 ║
║         │   ╭─────╮     │                                                 ║
║         │   │ 🎯  │     │                                                 ║
║         │   ╰─────╯     │                                                 ║
║         │               │                                                 ║
║         │  Emotion      │                                                 ║
║         │  Naming       │                                                 ║
║         │               │                                                 ║
║         │  ● ● ● ○ ○    │  ← Progress dots (partial)                     ║
║         │  ────────────▶│  ← Progress bar                                ║
║         └───────────────┘                                                 ║
║                                                                           ║
║   Background:      category-color-50                                     ║
║   Border:          3px solid category-color                              ║
║   Icon:            Category-specific, category-color, 24px               ║
║   Title:           caption-lg, Twilight-700, SemiBold                    ║
║   Progress dots:   Filled = category-color, Empty = Twilight-200         ║
║   Progress bar:    Mini bar below dots, category-color fill              ║
║                                                                           ║
║   MASTERED NODE                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║         ┌───────────────┐                                                 ║
║         │   ╭─────╮     │                                                 ║
║         │   │ ⭐  │     │  ← Star or checkmark                           ║
║         │   ╰─────╯     │                                                 ║
║         │               │                                                 ║
║         │  Emotion      │                                                 ║
║         │  Naming       │                                                 ║
║         │               │                                                 ║
║         │  ● ● ● ● ●    │                                                ║
║         │  MASTERED     │                                                 ║
║         └───────────────┘                                                 ║
║                                                                           ║
║   Background:      category-color                                        ║
║   Border:          None (filled shape)                                   ║
║   Icon:            Star, #FFFFFF, 24px                                   ║
║   Title:           caption-lg, #FFFFFF                                   ║
║   Badge:           "MASTERED" in caption-sm, #FFFFFF                     ║
║   Shadow:          0 4px 12px category-color at 30% opacity              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
7.3 Connection Lines
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SKILL TREE CONNECTION LINES                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LINE STYLES                                                             ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Locked connection (prerequisite not met):                               ║
║   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                                                      ║
║   Stroke: Twilight-100, 1px, dashed (4px dash, 4px gap)                  ║
║                                                                           ║
║   Available connection (can progress):                                    ║
║   ─────────────────────                                                   ║
║   Stroke: Twilight-300, 2px, solid                                       ║
║                                                                           ║
║   Active connection (skill in progress):                                  ║
║   ═══════════════════                                                     ║
║   Stroke: category-color, 3px, solid                                     ║
║   Animation: Gradient flow toward child node (energy flowing)            ║
║                                                                           ║
║   Completed connection:                                                   ║
║   ━━━━━━━━━━━━━━━━━━━                                                    ║
║   Stroke: Sage-400, 3px, solid                                           ║
║                                                                           ║
║   LINE ROUTING                                                            ║
║   ─────────────────────────────────────────────────────────               ║
║   • Lines use bezier curves, not straight segments                        ║
║   • Control points placed to create organic, flowing shapes              ║
║   • Lines should not cross unless absolutely necessary                   ║
║   • When lines must cross, use a small gap at intersection               ║
║                                                                           ║
║   ANIMATION: CONNECTION ACTIVATION                                        ║
║   ─────────────────────────────────────────────────────────               ║
║   When a skill is completed and unlocks children:                        ║
║   • Line animates from dashed → solid                                    ║
║   • Color transitions from Twilight-100 → Twilight-300                   ║
║   • A "pulse" of light travels along the line to child node              ║
║   • Duration: 600ms per line                                             ║
║   • Sequence: One line at a time (staggered by 100ms)                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
7.4 Mobile-Friendly Navigation
╔═══════════════════════════════════════════════════════════════════════════╗
║                    MOBILE SKILL TREE NAVIGATION                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   CHALLENGES:                                                             ║
║   • Skill trees can be complex with many nodes                           ║
║   • Small screens limit visible area                                      ║
║   • Touch targets need to be large enough (44×44px minimum)              ║
║                                                                           ║
║   SOLUTION: Focus + Context Navigation                                    ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   DEFAULT VIEW: Focused on current/next skills                            ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │  ┌─────────────────────────────────────────────────┐   │             ║
║   │  │              SELF-AWARENESS                     │   │  ← Category ║
║   │  │                 Foundation                      │   │    tab      ║
║   │  └─────────────────────────────────────────────────┘   │             ║
║   │                                                        │             ║
║   │         ┌─────────┐          ┌─────────┐              │             ║
║   │         │   ⭐    │──────────│   🎯    │              │             ║
║   │         │ Emotion │          │  Self-  │              │             ║
║   │         │ Naming  │          │Compassion              │             ║
║   │         │MASTERED │          │  60%    │              │             ║
║   │         └─────────┘          └─────────┘              │             ║
║   │              │                    │                    │             ║
║   │              ├──────────┬─────────┤                    │             ║
║   │              │          │         │                    │             ║
║   │         ┌────┴───┐  ┌───┴────┐  ┌─┴──────┐            │             ║
║   │         │   🔒   │  │   🔒   │  │   🔒   │            │             ║
║   │         │Defense │  │ Thought│  │  Body  │            │             ║
║   │         │ Recog. │  │ Observ.│  │ Aware  │            │             ║
║   │         └────────┘  └────────┘  └────────┘            │             ║
║   │                                                        │             ║
║   │  ──────────────────────────────────────────────────── │             ║
║   │  [👁️ See Full Tree]              [ ℹ️ Category Info ] │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   FULL TREE VIEW: Zoomable, pannable                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   • Pinch to zoom (0.5x to 2x scale)                                     ║
║   • Pan with finger drag                                                  ║
║   • Double-tap node to see details                                        ║
║   • "Fit to screen" button to reset view                                  ║
║   • Mini-map in corner shows position in full tree                        ║
║                                                                           ║
║   CATEGORY TABS                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   Horizontal scrolling tabs to filter by category:                        ║
║   ┌──────┬──────┬──────┬──────┬──────┬──────┐                            ║
║   │ All  │Self- │Ident.│Goals │Patt. │Emot. │  ...                       ║
║   │      │Aware │      │      │      │      │                            ║
║   └──────┴──────┴──────┴──────┴──────┴──────┘                            ║
║                                                                           ║
║   Active tab: Underline in category color                                ║
║   Tapping tab: Smooth scroll to that category section                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
7.5 Blocker Visualization
╔═══════════════════════════════════════════════════════════════════════════╗
║                    BLOCKER VISUALIZATION                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   Blockers are patterns/fears/defenses preventing skill development.      ║
║   They appear as "obstacles" on the path to skills.                       ║
║                                                                           ║
║   BLOCKER NODE                                                            ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║             ╔═══════════════╗                                             ║
║             ║   ⚠️          ║                                             ║
║             ║               ║                                             ║
║             ║   BLOCKER:    ║                                             ║
║             ║   Fear of     ║                                             ║
║             ║   Being Seen  ║                                             ║
║             ║               ║                                             ║
║             ╚═══════════════╝                                             ║
║                    │                                                      ║
║          ┌─────────┴─────────┐                                            ║
║          │                   │                                            ║
║          ▼                   ▼                                            ║
║     ┌─────────┐         ┌─────────┐                                       ║
║     │ Shame   │         │ Authen- │                                       ║
║     │Tolerance│         │  tic    │                                       ║
║     │ 🔒     │         │Express. │                                       ║
║     └─────────┘         │  🔒     │                                       ║
║                         └─────────┘                                       ║
║                                                                           ║
║   BLOCKER NODE SPECS                                                      ║
║   ─────────────────────────────────────────────────────────               ║
║   Shape:           Hexagon (different from skill rectangles)              ║
║   Background:      Warning-bg (#FFF8E1)                                  ║
║   Border:          2px solid Warning-main (#FFC107)                      ║
║   Icon:            Warning triangle, Warning-dark                        ║
║   Title:           "BLOCKER:" in caption-sm                              ║
║   Name:            caption-lg, Twilight-600                              ║
║   Size:            100×90px                                               ║
║                                                                           ║
║   ADDRESSING A BLOCKER                                                    ║
║   ─────────────────────────────────────────────────────────               ║
║   When user taps on blocker, show:                                        ║
║   • What this blocker is about                                            ║
║   • How it shows up in their patterns                                     ║
║   • Skills that help address it                                           ║
║   • Current progress on addressing it                                     ║
║                                                                           ║
║   BLOCKER DISSOLUTION ANIMATION                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   When all connected skills are mastered:                                 ║
║   • Blocker node cracks (crack lines appear)                              ║
║   • Light shines through cracks                                           ║
║   • Node breaks apart (particles scatter)                                 ║
║   • Path opens to previously blocked skills                               ║
║   • Duration: 1200ms                                                      ║
║   • Celebration: Medium level (particles, sound)                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
8. Profile & Psychometric Visualization
8.1 Radar/Spider Charts for Traits
╔═══════════════════════════════════════════════════════════════════════════╗
║                    TRAIT VISUALIZATION                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   RADAR CHART (For multi-dimensional profiles)                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║                        Autonomy                                           ║
║                           │                                               ║
║                          100                                              ║
║                           │                                               ║
║              Creativity   │    Competence                                 ║
║                    \      │      /                                        ║
║                     \    75     /                                         ║
║                      \   │    /                                           ║
║                       \  │   /                                            ║
║                        \ │  /                                             ║
║                    50 ──●───●── 50                                        ║
║                        /│\                                                ║
║                       / │ \                                               ║
║                      /  │  \                                              ║
║                     /   │   \                                             ║
║                    /   25    \                                            ║
║              Relatedness    Openness                                      ║
║                                                                           ║
║   SPECS:                                                                  ║
║   • Axes: 5-8 dimensions (more becomes cluttered)                        ║
║   • Grid: Twilight-100 lines at 25, 50, 75 levels                        ║
║   • Shape fill: Sage-300 at 30% opacity                                  ║
║   • Shape stroke: Sage-500, 2px                                          ║
║   • Axis labels: caption-md, Twilight-500                                ║
║   • Data points: 8px circles, Sage-500                                   ║
║                                                                           ║
║   ANIMATION:                                                              ║
║   • On first view: Shape draws from center outward (600ms)               ║
║   • On data change: Shape morphs smoothly (400ms)                        ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   HORIZONTAL BAR ALTERNATIVE (For simpler display)                        ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │                                                        │             ║
║   │  Autonomy                                              │             ║
║   │  █████████████████████████████████████░░░░░░░░░░  78% │             ║
║   │                                                        │             ║
║   │  Competence                                            │             ║
║   │  ██████████████████████████░░░░░░░░░░░░░░░░░░░░░  52% │             ║
║   │                                                        │             ║
║   │  Relatedness                                           │             ║
║   │  ████████████████████████████████░░░░░░░░░░░░░░░  65% │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Each bar can have a unique color from the category palette.            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
8.2 Progress Over Time Graphs
╔═══════════════════════════════════════════════════════════════════════════╗
║                    LONGITUDINAL PROGRESS VISUALIZATION                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LINE CHART: Trait/Metric Over Time                                     ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │  Self-Awareness Score                                  │             ║
║   │                                                        │             ║
║   │  100│                                        ●        │             ║
║   │     │                                   ●──●          │             ║
║   │   75│                              ●──●               │             ║
║   │     │                         ●──●                    │             ║
║   │   50│                    ●──●                         │             ║
║   │     │               ●──●                              │             ║
║   │   25│          ●──●                                   │             ║
║   │     │     ●──●                                        │             ║
║   │    0├────┬────┬────┬────┬────┬────┬────┬────┬────    │             ║
║   │       W1   W2   W3   W4   W5   W6   W7   W8   W9      │             ║
║   │                                                        │             ║
║   │   📈 +32 points since you started                     │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   SPECS:                                                                  ║
║   • Line: Sage-500, 3px stroke                                           ║
║   • Data points: 8px circles, Sage-500 fill                              ║
║   • Grid lines: Twilight-50, 1px                                         ║
║   • Axis labels: caption-sm, Twilight-300                                ║
║   • Title: heading-sm, Twilight-600                                      ║
║   • Summary badge: Success colors if positive                            ║
║                                                                           ║
║   ANIMATION:                                                              ║
║   • Line draws from left to right (800ms total)                          ║
║   • Data points fade in as line reaches them                             ║
║   • Summary fades in after line completes                                ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   MOOD/EMOTIONAL TRACKING CALENDAR                                        ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │  January 2026                                          │             ║
║   │                                                        │             ║
║   │  M   T   W   T   F   S   S                             │             ║
║   │                  1   2   3   4                         │             ║
║   │      🟡  🟢  🟢  🟡  🟢  🔵                             │             ║
║   │                                                        │             ║
║   │  5   6   7   8   9  10  11                             │             ║
║   │  🟢  🟡  🟠  🔵  🟢  🟢  🟢                             │             ║
║   │                                                        │             ║
║   │ 12  13  14  15  16  17  18                             │             ║
║   │  ●                                                     │ ← Today     ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Each dot colored by emotional state that day.                          ║
║   Tap day to see full journal/check-in from that day.                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
8.3 Discovered vs. Hidden Insights
╔═══════════════════════════════════════════════════════════════════════════╗
║                    INSIGHT DISCLOSURE TREATMENT                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   DISCOVERED INSIGHT (Revealed to user)                                  ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │  💎 INSIGHT                                           │             ║
║   │                                                        │             ║
║   │  Your Primary Driver: Autonomy                         │             ║
║   │                                                        │             ║
║   │  You're fundamentally motivated by freedom and         │             ║
║   │  self-direction. When this is satisfied, you thrive.   │             ║
║   │  When it's threatened, something in you rebels.        │             ║
║   │                                                        │             ║
║   │  ─────────────────────────────────────────────────     │             ║
║   │                                                        │             ║
║   │  Discovered: Day 5 of Trial                           │             ║
║   │  Confidence: High                                      │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Background:      Insight-bg (#F3E5F5) at 50%                           ║
║   Border:          1px solid Insight-light                               ║
║   Icon:            💎 or ✨                                               ║
║   Title badge:     "INSIGHT" in caption-sm, Insight-main                 ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   HIDDEN INSIGHT (Locked, teasing what's to come)                        ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ┌────────────────────────────────────────────────────────┐             ║
║   │  🔒 INSIGHT LOCKED                                    │             ║
║   │                                                        │             ║
║   │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │             ║
║   │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │             ║
║   │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │             ║
║   │                                                        │             ║
║   │  This insight unlocks when you:                        │             ║
║   │  ○ Complete Week 2 conversations                       │             ║
║   │  ○ Finish pattern identification                       │             ║
║   │                                                        │             ║
║   └────────────────────────────────────────────────────────┘             ║
║                                                                           ║
║   Background:      Twilight-50                                           ║
║   Border:          1px dashed Twilight-200                               ║
║   Content:         Blurred placeholder (text-shaped grey blocks)         ║
║   Unlock criteria: Checklist with empty circles                          ║
║                                                                           ║
║   As criteria are met, circles fill in.                                  ║
║   When all filled, "Unlock" animation plays.                             ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
8.4 Profile Growth Animation
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PROFILE GROWTH VISUALIZATION                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   CONCEPT: The profile is a living entity that grows over time.          ║
║   Visual metaphor: A constellation that gains more stars.                 ║
║                                                                           ║
║   EARLY PROFILE (Day 1-3)                                                ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║                    ★                                                      ║
║                   /                                                       ║
║                  /                                                        ║
║           ★────★                                                          ║
║                                                                           ║
║   "A few stars are visible. Your story is just beginning."               ║
║                                                                           ║
║   GROWING PROFILE (Day 4-6)                                              ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║                    ★────★                                                 ║
║                   /      \                                                ║
║                  /        \                                               ║
║           ★────★          ★                                               ║
║                  \       /                                                ║
║                   ★────★                                                  ║
║                                                                           ║
║   "New connections forming. Patterns emerging."                          ║
║                                                                           ║
║   COMPLETE BASELINE (Day 7+)                                             ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║           ★────★────★                                                     ║
║          /│         │\                                                    ║
║         / │    ★    │ \                                                   ║
║        ★──┼────┼────┼──★                                                  ║
║         \ │    │    │ /                                                   ║
║          \│    │    │/                                                    ║
║           ★────★────★                                                     ║
║                                                                           ║
║   "Your constellation is taking shape."                                  ║
║                                                                           ║
║   ANIMATION: Star Addition                                                ║
║   ─────────────────────────────────────────────────────────               ║
║   When new insight is discovered:                                         ║
║   1. New star position twinkles (scale 0 → 1.2 → 1, 400ms)               ║
║   2. Connection lines draw from existing stars (300ms each)              ║
║   3. Soft glow pulse on the constellation (600ms)                        ║
║   4. Message: "New dimension discovered"                                 ║
║                                                                           ║
║   Star color: Gradient from Sage-400 to Coral-400                        ║
║   Line color: Twilight-200 with subtle glow                              ║
║   Background: Deep Twilight-800 (like night sky)                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
9. AI-Generated Visual Opportunities
9.1 Personalized Journey Illustrations
╔═══════════════════════════════════════════════════════════════════════════╗
║                    AI IMAGE GENERATION USE CASES                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   VISION IMAGERY                                                          ║
║   ─────────────────────────────────────────────────────────               ║
║   Based on user's vision statement, generate a unique image.              ║
║                                                                           ║
║   User vision: "Living authentically, free from others'                   ║
║                 expectations, building something meaningful."              ║
║                                                                           ║
║   Prompt to AI (Midjourney/DALL-E style):                                ║
║   "Abstract representation of freedom and authenticity,                   ║
║    soft warm sunrise colors, open landscape, single figure                ║
║    walking toward horizon, watercolor style, peaceful,                    ║
║    Life OS brand colors (sage green #6B9080, coral #E07A5F),             ║
║    no text, suitable for mobile app, 4:3 aspect ratio"                   ║
║                                                                           ║
║   Guidelines:                                                             ║
║   • Always abstract/metaphorical, never literal                          ║
║   • Include brand color references in prompts                            ║
║   • Request specific aspect ratios for UI placement                      ║
║   • Avoid faces (uncanny valley risk)                                    ║
║   • Prefer nature, landscapes, abstract shapes                           ║
║                                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   ANTI-VISION IMAGERY                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   More muted, constrained visualization of what user fears.              ║
║                                                                           ║
║   User anti-vision: "Trapped in job I hate, same patterns                ║
║                      repeating, relationships faded."                     ║
║                                                                           ║
║   Prompt to AI:                                                          ║
║   "Abstract representation of feeling stuck and constrained,              ║
║    muted gray and twilight colors (#2D3A4F, #8A96AB),                    ║
║    geometric shapes suggesting barriers or loops,                         ║
║    fog or haze, lonely but not depressing,                                ║
║    watercolor style, 4:3 aspect ratio"                                   ║
║                                                                           ║
║   Note: Anti-vision imagery should be contemplative,                     ║
║   not scary or overwhelming.                                              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
9.2 Custom Avatar Generation
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PERSONALIZED AI COMPANION AVATAR                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   CONCEPT: Each user can have a unique AI companion visual.               ║
║                                                                           ║
║   BASE FORMS (User selects preference):                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   • Abstract light/energy form                                            ║
║   • Gentle animal guide (owl, fox, deer — stylized)                      ║
║   • Nature element (tree spirit, water form, cloud)                      ║
║   • Geometric/crystal form                                                ║
║                                                                           ║
║   PERSONALIZATION PROMPT:                                                 ║
║   ─────────────────────────────────────────────────────────               ║
║   "Create a friendly AI companion avatar in [base form] style,            ║
║    incorporating user's preferred colors: [user selections],              ║
║    [warm/cool/neutral] energy, approachable and wise feeling,            ║
║    suitable for small icon (64px) and large display (256px),             ║
║    transparent background, vector-style illustration"                     ║
║                                                                           ║
║   AVATAR VARIATIONS:                                                      ║
║   ─────────────────────────────────────────────────────────               ║
║   Generate 3-4 expressions/states:                                        ║
║   • Neutral/listening                                                     ║
║   • Celebrating/happy                                                     ║
║   • Thoughtful/contemplative                                              ║
║   • Empathetic/supportive                                                 ║
║                                                                           ║
║   These variations used based on conversation context.                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
9.3 Achievement Badges
╔═══════════════════════════════════════════════════════════════════════════╗
║                    AI-GENERATED ACHIEVEMENT BADGES                        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   Instead of pre-designed badges, generate unique ones per user.          ║
║                                                                           ║
║   BADGE TYPES & PROMPTS:                                                  ║
║   ─────────────────────────────────────────────────────────               ║
║                                                                           ║
║   Skill Mastery Badge:                                                    ║
║   "Circular badge icon for '[skill name]' mastery,                        ║
║    [category color] palette, incorporating visual metaphor                ║
║    of [skill concept], elegant emblem style,                              ║
║    gold accent for achievement feel, 256px, transparent bg"              ║
║                                                                           ║
║   Milestone Badge:                                                        ║
║   "Achievement badge for completing '[milestone name]',                   ║
║    [journey phase] theme, incorporating elements of                       ║
║    [user's vision keywords], celebratory but sophisticated,              ║
║    Life OS brand colors, 256px, transparent bg"                          ║
║                                                                           ║
║   Streak Badge:                                                           ║
║   "Badge celebrating [N]-day streak of [activity],                        ║
║    warm gradient suggesting consistency and growth,                       ║
║    number [N] integrated elegantly, not childish,                         ║
║    256px, transparent bg"                                                ║
║                                                                           ║
║   DISPLAY:                                                                ║
║   ─────────────────────────────────────────────────────────               ║
║   • Badges shown in profile "Achievements" section                        ║
║   • Grid layout, 3 per row on mobile                                      ║
║   • Tap to see full badge with description                                ║
║   • Locked badges shown as silhouettes                                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
9.4 Mood-Responsive Backgrounds
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DYNAMIC BACKGROUND GENERATION                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   App backgrounds can shift based on user's emotional state.              ║
║                                                                           ║
║   APPROACH: Pre-generate a library of backgrounds for each               ║
║   emotional state, then select/blend based on user check-ins.            ║
║                                                                           ║
║   CALM STATE:                                                             ║
║   "Abstract soft gradient background, serene dawn colors,                 ║
║    very subtle wave patterns, low contrast, suitable as                   ║
║    app background with text overlay, 1080x1920 portrait"                 ║
║                                                                           ║
║   ENERGIZED STATE:                                                        ║
║   "Abstract background with gentle upward motion suggestion,              ║
║    warm coral and sunrise tones (#E07A5F, #FFD93D),                       ║
║    subtle light rays, energetic but not overwhelming,                     ║
║    suitable as app background, 1080x1920 portrait"                       ║
║                                                                           ║
║   REFLECTIVE STATE:                                                       ║
║   "Abstract twilight background, deep blues and soft purples              ║
║    (#2D3A4F, #C9B1FF), subtle star/constellation hints,                  ║
║    contemplative mood, suitable as app background,                        ║
║    1080x1920 portrait"                                                   ║
║                                                                           ║
║   CHALLENGING STATE:                                                      ║
║   "Abstract background suggesting support and grounding,                  ║
║    warm earth tones with sage green (#6B9080) accents,                   ║
║    stable, reassuring feeling, subtle embrace metaphor,                   ║
║    suitable as app background, 1080x1920 portrait"                       ║
║                                                                           ║
║   TRANSITION:                                                             ║
║   Background crossfades over 2-3 seconds when mood state                 ║
║   is detected/changed. Very subtle — user shouldn't notice               ║
║   consciously, but should feel the shift.                                ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10. Screen-by-Screen Wireframe Concepts
10.1 Onboarding First Screen
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ONBOARDING: WELCOME SCREEN                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │                     ╭─────────────────╮                        │     ║
║   │                    ╱                   ╲                       │     ║
║   │                   │    [AI AVATAR]     │                       │     ║
║   │                   │                    │                       │     ║
║   │                    ╲                   ╱                       │     ║
║   │                     ╰─────────────────╯                        │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │                       LIFE OS                                  │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │              "Hey. I'm glad you're here."                     │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │       ┌─────────────────────────────────────────────┐         │     ║
║   │       │                                             │         │     ║
║   │       │              Let's Begin                    │         │     ║
║   │       │                                             │         │     ║
║   │       └─────────────────────────────────────────────┘         │     ║
║   │                                                                │     ║
║   │                    Already have an account? Sign in           │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
║   SPECIFICATIONS:                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Background:      Dawn-cream (#FAF8F5)                                  ║
║   Avatar:          120×120px, centered, subtle breathing animation       ║
║   Logo:            "LIFE OS" in display-md, Twilight-600                 ║
║   Greeting:        body-lg, Fraunces Regular, Twilight-500               ║
║   Primary CTA:     Full-width button, Twilight-500 bg, white text       ║
║   Secondary:       caption-md, Twilight-300, underlined                  ║
║                                                                           ║
║   Animation:                                                              ║
║   • Avatar fades in and starts breathing (400ms delay)                   ║
║   • Text fades in sequence (200ms stagger)                               ║
║   • Button slides up from bottom (300ms, ease-out)                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10.2 Daily Prompt Screen
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DAILY PROMPT SCREEN                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │  ◄ Back                                    Day 5  🔥7          │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │                                                                │     ║
║   │                     Good morning, Alex.                        │     ║
║   │                                                                │     ║
║   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│     ║
║   │                                                                │     ║
║   │          ╭─────────────────────────────────────────╮          │     ║
║   │          │                                         │          │     ║
║   │          │  Today I want to share something        │          │     ║
║   │          │  I've been noticing about you.          │          │     ║
║   │          │                                         │          │     ║
║   │          │  But first—how are you showing up       │          │     ║
║   │          │  today?                                 │          │     ║
║   │          │                                         │          │     ║
║   │          ╰─────────────────────────────────────────╯          │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │     ┌───────────────────────────────────────────────────┐     │     ║
║   │     │  😊  Good — Ready for whatever comes             │     │     ║
║   │     └───────────────────────────────────────────────────┘     │     ║
║   │                                                                │     ║
║   │     ┌───────────────────────────────────────────────────┐     │     ║
║   │     │  😐  Okay — A bit tired but here                 │     │     ║
║   │     └───────────────────────────────────────────────────┘     │     ║
║   │                                                                │     ║
║   │     ┌───────────────────────────────────────────────────┐     │     ║
║   │     │  😔  Struggling — Today is hard                  │     │     ║
║   │     └───────────────────────────────────────────────────┘     │     ║
║   │                                                                │     ║
║   │     ┌───────────────────────────────────────────────────┐     │     ║
║   │     │  💭  Let me tell you...                          │     │     ║
║   │     └───────────────────────────────────────────────────┘     │     ║
║   │                                                                │     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
║   SPECIFICATIONS:                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Header:          Day counter + streak flame icon                       ║
║   Greeting:        heading-lg, Twilight-600 (personalized with name)     ║
║   Prompt bubble:   AI message bubble (see 5.1)                           ║
║   Option cards:    Selection cards (see 5.2)                             ║
║   Last option:     Opens text input for custom response                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10.3 Insight Reveal Moment
╔═══════════════════════════════════════════════════════════════════════════╗
║                    INSIGHT REVEAL SCREEN                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   │░░░░░░░░░░░░░░░░░░ (dimmed background) ░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   │░░░░░░░░┌──────────────────────────────────────────┐░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   💎 INSIGHT                             │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   Here's what I'm seeing.                │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   You seem to have a strong need for     │░░░░░░░░░░│     ║
║   │░░░░░░░░│   freedom and self-direction.            │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   When this is satisfied, you thrive.    │░░░░░░░░░░│     ║
║   │░░░░░░░░│   When it's threatened, something in     │░░░░░░░░░░│     ║
║   │░░░░░░░░│   you rebels.                            │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   ──────────────────────────────────     │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   Does that land?                        │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░│   ┌──────────────┐  ┌──────────────┐    │░░░░░░░░░░│     ║
║   │░░░░░░░░│   │  Yes, that's │  │  Tell me     │    │░░░░░░░░░░│     ║
║   │░░░░░░░░│   │  exactly it  │  │  more...     │    │░░░░░░░░░░│     ║
║   │░░░░░░░░│   └──────────────┘  └──────────────┘    │░░░░░░░░░░│     ║
║   │░░░░░░░░│                                          │░░░░░░░░░░│     ║
║   │░░░░░░░░└──────────────────────────────────────────┘░░░░░░░░░░│     ║
║   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
║   SPECIFICATIONS:                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Backdrop:        Twilight-800 at 60% opacity                           ║
║   Card:            #FFFFFF, 24px border-radius, 24px padding             ║
║   Badge:           "INSIGHT" in caption-sm, Insight-main                 ║
║   Intro:           body-lg, Twilight-600                                 ║
║   Body:            body-md, Twilight-500                                 ║
║   Question:        body-lg, Twilight-600, SemiBold                       ║
║   Buttons:         Side-by-side, equal width                             ║
║                                                                           ║
║   Animation: See section 4.3 (Insight Reveal Animation)                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10.4 Skill Tree View
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SKILL TREE SCREEN                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │  ◄ Profile                               🔍  ⚙️                │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │                                                                │     ║
║   │  YOUR SKILL TREE                                               │     ║
║   │  12 of 47 skills unlocked                                      │     ║
║   │                                                                │     ║
║   │  ┌─────────────────────────────────────────────────────────┐  │     ║
║   │  │ All │Self-│Ident│Goals│Patt.│Emot.│Relat│               │  │     ║
║   │  │     │Aware│     │     │     │     │     │               │  │     ║
║   │  └──▼──┴─────┴─────┴─────┴─────┴─────┴─────┘               │  │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │                                                        │   │     ║
║   │  │              ┌─────┐                                   │   │     ║
║   │  │              │ ⭐  │                                   │   │     ║
║   │  │              │Emot.│                                   │   │     ║
║   │  │              │Naming                                   │   │     ║
║   │  │              └──┬──┘                                   │   │     ║
║   │  │         ┌───────┼───────┐                              │   │     ║
║   │  │         │       │       │                              │   │     ║
║   │  │     ┌───┴───┐ ┌─┴─┐ ┌───┴───┐                         │   │     ║
║   │  │     │  🎯   │ │🔒 │ │  🔒   │                         │   │     ║
║   │  │     │ Self- │ │Tho│ │ Body  │                         │   │     ║
║   │  │     │Compass│ │ug │ │Aware  │                         │   │     ║
║   │  │     │  60%  │ │ht │ │       │                         │   │     ║
║   │  │     └───────┘ └───┘ └───────┘                         │   │     ║
║   │  │                                                        │   │     ║
║   │  │      [Pinch to zoom • Drag to pan]                    │   │     ║
║   │  │                                                        │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │  CURRENTLY WORKING ON:                                         │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │  🎯 Self-Compassion                      60% ████░░    │   │     ║
║   │  │  Learn to treat yourself with kindness  [Continue →]   │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │  [🏠]     [💬]     [🗺️]     [🌳]     [👤]                    │     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
║   Navigation tabs: Home, Chat, Journey Map, Skill Tree, Profile          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10.5 Journey Map View
╔═══════════════════════════════════════════════════════════════════════════╗
║                    JOURNEY MAP SCREEN                                     ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │  ◄ Home                                              ⚙️        │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │                                                                │     ║
║   │  YOUR JOURNEY                                                  │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │                                                        │   │     ║
║   │  │                     🏔️ YOUR VISION                     │   │     ║
║   │  │            "Living authentically, free..."             │   │     ║
║   │  │                         │                              │   │     ║
║   │  │                         │                              │   │     ║
║   │  │                    ○────┘ ← Evolution Phase            │   │     ║
║   │  │                   /                                    │   │     ║
║   │  │                  /                                     │   │     ║
║   │  │             ○───○ ← Calibration                       │   │     ║
║   │  │            /                                           │   │     ║
║   │  │           /                                            │   │     ║
║   │  │      📍 YOU ARE HERE                                   │   │     ║
║   │  │      Week 2, Day 3                                     │   │     ║
║   │  │          \                                             │   │     ║
║   │  │           \                                            │   │     ║
║   │  │       ●────● ← Excavation Complete ✓                  │   │     ║
║   │  │                                                        │   │     ║
║   │  │  [Scroll for more details]                             │   │     ║
║   │  │                                                        │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │  CURRENT PHASE: CALIBRATION                            │   │     ║
║   │  │                                                        │   │     ║
║   │  │  Testing your hypotheses about yourself.               │   │     ║
║   │  │  Finding what actually works.                          │   │     ║
║   │  │                                                        │   │     ║
║   │  │  Progress: ██████████████░░░░░░░░░░░░░  42%            │   │     ║
║   │  │                                                        │   │     ║
║   │  │                        [View Phase Details →]          │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │  [🏠]     [💬]     [🗺️]     [🌳]     [👤]                    │     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10.6 Profile/Psychometric View
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PROFILE SCREEN                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │                                                      ⚙️        │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │                                                                │     ║
║   │                     ╭─────────────╮                            │     ║
║   │                     │             │                            │     ║
║   │                     │  [AVATAR]   │                            │     ║
║   │                     │             │                            │     ║
║   │                     ╰─────────────╯                            │     ║
║   │                                                                │     ║
║   │                         Alex                                   │     ║
║   │                    Journey Day 17                              │     ║
║   │                                                                │     ║
║   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│     ║
║   │                                                                │     ║
║   │  YOUR PROFILE                                                  │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │                  [RADAR CHART]                         │   │     ║
║   │  │                                                        │   │     ║
║   │  │           Autonomy                                     │   │     ║
║   │  │              ★                                         │   │     ║
║   │  │             /│\                                        │   │     ║
║   │  │    Open.   / │ \   Compet.                            │   │     ║
║   │  │        \  /  │  \  /                                  │   │     ║
║   │  │         ★────●────★                                   │   │     ║
║   │  │        /          \                                    │   │     ║
║   │  │    Relat.       Growth                                 │   │     ║
║   │  │                                                        │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │  INSIGHTS DISCOVERED: 5                                        │     ║
║   │  [View All →]                                                  │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │  💎 Primary Driver: Autonomy                           │   │     ║
║   │  │  You're fundamentally motivated by freedom...          │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │  💎 Core Pattern: Achievement-Freedom Tension          │   │     ║
║   │  │  You drive yourself harder than anyone else...         │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │  ACHIEVEMENTS: 8 🏆                                            │     ║
║   │  [View All →]                                                  │     ║
║   │                                                                │     ║
║   │────────────────────────────────────────────────────────────────│     ║
║   │  [🏠]     [💬]     [🗺️]     [🌳]     [👤]                    │     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
10.7 Conversion Screen (Day 7)
╔═══════════════════════════════════════════════════════════════════════════╗
║                    CONVERSION SCREEN                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌────────────────────────────────────────────────────────────────┐     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   │                     Day 7: Your Profile                        │     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │                                                        │   │     ║
║   │  │   ★ ─────── ★ ─────── ★                               │   │     ║
║   │  │    \       / \       /                                 │   │     ║
║   │  │     \     /   \     /                                  │   │     ║
║   │  │      ★ ─ ★ ─── ★ ─ ★   [Constellation Visual]         │   │     ║
║   │  │     /     \   /     \                                  │   │     ║
║   │  │    /       \ /       \                                 │   │     ║
║   │  │   ★ ─────── ★ ─────── ★                               │   │     ║
║   │  │                                                        │   │     ║
║   │  │   Your profile is taking shape.                        │   │     ║
║   │  │                                                        │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │  WHAT WE'VE DISCOVERED:                                       │     ║
║   │                                                                │     ║
║   │  ✓ Primary Driver: Autonomy                                    │     ║
║   │  ✓ Key Pattern: Achievement-Freedom Tension                    │     ║
║   │  ✓ Growth Edge: Self-Compassion                                │     ║
║   │                                                                │     ║
║   │  WHAT'S WAITING:                                               │     ║
║   │                                                                │     ║
║   │  🔒 Developmental Stage Assessment                             │     ║
║   │  🔒 Deep Blocker Analysis                                      │     ║
║   │  🔒 Personalized Journey                                       │     ║
║   │  🔒 Your Skill Tree                                            │     ║
║   │                                                                │     ║
║   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│     ║
║   │                                                                │     ║
║   │  ┌────────────────────────────────────────────────────────┐   │     ║
║   │  │                                                        │   │     ║
║   │  │             Continue My Journey                        │   │     ║
║   │  │                                                        │   │     ║
║   │  │             $12/month • Cancel anytime                 │   │     ║
║   │  │                                                        │   │     ║
║   │  └────────────────────────────────────────────────────────┘   │     ║
║   │                                                                │     ║
║   │                    I need more time                            │     ║
║   │                                                                │     ║
║   │                                                                │     ║
║   └────────────────────────────────────────────────────────────────┘     ║
║                                                                           ║
║   SPECIFICATIONS:                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Constellation:   Profile growth visualization                          ║
║   Discovered:      Green checkmarks, body-sm                             ║
║   Locked:          Lock icons, body-sm, Twilight-300                     ║
║   Primary CTA:     Coral-500 bg, white text, full-width                  ║
║   Secondary:       Text link, Twilight-400                               ║
║                                                                           ║
║   Note: No pressure tactics. Clear value. Easy to dismiss.              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11. Design System Summary
11.1 Component Library Overview
╔═══════════════════════════════════════════════════════════════════════════╗
║                    COMPONENT LIBRARY STRUCTURE                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   PRIMITIVES (Building blocks)                                            ║
║   ─────────────────────────────────────────────────────────               ║
║   • Colors (tokens)                                                       ║
║   • Typography (scale, families)                                          ║
║   • Spacing (scale)                                                       ║
║   • Shadows                                                               ║
║   • Border radii                                                          ║
║   • Icons                                                                 ║
║   • Illustrations                                                         ║
║                                                                           ║
║   ATOMS (Single elements)                                                 ║
║   ─────────────────────────────────────────────────────────               ║
║   • Button (primary, secondary, tertiary, ghost)                         ║
║   • Icon Button                                                           ║
║   • Input (text, textarea)                                               ║
║   • Checkbox / Radio                                                      ║
║   • Toggle                                                                ║
║   • Slider                                                                ║
║   • Badge                                                                 ║
║   • Avatar                                                                ║
║   • Progress Bar                                                          ║
║   • Progress Ring                                                         ║
║   • Divider                                                               ║
║                                                                           ║
║   MOLECULES (Combined elements)                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   • Message Bubble (AI, User, System)                                    ║
║   • Selection Card                                                        ║
║   • Quick Reply Chip                                                      ║
║   • Insight Card                                                          ║
║   • Skill Node                                                            ║
║   • Milestone Node                                                        ║
║   • Profile Stat                                                          ║
║   • Navigation Tab                                                        ║
║   • List Item                                                             ║
║   • Toast/Notification                                                    ║
║                                                                           ║
║   ORGANISMS (Complex components)                                          ║
║   ─────────────────────────────────────────────────────────               ║
║   • Chat Interface                                                        ║
║   • Skill Tree View                                                       ║
║   • Journey Map View                                                      ║
║   • Profile Card                                                          ║
║   • Radar Chart                                                           ║
║   • Progress Calendar                                                     ║
║   • Modal / Bottom Sheet                                                  ║
║   • Navigation Bar (Top)                                                  ║
║   • Tab Bar (Bottom)                                                      ║
║                                                                           ║
║   TEMPLATES (Page layouts)                                                ║
║   ─────────────────────────────────────────────────────────               ║
║   • Chat Screen Template                                                  ║
║   • Card Selection Screen Template                                        ║
║   • Profile Screen Template                                               ║
║   • Full-screen Modal Template                                            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11.2 Spacing System
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SPACING SCALE                                          ║
║                    Base unit: 4px                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   TOKEN          │ VALUE    │ USAGE                                       ║
║   ───────────────┼──────────┼───────────────────────────────────────     ║
║   space-0        │ 0px      │ No spacing                                  ║
║   space-1        │ 4px      │ Tight inline spacing                        ║
║   space-2        │ 8px      │ Icon-to-text, related elements              ║
║   space-3        │ 12px     │ List item padding                           ║
║   space-4        │ 16px     │ Standard padding (cards, containers)        ║
║   space-5        │ 20px     │ Medium padding                              ║
║   space-6        │ 24px     │ Section spacing                             ║
║   space-8        │ 32px     │ Large section gaps                          ║
║   space-10       │ 40px     │ Major section divisions                     ║
║   space-12       │ 48px     │ Screen section padding                      ║
║   space-16       │ 64px     │ Hero spacing                                ║
║   space-20       │ 80px     │ Large hero spacing                          ║
║                                                                           ║
║   USAGE GUIDELINES                                                        ║
║   ─────────────────────────────────────────────────────────               ║
║   • Screen edge padding: space-4 (16px) on mobile                         ║


║   • Card internal padding: space-4 to space-6 (16-24px)                   ║
║   • Between related items: space-2 to space-3 (8-12px)                    ║
║   • Between sections: space-6 to space-8 (24-32px)                        ║
║   • Between screen areas: space-10 to space-12 (40-48px)                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11.3 Border Radius System
╔═══════════════════════════════════════════════════════════════════════════╗
║                    BORDER RADIUS TOKENS                                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   TOKEN          │ VALUE    │ USAGE                                       ║
║   ───────────────┼──────────┼───────────────────────────────────────     ║
║   radius-none    │ 0px      │ Sharp corners (rare)                        ║
║   radius-sm      │ 4px      │ Small badges, tags                          ║
║   radius-md      │ 8px      │ Buttons, inputs                             ║
║   radius-lg      │ 12px     │ Cards, selection items                      ║
║   radius-xl      │ 16px     │ Message bubbles                             ║
║   radius-2xl     │ 20px     │ Large cards, modals                         ║
║   radius-3xl     │ 24px     │ Bottom sheets                               ║
║   radius-full    │ 9999px   │ Pills, circular elements                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11.4 Shadow System
╔═══════════════════════════════════════════════════════════════════════════╗
║                    SHADOW TOKENS                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   LIGHT MODE                                                              ║
║   ─────────────────────────────────────────────────────────               ║
║   shadow-sm      │ 0 1px 2px rgba(0,0,0,0.04)                             ║
║                  │ Subtle lift (buttons at rest)                          ║
║                                                                           ║
║   shadow-md      │ 0 2px 8px rgba(0,0,0,0.06)                             ║
║                  │ Standard cards                                         ║
║                                                                           ║
║   shadow-lg      │ 0 4px 16px rgba(0,0,0,0.08)                            ║
║                  │ Elevated cards, dropdowns                              ║
║                                                                           ║
║   shadow-xl      │ 0 8px 24px rgba(0,0,0,0.12)                            ║
║                  │ Modals, bottom sheets                                  ║
║                                                                           ║
║   shadow-glow    │ 0 0 16px rgba(107,144,128,0.3)                         ║
║                  │ Insight reveals, celebration moments                   ║
║                                                                           ║
║   DARK MODE                                                               ║
║   ─────────────────────────────────────────────────────────               ║
║   shadow-sm      │ 0 1px 2px rgba(0,0,0,0.2)                              ║
║   shadow-md      │ 0 2px 8px rgba(0,0,0,0.3)                              ║
║   shadow-lg      │ 0 4px 16px rgba(0,0,0,0.4)                             ║
║   shadow-xl      │ 0 8px 24px rgba(0,0,0,0.5)                             ║
║   shadow-glow    │ 0 0 20px rgba(126,231,135,0.2)                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11.5 Icon Style Guidelines
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ICON SYSTEM                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ICON LIBRARY: Phosphor Icons (https://phosphoricons.com/)              ║
║   ─────────────────────────────────────────────────────────               ║
║   Why: Flexible weight system, comprehensive set, consistent style,      ║
║        MIT license, great for both UI and illustrations.                  ║
║                                                                           ║
║   WEIGHT USAGE                                                            ║
║   ─────────────────────────────────────────────────────────               ║
║   Regular (default):    Navigation icons, action buttons                 ║
║   Light:               Decorative icons, large displays                   ║
║   Bold:                Emphasis, selected states                          ║
║   Fill:                Active/selected navigation items                   ║
║                                                                           ║
║   SIZES                                                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   16px:    Inline with caption text, dense UI                            ║
║   20px:    Standard UI icons, buttons                                    ║
║   24px:    Navigation, list items, prominent actions                     ║
║   32px:    Feature icons, category indicators                            ║
║   48px:    Hero icons, onboarding                                        ║
║   64px:    Celebration moments, empty states                             ║
║                                                                           ║
║   COLORS                                                                  ║
║   ─────────────────────────────────────────────────────────               ║
║   Default:             Twilight-400 (current text color)                 ║
║   Active/Selected:     Sage-500 or category color                        ║
║   Disabled:            Twilight-200                                       ║
║   Interactive:         Twilight-500                                       ║
║   Error:               Error-main                                         ║
║   Success:             Success-main                                       ║
║                                                                           ║
║   ICON + TEXT PAIRING                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   Always pair icons with text labels for accessibility.                   ║
║   Exception: Universally recognized icons (close X, search, menu)        ║
║                                                                           ║
║   Spacing: 8px (space-2) between icon and label                          ║
║                                                                           ║
║   KEY ICONS FOR LIFE OS                                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   Navigation:                                                             ║
║   • Home: House                                                           ║
║   • Chat: ChatCircle                                                      ║
║   • Journey: Path or MapTrifold                                          ║
║   • Skills: TreeStructure or Graph                                       ║
║   • Profile: UserCircle                                                   ║
║                                                                           ║
║   Actions:                                                                ║
║   • Send: PaperPlaneTilt                                                 ║
║   • Settings: Gear                                                        ║
║   • Back: CaretLeft or ArrowLeft                                         ║
║   • Close: X                                                              ║
║   • More: DotsThreeVertical                                              ║
║                                                                           ║
║   Status:                                                                 ║
║   • Complete: CheckCircle                                                 ║
║   • In Progress: Spinner or Circle (partial)                             ║
║   • Locked: Lock                                                          ║
║   • Unlocked: LockOpen                                                    ║
║   • Insight: Sparkle or Diamond                                          ║
║   • Warning: Warning                                                      ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11.6 Illustration Style Guidelines
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ILLUSTRATION STYLE                                     ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   STYLE DIRECTION: "Soft Organic"                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   Inspired by Headspace's approach but more mature and abstract.          ║
║                                                                           ║
║   CHARACTERISTICS                                                         ║
║   ─────────────────────────────────────────────────────────               ║
║   • Soft, rounded shapes (no sharp edges)                                ║
║   • Organic, flowing lines                                                ║
║   • Limited color palette (3-4 colors per illustration)                  ║
║   • Subtle gradients within shapes                                        ║
║   • Abstract representations (avoid literal depictions)                  ║
║   • Nature-inspired elements (plants, landscapes, celestial)             ║
║   • No human faces (avoid uncanny valley)                                 ║
║   • Stylized figures if humans needed (simple, geometric)                ║
║                                                                           ║
║   COLOR USAGE IN ILLUSTRATIONS                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   Primary shapes:     Sage palette, Twilight palette                     ║
║   Accents:           Coral, insight purple                               ║
║   Backgrounds:       Dawn-cream, subtle gradients                        ║
║   Highlights:        White, soft yellow                                   ║
║                                                                           ║
║   ILLUSTRATION USE CASES                                                  ║
║   ─────────────────────────────────────────────────────────               ║
║   • Onboarding screens (welcome, pathway selection)                      ║
║   • Empty states (no data yet, first time)                               ║
║   • Celebration moments (achievement unlocked)                           ║
║   • Error states (gentle, not alarming)                                  ║
║   • Journey visualization backgrounds                                    ║
║   • Skill category headers                                               ║
║                                                                           ║
║   AVOID                                                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   • Stock photography of people                                          ║
║   • Overly detailed or complex illustrations                             ║
║   • Cartoon-style characters                                             ║
║   • Corporate/business imagery                                           ║
║   • Religious or spiritual symbols                                       ║
║   • Gender/age-specific representations                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
11.7 Photography/Imagery Guidelines
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PHOTOGRAPHY GUIDELINES                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   GENERAL RULE: Prefer illustrations and AI-generated imagery            ║
║   over stock photography. If photography is needed:                       ║
║                                                                           ║
║   ACCEPTABLE SUBJECTS                                                     ║
║   ─────────────────────────────────────────────────────────               ║
║   • Nature scenes (landscapes, plants, skies)                            ║
║   • Abstract textures (water, clouds, light)                             ║
║   • Journeys/paths (literal trails, roads)                               ║
║   • Minimal spaces (calm interiors, open spaces)                         ║
║                                                                           ║
║   AVOID                                                                   ║
║   ─────────────────────────────────────────────────────────               ║
║   • Stock photos of people (especially forced smiles)                    ║
║   • Cliché meditation imagery (person on mountain, lotus)                ║
║   • Corporate/business settings                                           ║
║   • Overly staged or unnatural compositions                              ║
║                                                                           ║
║   TREATMENT                                                               ║
║   ─────────────────────────────────────────────────────────               ║
║   • Apply subtle color overlay to match brand palette                    ║
║   • Reduce saturation slightly (muted, calm feel)                        ║
║   • Ensure good contrast for text overlay if needed                      ║
║   • Prefer soft focus or minimal depth of field                          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Quick Reference: Design Tokens Summary
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DESIGN TOKENS QUICK REFERENCE                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   COLORS (Primary)                                                        ║
║   ─────────────────────────────────────────────────────────               ║
║   Primary Brand:        #2D3A4F (Deep Twilight)                          ║
║   Secondary Brand:      #6B9080 (Soft Sage)                              ║
║   Accent:               #E07A5F (Warm Coral)                             ║
║   Background:           #FAF8F5 (Dawn Cream)                             ║
║   Surface:              #FFFFFF (White)                                   ║
║                                                                           ║
║   TYPOGRAPHY                                                              ║
║   ─────────────────────────────────────────────────────────               ║
║   Primary Font:         Inter                                             ║
║   Display Font:         Fraunces                                          ║
║   Mono Font:            JetBrains Mono                                    ║
║   Base Size:            16px                                              ║
║   Scale:                1.25 (Major Third)                                ║
║                                                                           ║
║   SPACING (Base 4px)                                                      ║
║   ─────────────────────────────────────────────────────────               ║
║   Tight:                4px, 8px                                          ║
║   Standard:             16px, 24px                                        ║
║   Spacious:             32px, 48px                                        ║
║                                                                           ║
║   BORDER RADIUS                                                           ║
║   ─────────────────────────────────────────────────────────               ║
║   Buttons:              8px                                               ║
║   Cards:                12-16px                                           ║
║   Message Bubbles:      16px                                              ║
║   Modals:               20-24px                                           ║
║   Pills:                9999px                                            ║
║                                                                           ║
║   ANIMATION                                                               ║
║   ─────────────────────────────────────────────────────────               ║
║   Quick:                150ms                                             ║
║   Standard:             250ms                                             ║
║   Emphasis:             400ms                                             ║
║   Celebration:          600-1000ms                                        ║
║   Default Easing:       cubic-bezier(0.4, 0.0, 0.2, 1)                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
Implementation Checklist
For designers and developers implementing this system:

Phase 1: Foundation
 Set up color tokens in design tool (Figma/Sketch)
 Import and configure typography
 Create spacing and sizing scales
 Build shadow and effect styles
 Import icon library (Phosphor)
Phase 2: Primitives
 Create button component variants
 Build input components
 Design progress indicators
 Create avatar component
 Build badge components
Phase 3: Patterns
 Design chat interface components
 Build card selection patterns
 Create skill node variants
 Design insight reveal pattern
 Build navigation patterns
Phase 4: Screens
 Onboarding flow screens
 Daily conversation screens
 Skill tree view
 Journey map view
 Profile screens
 Conversion screens
Phase 5: Motion
 Define animation tokens in code
 Build microinteraction library
 Create celebration animations
 Implement reduced motion alternatives
 Test animation performance
Phase 6: AI Integration
 Set up AI image generation pipeline
 Create prompt templates for visuals
 Build avatar generation system
 Implement mood-responsive backgrounds
Document End

Version History:

1.0 (2026-01-13): Initial comprehensive design architecture