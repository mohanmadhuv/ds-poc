# Carbon Agentic POC Instruction Pack

## Purpose
This folder turns product-design guidance into persistent repository instructions for Codex.

## Installation
Copy `AGENTS.md` and the `agent/` directory into the root of the repository where Codex will work.

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
└── ...application files
```

Codex automatically discovers `AGENTS.md` instructions by directory scope. Keep the root file concise and move detailed knowledge into referenced docs.

## Recommended first Codex task
After installing this pack, ask Codex to inspect the repo rather than immediately generate a demo screen:

> Read AGENTS.md and every referenced file under agent/. Inspect the current repository, installed Carbon packages, app architecture, styling setup, and reusable components. Do not implement a feature yet. Create a short readiness report identifying what already exists, what Carbon packages/versions are installed, how pages are structured, what validation commands are available, and the minimum setup required for this POC.

Then use the result to update these instruction files to match the actual codebase.

The current `/playground` is intentionally a stable placeholder. Do not connect a free-form prompt directly to JSX generation until the pattern, UI-plan, generation, and validation contracts are implemented and observable.

## Important
This first version encodes design intent and pattern selection. It intentionally does not hard-code exact Carbon React prop signatures because those should be derived from the version installed in the repository.
