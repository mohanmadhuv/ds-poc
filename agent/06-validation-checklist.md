# 06 — Validation Checklist

Run this after generation and before completion.

## A. Intent and UX
- [ ] The interface directly supports the requested user goal.
- [ ] The primary action is obvious.
- [ ] Secondary actions do not compete with the primary action.
- [ ] The chosen pattern matches the task.
- [ ] No unrelated vanity content was added.

## B. Carbon system fidelity
- [ ] Existing Carbon components are used where available.
- [ ] No Carbon component was recreated with custom HTML/CSS without necessity.
- [ ] Spacing, typography, color, radius, and layout follow Carbon/project tokens and conventions.
- [ ] Table/search/filter/pagination composition follows established Carbon conventions where applicable.
- [ ] Tabs are not being misused as process steps.

## C. Interaction quality
- [ ] Row-level actions are placed according to frequency and importance.
- [ ] Destructive actions communicate consequence and require confirmation when appropriate.
- [ ] Forms have clear labels and useful validation.
- [ ] Feedback appears after meaningful actions.
- [ ] Search/filter reset and no-results behavior are coherent.
- [ ] Drill-down/detail does not destroy list context unnecessarily.

## D. States
- [ ] Loading state exists when data/action is asynchronous.
- [ ] First-use empty state is sensible.
- [ ] Search/filter no-results state is distinct from first-use empty.
- [ ] Error state is actionable.
- [ ] Success feedback is present when needed.
- [ ] Permission/restricted state is represented if the scenario implies roles/permissions.

## E. Accessibility
- [ ] Controls have accessible names.
- [ ] Form controls have labels.
- [ ] Icon-only controls have tooltip/accessible label.
- [ ] Keyboard flow is usable.
- [ ] Focus is managed for dialogs/overlays.
- [ ] Status meaning is not conveyed only by color.
- [ ] Heading hierarchy is logical.

## F. Code quality
- [ ] Uses current installed Carbon React APIs.
- [ ] Reuses project components/helpers where appropriate.
- [ ] No unnecessary custom CSS.
- [ ] Demo fixture data is separated cleanly from reusable UI logic.
- [ ] No dead code or placeholder lorem ipsum remains.
- [ ] Existing tests/build/typecheck/lint are run when available.

## G. Demo provenance
Where the POC supports a "Built with Carbon" inspector:
- [ ] Record selected pattern(s).
- [ ] Record major Carbon components used.
- [ ] Do not expose hidden chain-of-thought.
- [ ] Show concise design-system provenance only.
