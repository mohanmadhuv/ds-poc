import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const colors = [
  { name: 'Deep green', role: 'Primary / dark surfaces', hex: '#002d28' },
  { name: 'Mint', role: 'Accent / primary action', hex: '#39f2af' },
  { name: 'Pale blue', role: 'Secondary surface', hex: '#ebf0fa' },
  { name: 'Sage', role: 'Muted text on dark', hex: '#c8d1cf' },
  { name: 'White', role: 'Base surface', hex: '#ffffff' },
];

const typeScale = [
  { role: 'Display / H1', font: 'Sora', weight: 700, size: '54px', sample: 'You Choose, We Ship' },
  { role: 'Heading / H3', font: 'Sora', weight: 700, size: '26px', sample: 'Get Instant, Comparative Quotes' },
  { role: 'Lead body', font: 'Instrument Sans', weight: 500, size: '20px', sample: 'Instantly compare your freight options.' },
  { role: 'Base body', font: 'Instrument Sans', weight: 500, size: '16px', sample: 'Simplify international freight forwarding.' },
];

export function BrandFoundations() {
  return (
    <>
      <p className="text-primary text-xs font-medium">Brand adapter</p>
      <h1 className="mt-2 text-3xl font-normal tracking-tight">Brand foundations</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Colors, typography, and shape sourced from{' '}
        <a
          href="https://www.cargoplot.com/"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4"
        >
          cargoplot.com
        </a>
        , collected here as the raw material for this brand's adapter — not yet mapped onto the token
        roles in <code className="bg-muted rounded border px-1.5 py-0.5 text-xs">design-system/DESIGN.md</code>.
      </p>

      <Separator className="my-7 max-w-4xl" />

      <section>
        <h2 className="text-lg font-semibold">Colors</h2>
        <p className="text-muted-foreground mt-1 text-sm">Sampled from the header, hero, and CTA button.</p>
        <div className="mt-4 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {colors.map((color) => (
            <Card key={color.hex} className="gap-0 overflow-hidden p-0">
              <div className="h-16 border-b" style={{ backgroundColor: color.hex }} />
              <div className="p-3">
                <p className="text-sm font-medium">{color.name}</p>
                <p className="text-muted-foreground text-xs">{color.role}</p>
                <p className="text-muted-foreground mt-1 font-mono text-xs uppercase">{color.hex}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Typography</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Headings in Sora (700), body text in Instrument Sans (500).
        </p>
        <div className="mt-4 grid max-w-3xl gap-4">
          {typeScale.map((type) => (
            <Card key={type.role} className="p-4">
              <p className="text-muted-foreground font-mono text-xs">
                {type.role} &middot; {type.font} {type.weight} &middot; {type.size}
              </p>
              <p
                className="mt-2"
                style={{ fontFamily: `"${type.font}", sans-serif`, fontWeight: type.weight, fontSize: type.size }}
              >
                {type.sample}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Shape</h2>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Every button, card, and section on the source site uses a 0px border radius — sharp corners
          throughout, no rounding at all. That's a deliberate departure from this app's own default
          <code className="bg-muted mx-1 rounded border px-1.5 py-0.5 text-xs">--radius</code>
          token and would need to be a conscious choice when this brand's adapter is written.
        </p>
        <div className="mt-4 flex max-w-3xl items-center gap-4">
          <Button
            className="px-5 py-2.5 text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: '#39f2af', color: '#002d28', borderRadius: 0 }}
          >
            Get shipping rates
          </Button>
          <span className="text-muted-foreground text-xs">radius: 0px</span>
        </div>
      </section>
    </>
  );
}
