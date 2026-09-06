# 05 - Planning Protocol

Before implementation, create an intermediate UI plan before writing JSX. Keep it compact enough to inspect quickly, then use the detailed UX plan to constrain generation and cover consequential states.

## Intermediate UI plan

The UI plan is the bridge between a natural-language request and implementation. It must be produced before JSX and should be visible to the user when the workflow calls for an explicit plan.

Use this format:

```yaml
page: <stable-page-or-route-name>

intents:
  - <user task expressed as an action>

pattern:
  primary: <pattern name from agent/08-saas-patterns.md or agent/03-pattern-registry.md>
  secondary:
    - <supporting pattern name>

composition:
  - <Carbon component or existing project component>

states:
  - <loading | empty | no-results | error | success | permission | destructive-confirmation>
```

Example:

```yaml
page: team-management

intents:
  - browse members
  - search members
  - invite member
  - change role
  - revoke access

pattern:
  primary: record-management
  secondary:
    - create-form
    - destructive-action

composition:
  - PageHeader
  - Search
  - Dropdown
  - DataTable
  - Tag
  - OverflowMenu
  - Modal
  - InlineNotification

states:
  - loading
  - empty
  - error
  - success
```

UI plan rules:

- Normalize intents as user actions, not visual descriptions.
- Select one primary pattern; secondary patterns must directly support it.
- List components by role in the composition, not every nested Carbon primitive.
- Include only states implied by the request, but do not omit consequential asynchronous, permission, or destructive states.
- Use names from the pattern registry and approved component registry; do not invent pattern names without documenting the gap.
- Do not expose hidden reasoning or chain-of-thought. The plan should contain decisions and implementation scope, not private deliberation.

## Generator consumption contract

The implementation agent must treat the UI plan as structured input to generation, not as commentary that can be ignored.

```text
Prompt
  -> intent analysis
  -> pattern selection
  -> UI plan
  -> Carbon implementation
  -> validation
```

Before writing JSX:

1. Derive the user intents from the prompt.
2. Select one primary pattern and any directly supporting patterns.
3. Produce the UI plan in the format above.
4. Resolve every composition entry to an installed Carbon component or an existing project component.
5. Map every listed state to an implementation state, fixture, or reachable interaction.

While writing JSX:

- The selected primary pattern determines the page anatomy and interaction model.
- The composition list is the allowed starting vocabulary; add a component only when implementation semantics require it and record the reason in the detailed UX plan.
- The states list is an implementation checklist, not optional copy guidance.
- The generator must not replace a planned Carbon component with custom HTML/CSS when the installed package supports the need.
- The generator must preserve the plan's primary user intent and must not add unrelated dashboard content.

Before completion, validate that:

- the implemented page still supports every listed intent;
- the selected pattern is recognizable in the page structure;
- every listed composition item is present or its omission is documented as an API/project gap;
- every listed state is implemented or explicitly out of scope with a reason;
- the final implementation passes `agent/06-validation-checklist.md`.

If the prompt changes materially during implementation, regenerate the UI plan before continuing. Do not silently patch JSX around an obsolete plan.

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
