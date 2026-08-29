# WebOps Commander design system

This file is the visual source of truth. It adapts the UI/UX Pro Max operations-dashboard guidance to the authoritative product brief.

## Direction

- Premium mission-control interface: dark, restrained, precise, and dense without becoming cramped.
- Near-black canvas, cool slate panels, off-white text, blue-violet WebMCP accent, and semantic green/amber/red status colors.
- Geist Sans for UI and Geist Mono for telemetry; operational values use tabular numerals.
- Flat surfaces gain hierarchy through thin low-contrast borders, inner highlights, and controlled shadows—not decorative gradients or glass everywhere.
- Motion explains state changes only: activity arrival, focused topology paths, approval entry, and deterministic recovery. Respect reduced motion.

## Tokens

| Role            | Value     |
| --------------- | --------- |
| Canvas          | `#07090d` |
| Elevated canvas | `#0b0e14` |
| Panel           | `#10141c` |
| Panel strong    | `#151a24` |
| Border          | `#252b37` |
| Text            | `#f4f6f8` |
| Muted text      | `#98a2b3` |
| WebMCP          | `#8b83ff` |
| Healthy         | `#36d399` |
| Warning         | `#f5b942` |
| Critical        | `#ff5f6d` |

## Component rules

- Radius: 10px controls, 14px cards, 18px major regions.
- Controls are at least 44px high and show an obvious `:focus-visible` ring.
- Charts pair color with labels and a text summary. Topology has a semantic list alternative.
- Dense dashboard spacing uses an 8/12/16/24/32px scale; landing sections may use 48/72/96px.
- Avoid scale-on-hover for data cards. Buttons may translate by one pixel without causing layout shift.
- At 1024px the activity rail moves below the main area; at 640px KPIs and diagnostics become single-column.

## Required checks

- Keyboard navigation follows reading order; dialog traps focus and restores it on close.
- Contrast is at least 4.5:1 for body text.
- No emoji icons; use Lucide SVG icons with accessible labels where needed.
- No horizontal overflow at 375, 768, 1024, or 1440px.
- `prefers-reduced-motion: reduce` removes non-essential transitions and recovery tweening.
