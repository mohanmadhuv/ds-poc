# 03 — Pattern Registry

Mature design systems define patterns as reusable combinations of components/templates that help users accomplish goals. Prefer these goal-level structures over assembling components ad hoc.

## P01 — Record management
Use when users manage a collection of entities such as users, services, projects, invoices, devices, or environments.

Typical anatomy:
1. Page heading and concise description
2. Primary creation/invite action
3. Search and/or filters
4. Data table or structured list
5. Status representation
6. Row-level actions
7. Pagination when needed
8. Empty/no-results/error states
9. Confirmation for destructive actions
10. Success/error feedback

## P02 — Monitoring and triage
Use when users need to detect issues, assess priority, and inspect operational state.

Typical anatomy:
1. Scope/title and freshness context
2. Small number of meaningful summary metrics
3. Prioritized alerts/statuses
4. Filters/search
5. Dense record view, usually table/list
6. Drill-down details
7. Timeline/history when sequence matters
8. Clear severity/status vocabulary

Do not add vanity metrics unrelated to the user's decisions.

## P03 — Multi-step creation
Use for creating/configuring an object where steps have dependencies or cognitive load is high.

Typical anatomy:
1. Progress indicator
2. One coherent decision group per step
3. Inline validation
4. Back/next navigation
5. Review step when configuration has meaningful consequences
6. Explicit final action
7. Completion feedback and next step

Do not split a short, simple form into unnecessary steps.

## P04 — Simple form
Use for short tasks with a small number of related inputs and low complexity.

May appear on a dedicated page, panel, or dialog depending on context.

Choose container by complexity:
- very small focused task -> modal/dialog may work
- medium task while preserving context -> side panel if supported
- substantial task -> dedicated page

## P05 — Filtering
Use when users need to narrow a displayed dataset by predefined attributes.

Rules:
- choose filters that map to real user decisions
- visibly communicate active filter state
- provide a way to clear/reset filters
- update results predictably
- distinguish "no data" from "no results for these filters"

## P06 — Search
Use when keyword discovery is materially faster than browsing/filtering.

Rules:
- identify what fields/content are searched
- show no-results guidance
- preserve query context where useful
- avoid a search control over trivially small datasets

## P07 — Empty states
Use when no data can be displayed.

Distinguish:
- first use / nothing created yet
- no results after search/filter
- data removed/deleted
- unavailable/error-like absence

A useful empty state explains the situation and offers a relevant next step when one exists.

## P08 — Notifications and feedback
Use when the system must communicate action results or meaningful system changes.

Feedback should be:
- relevant to the current goal
- timely
- informative enough to understand outcome and next steps
- minimally disruptive

## P09 — Dialog / confirmation
Use when the user must make a focused decision without leaving their current workflow.

For destructive actions:
- name the object affected
- explain consequence
- clearly distinguish cancel vs destructive confirmation
- do not use vague labels such as "OK" for irreversible actions

## P10 — Detail / drill-down
Use when a summary/list view needs deeper inspection without overloading the initial view.

Possible implementations:
- dedicated detail page
- side panel if supported and preserving context matters
- modal only for genuinely compact detail/decision content
- tabs inside detail when there are peer categories

## P11 — Settings/configuration
Use when users change persistent product/system preferences.

Rules:
- group settings by user mental model
- distinguish immediate toggles from settings requiring explicit save
- explain risky or system-wide consequences
- provide confirmation/feedback where appropriate

## P12 — Bulk action
Use when users need the same action applied to multiple records.

Typical anatomy:
- row selection
- selection count
- contextual batch actions
- confirmation for consequential/destructive operations
- clear success/partial-failure feedback
