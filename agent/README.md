# Agentic POC Instruction Pack

## Purpose

This folder turns product-design guidance into persistent repository instructions for a coding agent. The design system these instructions target is a plug-in — see `design-system/ACTIVE.md` for which one is active right now (currently shadcn/ui on Next.js + Tailwind CSS). Nothing in this folder or in `design-system/COMPONENTS.md`/`design-system/DESIGN.md` names a specific library; that binding lives entirely in `design-system/adapters/<name>.md`.

## Installation

Copy `AGENTS.md` and the `agent/` directory into the root of the repository where the coding agent will work.

Expected structure:

```text
repo/
├── AGENTS.md
├── agent/
│   ├── 01-design-principles.md
│   ├── 02-component-registry.md
│   ├── 03-pattern-registry.md
│   ├── 04-composition-rules.md
│   ├── 05-planning-protocol.md
│   ├── 06-validation-checklist.md
│   ├── 07-demo-scenarios.md
│   ├── 08-saas-patterns.md
│   └── 09-generation-validation-protocol.md
├── design-system/
│   ├── ACTIVE.md
│   ├── active-system.json
│   ├── DESIGN.md
│   ├── COMPONENTS.md
│   └── adapters/
│       ├── TEMPLATE.md
│       └── shadcn.md
└── ...application files
```

The coding agent automatically discovers `AGENTS.md` instructions by directory scope. Keep the root file concise and move detailed knowledge into referenced docs.

## Recommended first task for a new agent

After installing this pack, ask the agent to inspect the repo rather than immediately generate a demo screen:

> Read AGENTS.md and every referenced file under agent/ and design-system/. Inspect the current repository, the active design-system adapter, app architecture, styling setup, and reusable components. Do not implement a feature yet. Create a short readiness report identifying what already exists, which adapter is plugged in, how pages are structured, what validation commands are available, and the minimum setup required for this POC.

Then use the result to confirm these instruction files still match the actual codebase.

The current `/playground` is intentionally a stable reference implementation. Do not connect a free-form prompt directly to JSX generation until the pattern, UI-plan, generation, and validation contracts are implemented and observable.

## Swapping the design system

To point this instruction pack at a different component library or brand, do not edit `agent/*.md` or `design-system/COMPONENTS.md`. Instead, write a new adapter following `design-system/adapters/TEMPLATE.md` and flip `design-system/ACTIVE.md` to it — see that file for the full procedure.

## Important

This instruction pack encodes design intent and pattern selection at a brand-agnostic level. It intentionally does not hard-code any specific library's exact component prop signatures — those live in the active adapter doc and should be derived from the version installed in the repository.
