# Design-system context

This folder is the high-level design contract for the SaaS POC. The design system itself is a plug-in — this folder separates what never changes (product rules, approved families) from what changes when you swap libraries or brands (the adapter).

## Source hierarchy

1. `ACTIVE.md` — which adapter is plugged in right now, and how to swap it
2. `DESIGN.md` — brand/library-agnostic visual language, token *roles*, layout, chart, and state contract
3. `COMPONENTS.md` — the approved 30 brand-agnostic component families and selection rules
4. `adapters/<name>.md` — the concrete binding of those families/roles to one real library (currently `adapters/shadcn.md`)
5. `active-system.json` — machine-readable twin of `ACTIVE.md`, consumed by `scripts/validate-design-system.mjs`
6. `../agent/03-pattern-registry.md` — user-task patterns
7. `../agent/08-saas-patterns.md` — reusable SaaS compositions
8. `../agent/09-generation-validation-protocol.md` — generation and validation pipeline
9. `../agent/04-composition-rules.md` — component composition decisions
10. the active adapter's installed packages — exact runtime API and values

## Why this split exists

`DESIGN.md` and `COMPONENTS.md` are written entirely at the semantic level — "a primary interactive color", "a Dialog family" — so they never need to change when the underlying library changes. Everything library-specific (exact component names, import paths, install commands, composition recipes for families the library doesn't ship natively) lives in one adapter file. Swapping the design system means writing a new adapter and flipping `ACTIVE.md`; it does not mean rewriting the agent instructions.

## Deliberate exclusions for V2

Do not maintain parallel:
- a second Tailwind (or equivalent) theme
- a second custom CSS-variable token map
- a second JSON token file
- a Figma-exported token file

Those can be introduced later only if the POC proves a need. For now, the active adapter owns implementation values and Markdown owns agent guidance.
