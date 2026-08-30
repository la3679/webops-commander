# WebOps Commander design system

This is the visual source of truth for the marketing and command-center surfaces. It synthesizes the UI/UX Pro Max real-time operations, developer-tool, accessibility, responsive, icon, and Next.js guidance with the product brief.

## Direction

- Product character: industrial editorial, operational, precise, and human-controlled.
- Avoid generic AI cues: no violet gradients, sparkles, robot marks, glowing orbs, or anonymous neural-network imagery.
- Brand mark: custom `WC` routing-path monogram with signal-orange and telemetry-cyan endpoints.
- Landing page: warm paper canvas, ink typography, visible grid/rule structure, asymmetric editorial hierarchy.
- Application: graphite control room, compact telemetry, restrained depth, sharp 3–6px corners.
- Motion explains state only and uses 150–300ms transitions. Respect reduced motion.

## Tokens

| Role                        | Landing   | Application |
| --------------------------- | --------- | ----------- |
| Canvas                      | `#E9E4D8` | `#0B0D0E`   |
| Raised canvas               | `#DED8CA` | `#101315`   |
| Panel                       | `#F5F1E7` | `#15191B`   |
| Panel strong                | `#EBE5D8` | `#1B2022`   |
| Border                      | `#BCB5A8` | `#2C3437`   |
| Text                        | `#141719` | `#F4F1E8`   |
| Muted text                  | `#5F6666` | `#97A2A5`   |
| Primary / action            | `#FF6B35` | `#FF6B35`   |
| Telemetry / brand secondary | `#087E79` | `#52D4CF`   |
| Healthy                     | `#087E79` | `#35CD9B`   |
| Warning                     | `#A26100` | `#EFB849`   |
| Critical                    | `#B42318` | `#FF625E`   |

## Typography

- IBM Plex Sans: body, navigation, headings, controls.
- JetBrains Mono: telemetry, labels, identifiers, numeric values, technical display accents.
- Body text is at least 16px on mobile-facing long-form content with 1.5–1.75 line-height.
- Operational values use tabular numerals.

## Components

- Controls are at least 44px high, use visible focus rings, and have hover/pressed/disabled states.
- Buttons use 3px corners; panels use 6px corners; tags use 2px corners.
- Panels use thin borders and a small orange registration corner rather than glass or glow.
- Status always combines color with a label and/or icon.
- Use Lucide outline icons consistently for interface actions. The brand mark is a bespoke inline SVG.
- Charts include labels and a screen-reader text summary.
- Dialogs provide a clear close or decision path and retain Radix focus management.

## Layout

- Landing max width: 1320px. Application max width: 1720px.
- Spacing follows a 4/8px system with dense dashboard gaps and larger landing section intervals.
- Check 375, 768, 1024, and 1440px. No horizontal page overflow.
- Below 1024px, the activity rail follows the main application content. Below 640px, dense grids collapse.
- Landing information architecture follows the feature-rich operations pattern: hero and live preview, command-center overview, full tool surface, human/agent model, response lifecycle, safety and architecture, scope, and final launch CTA.
- Long-form sections use short introductions, numbered grids, compact factual labels, and repeated visual rules to remain scannable.

## Accessibility and performance

- Normal text contrast is at least 4.5:1.
- Keyboard order matches reading order; all icon-only buttons have accessible labels.
- Touch targets are at least 44×44px with 8px spacing where possible.
- Never remove focus rings or disable zoom.
- Respect `prefers-reduced-motion`; do not rely on hover for essential information.
- Server components stay server-rendered; client boundaries remain limited to interactive application leaves.

## Pre-delivery checklist

- [ ] No emoji or generic AI logoography.
- [ ] All interactions retain existing behavior.
- [ ] Focus, hover, active, disabled, empty, warning, and success states remain legible.
- [ ] 375 / 768 / 1024 / 1440 responsive checks pass.
- [ ] Reduced motion is respected.
- [ ] No console errors, type errors, lint errors, or failing tests.
