# 09 - Generation and Validation Protocol

This protocol defines how the Carbon agent turns a product request into a trustworthy interface. It is the execution contract for the V3 instruction layer.

## Thesis

The agent must demonstrate that it can:

1. understand product intent;
2. choose an appropriate SaaS interaction pattern;
3. compose only approved Carbon primitives and existing project components;
4. account for consequential states and accessibility;
5. validate the implementation before presenting it.

Generating JSX directly from a textbox is not the product thesis. A future playground may collect a workflow prompt, but it must first show or record the intermediate decisions that constrain generation.

## Required pipeline

```text
Prompt
  -> intent analysis
  -> primary/secondary pattern selection
  -> compact UI plan
  -> detailed UX plan
  -> Carbon implementation
  -> design-system validation
  -> presented experience
```

The steps are ordered. Do not skip from Prompt to JSX.

## Stage contracts

### 1. Intent analysis

Identify:

- primary user and goal;
- critical and secondary tasks;
- objects/data being managed;
- decisions the user must make;
- risky or destructive actions;
- feedback and exceptional states required by the workflow.

Output: normalized task intent, not a visual description.

### 2. Pattern selection

Select one primary pattern from `agent/08-saas-patterns.md`, with secondary patterns only when they directly support the primary task. Use `agent/03-pattern-registry.md` for broader task-pattern definitions.

Output: primary pattern, secondary patterns, and a short rationale grounded in the user goal.

### 3. UI plan

Produce the compact plan specified in `agent/05-planning-protocol.md` before writing JSX.

The plan is an implementation contract:

- `intents` become visible or reachable interactions;
- `pattern.primary` determines the page anatomy;
- `pattern.secondary` constrains supporting compositions;
- `composition` resolves to approved Carbon/project components;
- `states` become implementation and validation obligations.

Output: inspectable UI plan, with no hidden reasoning or chain-of-thought.

### 4. Detailed UX plan

Expand the UI plan only where needed to define information architecture, component reasons, state behavior, assumptions, and avoided anti-patterns. Follow the schema in `agent/05-planning-protocol.md`.

Output: concise implementation context that prevents semantic drift.

### 5. Carbon implementation

Implement the plan using:

- approved families in `design-system/COMPONENTS.md`;
- Carbon runtime packages as the API authority;
- existing project components and patterns;
- Carbon tokens and theme values;
- deterministic fixture data when a backend is out of scope.

Do not create a direct prompt-to-JSX path. Do not add decorative content, unapproved UI systems, or custom controls that duplicate Carbon.

### 6. Design-system validation

Run `pnpm validate:design-system` and the manual checklist in `agent/06-validation-checklist.md`.

Validation must confirm:

- plan intents are implemented;
- selected patterns are recognizable;
- composition uses approved Carbon/project components;
- token discipline is preserved;
- destructive actions have consequence-aware confirmation;
- loading, empty, no-results, error, success, and permission states are handled when implied;
- labels, names, focus, and keyboard behavior remain accessible;
- Search and filters affect the intended dataset;
- typecheck, lint, and build pass.

Output: validated experience plus concise design-system provenance where the POC supports it.

## Generation gates

The agent must stop and repair before proceeding when:

- no primary pattern can be justified;
- the UI plan is missing or materially inconsistent with the request;
- a composition item has no Carbon/project resolution;
- a required state has no implementation path;
- a destructive action lacks confirmation;
- the validator or required code-quality checks fail.

If the user changes the request, regenerate intent analysis, pattern selection, and the UI plan before modifying JSX.

## Playground boundary

The current `/playground` remains a stable placeholder for future generated scenarios. A later dynamic playground may include:

```text
Describe a product workflow -> Build -> generated experience
```

When that work begins, the prompt submission must produce the plan and validation artifacts as part of the generation workflow. A textbox must not call an unconstrained code generator and render its output directly.
