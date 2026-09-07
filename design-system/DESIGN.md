# SaaS POC — Design Contract

> Agent-facing source of truth for visual language and token usage.
> This document is brand- and library-agnostic. Runtime source of truth for exact values is always the active adapter — see `design-system/ACTIVE.md`.

## 1. Scope

This POC is an enterprise SaaS product. It should support high-density product work such as administration, operations monitoring, configuration, analytics, and multi-step workflows.

This document defines the design decisions the coding agent must follow. It does **not** duplicate any specific component library's token values or component names. `design-system/ACTIVE.md` names the currently plugged-in design system; `design-system/adapters/<name>.md` is the authoritative source for its real values and APIs.

## 2. One-format rule

For this POC, maintain design context in Markdown only.

- Agent design context: `design-system/DESIGN.md` (this file)
- Component context: `design-system/COMPONENTS.md`
- Active-system pointer: `design-system/ACTIVE.md`
- Interaction/composition context: existing files under `agent/`
- Runtime UI, icons, and data visualization: whatever the active adapter (`design-system/adapters/<name>.md`) declares

Do not create parallel design-token systems (a second Tailwind theme, a second JSON token file, a second CSS-variable map) alongside the active adapter's own token system unless a later task explicitly requires it.

Reason: one human-readable source plus the active adapter's implementation package minimizes drift and gives the agent fewer conflicting truths.

## 3. Product character

The interface should feel:

- precise
- operational
- calm
- data-literate
- compact without becoming cramped
- consistent rather than decorative
- optimized for repeated use by knowledgeable users

The interface should **not** feel:

- like a marketing site
- like a generic AI dashboard
- glassmorphic
- gradient-heavy
- excessively rounded
- card-heavy without information-architecture justification
- decorative at the expense of scanability

## 4. Theme

Default demo theme: a light theme suitable for enterprise SaaS, expressed entirely through the active adapter's token system (see `design-system/adapters/<name>.md` §3 "Token binding").

Do not hard-code hex values to imitate a theme. If a brand or later task requires dark mode, add it as an additional token set in the active adapter's theme file — do not invent a parallel styling mechanism to get there.

## 5. Token policy

### 5.1 Rule

Use the active adapter's semantic tokens or component defaults. Never invent a visual value when the adapter already expresses the role.

The agent should choose tokens by **semantic role**, not by visually matching a raw value.

### 5.2 Color roles

Every adapter must bind these roles (see the active adapter's §3 "Token binding" for the concrete values):

| Role | Use |
|---|---|
| background | application canvas |
| layer | primary content surfaces |
| layer-accent | nested/subordinate surfaces |
| field | input surfaces when applicable |
| text-primary | primary readable content |
| text-secondary | supporting content |
| text-placeholder | placeholder content |
| text-helper | helper/instructional text |
| text-error | validation/error copy |
| icon-primary | primary icons |
| icon-secondary | secondary icons |
| icon-interactive | actionable icons |
| border-subtle | structural separation |
| border-strong | emphasized boundaries |
| link-primary | links |
| focus | keyboard focus indication |
| interactive | primary interactive emphasis |
| support-error | errors/destructive feedback |
| support-success | success feedback |
| support-warning | warnings |
| support-info | informational feedback |

Rules:
- Never use color as the only carrier of status.
- Prefer the active adapter's component-level status treatment over custom color styling.
- Do not create brand accent colors for this POC.
- Do not create decorative gradients.

### 5.3 Spacing

Use the active adapter's spacing scale only (see its token binding table). Do not use arbitrary values (e.g. a raw `13px`, or an unscaled arbitrary-bracket utility) to visually patch a layout.

Layout intent:
- tight equivalent spacing for closely related controls/content
- a mid-scale step between meaningful groups
- the largest scale steps between major page regions

The adapter's token/scale step name, not any specific pixel number, is the implementation authority.

### 5.4 Typography

Use the active adapter's type scale. Prefer semantic type roles equivalent to:

| Role | Type intent |
|---|---|
| page title | largest heading step used for a page `<h1>` |
| section title | next heading step down |
| subsection title | next heading step down again |
| component heading | smallest heading step |
| body | default body text size |
| compact table/control text | the adapter's smallest comfortable body size |
| label | form/field label size |
| helper text | secondary/muted small text |

Rules:
- Do not create custom font families beyond what `design-system/ACTIVE.md` declares as the current brand font.
- Do not use arbitrary font sizes/weights outside the adapter's type scale.
- Keep hierarchy shallow. Most SaaS pages should need only page, section, body, label, and helper levels.
- Avoid oversized marketing typography inside the application shell — the one exception is a documentation/mission-style page (like `/`), where a single larger, lighter display heading is acceptable because the page is explicitly a doc front page, not a working product screen.

### 5.5 Shape and elevation

The active adapter's component geometry is authoritative.

- Do not globally override border radii to make the adapter look like a different design system.
- Do not add custom shadows to ordinary tiles, tables, forms, or panels beyond what the adapter's own components already apply.
- Prefer layers, borders, spacing, and hierarchy over floating-card elevation.
- Use overlays only through the adapter's own overlay components (Dialog/AlertDialog family).

### 5.6 Icons

Use one icon set only, as declared by the active adapter — do not mix icon libraries.

- Pair unfamiliar icon-only actions with accessible labels/tooltips.
- Do not use icons decoratively when they add no meaning.

### 5.7 Motion

Prefer motion already provided by the active adapter's components.

Custom motion must be functional: state change, hierarchy, navigation continuity, or feedback. No decorative entrance choreography in application screens.

## 6. Layout contract

### Application shell

A generated feature should live inside the stable AppShell (see `design-system/COMPONENTS.md` family "AppShell") rather than re-inventing navigation per prompt.

Default hierarchy:

1. persistent navigation shell (sidebar/header)
2. page header / breadcrumb region
3. task-specific controls
4. primary content region
5. contextual feedback / overlays

### Page width

Prefer the active adapter's responsive layout conventions. Do not center the application in a narrow marketing-site container when the task benefits from horizontal data density.

### Density

- Tables and monitoring pages may be information-dense.
- Forms should be progressively grouped and readable.
- Summary tiles/cards are for high-level signals, not a replacement for structured records.
- White space should clarify relationships, not create visual spectacle.

## 7. Data visualization contract

Use the active adapter's declared chart binding only (see its family-binding table for BarChart/LineChart/DonutChart).

Approved chart families:

1. Bar chart — compare values across discrete categories.
2. Line chart — show change/trend across an ordered continuous domain such as time.
3. Donut chart — show a small number of parts of a whole when exact comparison is not the primary task.

Rules:
- Do not generate a chart because a dashboard "looks empty."
- Every chart must answer a specific question implied by the user's request.
- Prefer a table when exact values and comparison are more important than shape/trend.
- Do not use donut charts for many categories.
- Provide useful labels/tooltips and an accessible textual interpretation when practical.
- Match the chart theme to the active adapter's application theme.

## 8. State contract

When a task implies data or mutation, design beyond the happy path.

Consider:
- loading
- empty
- no search/filter results
- partial data
- validation error
- system error
- success confirmation
- permission denied / disabled action
- destructive confirmation

Do not display every state simultaneously. Implement the states relevant to the workflow and make them reachable through demo fixtures where valuable.

## 9. Accessibility contract

- Every input has a visible or programmatically associated label.
- Every icon-only control has an accessible name.
- Every table has an accessible name/description where meaningful.
- Focus must remain visible.
- Keyboard interaction must not be broken by custom wrappers.
- Do not rely on color alone for meaning.
- Preserve the active adapter's built-in semantics instead of replacing them with div-based clones.

## 10. Custom UI escape hatch

A custom component may be created only when all are true:

1. no approved family in `design-system/COMPONENTS.md`, and no composition recipe in the active adapter's doc, solves the task;
2. the requirement is necessary to the requested workflow;
3. it uses the active adapter's tokens and accessibility conventions;
4. it is documented as a gap in the active adapter's "Known gaps" section;
5. the agent explains the gap in its completion summary.

For the live POC, this should be rare.
