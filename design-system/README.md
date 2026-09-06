# Design-system context

This folder is the high-level design contract for the Carbon SaaS POC.

## Source hierarchy

1. `DESIGN.md` — visual language, token policy, layout, charts, states, accessibility
2. `COMPONENTS.md` — approved 30 component families and selection rules
3. `../agent/03-pattern-registry.md` — user-task patterns
4. `../agent/04-composition-rules.md` — component composition decisions
5. installed Carbon packages — exact runtime API and values

## Deliberate exclusions for V2

Do not maintain parallel:
- Tailwind theme
- custom CSS variable token map
- JSON token file
- Figma-exported token file

Those can be introduced later only if the POC proves a need. For now, Carbon owns implementation values and Markdown owns agent guidance.
