# Adapter template — `design-system/adapters/<name>.md`

Copy this file to `design-system/adapters/<your-system-name>.md` and fill in every section before flipping `design-system/ACTIVE.md` and `design-system/active-system.json` to point at it. An adapter's job is to bind the 30 brand-agnostic families in `design-system/COMPONENTS.md` to one real, installable library — nothing in `agent/*.md` or `COMPONENTS.md` should need to change when you do this.

## 1. Identity

- **Name:** (short id used in `active-system.json`, e.g. `shadcn`, `mui`, `acme-brand`)
- **Base library:** the underlying primitive/headless layer, if any (e.g. Radix UI, React Aria)
- **Styling engine:** how visual tokens are expressed (e.g. Tailwind CSS, CSS Modules, styled-components)
- **Runtime shell:** the app framework this adapter assumes (Next.js, Remix, plain Vite, ...)

## 2. Install

Exact commands to get from a bare app to this adapter working: package installs, CLI init commands, config files created, path aliases required.

## 3. Token binding

For each semantic role in `design-system/DESIGN.md` section 5.2 (background, layer, text-primary, border-subtle, interactive, support-error, ...), state the concrete token/variable/class that expresses it in this library. Do not restate the *rules* (DESIGN.md owns those) — only the binding.

## 4. Family binding

One row per family in `design-system/COMPONENTS.md`. For each: the real component name(s), where to import them from, the install/add command if the library is component-source-based (like shadcn), and — critically — a documented composition recipe for any family this library does not ship as a single primitive (state clearly what it's composed from, not "not supported").

| Family | Real component(s) | Import / add | Notes |
|---|---|---|---|
| Button | ... | ... | ... |
| ... | | | |

## 5. Known gaps

List families with no clean binding and no reasonable composition. These are legitimate candidates for the custom-UI escape hatch in `design-system/DESIGN.md` §10 — document the gap here so the next person doesn't rediscover it.

## 6. Validator hooks

Confirm `design-system/active-system.json` for this adapter lists: `componentSourceDir`, `componentImportPrefix`, `requiredDependencies`, `forbiddenDependencies` (name every other adapter/library you're replacing, so `scripts/validate-design-system.mjs` can catch drift), `buildCommand`, `typecheckCommand`, `lintCommand`.
