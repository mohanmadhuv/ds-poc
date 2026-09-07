# 07 — Demo Scenarios

These scenarios are calibration examples. Do not hard-code layouts specifically for them. The system must generalize to novel requests.

## Scenario A — Team member management

Prompt:
> Add a team member management page where admins can invite users, change roles, search members, and revoke access.

Expected reasoning shape:
- Primary pattern: record management
- Objects: team members
- High-value components: DataTable, Search, status/role Badge where useful, Button, Select, Menu, Dialog, Notification
- Important states: loading, no members, no search results, invite success/error, permission constraints
- Destructive action: revoke access -> confirmation
- Product concern: admin-only actions should be represented coherently

Do not:
- make each team member a giant card if comparison is important
- place persistent "revoke" buttons on every row if overflow is clearer
- revoke immediately without confirmation

## Scenario B — Operations dashboard

Prompt:
> Create an operations dashboard where users can monitor active services, filter incidents by severity and status, inspect recent alerts, and open an incident to see its timeline and details.

Expected reasoning shape:
- Primary pattern: monitoring and triage
- Secondary patterns: filtering, detail/drill-down, notifications
- Objects: services, incidents, alerts
- High-value components: summary Cards where meaningful, Badge, DataTable, Search, filter controls, Tabs for peer detail sections if justified, detail panel/page, Notification
- Important states: freshness/loading, no incidents, filtered no-results, error
- Product concern: severity must be quickly scannable without relying on color alone

Do not:
- invent unrelated charts just because it says dashboard
- overwhelm the initial view with every incident detail

## Scenario C — Application deployment

Prompt:
> Create a multi-step workflow for deploying a new application where users configure the environment, choose resources, set scaling limits, review the configuration, and launch it.

Expected reasoning shape:
- Primary pattern: multi-step creation
- Objects: application/deployment configuration
- High-value components: ProgressIndicator, TextField, Select/ComboBox, NumberField, Switch/Checkbox as appropriate, Buttons, validation, review summary, Notification
- Important states: validation errors, submitting/loading, deployment success/error
- Consequence: final launch should be explicit and reviewable

Do not:
- place the entire complex workflow in one modal
- use tabs as wizard steps
- skip the review step when choices have meaningful infrastructure consequences

## Flexibility tests
Use these to test whether the agent generalizes:

1. "Build a billing page where finance admins can review invoices, filter by payment status, download invoices, and update the default payment method."
2. "Create an API key management experience where developers can create, rename, copy, rotate, and revoke keys while clearly seeing last-used information."
3. "Add a customer support queue where agents can filter tickets by priority and assignee, bulk-assign selected tickets, and open ticket history without losing their queue context."
4. "Create a feature flag management page where engineers can search flags, see rollout status, change audience percentage, and archive obsolete flags."
5. "Build a project settings experience with general settings, member permissions, notifications, and a dangerous area for deleting the project."
