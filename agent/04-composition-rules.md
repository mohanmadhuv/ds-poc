# 04 — Composition Rules

Apply these rules before and during implementation.

## Dataset rules
R01. If users compare records across shared attributes, prefer DataTable.
R02. If users only scan a small non-comparative collection, list/tile/structured list may be better.
R03. If a dataset is meaningfully searchable, pair it with Search using the system's established table/search pattern.
R04. If users need predefined narrowing criteria, add filters rather than forcing search to do all discovery work.
R05. If both search and filters exist, make their combined effect understandable and provide clear/reset behavior.
R06. Use pagination only when dataset scale warrants it; do not paginate tiny fixture datasets solely to showcase the component.

## Action rules
R07. Keep the primary page action visible.
R08. Put low-frequency row actions in an overflow/menu when persistent buttons would create noise.
R09. Never hide the main user goal in overflow.
R10. Destructive actions require consequence-aware confirmation when reversal is difficult or impossible.
R11. Action labels should describe the action: "Invite member", "Revoke access", "Deploy application", not vague "Submit" when specificity is possible.

## Form rules
R12. <= roughly 3 simple, independent fields with low consequence may fit a modal/dialog.
R13. If the user needs page context while editing a moderate amount of information, prefer a panel pattern if supported.
R14. Complex, dependent, or lengthy input belongs in a dedicated page or multi-step flow.
R15. Use ProgressIndicator only for genuine sequences.
R16. Put validation near the field/problem and provide a useful corrective message.
R17. Do not require users to remember information from earlier steps when it can be summarized at review.

## Status rules
R18. Use Badge or the active adapter's appropriate status treatment for compact categorical status.
R19. Status text must remain understandable without color.
R20. Prioritize severity/status ordering only when it supports the user's decision.

## Feedback rules
R21. Local validation -> local/inline feedback.
R22. Completed local action -> inline or toast-style success feedback as appropriate.
R23. Persistent page-level concern -> inline/callout/banner according to scope.
R24. Critical action requiring acknowledgement -> modal/dialog.
R25. Avoid unnecessary notifications and alert fatigue.

## Navigation and disclosure rules
R26. Tabs are for peer views, not sequential steps.
R27. Accordions/disclosures are for optional secondary information, not essential task instructions.
R28. Use drill-down detail rather than placing every record attribute in the table.
R29. Preserve the user's list/filter/search context when opening and closing secondary detail when feasible.

## Empty/loading/error rules
R30. Distinguish first-use empty from filtered/search no-results.
R31. A no-results state should suggest adjusting query/filters when appropriate.
R32. A first-use empty state should offer the natural creation/onboarding action when one exists.
R33. Loading feedback should be scoped to what is loading; avoid blocking unrelated parts of the interface.
R34. Error states should tell the user what failed and what they can do next.

## Layout rules
R35. Use the active design system's spacing/layout tokens or existing project utilities tied to them.
R36. Prefer clear page hierarchy: title/context -> actions -> controls -> content -> secondary detail.
R37. Avoid oversized cards, excessive rounded containers, decorative gradients, and arbitrary dashboard chrome.
R38. Dense enterprise interfaces should gain clarity from alignment, grouping, and hierarchy rather than excessive whitespace.

## Custom component rule
R39. Before creating any custom component, explicitly check:
1. Is there a component in the active adapter (`design-system/adapters/<name>.md`)?
2. Is there an existing project component?
3. Can an existing pattern, or a documented composition recipe in the adapter doc, compose the behavior?
Only proceed if all are insufficient.

## Precision rule
R40. Do not infer business-critical behavior that the prompt does not support. For demo fixtures, reasonable placeholder data is allowed, but interaction semantics must remain coherent and clearly scoped to the requested scenario.
