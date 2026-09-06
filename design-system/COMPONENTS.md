# Carbon SaaS POC — Approved Component Set

> Exactly 30 component families are approved for the first POC.
> Use these deeply before expanding the inventory.

The installed Carbon packages are authoritative for exact React APIs and supported variants. This file describes **product intent, selection logic, and composition**, not prop signatures.

## Component-selection rule

Before creating custom UI:

1. identify the user's task;
2. identify the interaction pattern;
3. choose from this approved set;
4. inspect the installed Carbon Storybook/package for the current API;
5. compose components according to `agent/04-composition-rules.md`.

---

## A. Actions

### 01. Button
**Purpose:** explicit labeled action.

Use for:
- primary page action
- form submission
- confirmation
- secondary action

Rules:
- one clear primary action per decision area;
- use destructive treatment only for truly destructive actions;
- do not use a Link when state is mutated.

Pairs with: Modal, Form inputs, DataTable toolbar, Notification.

### 02. IconButton
**Purpose:** compact action where the icon is conventional and space is constrained.

Use for:
- close
- refresh
- settings
- view details where the icon is unambiguous

Rules:
- accessible name required;
- tooltip where needed for comprehension;
- prefer text Button for unfamiliar or high-consequence actions.

### 03. OverflowMenu
**Purpose:** lower-frequency contextual actions.

Use for:
- row actions
- edit / duplicate / archive / revoke / delete clusters

Rules:
- never hide the primary task inside overflow;
- destructive menu actions still require confirmation where consequences are meaningful.

---

## B. Form inputs and configuration

### 04. TextInput
**Purpose:** short free-form value.

Use for names, titles, identifiers, short configuration values.

Required: label; validation/helper text when relevant.

### 05. TextArea
**Purpose:** longer free-form content.

Use for descriptions, notes, messages, rationale.

Do not use for structured data that should be separate fields.

### 06. NumberInput
**Purpose:** numeric input with numeric semantics.

Use for quantities, thresholds, limits, capacities.

Define units in label/helper text where ambiguity is possible.

### 07. Select
**Purpose:** conventional single selection inside a form.

Use when a native-like bounded single choice is sufficient.

Prefer RadioButtonGroup when a very small set benefits from visible comparison.

### 08. Dropdown
**Purpose:** richer bounded single selection.

Use when options are better presented through Carbon's dropdown interaction than a compact Select.

Do not use for free-form search.

### 09. MultiSelect
**Purpose:** choose several options from a bounded set.

Use for tags, teams, regions, statuses, permissions when independent multi-choice is meaningful.

Avoid when the option set is enormous and requires a different discovery model.

### 10. Checkbox
**Purpose:** independent boolean or multi-choice selection.

Use for optional choices that can coexist.

Do not use a lone checkbox to represent an immediate system setting when Toggle communicates the state more clearly.

### 11. RadioButtonGroup
**Purpose:** exactly one choice from a small visible set.

Use when users benefit from comparing all choices before deciding.

### 12. Toggle
**Purpose:** immediate on/off setting.

Use for reversible settings with an understandable resulting state.

Do not use as a substitute for a Submit button.

### 13. DatePicker
**Purpose:** date or date-range input.

Use for scheduling, reporting ranges, expiration dates, filters.

Do not emulate a date picker with a plain text field.

---

## C. Discovery and data display

### 14. Search
**Purpose:** keyword discovery within a meaningful corpus.

Use for:
- table records
- member lists
- resources
- configuration catalogs

Search should visibly affect a defined content region.

### 15. DataTable
**Purpose:** scan, compare, sort, select, and act on structured records.

Use when multiple records share attributes.

Typical composition:
`Search + filters + DataTable + Tag + OverflowMenu + Pagination`

Rules:
- accessible table name required;
- use meaningful columns;
- row actions belong near the record;
- do not turn every value into a colorful badge;
- use batch selection only when batch action is real.

### 16. Pagination
**Purpose:** navigate large result sets.

Use with DataTable when record count justifies paging.

Do not paginate tiny demo datasets merely to show the component.

### 17. Tag
**Purpose:** concise status or categorical metadata.

Use for:
- active / invited / suspended
- severity
- environment
- deployment state

Rules:
- text must carry meaning without color;
- avoid tag overload.

### 18. Tile
**Purpose:** grouped summary, contained object, or small decision surface.

Use for:
- KPI summaries
- high-level resource summary
- small option sets when tile semantics fit

Do not use tiles as the default representation for records that should be compared in columns.

### 19. Tabs
**Purpose:** switch between peer views while preserving context.

Use for:
- overview / activity / settings
- incidents / alerts / maintenance

Do not use for sequential workflow steps.

### 20. Accordion
**Purpose:** reveal optional grouped information.

Use for advanced settings, secondary explanations, or dense reference material.

Do not hide information required to complete the primary task.

---

## D. Overlays, feedback, and workflow state

### 21. Modal
**Purpose:** focused short task, decision, or confirmation without leaving page context.

Strong uses:
- invite member
- confirm revoke access
- confirm delete
- short edit form

Avoid for:
- long multi-step creation
- dense review workflows
- tasks that require substantial page context

### 22. Notification
**Family includes:** inline and toast notification variants available in installed Carbon.

**Purpose:** communicate system feedback and important state.

Use inline when feedback belongs to a region/form.
Use toast when short-lived global confirmation is appropriate.

Do not stack repetitive success toasts for trivial actions.

### 23. Loading
**Purpose:** communicate ongoing processing.

Prefer localized loading for localized operations.
Avoid blocking the whole application for a row-level mutation.

### 24. Skeleton
**Purpose:** preserve expected content structure while data loads.

Use when layout is known and initial content retrieval is non-instant.

Prefer skeleton over an unrelated spinner when users benefit from understanding page structure.

### 25. ProgressIndicator
**Purpose:** communicate position in a multi-step task.

Use for flows with meaningful sequential stages.

Do not use for tabs, filters, or single forms.

---

## E. Navigation and application structure

### 26. Breadcrumb
**Purpose:** communicate hierarchical location.

Use when users can arrive several levels deep in an information architecture.

Omit when hierarchy is flat and the breadcrumb adds no orientation value.

### 27. UI Shell
**Family includes:** Carbon Header and SideNav primitives required to form the stable application shell.

**Purpose:** global product navigation and identity.

Rules:
- keep shell stable across generated scenarios;
- feature prompts should usually change the page body, not reinvent navigation;
- do not turn local filters into side navigation.

---

## F. Data visualization

Data visualization uses `@carbon/charts-react` and follows `design-system/DESIGN.md`.

### 28. BarChart
**Purpose:** compare discrete categories.

Good questions:
- which service has most incidents?
- which region has highest usage?
- how do categories compare this period?

Prefer horizontal bars when category labels are long.

### 29. LineChart
**Purpose:** show trend over an ordered continuous domain, usually time.

Good questions:
- how has volume changed over 30 days?
- is latency trending upward?
- what happened before an incident?

Do not use when the x-axis is merely unrelated categories.

### 30. DonutChart
**Purpose:** communicate a small parts-of-whole relationship.

Good questions:
- what proportion of incidents are critical/high/medium/low?
- what share of resources are active/paused/failed?

Rules:
- keep category count small;
- do not use for precise comparison;
- prefer BarChart or DataTable when exactness matters.

---

# Approved SaaS compositions

These are recipes, not templates.

## Record management

`UI Shell + Breadcrumb + page header + Search + filter controls + DataTable + Tag + OverflowMenu + Pagination + Modal + Notification`

Use for members, customers, devices, invoices, environments, integrations, jobs.

## Monitoring and operations

`UI Shell + page header + Tile summaries + BarChart/LineChart when justified + Tabs + filters + DataTable + Tag + Notification`

Use for incidents, services, deployments, jobs, usage, reliability.

## Multi-step creation

`UI Shell + Breadcrumb + page header + ProgressIndicator + grouped form inputs + validation + review step + Button + Notification`

Use for deploying an application, creating an environment, onboarding an integration, configuring a policy.

## Settings/detail

`UI Shell + Breadcrumb + page header + Tabs + form inputs + Toggle/Checkbox + Accordion for advanced options + Button + Notification`

Use for configuration, permissions, integration settings, account policies.
