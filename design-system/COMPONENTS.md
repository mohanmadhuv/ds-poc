# SaaS POC — Approved Component Set

> Exactly 30 component families are approved for this POC.
> These names are brand- and library-agnostic. The active adapter (see `design-system/ACTIVE.md`) is authoritative for exact React APIs, install commands, and supported variants — this file describes **product intent, selection logic, and composition**, not any specific library's prop signatures.

## Component-selection rule

Before creating custom UI:

1. identify the user's task;
2. identify the interaction pattern;
3. choose from this approved set;
4. read the active adapter's doc (`design-system/adapters/<name>.md`) for the current API and, for families it doesn't ship natively, its documented composition recipe;
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

Pairs with: Dialog, form inputs, DataTable toolbar, Notification.

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
- prefer a text Button for unfamiliar or high-consequence actions.

### 03. Menu
**Purpose:** lower-frequency contextual actions.

Use for:
- row actions
- edit / duplicate / archive / revoke / delete clusters

Rules:
- never hide the primary task inside a menu;
- destructive menu actions still require confirmation where consequences are meaningful.

---

## B. Form inputs and configuration

### 04. TextField
**Purpose:** short free-form value.

Use for names, titles, identifiers, short configuration values.

Required: label; validation/helper text when relevant.

### 05. TextArea
**Purpose:** longer free-form content.

Use for descriptions, notes, messages, rationale.

Do not use for structured data that should be separate fields.

### 06. NumberField
**Purpose:** numeric input with numeric semantics.

Use for quantities, thresholds, limits, capacities.

Define units in label/helper text where ambiguity is possible.

### 07. Select
**Purpose:** conventional single selection inside a form.

Use when a native-like bounded single choice is sufficient.

Prefer RadioGroup when a very small set benefits from visible comparison.

### 08. ComboBox
**Purpose:** richer bounded single selection, typically with search.

Use when options are better presented through a searchable list interaction than a compact Select.

Do not use for genuinely free-form search over an open-ended corpus.

### 09. MultiSelect
**Purpose:** choose several options from a bounded set.

Use for tags, teams, regions, statuses, permissions when independent multi-choice is meaningful.

Avoid when the option set is enormous and requires a different discovery model.

### 10. Checkbox
**Purpose:** independent boolean or multi-choice selection.

Use for optional choices that can coexist.

Do not use a lone checkbox to represent an immediate system setting when Switch communicates the state more clearly.

### 11. RadioGroup
**Purpose:** exactly one choice from a small visible set.

Use when users benefit from comparing all choices before deciding.

### 12. Switch
**Purpose:** immediate on/off setting.

Use for reversible settings with an understandable resulting state.

Do not use as a substitute for a Submit action.

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
`Search + filters + DataTable + Badge + Menu + Pagination`

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

### 17. Badge
**Purpose:** concise status or categorical metadata.

Use for:
- active / invited / suspended
- severity
- environment
- deployment state

Rules:
- text must carry meaning without color;
- avoid badge overload.

### 18. Card
**Purpose:** grouped summary, contained object, or small decision surface.

Use for:
- KPI summaries
- high-level resource summary
- small option sets when card semantics fit

Do not use cards as the default representation for records that should be compared in columns.

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

### 21. Dialog
**Purpose:** focused short task, decision, or confirmation without leaving page context.

Strong uses:
- invite member
- short edit form
- confirm a non-destructive decision

For destructive confirmation specifically, use the adapter's dedicated destructive-confirmation treatment (an "alert dialog" variant) rather than a generic Dialog — see the active adapter's family binding.

Avoid for:
- long multi-step creation
- dense review workflows
- tasks that require substantial page context

### 22. Notification
**Family includes:** inline and transient (toast) notification variants available in the active adapter.

**Purpose:** communicate system feedback and important state.

Use inline when feedback belongs to a region/form.
Use a transient/toast notification when short-lived global confirmation is appropriate.

Do not stack repetitive success notifications for trivial actions.

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

### 27. AppShell
**Family includes:** the persistent navigation/identity primitives required to form the stable application shell (a header and/or a collapsible side navigation).

**Purpose:** global product navigation and identity.

Rules:
- keep the shell stable across generated scenarios;
- feature prompts should usually change the page body, not reinvent navigation;
- do not turn local filters into shell-level navigation.

---

## F. Data visualization

Data visualization uses whatever chart binding the active adapter declares (see its family-binding table), following `design-system/DESIGN.md` §7.

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

`AppShell + Breadcrumb + page header + Search + filter controls + DataTable + Badge + Menu + Pagination + Dialog + Notification`

Use for members, customers, devices, invoices, environments, integrations, jobs.

## Monitoring and operations

`AppShell + page header + Card summaries + BarChart/LineChart when justified + Tabs + filters + DataTable + Badge + Notification`

Use for incidents, services, deployments, jobs, usage, reliability.

## Multi-step creation

`AppShell + Breadcrumb + page header + ProgressIndicator + grouped form inputs + validation + review step + Button + Notification`

Use for deploying an application, creating an environment, onboarding an integration, configuring a policy.

## Settings/detail

`AppShell + Breadcrumb + page header + Tabs + form inputs + Switch/Checkbox + Accordion for advanced options + Button + Notification`

Use for configuration, permissions, integration settings, account policies.
