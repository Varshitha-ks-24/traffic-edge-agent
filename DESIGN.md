# Design Brief: Autonomous Edge-Case Traffic Agent

## Direction & Tone
Command center / control room aesthetic. Professional, authoritative, high-tech intelligence platform for real-time traffic management. Dark-themed precision interface with data-dense layouts and glowing status indicators.

## Color Palette (OKLCH Dark Mode)

| Token | L | C | H | Purpose |
|-------|---|---|---|---------|
| **background** | 0.08 | 0 | 0 | Deep charcoal base, minimal visual noise |
| **card** | 0.12 | 0 | 0 | Slightly elevated card containers |
| **primary** | 0.62 | 0.25 | 195 | Cyan/teal — data flow, active elements |
| **accent** | 0.72 | 0.23 | 55 | Amber/gold — warnings, alerts, highlights |
| **destructive** | 0.62 | 0.24 | 24 | Red — critical emergencies, stop states |
| **chart-1** | 0.62 | 0.25 | 195 | Cyan — primary data visualization |
| **chart-2** | 0.72 | 0.23 | 55 | Amber — secondary/warning data |
| **chart-3** | 0.68 | 0.18 | 110 | Green — normal/healthy traffic |

## Typography
- **Display**: Plus Jakarta Sans (bold, geometric, tech-forward)
- **Body**: Plus Jakarta Sans (clean, legible, professional)
- **Mono**: JetBrains Mono (data, metrics, code-like precision)

## Elevation & Depth
- Base: charcoal background (`--background: 0.08 0 0`)
- Cards: subtle dark elevation with cyan glow (`box-shadow: 0 0 20px rgba(98, 213, 228, 0.1)`)
- Modals: high elevation with inset light border for depth

## Structural Zones

| Zone | Styling | Purpose |
|------|---------|---------|
| **Header** | `bg-card` border-b `border-primary/20` | System status, title, breadcrumbs |
| **Sidebar** | `bg-card` with `sidebar-*` tokens | Navigation, mode toggle, info panel |
| **Main content** | `bg-background` grid layout | Map, metrics, data tables |
| **Alert banner** | `bg-accent/10` border `border-accent/40` | Real-time incident notifications |
| **Status cards** | `bg-card` `shadow-card-dark` `pulse-glow` | KPIs, traffic state, alerts |
| **Data table** | `bg-card` rows with `hover:bg-card/80` | Vehicles, routes, predictions |
| **Footer** | `bg-muted/20` border-t `border-border` | System time, API status, debug info |

## Spacing & Rhythm
- Compact density for data-heavy interface (1rem base grid)
- Consistent 8px/16px/24px gaps between zones
- 0.5rem border-radius for sharp, tech aesthetic (not rounded)

## Component Patterns
- **Status badge**: colored pill (`px-3 py-1 rounded-full`) with icon, pulsing for active
- **Data metric**: large number (body mono), label (body sm muted), sparkline trend
- **Alert**: colored left border, icon, message, timestamp
- **Map region**: overlays with color-coded congestion (green/yellow/red), clickable zones
- **Chart**: line/bar data in cyan/amber, grid lines `border-border/40`, legend below
- **Button**: primary (cyan bg, dark text), secondary (transparent border), accent (amber)

## Motion & Animation
- **Transitions**: smooth 0.3s cubic-bezier(0.4, 0, 0.2, 1) for state changes
- **Pulse glow**: subtle 2s breathing pulse on active status indicators
- **Scan line**: 3s animated scan across real-time data (optional, on map or live streams)
- No bounce or playful easing; precision-focused motion

## Anti-patterns Avoided
- Generic blue CTAs (using cyan/amber context-specific colors)
- Warm pastels (dark, cool professionalism maintained)
- Rounded corners (sharp 0.5rem for tech precision)
- Scattered animations (choreographed pulse + scan line only)
- Low contrast (AA+ on all text, OKLCH tuned for dark mode legibility)

## Signature Detail
Glowing cyan card accents with subtle inset border simulate real control room instrumentation. Status indicators pulse gently to draw attention without distraction. Amber accent highlights create visual hierarchy for warnings/alerts without feeling alarm-ish.

## Chart Colors
Primary: cyan (0.62 195°) for traffic flow, secondary: amber (0.72 55°) for delays, tertiary: green (0.68 110°) for normal state. All colors tuned for dark background legibility with sufficient saturation.

## Differentiation
Autonomous Edge-Case Traffic Agent stands out through:
1. **Precision-first layout** — every element serves data clarity
2. **Contextual color coding** — cyan=data flow, amber=action needed, red=emergency
3. **Glowing indicators** — subtle cyan/amber glows simulate high-tech command center
4. **Minimal decoration** — no gradients, no shadows for their own sake, only functional depth
5. **Mono type for metrics** — data feels authoritative and precise

## Dark Mode Strategy
Pure dark mode (no light mode). All OKLCH values optimized for charcoal base (L 0.08), ensuring high contrast for data legibility and reducing eye strain in 24/7 monitoring scenarios.
