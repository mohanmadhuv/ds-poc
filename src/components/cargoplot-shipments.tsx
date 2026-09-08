'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Sora } from 'next/font/google';
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Columns3,
  Download,
  Euro,
  FileCheck2,
  FileText,
  Filter,
  Info,
  Package,
  PackageCheck,
  Pencil,
  Plane,
  Plus,
  Search as SearchIcon,
  Ship,
  Tag,
  TrainFront,
  Truck,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { inquiries, type Inquiry, type Location, type TransportMode } from '@/fixtures/inquiries';
import { BRAND_DARK, BRAND_MINT, CargoplotShell, sharp } from '@/components/cargoplot-shell';

const sora = Sora({ subsets: ['latin'], weight: ['600', '700'] });

// A shipment is what an inquiry becomes once a quote is booked. There's no
// separate shipment fixture — this mock reuses the Inquiry shape and derives
// shipments from whichever seed inquiries already carry a "Booked" status.
type Shipment = Inquiry;

const modeIcon: Record<TransportMode, typeof Ship> = { sea: Ship, air: Plane, rail: TrainFront, road: Truck };
const freightLabel: Record<TransportMode, string> = { sea: 'Sea', air: 'Air', rail: 'Rail', road: 'Road' };

const opsAssignees = ['Kaj van Boven', 'Maria Silva', 'Tom Becker', 'Nina Patel'];
const salesAssignees = ['Rafael Alves', 'Emma Novak', 'Liam Chen', 'Sara Ahmed'];

const countryCodes: Record<string, string> = {
  'The Netherlands': 'NL',
  Canada: 'CA',
  'United States': 'US',
  Germany: 'DE',
  'United Kingdom': 'GB',
  China: 'CN',
  'United Arab Emirates': 'AE',
  India: 'IN',
  Morocco: 'MA',
  Singapore: 'SG',
  Australia: 'AU',
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function pick<T>(pool: T[], seed: string) {
  return pool[hashString(seed) % pool.length];
}

function countryCode(country: string) {
  return countryCodes[country] ?? country.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
}

function flagEmoji(code: string) {
  return String.fromCodePoint(...code.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)));
}

function locode(loc: Location) {
  return countryCode(loc.country) + loc.city.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function formatLongDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Table cell abbreviation: "40' high cube container" -> "40 HC".
function containerAbbrev(type: string) {
  const size = type.match(/^(\d+)'/)?.[1] ?? '20';
  const code = type.includes('high cube') ? 'HC' : type.includes('refrigerated') ? 'RF' : 'DC';
  return `${size} ${code}`;
}

// Detail-card label: "40' high cube container" -> "40 high cube".
function containerLabel(type: string) {
  return type.replace("'", '').replace(/ container$/, '');
}

function estimateQuotePrice(reference: string) {
  return 950 + (hashString(reference) % 300);
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

// Mirrors the dark-header / mint-title card chrome from CargoPlot's
// production Shipment detail screen (Figma node 10:234) — distinct from
// DashboardCard's white header text, which is this mock's other card idiom.
function ShipmentCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className={cn(sharp, 'border')}>
      <div
        className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold"
        style={{ backgroundColor: BRAND_DARK, color: BRAND_MINT }}
      >
        {title}
        {action}
      </div>
      <div className="p-4 text-sm">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="font-medium">{children}</div>
    </div>
  );
}

function ShipmentDetailView({ shipment }: { shipment: Shipment }) {
  const ModeIcon = modeIcon[shipment.mainTransport];
  const destCode = locode(shipment.destination);
  const destFlag = flagEmoji(countryCode(shipment.destination.country));
  const ops = pick(opsAssignees, `${shipment.id}-ops`);
  const sales = pick(salesAssignees, `${shipment.id}-sales`);
  const acceptedOn = `${formatShortDate(shipment.readyDate).replace(' ', ' ')} 2026, 17:06`;
  const totalContainers = shipment.cargo.reduce((sum, line) => sum + line.quantity, 0);
  const quotedPrice = estimateQuotePrice(shipment.reference);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 items-start gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <ShipmentCard title="Shipment details">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="flex items-center gap-2">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs" style={{ backgroundColor: BRAND_DARK, color: 'white' }}>
                    {initials(ops)}
                  </AvatarFallback>
                </Avatar>
                <Field label="Ops Assignee">{ops}</Field>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">{initials(sales)}</AvatarFallback>
                </Avatar>
                <Field label="Sales Assignee">{sales}</Field>
              </div>
              <Field label="Reference">{shipment.reference}</Field>
              <Field label="Status">
                <Badge className={cn(sharp, 'bg-blue-500 text-white')}>Active</Badge>
              </Field>
              <Field label="Origin">
                {shipment.origin.city}, {shipment.origin.country}
              </Field>
              <Field label="Destination">
                {shipment.destination.city}, {shipment.destination.country}
              </Field>
              <Field label="Incoterm">{shipment.incoterm}</Field>
              <Field label="Transport mode">
                <Badge variant="secondary" className={cn(sharp, 'gap-1')}>
                  <ModeIcon className="size-3.5" /> {freightLabel[shipment.mainTransport]}
                </Badge>
              </Field>
              <div className="col-span-2">
                <Field label="Commodity restriction">
                  <span className="text-muted-foreground font-normal">Not available</span>
                </Field>
              </div>
            </div>
            <p className="text-muted-foreground mt-6 text-xs">Accepted on {acceptedOn}</p>
            <p className="text-muted-foreground text-xs">Last update on: {acceptedOn}</p>
          </ShipmentCard>

          <ShipmentCard title="Cargo properties">
            <div className="text-muted-foreground -mx-4 -mt-4 mb-4 flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
              <Package className="size-4" />
              {totalContainers} container{totalContainers === 1 ? '' : 's'}
            </div>
            <div className="flex flex-wrap gap-2">
              {shipment.cargo.map((line, i) => (
                <Badge key={i} variant="secondary" className={sharp}>
                  {containerLabel(line.containerType)}
                </Badge>
              ))}
            </div>
            <div className="mt-4">
              <Field label="Description">{shipment.description}</Field>
            </div>
            <div className="mt-3">
              <Field label="Special contents">
                <span className="text-muted-foreground font-normal">None</span>
              </Field>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium">
              HS Codes <Info className="text-muted-foreground size-3" />
            </div>
            <p className="text-muted-foreground text-xs">Please provide the HS code(s) for the products to be imported</p>
          </ShipmentCard>

          <ShipmentCard title="Financials">
            <button
              type="button"
              className="-mx-4 -mt-4 mb-4 flex w-[calc(100%+2rem)] items-center gap-3 bg-muted/30 p-4 text-left hover:bg-muted/50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <Euro className="size-4" />
              </span>
              View invoiced and pending charges
            </button>
            <p className="text-muted-foreground text-xs">Original quote</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: BRAND_DARK }}>
                <Calculator className="size-4 text-white" />
              </span>
              <div>
                <p className="font-semibold">€{quotedPrice.toLocaleString()}</p>
                <p className="text-muted-foreground text-xs">Accepted on {formatShortDate(shipment.readyDate)}-2026</p>
              </div>
            </div>
          </ShipmentCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <ShipmentCard title="Shipment planning">
            <div className="relative pl-9">
              <div className="bg-border absolute top-1 bottom-1 left-[13px] w-px" />

              <div className="relative pb-6">
                <span
                  className="absolute -left-9 flex size-7 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  <PackageCheck className="size-3.5" />
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Origin · pre-carriage</p>
                  <ChevronUp className="text-muted-foreground size-4" />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">Cargo ready date</p>
                <p className="font-medium">{formatLongDate(shipment.readyDate)}</p>
              </div>

              <div className="relative pb-6">
                <span
                  className="absolute -left-9 flex size-7 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  <ModeIcon className="size-3.5" />
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    Main carriage <span className="text-muted-foreground text-xs font-normal">{freightLabel[shipment.mainTransport]}</span>
                  </p>
                  <ChevronUp className="text-muted-foreground size-4" />
                </div>
                <div className="mt-2 flex items-center justify-between border p-3">
                  <div>
                    <p className="text-xs font-semibold">ETD</p>
                    <p className="text-muted-foreground text-sm">TBA</p>
                  </div>
                  <div className="bg-border mx-3 h-px flex-1" />
                  <div className="text-right">
                    <p className="text-xs font-semibold">ETA</p>
                    <p className="text-muted-foreground text-sm">TBA</p>
                    <p className="mt-0.5 text-xs">
                      {destFlag} {destCode}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 border p-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Shipping line</p>
                    <p className="font-medium">OOCL</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vessel</p>
                    <p className="font-medium">TBA</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CO₂</p>
                    <p className="font-medium">TBA</p>
                  </div>
                </div>
              </div>

              <div className="relative pb-6">
                <span
                  className="absolute -left-9 flex size-7 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  <Truck className="size-3.5" />
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Destination · on-carriage</p>
                  <ChevronUp className="text-muted-foreground size-4" />
                </div>
                <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  ON-CARRIAGE LEGS <Badge variant="secondary">1</Badge>
                </p>
                <div className="mt-2 flex items-center gap-2 border p-3">
                  <span className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Truck className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">Truck delivery</p>
                    <p className="text-muted-foreground text-xs">
                      {destFlag} {destCode} → {shipment.destination.city}, {shipment.destination.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <span className="text-muted-foreground absolute -left-9 flex size-7 items-center justify-center rounded-full border">
                  <Tag className="size-3.5" />
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    General <span className="text-muted-foreground text-xs font-normal">Reference, flags, addons</span>
                  </p>
                  <ChevronDown className="text-muted-foreground size-4" />
                </div>
              </div>
            </div>
          </ShipmentCard>

          <ShipmentCard
            title="Documents"
            action={
              <div className="flex items-center gap-2">
                <Plus className="size-4" />
                <Download className="size-4" />
              </div>
            }
          >
            <p className="text-muted-foreground mb-3 text-xs">Documents</p>
            <div className="space-y-4">
              {[
                { icon: FileText, title: 'Commercial invoice', subtitle: 'Click or drag to upload' },
                { icon: FileCheck2, title: 'Direct representation', subtitle: 'Click to complete and submit' },
                { icon: Ship, title: 'House bill of lading', subtitle: 'Click or drag to upload' },
              ].map((doc) => (
                <button key={doc.title} type="button" className="flex w-full items-center gap-3 text-left hover:opacity-80">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: BRAND_DARK }}
                  >
                    <doc.icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-muted-foreground text-xs">{doc.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </ShipmentCard>

          <ShipmentCard title="Suppliers" action={<Plus className="size-4" />}>
            <p className="text-muted-foreground">
              Please specify your suppliers for this shipment. A cargoplot agent will contact these suppliers to coordinate the
              shipment with them.
            </p>
          </ShipmentCard>

          <ShipmentCard title="Additional information">
            <p className="flex items-center gap-1 text-xs font-medium">
              Delivery and customs <Info className="size-3 text-blue-500" />
            </p>
            <div className="mt-2 space-y-3">
              {[
                { title: 'Delivery address confirmation', subtitle: 'The delivery address needs to be confirmed' },
                { title: 'Article 23', subtitle: 'VAT cannot be reversed charged' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2">
                  <XCircle className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1 text-xs font-medium">
              Additional services <Info className="size-3 text-blue-500" />
            </p>
            <div className="mt-2 flex items-start gap-2">
              <XCircle className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">Insurance</p>
                <p className="text-muted-foreground text-xs">The transported goods are not insured</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs">Please contact us if you want to add any of the additional services.</p>
          </ShipmentCard>

          <ShipmentCard title="Review">
            <p>Let us know how our partners performed. All feedback is valuable.</p>
            <div className="mt-4 flex justify-center">
              <Button className={sharp} style={{ backgroundColor: BRAND_MINT, color: BRAND_DARK }}>
                <Pencil className="size-4" /> Submit
              </Button>
            </div>
          </ShipmentCard>
        </div>
      </div>
    </div>
  );
}

export function CargoplotShipments() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const shipments = useMemo(() => inquiries.filter((inq) => inq.status === 'Booked'), []);
  const filtered = useMemo(
    () =>
      shipments.filter((s) =>
        `${s.reference} ${s.origin.city} ${s.destination.city} ${s.description} ${s.requestedBy}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [shipments, query],
  );
  const active = shipments.find((s) => s.id === activeId) ?? null;

  return (
    <CargoplotShell backLabel={view === 'detail' ? 'Back to Shipments' : undefined} onBack={() => setView('list')}>
      {view === 'list' && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h1 className={cn(sora.className, 'text-xl font-bold')}>Shipments</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className={sharp} aria-label="Filter">
                <Filter className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className={sharp} aria-label="Choose columns">
                <Columns3 className="size-4" />
              </Button>
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Search"
                  className={cn(sharp, 'w-48 pl-8')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 truncate">Mode</TableHead>
                  <TableHead className="w-28 truncate">Reference</TableHead>
                  <TableHead className="w-32 truncate">Requester</TableHead>
                  <TableHead className="truncate">Description</TableHead>
                  <TableHead className="w-20 truncate">CRD</TableHead>
                  <TableHead className="w-16 truncate">ETD</TableHead>
                  <TableHead className="w-16 truncate">ETA</TableHead>
                  <TableHead className="w-24 truncate">MBL no.</TableHead>
                  <TableHead className="w-28 truncate">Container no.</TableHead>
                  <TableHead className="w-32 truncate">Cargo properties</TableHead>
                  <TableHead className="w-24 truncate">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-muted-foreground h-32 text-center">
                      No shipments yet. Shipments appear here once a quote has been booked.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((shipment) => {
                    const ModeIcon = modeIcon[shipment.mainTransport];
                    const totalContainers = shipment.cargo.reduce((sum, line) => sum + line.quantity, 0);
                    return (
                      <TableRow
                        key={shipment.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setActiveId(shipment.id);
                          setView('detail');
                        }}
                      >
                        <TableCell className="truncate">
                          <ModeIcon className="text-muted-foreground size-4" />
                        </TableCell>
                        <TableCell className="truncate font-medium">{shipment.reference}</TableCell>
                        <TableCell className="truncate">{shipment.requestedBy}</TableCell>
                        <TableCell className="text-muted-foreground truncate">{shipment.description}</TableCell>
                        <TableCell className="truncate">{formatShortDate(shipment.readyDate)}</TableCell>
                        <TableCell className="text-muted-foreground truncate">TBA</TableCell>
                        <TableCell className="text-muted-foreground truncate">TBA</TableCell>
                        <TableCell className="text-muted-foreground truncate">—</TableCell>
                        <TableCell className="truncate">
                          <span className="bg-muted text-muted-foreground inline-flex size-5 items-center justify-center rounded-full text-xs">
                            ?
                          </span>
                        </TableCell>
                        <TableCell className="truncate">
                          <div className="flex items-center gap-1.5">
                            <Package className="text-muted-foreground size-4 shrink-0" />
                            <Badge variant="secondary" className={sharp}>
                              {totalContainers}
                            </Badge>
                            <Badge variant="secondary" className={sharp}>
                              {containerAbbrev(shipment.cargo[0].containerType)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge className={cn(sharp, 'bg-blue-500 text-white')}>Active</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {view === 'detail' && active && <ShipmentDetailView shipment={active} />}
    </CargoplotShell>
  );
}
