# 08 - SaaS Composition Patterns

This catalog defines reusable compositions for common enterprise SaaS tasks. Select a primary pattern before selecting individual components. Use the active adapter (`design-system/ACTIVE.md` → `design-system/adapters/<name>.md`) as the runtime authority for exact APIs.

## Pattern selection rules

- Choose one primary pattern that represents the user's main goal.
- Add secondary patterns only when they support that goal directly.
- Preserve the application shell and existing project conventions.
- Treat loading, empty, error, success, permission, and destructive states as part of the pattern when they apply.
- Use active-adapter components and tokens before creating custom UI.

## P01 - Record management

### User intent

Manage a collection of comparable records: find one, inspect its status, perform a row action, create a record, or apply a justified batch action.

### Preferred composition

`AppShell + Breadcrumb (when hierarchical) + page header + Button + Search + filters + DataTable + Badge + Menu + Pagination (when warranted) + Dialog + Notification`

### Allowed variants

- Use a structured list instead of DataTable when records are few and comparison across columns is not important.
- Omit Pagination for small deterministic datasets.
- Use row selection and batch actions only when the product task includes a real bulk operation.
- Use a detail/inspection view or side panel when row attributes exceed useful table density.

### Required states

- Loading or Skeleton for initial retrieval.
- First-use empty state with the natural creation action.
- Search/filter no-results state with clear/reset guidance.
- Error state with retry or recovery guidance.
- Success feedback after create/update/batch actions.
- Permission-restricted state when management actions depend on role.
- Destructive confirmation for revoke, delete, archive, or equivalent actions.

### Anti-patterns

- Replacing comparable records with oversized cards.
- Showing every possible record attribute in the table.
- Hiding the primary create/manage action in a menu.
- Adding pagination to a tiny fixture dataset just to display the component.
- Using color-only status indicators.

### When not to use it

Do not use this pattern for a single object, a primarily sequential workflow, or an operational triage task where urgency and severity are the primary concerns.

## P02 - Search, filter, and results

### User intent

Locate relevant content or records efficiently by keyword and/or predefined criteria, understand the active query, and recover from no matches.

### Preferred composition

`page header + Search + Select/ComboBox/MultiSelect/DatePicker filters + clear/reset action + structured results (DataTable, list, or detail summary) + result count/status feedback`

### Allowed variants

- Use Search alone for meaningful keyword discovery without stable categorical criteria.
- Use filters alone for small bounded datasets with clear dimensions.
- Use DataTable when users compare result attributes; use a list when they scan sequential content.
- Preserve query and filters when opening and closing detail.

### Required states

- Initial state that explains the searchable scope.
- Loading state when results update asynchronously.
- Results state with active filter/query context.
- No-results state distinct from first-use empty, with adjustment guidance.
- Error state with retry or recovery action.
- Clear/reset behavior when Search and filters are combined.

### Anti-patterns

- Adding a search field to a trivially small dataset.
- Making filters invisible or impossible to reset.
- Using free-form Search as a substitute for bounded filters.
- Updating results in a way that loses the user's query context.
- Showing a generic "no data" message for filtered no-results.

### When not to use it

Do not use it when there is no meaningful corpus to search or narrow, or when the task is primarily configuring one object rather than discovering records.

## P03 - Create and edit form

### User intent

Enter or change a small, coherent group of related values and receive clear validation and completion feedback.

### Preferred composition

`page header or Dialog + labeled TextField/TextArea/NumberField + Select/ComboBox + Checkbox/RadioGroup/Switch as appropriate + Button + inline validation + Notification`

### Allowed variants

- Use a Dialog for a short, focused task with roughly three simple independent fields.
- Use a dedicated page for moderate or consequential forms.
- Use a supported panel pattern when preserving page context is important.
- Use Tabs only for peer groups of settings, not to disguise a multi-step workflow.
- Use Accordion only for optional advanced fields.

### Required states

- Clear labels, helper text, and initial values where applicable.
- Inline validation near the field with corrective guidance.
- Disabled or permission-restricted fields when the user cannot edit them.
- Submitting/loading state scoped to the form action.
- Success feedback after save.
- Error feedback when save fails, preserving entered values where possible.
- Unsaved-change or cancellation behavior when the form is consequential.

### Anti-patterns

- Unlabeled or placeholder-only inputs.
- A lone Switch used as a submit action.
- Vague actions such as "Submit" when "Save settings" is clearer.
- Hiding required instructions inside a tooltip or Accordion.
- Putting a complex workflow into a Dialog.

### When not to use it

Do not use a simple form for dependent configuration with meaningful review, multiple stages, or infrastructure/system-wide consequences. Use Multi-step creation instead.

## P04 - Multi-step creation flow

### User intent

Create or configure an object through dependent stages, understand progress, correct errors, review consequences, and complete an explicit final action.

### Preferred composition

`AppShell + Breadcrumb (when useful) + page header + ProgressIndicator + grouped form inputs + inline validation + Back/Next Buttons + review summary + final Button + Notification`

### Allowed variants

- Use two or more meaningful steps only when decisions depend on one another or cognitive load is high.
- Use a review step when choices have operational, financial, security, or infrastructure consequences.
- Use a dedicated page for substantial flows; use a supported panel only for moderate flows.
- Use Skeleton or local Loading during asynchronous option retrieval.

### Required states

- Current step and completion state.
- Per-field and per-step validation.
- Back navigation that preserves entered values.
- Loading and disabled states during asynchronous actions.
- Review state summarizing earlier decisions.
- Submit/deploy/create success state with next step.
- Submission error state that identifies recovery options.
- Permission or unavailable-option state when relevant.

### Anti-patterns

- Using Tabs as wizard steps.
- Splitting a short form into unnecessary stages.
- Requiring users to remember earlier choices instead of showing a review.
- Allowing the final action without clear consequence or review.
- Losing entered values after validation or navigation.

### When not to use it

Do not use it for a short, low-consequence form that can be completed in one coherent decision group.

## P05 - Detail and inspection view

### User intent

Understand one object in enough depth to make a decision or perform a contextual action without losing the originating list or query context.

### Preferred composition

`Breadcrumb (when hierarchical) + page header + status Badge + structured summary + Tabs for peer sections + Accordion for optional detail + contextual Button/Menu + Notification`

### Allowed variants

- Use a dedicated detail page for substantial information or deep navigation.
- Use a side panel when detail is secondary and preserving the list context matters.
- Use a Dialog only for compact detail or a focused decision.
- Use Tabs for peer sections such as Overview, Activity, and Settings.
- Use a timeline/history composition only when sequence is material to the task.

### Required states

- Loading or Skeleton for object retrieval.
- Not-found or deleted-object state.
- Partial-data state when some sections are unavailable.
- Permission-restricted state for sensitive detail or actions.
- Error state with retry or return-to-list action.
- Clear success/error feedback after contextual mutation.
- Preserved originating search/filter context when returning to results.

### Anti-patterns

- Repeating every table column without adding decision-making depth.
- Using a Dialog for long, multi-section detail.
- Hiding essential information in an Accordion.
- Removing list context when a panel or preserved navigation would suffice.
- Showing an action without identifying the object it affects.

### When not to use it

Do not use it when records are only scanned or compared and no deeper decision requires additional context.

## P06 - Operations dashboard

### User intent

Monitor system state, detect issues, prioritize work, inspect recent events, and drill into the records that need attention.

### Preferred composition

`AppShell + page header + freshness context + meaningful Card summaries + BarChart/LineChart when decision-relevant + Search/filters + DataTable + Badge + Tabs or detail view + Notification`

### Allowed variants

- Use Cards for a small number of actionable summary signals, not decorative KPIs.
- Use BarChart for category comparison, LineChart for ordered trends, and DonutChart only for a small parts-of-whole summary.
- Use Tabs for peer operational views such as Incidents, Alerts, and Maintenance.
- Use a detail page or panel for incident timeline and supporting evidence.
- Use a dense DataTable when records share comparable operational attributes.

### Required states

- Data freshness or last-updated context.
- Loading/Skeleton for initial metrics and records.
- No-incidents or no-alerts empty state.
- Filtered no-results state.
- Error state that identifies which region failed.
- Severity/status representation that does not rely on color alone.
- Detail loading/error state for drill-down.
- Success or acknowledgement feedback for operational actions.

### Anti-patterns

- Adding charts because the page looks empty.
- Using vanity metrics unrelated to user decisions.
- Making every operational value a Card.
- Relying on red/amber/green alone to communicate severity.
- Overloading the first view with full incident history.

### When not to use it

Do not use it for ordinary record administration, a one-object detail task, or a configuration workflow where monitoring is not the primary goal.

## P07 - Settings and configuration

### User intent

Change persistent product or system preferences, understand their scope and consequence, and know whether changes apply immediately or require saving.

### Preferred composition

`AppShell + Breadcrumb (when useful) + page header + Tabs for peer setting groups + labeled form controls + Switch/Checkbox + Accordion for optional advanced settings + Button + Notification`

### Allowed variants

- Use a single settings page when the scope is small and coherent.
- Use Tabs for peer groups such as General, Permissions, and Notifications.
- Use Switch for immediate, reversible changes with clear resulting state.
- Use explicit Save/Cancel actions for grouped changes.
- Use a destructive area with Dialog (destructive-confirmation variant) for irreversible settings.

### Required states

- Current saved value and scope of effect.
- Loading state for settings retrieval.
- Validation state for constrained values.
- Disabled or permission-restricted controls.
- Unsaved-change state when explicit save is required.
- Save success and save error feedback.
- Destructive confirmation when a setting deletes, revokes, or materially changes access/data.

### Anti-patterns

- Mixing unrelated settings without grouping by user mental model.
- Using Switches for changes that require a separate Submit action.
- Applying system-wide consequences without explanation or confirmation.
- Hiding important settings exclusively in Accordion sections.
- Treating Tabs as sequential configuration steps.

### When not to use it

Do not use it for creating a new object with dependent decisions or for one-off edits that belong in a focused form.

## P08 - Empty state and first-use onboarding

### User intent

Understand why content is absent and take the next useful action, such as creating the first object, connecting a source, or adjusting a query.

### Preferred composition

`page header + relevant content region + concise empty explanation + Button or Link to the natural next action + optional Notification or supporting helper text`

### Allowed variants

- First-use empty: explain what the product will contain and offer creation/onboarding.
- No-results empty: reflect the active Search/filters and offer reset/adjustment.
- Deleted/removed empty: explain the absence and provide recovery/navigation when supported.
- Unavailable empty: explain access or service limitation and identify who can resolve it.
- Use a Card only when it is the product's existing empty-state container, not as decoration.

### Required states

- Clear distinction between first-use, no-results, deleted, and unavailable states.
- A relevant next action when one exists.
- Accessible text explanation independent of color or illustration.
- Loading state before deciding that the dataset is empty.
- Error state when absence is caused by retrieval failure.

### Anti-patterns

- Generic "No data" with no explanation or action.
- Treating a filtered no-results state as if the user has never created data.
- Decorative illustrations that displace the primary action.
- Inventing sample records that look like real product data.
- Showing an empty state before asynchronous loading resolves.

### When not to use it

Do not use an empty-state pattern when content exists but merely needs progressive disclosure or drill-down.

## P09 - Destructive action and confirmation

### User intent

Understand the consequence of a high-impact action, confirm it deliberately, or safely cancel without accidental mutation.

### Preferred composition

`contextual Button or Menu + Dialog (destructive-confirmation variant) + explicit destructive Button + cancel action + Notification after completion`

### Allowed variants

- Use a destructive Button directly for low-risk reversible actions when the active adapter's guidance and the product context support it.
- Use the adapter's destructive-confirmation Dialog variant for irreversible or difficult-to-reverse actions — never a generic Dialog for this.
- Use a Menu for low-frequency row actions, but keep consequence communication in the confirmation.
- Use a typed confirmation input only when the product risk genuinely justifies the extra friction.
- Use inline warning copy for persistent dangerous areas before the action is invoked.

### Required states

- Action label names the object and consequence.
- Confirmation dialog with Cancel and explicit destructive action labels.
- Loading/disabled state while the mutation runs.
- Success feedback that identifies what changed.
- Error feedback with recovery guidance.
- Permission-restricted or unavailable action state.
- Updated list/detail state after completion.

### Anti-patterns

- Vague labels such as "OK" or "Continue" for irreversible actions.
- Destructive action as the visually dominant default action without context.
- Immediate deletion when reversal is difficult or impossible.
- Hiding destructive actions in an unrelated settings area.
- Relying on red color without clear consequence text.

### When not to use it

Do not use a confirmation dialog for harmless, reversible, or easily undoable actions when the interruption would slow routine work.

## P10 - Loading, error, and success feedback

### User intent

Understand what the system is doing, what failed, whether an action completed, and what to do next without losing context.

### Preferred composition

`local Loading or Skeleton + Notification (inline or transient) + scoped retry or next-action Button + preserved content context`

### Allowed variants

- Use Skeleton when the content structure is known and retrieval is initial or non-instant.
- Use a localized Loading indicator for processing such as a row or form action.
- Use an inline Notification for persistent, region-specific feedback.
- Use a transient/toast Notification for short-lived global confirmation where context is obvious.
- Use a page-level error treatment when a primary content region cannot load.
- Pair partial failure with successful regions when the page can still support useful work.

### Required states

- Loading state scoped to the region or action being processed.
- Error state that names what failed and provides a recovery action.
- Success state that names the completed action and useful next step when needed.
- Disabled controls during consequential in-flight mutations.
- Partial-data or partial-failure treatment when only one region fails.
- Permission or unavailable state when the system cannot offer the action.

### Anti-patterns

- Blocking the entire page for a localized operation.
- Using a spinner without communicating what is loading.
- Showing success notifications for every trivial interaction.
- Clearing useful content when a refresh fails.
- Reporting only a technical error code with no user action.

### When not to use it

Do not add notifications for state changes that are already immediate, obvious, and visible in the updated control unless the workflow has a meaningful completion consequence.
