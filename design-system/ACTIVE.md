# Active design system

> Read this file first, before `DESIGN.md` or `COMPONENTS.md`. It tells you which adapter is plugged in right now.

**Active adapter:** shadcn/ui
**Adapter doc:** [`design-system/adapters/shadcn.md`](./adapters/shadcn.md)
**Machine-readable manifest:** [`design-system/active-system.json`](./active-system.json)
**Runtime shell:** Next.js (App Router) + Tailwind CSS, deployed on Vercel.
**Brand:** unbranded default (shadcn's neutral base palette, Inter typeface). Swap tokens in `src/app/globals.css` and the font in `src/app/layout.tsx` to apply a brand.

## What "active" means

- `design-system/DESIGN.md` and `design-system/COMPONENTS.md` are brand- and library-agnostic. They define *roles* (a "primary interactive color", a "Dialog family") and *rules* (when to use a Dialog vs an AlertDialog), never a specific package.
- The adapter named above is the only place those roles resolve to real components, imports, and install commands. `agent/02-component-registry.md` tells you to read the adapter before writing implementation code.
- `scripts/validate-design-system.mjs` reads `active-system.json` to know which dependencies are required/forbidden — it does not hardcode a library name.

## Swapping the design system

1. Write a new adapter file at `design-system/adapters/<name>.md`, following the structure in [`design-system/adapters/TEMPLATE.md`](./adapters/TEMPLATE.md) — one entry per family in `COMPONENTS.md`, mapped to the new library's real components.
2. Update the fields above (adapter, doc link) and `active-system.json` (`name`, `adapterDoc`, `requiredDependencies`, `forbiddenDependencies`, `componentSourceDir`) to point at the new adapter.
3. Install the new library, remove the old one, and rebuild `src/app/**/page.tsx` and `src/components/*` against the new adapter's bindings.
4. Do **not** edit `agent/*.md` or `design-system/COMPONENTS.md` for this — if you find yourself needing to, the family/pattern registry has a real gap, not a branding problem.

## History

- Previously plugged: IBM Carbon Design System (`@carbon/react`, `@carbon/charts-react`, Vite). Fully removed — no Carbon code, dependencies, or fonts remain in this repo.
