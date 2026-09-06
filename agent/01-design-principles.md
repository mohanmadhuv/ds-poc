# 01 — Design Principles

## 1. Task before interface
Identify what the user is trying to accomplish before selecting components.

Convert a request into:
- primary user
- primary goal
- critical tasks
- relevant objects/data
- decisions the user must make
- system feedback needed
- risky or destructive actions
- exceptional states

Do not start with visual layout.

## 2. System before invention
The Carbon system is the default design vocabulary.

Use system components and system patterns first. Create custom UI only when:
- no existing Carbon component or established project component satisfies the interaction need, and
- the custom element represents a genuinely product-specific interaction rather than styling preference.

## 3. Patterns before isolated components
A good interface is not a pile of components.

First select the product interaction pattern, then the components needed to realize it.

Examples:
- managing records -> searchable/filterable data set + row actions + confirmation for destructive actions
- creating a complex object -> progressive creation flow + validation + review + completion feedback
- monitoring system state -> summary + prioritized status + filterable records + drill-down detail

## 4. Progressive disclosure
Show the information and controls needed for the current decision. Move secondary information into tabs, disclosures, overflow menus, expandable areas, or detail views when appropriate.

Do not overwhelm the initial view with every possible control.

## 5. Clear action hierarchy
Each view should make the primary task obvious.

Use:
- one clear primary action when possible
- secondary actions for supporting tasks
- overflow/menu actions for low-frequency row-level or tertiary actions
- destructive styling and confirmation only for genuinely destructive actions

## 6. State is part of the design
For any data-driven or asynchronous experience, consider:
- loading
- first-use empty
- no-results empty
- error
- success
- disabled/unavailable
- permission-restricted
- partial data

Do not consider a feature complete if its meaningful non-happy-path states are ignored.

## 7. Feedback should match consequence
Use the least disruptive feedback that still communicates the result.

Examples:
- field problem -> field validation / contextual inline feedback
- successful local action -> inline or toast feedback
- important persistent page-level issue -> inline/callout/banner as appropriate
- irreversible/destructive confirmation -> modal/dialog

Carbon's notification guidance emphasizes relevant, timely, informative feedback and avoiding unnecessary disruption.

## 8. Accessibility is structural
Accessibility is not a final visual check.

Preserve:
- semantic elements
- explicit form labels
- keyboard navigation
- logical tab/focus order
- visible focus states
- accessible names for icon-only controls
- understandable validation
- non-color-only status communication
- appropriate headings and landmarks

## 9. Real product density
Enterprise/product interfaces can be information-dense without becoming chaotic.

Prefer structured hierarchy, tables, grouping, filters, tabs, and progressive disclosure over oversized cards and excessive whitespace.

Avoid generic "AI dashboard" aesthetics.

## 10. Explainability through provenance
When useful for the demo environment, keep enough implementation metadata to identify which Carbon patterns/components were used.

This metadata may power a "Built with Carbon" inspector, but should not clutter the primary product experience.
