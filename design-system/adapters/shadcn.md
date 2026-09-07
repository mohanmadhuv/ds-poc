# Adapter: shadcn/ui

> Filled in per the structure in `design-system/adapters/TEMPLATE.md`. This is the currently active adapter — see `design-system/ACTIVE.md`.

## 1. Identity

- **Name:** `shadcn`
- **Base library:** Radix UI (via the unified `radix-ui` package)
- **Styling engine:** Tailwind CSS v4, CSS custom properties for theme tokens (`src/app/globals.css`)
- **Runtime shell:** Next.js (App Router), `src/app/` directory convention, deployed on Vercel

## 2. Install

```bash
npx shadcn@latest init -d --base radix
npx shadcn@latest add <component-names...>
```

`components.json` at the repo root configures aliases (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`); `tsconfig.json` maps `@/*` to `./src/*`. Components are copied into `src/components/ui/*` as owned source — edit them directly rather than patching around them.

## 3. Token binding

| Role (from DESIGN.md §5.2) | shadcn/Tailwind binding |
|---|---|
| background | `bg-background` / `--background` |
| layer, layer-accent | `bg-card` / `--card`, `bg-popover` / `--popover` |
| field | `bg-input` (via component defaults, e.g. `Input`, `Select`) |
| text-primary | `text-foreground` |
| text-secondary | `text-muted-foreground` |
| text-placeholder | native `placeholder:` Tailwind variant on form components |
| text-helper | `text-muted-foreground text-sm` |
| text-error | `text-destructive` |
| icon-primary / icon-secondary | `text-foreground` / `text-muted-foreground` on Lucide icons (`lucide-react`) |
| icon-interactive | inherits current text color inside a `Button`/link |
| border-subtle | `border-border` / `--border` |
| border-strong | `border-input` for stronger form-control borders |
| link-primary | `text-primary underline-offset-4` |
| focus | `--ring`, applied via each primitive's built-in `focus-visible:` classes |
| interactive | `--primary` |
| support-error | `--destructive` |
| support-success, support-warning, support-info | no dedicated tokens shipped by default — extend `@theme inline` in `globals.css` with `--color-success`/`--color-warning`/`--color-info` (oklch) if a request needs them; until then, compose with Tailwind's `emerald-`/`amber-`/`sky-` palettes as done for `Badge` status colors in `src/components/team-management.tsx` |
| spacing scale | Tailwind's default spacing scale (`gap-1`…`gap-12`, `p-*`) — do not use arbitrary bracket values (`p-[13px]`) when a scale step covers it |
| type scale | Tailwind text sizes (`text-xs` … `text-4xl`) + `font-sans` (Inter, see `src/app/layout.tsx`) |
| radius | `--radius` and its `--radius-sm/md/lg/xl` derivatives, applied automatically by each component |

## 4. Family binding

| Family | Real component(s) | Import | Notes |
|---|---|---|---|
| Button | `Button` | `@/components/ui/button` | variants: default, outline, secondary, ghost, destructive, link |
| IconButton | `Button` with `size="icon"` | `@/components/ui/button` | always pair with `aria-label` |
| Menu | `DropdownMenu` family | `@/components/ui/dropdown-menu` | `DropdownMenuItem variant="destructive"` for destructive rows |
| TextField | `Input` + `Label` | `@/components/ui/input`, `@/components/ui/label` | |
| TextArea | `Textarea` + `Label` | `@/components/ui/textarea` | |
| NumberField | `Input` with `type="number"` | `@/components/ui/input` | composed — shadcn ships no dedicated numeric-stepper primitive |
| Select | `Select` family | `@/components/ui/select` | native-like bounded choice |
| ComboBox | `Command` inside `Popover` | `@/components/ui/command`, `@/components/ui/popover` | composed — richer searchable single-select |
| MultiSelect | `Command`/`Popover` + `Badge` chips | `@/components/ui/command`, `@/components/ui/badge` | composed — no native multi-select primitive |
| Checkbox | `Checkbox` | `@/components/ui/checkbox` | |
| RadioGroup | `RadioGroup`, `RadioGroupItem` | `@/components/ui/radio-group` | |
| Switch | `Switch` | `@/components/ui/switch` | |
| DatePicker | `Calendar` inside `Popover` | `@/components/ui/calendar`, `@/components/ui/popover` | composed, uses `react-day-picker` under the hood |
| Search | `Input` + Lucide `Search` icon | `@/components/ui/input`, `lucide-react` | composed — no dedicated Search primitive |
| DataTable | `Table` family | `@/components/ui/table` | sorting/selection are hand-wired local state, not a built-in prop |
| Pagination | `Pagination` family | `@/components/ui/pagination` | |
| Badge | `Badge` | `@/components/ui/badge` | default/secondary/outline/destructive variants only — extend with Tailwind palette classes for extra status colors, as in the Playground's member-status badges |
| Card | `Card` family | `@/components/ui/card` | |
| Tabs | `Tabs` family | `@/components/ui/tabs` | |
| Accordion | `Accordion` family | `@/components/ui/accordion` | |
| Dialog | `Dialog` family for focused tasks; `AlertDialog` family for destructive confirmation | `@/components/ui/dialog`, `@/components/ui/alert-dialog` | always use `AlertDialog`, not `Dialog`, for destructive confirmation |
| Notification | `Alert` (inline) + `sonner` `Toaster`/`toast()` (transient) | `@/components/ui/alert`, `@/components/ui/sonner` | `<Toaster />` mounted once in `src/app/layout.tsx` |
| Loading | Lucide spinner icon (`animate-spin`) or an inline `border-t-foreground animate-spin` div | `lucide-react` | composed — no dedicated Loading primitive |
| Skeleton | `Skeleton` | `@/components/ui/skeleton` | |
| ProgressIndicator | `Progress` + an ordered step label | `@/components/ui/progress` | composed — no built-in multi-step stepper; render step state (`Step 2 of 3`) alongside the bar |
| Breadcrumb | `Breadcrumb` family | `@/components/ui/breadcrumb` | |
| AppShell | `Sidebar` family (`SidebarProvider`, `Sidebar`, `SidebarInset`, ...) + a slim `<header>` | `@/components/ui/sidebar` | see `src/components/app-shell.tsx` |
| BarChart | `ChartContainer` + Recharts `BarChart`/`Bar` | `@/components/ui/chart`, `recharts` | `recharts` is a plain dependency, not a CLI-added component |
| LineChart | `ChartContainer` + Recharts `LineChart`/`Line` | `@/components/ui/chart`, `recharts` | |
| DonutChart | `ChartContainer` + Recharts `PieChart`/`Pie` with `innerRadius` | `@/components/ui/chart`, `recharts` | |

## 5. Known gaps

- No native NumberField stepper, Search field, ComboBox, MultiSelect, Loading spinner, or step-indicator/stepper component — all documented above as compositions of existing primitives, not custom UI from scratch.
- `Badge` ships 4 variants only (default/secondary/outline/destructive); semantic status colors (success/warning/info) are composed from Tailwind's palette rather than theme tokens until `globals.css` grows dedicated `--color-success`/`--color-warning`/`--color-info` tokens.

## 6. Validator hooks

See `design-system/active-system.json`: `componentSourceDir: "src/components/ui"`, `componentImportPrefix: "@/components/ui/"`, `buildCommand: "next build --webpack"` (see note below), `typecheckCommand: "tsc --noEmit"`, `lintCommand: "eslint ."`.

**Why `--webpack`:** Next.js 16.3.4's default Turbopack build has a reproducible bug prerendering the framework-internal `/_global-error` route (`Invariant: Expected workStore to be initialized`). The webpack build compiles and prerenders cleanly with identical source. Re-test with plain `next build` on a future Next.js patch release and drop the flag once it's fixed upstream.
