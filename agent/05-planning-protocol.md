# 05 — Planning Protocol

Before implementation, create an internal UX plan. Keep it concise and use it to constrain generation.

## UX Plan schema

```yaml
request: "<normalized user request>"

user:
  role: "<primary actor>"
  goal: "<what they need to accomplish>"

objects:
  - "<main entity/data object>"

primary_tasks:
  - "<task>"

secondary_tasks:
  - "<task>"

risk_actions:
  - action: "<destructive/high-consequence action>"
    confirmation: true

page_pattern: "<pattern id/name from 03-pattern-registry.md>"

layout:
  - "page header"
  - "primary actions"
  - "filters/search"
  - "main content"
  - "detail/secondary content"

carbon_components:
  - component: "DataTable"
    reason: "records share comparable attributes"

states:
  loading: true
  empty_first_use: true
  empty_no_results: true
  error: true
  success_feedback: true
  permission_restricted: false

interactions:
  - trigger: "Revoke access"
    response: "destructive confirmation modal"

assumptions:
  - "<only assumptions needed to make the demo coherent>"

avoid:
  - "<known anti-patterns for this request>"
```

## Planning procedure

### Step 1 — Normalize intent
Rewrite the prompt as a product task without changing its meaning.

### Step 2 — Identify the user goal
Ask internally: what does success look like for the user?

### Step 3 — Select one primary pattern
Choose from `03-pattern-registry.md`.
Secondary patterns may support it.

### Step 4 — Define information architecture
Determine what belongs:
- on the initial page
- inside controls
- inside secondary detail
- inside confirmation/creation flows

### Step 5 — Select components by function
For every major component, be able to state why it is appropriate.
Do not select components merely to demonstrate breadth.

### Step 6 — Enumerate consequential states
At minimum consider loading, empty, no results, error, success, and destructive confirmation where relevant.

### Step 7 — Implement
Use installed Carbon React components and existing project code.

### Step 8 — Validate
Run `06-validation-checklist.md` and fix violations.
