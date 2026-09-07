import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Overview() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="text-primary text-xs font-medium">DS-PoC</p>
        <h1 className="mt-2 text-4xl font-normal tracking-tight">Mission</h1>
        <p className="text-muted-foreground mt-1">What this platform is for</p>
      </header>
      <Separator className="my-7 max-w-4xl" />
      <div className="grid max-w-2xl gap-7">
        <p className="text-foreground text-xl leading-normal font-normal">
          Give coding agents a single, swappable design-system vocabulary so natural-language product
          requests turn into precise, accessible, enterprise-grade SaaS interfaces instead of generic
          AI dashboards.
        </p>
        <div className="text-muted-foreground grid gap-5 text-sm leading-relaxed">
          <p>
            Agents save time and avoid drift by composing only from the 30 approved, brand-agnostic
            component families in{' '}
            <code className="bg-muted text-foreground rounded border px-1.5 py-0.5 text-xs">
              design-system/COMPONENTS.md
            </code>
            , instead of inventing custom UI.
          </p>
          <p>
            Reviewers can trust generated screens because every token, state, and composition decision
            traces back to{' '}
            <code className="bg-muted text-foreground rounded border px-1.5 py-0.5 text-xs">
              design-system/DESIGN.md
            </code>
            .
          </p>
          <p>
            The design system itself is a plug-in: the active adapter is declared in{' '}
            <code className="bg-muted text-foreground rounded border px-1.5 py-0.5 text-xs">
              design-system/ACTIVE.md
            </code>{' '}
            and currently binds those 30 families to shadcn/ui. Swapping to a different library or brand
            means writing a new adapter, not rewriting the agent instructions.
          </p>
          <p>
            The{' '}
            <Link href="/playground" className="text-primary underline underline-offset-4">
              Playground
            </Link>{' '}
            is a stable reference implementation today. The goal is a validated plan &rarr; generate
            &rarr; validate loop, defined in{' '}
            <code className="bg-muted text-foreground rounded border px-1.5 py-0.5 text-xs">
              agent/09-generation-validation-protocol.md
            </code>
            , that turns free-form prompts into design-system UI safely.
          </p>
        </div>
      </div>
    </article>
  );
}
