# 02 — Component Registry Adapter

The authoritative approved component inventory is:

`design-system/COMPONENTS.md`

Read that file before feature implementation.

## Runtime authority

- UI components: installed `@carbon/react`
- icons: Carbon icons supplied with `@carbon/react`
- charts: installed `@carbon/charts-react`
- visual/token contract: `design-system/DESIGN.md`

This agent file intentionally does not duplicate the 30-component registry. Exact React APIs must be verified against the installed package before implementation.

## Hard rule

If a requested interface can be composed from the approved 30 component families, do not create a custom substitute.

If it cannot, follow the custom UI escape hatch in `design-system/DESIGN.md` and document the missing capability.
