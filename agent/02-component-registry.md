# 02 — Component Registry Adapter

The authoritative approved component inventory is:

`design-system/COMPONENTS.md`

Read that file before feature implementation. It is brand- and library-agnostic — it never names a specific package.

## Runtime authority

The active design system is declared in `design-system/ACTIVE.md`. Resolve it before writing any implementation code:

1. Read `design-system/ACTIVE.md` for the active adapter's name and doc path.
2. Read that adapter doc (e.g. `design-system/adapters/shadcn.md`) for:
   - UI components: real component names and import paths;
   - icons: the declared icon set;
   - charts: the declared chart binding;
   - visual/token contract: how each semantic role in `design-system/DESIGN.md` §5.2 resolves to real tokens.

This agent file intentionally does not duplicate the 30-family registry or any adapter's exact API — both can change independently, and hardcoding either here would defeat the point of the adapter seam. Exact APIs must always be verified against the active adapter's doc and the installed package before implementation.

## Hard rule

If a requested interface can be composed from the approved 30 component families (resolved through the active adapter, including its documented composition recipes for families it doesn't ship as a single primitive), do not create a custom substitute.

If it cannot, follow the custom UI escape hatch in `design-system/DESIGN.md` §10 and document the missing capability in the active adapter's "Known gaps" section.

## Do not brand-lock this file or any other `agent/*.md`

Do not add a specific library's name to a rule, a composition list, or a code comment in `agent/*.md`. If a task requires swapping the design system, that is a `design-system/adapters/<name>.md` change plus a `design-system/ACTIVE.md` flip — never an edit to this registry or the pattern files it points to.
