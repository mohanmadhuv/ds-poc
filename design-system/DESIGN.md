# Carbon SaaS POC — Design Contract

> Agent-facing source of truth for visual language and token usage.
> Runtime source of truth remains the installed Carbon packages.

## 1. Scope

This POC is an enterprise SaaS product built with IBM Carbon Design System. It should support high-density product work such as administration, operations monitoring, configuration, analytics, and multi-step workflows.

This document defines the design decisions the coding agent must follow. It does **not** duplicate Carbon's token values. The installed Carbon package is authoritative for actual values.

## 2. One-format rule

For this POC, maintain design context in Markdown only.

- Agent design context: `design-system/DESIGN.md`
- Component context: `design-system/COMPONENTS.md`
- Interaction/composition context: existing files under `agent/`
- Runtime UI: `@carbon/react`
- Runtime data visualization: `@carbon/charts-react`
- Runtime icons: Carbon icons supplied with `@carbon/react`

Do not create parallel Tailwind tokens, JSON design tokens, custom CSS-variable token maps, or another design-system abstraction unless a later task explicitly requires it.

Reason: one human-readable source plus Carbon's implementation package minimizes drift and gives the agent fewer conflicting truths.

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

Default demo theme: a light Carbon theme suitable for enterprise SaaS.

Prefer Carbon `g10` where supported by the installed version because it provides a subtle application canvas with layered content surfaces. If the installed package or project shell already uses another Carbon light theme, preserve that theme rather than creating a custom one.

Do not hard-code hex values to imitate Carbon themes.

## 5. Token policy

### 5.1 Rule

Use Carbon semantic tokens or component defaults. Never invent a visual value when Carbon already expresses the role.

The agent should choose tokens by **semantic role**, not by visually matching a raw value.

### 5.2 Color roles

Use the installed Carbon equivalents for these roles:

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
- Prefer Carbon's component-level status treatment over custom color styling.
- Do not create brand accent colors for this POC.
- Do not create decorative gradients.

### 5.3 Spacing

Use Carbon spacing tokens only.

Prefer the installed equivalents of:

- spacing-02: very small inline separation
- spacing-03: compact internal gap
- spacing-04: related control gap
- spacing-05: standard component/content gap
- spacing-06: section-internal spacing
- spacing-07: section separation
- spacing-08/09: major page separation

Do not use arbitrary values such as `13px`, `18px`, `27px`, or one-off margins to visually patch a layout.

Layout intent:
- 8–16px equivalent spacing for tightly related controls/content
- 24–32px equivalent spacing between meaningful groups
- 40–48px equivalent spacing between major page regions

The Carbon token name, not these approximate numbers, is the implementation authority.

### 5.4 Typography

Use Carbon type styles. Prefer semantic type roles equivalent to:

| Role | Carbon type intent |
|---|---|
| page title | heading-04 / appropriate product heading |
| section title | heading-03 |
| subsection title | heading-02 |
| component heading | heading-01 |
| body | body-01 |
| compact table/control text | body-compact-01 |
| label | label-01 |
| helper text | helper-text-01 |

Rules:
- Do not create custom font families.
- Do not use arbitrary font sizes/weights.
- Keep hierarchy shallow. Most SaaS pages should need only page, section, body, label, and helper levels.
- Avoid oversized marketing typography inside the application shell.

### 5.5 Shape and elevation

Carbon component geometry is authoritative.

- Do not globally add border radii to make Carbon look like another design system.
- Do not add custom shadows to ordinary tiles, tables, forms, or panels.
- Prefer layers, borders, spacing, and hierarchy over floating-card elevation.
- Use overlays only through approved Carbon components such as Modal.

### 5.6 Icons

Use Carbon icons only.

- Do not mix icon libraries.
- Pair unfamiliar icon-only actions with accessible labels/tooltips.
- Do not use icons decoratively when they add no meaning.

### 5.7 Motion

Prefer motion already provided by Carbon components.

Custom motion must be functional: state change, hierarchy, navigation continuity, or feedback. No decorative entrance choreography in application screens.

## 6. Layout contract

### Application shell

A generated feature should live inside a stable SaaS shell rather than re-inventing navigation per prompt.

Default hierarchy:

1. global header
2. optional side navigation
3. page header / breadcrumb region
4. task-specific controls
5. primary content region
6. contextual feedback / overlays

### Page width

Prefer responsive Carbon grid/layout conventions. Do not center the application in a narrow marketing-site container when the task benefits from horizontal data density.

### Density

- Tables and monitoring pages may be information-dense.
- Forms should be progressively grouped and readable.
- Summary tiles are for high-level signals, not a replacement for structured records.
- White space should clarify relationships, not create visual spectacle.

## 7. Data visualization contract

Use `@carbon/charts-react` only for data visualization in the POC.

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
- Match the chart theme to the Carbon application theme.

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
- Every table has an accessible name/description as required by Carbon guidance.
- Focus must remain visible.
- Keyboard interaction must not be broken by custom wrappers.
- Do not rely on color alone for meaning.
- Preserve Carbon's built-in semantics instead of replacing them with div-based clones.

## 10. Custom UI escape hatch

A custom component may be created only when all are true:

1. no approved component or composition solves the task;
2. the requirement is necessary to the requested workflow;
3. it uses Carbon tokens and accessibility conventions;
4. it is documented as a gap in the design system;
5. the agent explains the gap in its completion summary.

For the live POC, this should be rare.
