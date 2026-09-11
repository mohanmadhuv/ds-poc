'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Sora } from 'next/font/google';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Bot,
  Calendar as CalendarIcon,
  Columns3,
  FileText,
  Filter,
  Handshake,
  Info,
  MapPin,
  Package,
  PackageSearch,
  Pencil,
  Plane,
  Plus,
  Search as SearchIcon,
  Ship,
  Star,
  TrainFront,
  TriangleAlert,
  Truck,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import {
  containerTypes,
  incotermOptions,
  inquiries as seedInquiries,
  shipmentStages,
  type ContainerLine,
  type Inquiry,
  type Location,
  type TransportMode,
} from '@/fixtures/cargoplot/inquiries';
import { BRAND_DARK, BRAND_MINT, BRAND_PALE, CargoplotShell, sharp } from '@/components/cargoplot/shell';

const sora = Sora({ subsets: ['latin'], weight: ['600', '700'] });

const countries = ['The Netherlands', 'Canada', 'United States', 'Germany', 'United Kingdom', 'China'];

const mainTransportOptions: { value: TransportMode; label: string; icon: typeof Ship }[] = [
  { value: 'sea', label: 'Sea', icon: Ship },
  { value: 'air', label: 'Air', icon: Plane },
  { value: 'rail', label: 'Rail', icon: TrainFront },
  { value: 'road', label: 'Road', icon: Truck },
];

const destinationTransportOptions = [
  { value: 'Direct truck', label: 'Direct truck', icon: Truck },
  { value: 'Rail', label: 'Rail', icon: TrainFront },
  { value: 'Barge', label: 'Barge', icon: Ship },
];

const modeIcon: Record<TransportMode, typeof Ship> = { sea: Ship, air: Plane, rail: TrainFront, road: Truck };

const statusStyles: Record<Inquiry['status'], string> = {
  Received: 'bg-blue-100 text-blue-700',
  Quoted: 'text-black',
  Booked: 'text-white',
};

const freightLabel: Record<TransportMode, string> = {
  sea: 'Seafreight',
  air: 'Airfreight',
  rail: 'Rail freight',
  road: 'Road freight',
};

function formatLocation(loc: Location | null) {
  return loc ? `${loc.city}, ${loc.country}` : null;
}

// A search result from the carrier network. Generated deterministically from
// the inquiry's reference (rather than truly at random) so a given inquiry
// always shows the same quotes — mirrors the real product's "quotes already
// generated for this inquiry" behavior instead of reshuffling on every render.
type Quote = {
  id: string;
  price: number;
  transitDays: number;
  rating: number | null;
  reviewCount: number;
  proneToDelays: boolean;
};

function seededRandom(seed: string) {
  let state = 0;
  for (let i = 0; i < seed.length; i++) state = (Math.imul(state, 31) + seed.charCodeAt(i)) | 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) | 0;
    return ((state >>> 0) % 100000) / 100000;
  };
}

function generateQuotes(inquiry: Inquiry): Quote[] {
  const rand = seededRandom(inquiry.reference);
  const basePrice = 900 + Math.floor(rand() * 300);
  const count = 6 + Math.floor(rand() * 5);
  return Array.from({ length: count }, (_, i) => {
    const hasRating = rand() > 0.15;
    return {
      id: `${inquiry.id}-${i}`,
      price: basePrice + i * (8 + Math.floor(rand() * 20)),
      transitDays: 14 + Math.floor(rand() * 24),
      rating: hasRating ? Math.round((3.4 + rand() * 1.6) * 10) / 10 : null,
      reviewCount: hasRating ? 90 + Math.floor(rand() * 420) : 0,
      proneToDelays: rand() > 0.82,
    };
  });
}

function locationCode(loc: Location) {
  return loc.city.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
}

function addDays(dateStr: string, days: number) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatLongDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

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

// UN/LOCODE-style discharge port code, e.g. Rotterdam, The Netherlands -> NLRTM.
function portCode(loc: Location) {
  const country = countryCodes[loc.country] ?? loc.country.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
  return country + loc.city.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
}

// A vendor-billed charge line on an accepted quote's invoice. Weights are
// fixed proportions of the quote's total price so every quote's line items
// always foot to its own price exactly, rather than to an unrelated total.
type LineItem = {
  vendor: string;
  vendorColor: string;
  description: string;
  unitPrice: number;
  quantityLabel: string;
  subtotal: number;
};

function buildLineItems(quote: Quote, inquiry: Inquiry): LineItem[] {
  const rand = seededRandom(`${inquiry.reference}-lineitems`);
  const totalContainers = inquiry.cargo.reduce((sum, line) => sum + line.quantity, 0);
  const fuelPct = 20 + Math.floor(rand() * 30);
  const distanceKm = 15 + Math.floor(rand() * 60);
  const destLabel = destinationTransportOptions.find((o) => o.value === inquiry.destinationTransport)?.label ?? 'Road';

  const weighted: (Omit<LineItem, 'subtotal' | 'unitPrice'> & { weight: number })[] = [
    {
      vendor: 'CA',
      vendorColor: '#0f3d3e',
      description: `${freightLabel[inquiry.mainTransport]} freight, ${inquiry.origin.city} to ${portCode(inquiry.destination)}`,
      quantityLabel: '1',
      weight: 0.5,
    },
    {
      vendor: 'TH',
      vendorColor: '#0e7490',
      description: `Terminal handling & release charges, ${inquiry.destination.city}`,
      quantityLabel: '1',
      weight: 0.16,
    },
    {
      vendor: 'CU',
      vendorColor: '#0e7490',
      description: 'Customs import clearance, including 1 HS code',
      quantityLabel: '1',
      weight: 0.04,
    },
    {
      vendor: 'DT',
      vendorColor: '#b91c1c',
      description: `${destLabel} to ${inquiry.destination.city} (${distanceKm} km)`,
      quantityLabel: `${totalContainers} container${totalContainers === 1 ? '' : 's'}`,
      weight: 0.14,
    },
    {
      vendor: 'DT',
      vendorColor: '#b91c1c',
      description: `Fuel surcharge (variable; currently ${fuelPct}%; surcharges are subject to change and are passed through at cost.)`,
      quantityLabel: '1',
      weight: 0.06,
    },
    {
      vendor: 'CU',
      vendorColor: '#0e7490',
      description: 'Documentation fee',
      quantityLabel: '1',
      weight: 0.03,
    },
    {
      vendor: 'CARGOPLOT',
      vendorColor: BRAND_MINT,
      description: 'Cargoplot',
      quantityLabel: '1',
      weight: 0.07,
    },
  ];

  let allocated = 0;
  return weighted.map((item, i) => {
    const isLast = i === weighted.length - 1;
    const subtotal = isLast ? quote.price - allocated : Math.round(quote.price * item.weight * 100) / 100;
    allocated += subtotal;
    return { ...item, unitPrice: subtotal, subtotal };
  });
}

// The route/date/incoterm/mode recap shown above the quote results,
// regardless of whether the search found anything.
// One row of the search results list: mirrors the carrier-quote card from
// CargoPlot's production Inquiries screen (mode + incoterm, agent rating,
// price, and a compact route/last-mile timeline) rather than the flat
// "no quotes yet" placeholder this mock previously showed.
function QuoteCard({
  quote,
  inquiry,
  onBook,
  onView,
  accepted = false,
  originLabel,
}: {
  quote: Quote;
  inquiry: Inquiry;
  onBook?: () => void;
  onView?: () => void;
  // Accepted mode renders the read-only summary for a Quoted/Booked inquiry:
  // a "worked together before" tag, a status pill in place of "Prone to
  // delays", and no Book now / View quote actions — the full quote detail
  // sits right below it on the page instead of behind a click-through.
  accepted?: boolean;
  originLabel?: string;
}) {
  const ModeIcon = modeIcon[inquiry.mainTransport];
  const LastLegIcon = destinationTransportOptions.find((o) => o.value === inquiry.destinationTransport)?.icon ?? Truck;
  const incotermCode = inquiry.incoterm.split(' - ')[0];
  const validTill = addDays(inquiry.readyDate, 115);

  return (
    <div className={cn(sharp, 'border p-4')}>
      {accepted && (
        <div className="mb-3 flex justify-end">
          <Badge className={cn(sharp, 'gap-1 bg-emerald-50 text-emerald-700')}>
            <Handshake className="size-3.5" /> Worked together before
          </Badge>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="flex flex-1 items-start gap-3">
          <ModeIcon className="mt-0.5 size-6 shrink-0" style={{ color: BRAND_DARK }} />
          <div>
            <p className="font-semibold">{freightLabel[inquiry.mainTransport]}</p>
            <p className="text-muted-foreground text-xs">{incotermCode}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Users className="text-muted-foreground size-4" />
          <div>
            <p className="text-sm">Multiple agents</p>
            {quote.rating ? (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={cn('size-3', i < Math.round(quote.rating!) ? 'fill-current' : 'fill-none')} />
                  ))}
                </div>
                ({quote.reviewCount})
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">No rating available</p>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className={cn(sora.className, 'text-lg font-bold')}>€{quote.price.toLocaleString()}</p>
          {accepted ? (
            <Badge
              className={cn(
                sharp,
                'mt-1',
                inquiry.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700',
              )}
            >
              {inquiry.status === 'Booked' ? 'Accepted' : 'Quoted'}
            </Badge>
          ) : (
            <>
              <p className="text-muted-foreground text-xs">Valid till {validTill}</p>
              {quote.proneToDelays && (
                <Badge className={cn(sharp, 'mt-1 bg-orange-100 text-orange-700')}>
                  <TriangleAlert className="size-3" /> Prone to delays
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="border-muted-foreground/40 size-2 shrink-0 rounded-full border" />
            <span className="border-muted-foreground/30 mx-1 h-px flex-1 border-t border-dashed" />
            <span className="border-muted-foreground/40 size-2 shrink-0 rounded-full border" />
            <span className="border-muted-foreground/30 mx-1 h-px flex-1 border-t border-dashed" />
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: BRAND_DARK }} />
            <span className="mx-1.5 h-px flex-1" style={{ backgroundColor: BRAND_DARK }} />
            <LastLegIcon className="size-4 shrink-0" style={{ color: BRAND_DARK }} />
            <span className="mx-1.5 h-px flex-1" style={{ backgroundColor: BRAND_DARK }} />
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: BRAND_DARK }} />
          </div>
          <div className="text-muted-foreground mt-1 flex justify-between text-[10px] font-medium">
            <span>{originLabel ?? locationCode(inquiry.origin)}</span>
            <span>{inquiry.destination.city}</span>
          </div>
        </div>
        {!accepted && (
          <div className="flex w-32 shrink-0 flex-col gap-1.5">
            <Button size="sm" className={sharp} style={{ backgroundColor: BRAND_MINT, color: BRAND_DARK }} onClick={onBook}>
              Book now
            </Button>
            <Button size="sm" variant="outline" className={sharp} onClick={onView}>
              View quote
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function newReference() {
  return `C${Math.floor(100 + Math.random() * 900)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function DetailField({ label, children, info }: { label: string; children: ReactNode; info?: string }) {
  return (
    <div>
      <p className="text-muted-foreground flex items-center gap-1 text-xs">
        {label}
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3" />
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        )}
      </p>
      <div className="font-medium">{children}</div>
    </div>
  );
}

function VendorBadge({ vendor, color }: { vendor: string; color: string }) {
  if (vendor === 'CARGOPLOT') {
    return (
      <span className={cn(sharp, 'flex size-6 shrink-0 items-center justify-center')} style={{ backgroundColor: color }}>
        <Image src="/cargoplot-mark.png" alt="" width={40} height={40} className="size-4" />
      </span>
    );
  }
  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {vendor}
    </span>
  );
}

// The finalized quote document for a Quoted/Booked inquiry: a read-only
// summary card (no Book now / View quote — there's nothing left to do here)
// followed by the full itemized quote, mirroring the real product's PDF-style
// quote breakdown instead of the search-in-progress quotes list.
function AcceptedQuoteDocument({ inquiry, bookedQuote }: { inquiry: Inquiry; bookedQuote?: Quote }) {
  const quote = useMemo(() => bookedQuote ?? generateQuotes(inquiry)[0], [inquiry, bookedQuote]);
  const lineItems = useMemo(() => buildLineItems(quote, inquiry), [quote, inquiry]);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const validTo = addDays(inquiry.readyDate, 115);
  const validFrom = addDays(validTo, -364);
  const totalContainers = inquiry.cargo.reduce((sum, line) => sum + line.quantity, 0);
  const ModeIcon = modeIcon[inquiry.mainTransport];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <QuoteCard quote={quote} inquiry={inquiry} accepted originLabel={portCode(inquiry.destination)} />

      <div className="mt-6">
        <h2 className={cn(sora.className, 'text-lg font-bold')}>Quote {inquiry.reference}-P1</h2>

        <h3 className={cn(sora.className, 'mt-6 font-bold')}>Shipment details</h3>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-4">
          <DetailField label="Date">{formatLongDate(inquiry.readyDate)}</DetailField>
          <DetailField label="Transport mode">
            <Badge variant="secondary" className={cn(sharp, 'gap-1')}>
              <ModeIcon className="size-3.5" /> {freightLabel[inquiry.mainTransport]}
            </Badge>
          </DetailField>
          <DetailField label="Valid from B/L onboard date">{formatLongDate(validFrom)}</DetailField>
          <DetailField label="Valid to B/L onboard date" info="The quoted rate no longer applies after this date.">
            {formatLongDate(validTo)}
          </DetailField>
          <DetailField label="Origin">{formatLocation(inquiry.origin)}</DetailField>
          <DetailField label="Destination">{formatLocation(inquiry.destination)}</DetailField>
          <DetailField label="Port of loading">
            <span className="text-muted-foreground font-normal">Not available</span>
          </DetailField>
          <DetailField label="Port of discharge">{portCode(inquiry.destination)}</DetailField>
        </div>

        <h3 className={cn(sora.className, 'mt-8 font-bold')}>Cargo specifications</h3>
        <div className="mt-3 border">
          <div className="bg-muted/30 flex items-center gap-2 border-b px-3 py-2.5 text-sm">
            <Package className="size-4" /> {totalContainers} container{totalContainers === 1 ? '' : 's'}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quantity</TableHead>
                <TableHead>Container type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiry.cargo.map((line, i) => (
                <TableRow key={i}>
                  <TableCell>{line.quantity}</TableCell>
                  <TableCell>{line.containerType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 className={cn(sora.className, 'mt-8 font-bold')}>Line items</h3>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Unit price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="flex items-center gap-2">
                  <VendorBadge vendor={item.vendor} color={item.vendorColor} />
                  {item.description}
                </TableCell>
                <TableCell className="text-right">€{item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{item.quantityLabel}</TableCell>
                <TableCell className="text-right">€{item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-2 flex justify-end gap-8 border-t pt-2 text-sm">
          <span className="text-muted-foreground">Total of EUR items</span>
          <span className="w-24 text-right">€{grandTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end gap-8 border-t pt-2 font-semibold">
          <span>Grand total</span>
          <span className="w-24 text-right">€{grandTotal.toFixed(2)}</span>
        </div>

        <ul className="text-muted-foreground mt-6 list-disc space-y-1 pl-5 text-xs">
          <li>The general terms and conditions of Cargoplot &amp; the chosen freight forwarder apply</li>
          <li>Offer valid if the on-board date (according to bill of lading or equivalent document) is within the quote validity period</li>
          <li>Cargo-related documents are provided in exchange for payment</li>
          <li>All prices are conditional upon available capacity with the selected carriers</li>
          <li>Excluding VAT, import duties, timeslot delivery, and loading and unloading equipment</li>
          <li>Extra HS codes: €7.50 per code</li>
        </ul>
      </div>
    </div>
  );
}

// One field of the spec bar: a label/value trigger that opens a popover with
// the actual editor. Kept as a plain button so every field (location,
// calendar, selects) shares the same hit target and focus styling.
function SpecField({
  label,
  value,
  placeholder,
  invalid,
  info,
  className,
  children,
}: {
  label: string;
  value: ReactNode;
  placeholder: string;
  invalid?: boolean;
  info?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex min-w-0 flex-col items-start gap-0.5 border-r px-3 py-2 text-left last:border-r-0 hover:bg-muted/40 focus:outline-none',
            className,
          )}
        >
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            {label}
            {invalid && <TriangleAlert className="text-destructive size-3" />}
            {info && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3" />
                </TooltipTrigger>
                <TooltipContent>{info}</TooltipContent>
              </Tooltip>
            )}
          </span>
          <span className={cn('truncate text-sm', !value && 'text-muted-foreground')}>{value ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn(sharp, 'w-80')}>
        {children}
      </PopoverContent>
    </Popover>
  );
}

// Shared editor for Origin and Destination: a search step (matching the
// real product's "search or enter manually" pattern) followed by a
// required/optional fields step. Kept as one component since the two only
// differ in a couple of destination-only fields.
function LocationEditor({
  kind,
  onSave,
}: {
  kind: 'origin' | 'destination';
  onSave: (loc: Location) => void;
}) {
  const [step, setStep] = useState<'search' | 'fields'>('search');
  const [viaSearch, setViaSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState('');
  const [portOfDischarge, setPortOfDischarge] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);

  function runSearch() {
    setCity(searchText.split(',')[0]?.trim() ?? '');
    setViaSearch(true);
    setStep('fields');
  }

  function enterManually() {
    setViaSearch(false);
    setStep('fields');
  }

  function save() {
    if (!city || !country) return;
    onSave({
      city,
      country,
      streetName: streetName || undefined,
      streetNumber: streetNumber || undefined,
      postalCode: postalCode || undefined,
      province: province || undefined,
      portOfDischarge: kind === 'destination' ? portOfDischarge || undefined : undefined,
      companyName: kind === 'destination' ? companyName || undefined : undefined,
    });
  }

  if (step === 'search') {
    return (
      <div>
        <p className="text-sm font-medium">
          {kind === 'origin' ? 'Specify the pick-up or transfer location' : 'Specify the delivery location'}
        </p>
        <div className="mt-3 space-y-1.5">
          <Label className="text-xs">Search location</Label>
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              placeholder="Street name + number + city"
              className={cn(sharp, 'pl-8')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <Button
          className={cn(sharp, 'mt-3 w-full')}
          style={{ backgroundColor: BRAND_DARK, color: 'white' }}
          disabled={!searchText.trim()}
          onClick={runSearch}
        >
          Search location
        </Button>
        <div className="text-muted-foreground my-3 flex items-center gap-2 text-xs">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className={cn(sharp, 'w-full')} onClick={enterManually}>
          <Pencil className="size-4" /> Enter manually
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium">
        {kind === 'origin' ? 'Specify the pick-up or transfer location' : 'Specify the delivery location'}
      </p>
      {viaSearch && (
        <Alert className={cn(sharp, 'mt-3 border-orange-300 bg-orange-50 text-orange-800')}>
          <TriangleAlert />
          <AlertDescription className="text-orange-800">
            Please check if the autocompleted fields below are correct
          </AlertDescription>
        </Alert>
      )}
      <p className="text-muted-foreground mt-3 text-xs font-semibold">Required fields</p>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Label htmlFor={`${kind}-city`} className="text-xs">
            City
          </Label>
          <Input id={`${kind}-city`} className={sharp} value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className={cn(sharp, 'w-full')}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 text-xs font-semibold">Optional fields</p>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        {kind === 'destination' && (
          <div className="col-span-2 grid gap-1">
            <Label className="text-xs">Port of discharge</Label>
            <Input
              className={sharp}
              placeholder="Optional — leave blank if you don't have a preference"
              value={portOfDischarge}
              onChange={(e) => setPortOfDischarge(e.target.value)}
            />
          </div>
        )}
        {kind === 'destination' && (
          <div className="grid gap-1">
            <Label className="text-xs">Company name</Label>
            <Input className={sharp} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
        )}
        <div className="grid gap-1">
          <Label className="text-xs">Street name</Label>
          <Input className={sharp} value={streetName} onChange={(e) => setStreetName(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Street number</Label>
          <Input className={sharp} value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Postal code</Label>
          <Input className={sharp} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Province / state</Label>
          <Input className={sharp} value={province} onChange={(e) => setProvince(e.target.value)} />
        </div>
      </div>

      <button
        type="button"
        className="mt-3 flex items-center gap-1.5 text-xs font-medium hover:underline"
        onClick={() => setStep('search')}
      >
        <SearchIcon className="size-3.5" /> Search again
      </button>

      {kind === 'destination' && (
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div>
            <Label htmlFor="address-book" className="text-xs">
              Save to address book
            </Label>
            <p className="text-muted-foreground text-xs">Reuse this address on future shipments.</p>
          </div>
          <Switch id="address-book" checked={saveToAddressBook} onCheckedChange={setSaveToAddressBook} />
        </div>
      )}

      <div className="mt-3 flex justify-end gap-2 border-t pt-3">
        <Button variant="ghost" size="sm" className={sharp}>
          Cancel
        </Button>
        <Button size="sm" className={sharp} style={{ backgroundColor: BRAND_DARK, color: 'white' }} disabled={!city || !country} onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
}

export function CargoplotInquiries() {
  const [view, setView] = useState<'list' | 'create' | 'results'>('list');
  const [items, setItems] = useState<Inquiry[]>(seedInquiries);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [listQuery, setListQuery] = useState('');

  // Create-flow draft state.
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [cargoMode, setCargoMode] = useState<'FCL' | 'LCL'>('FCL');
  const [cargoLines, setCargoLines] = useState<ContainerLine[]>([{ quantity: 1, containerType: containerTypes[1] }]);
  const [lclVolume, setLclVolume] = useState('');
  const [lclWeight, setLclWeight] = useState('');
  const [readyDate, setReadyDate] = useState<Date | undefined>();
  const [incoterm, setIncoterm] = useState<string | null>(null);
  const [mainTransport, setMainTransport] = useState<TransportMode | null>(null);
  const [destinationTransport, setDestinationTransport] = useState<string | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [description, setDescription] = useState('');

  // Results-flow state: which order the generated quotes are sorted in, and
  // which specific quote was booked per inquiry (so the accepted-quote
  // document reflects the one actually chosen, not just the cheapest).
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'fastest'>('price-asc');
  const [acceptedQuotes, setAcceptedQuotes] = useState<Record<string, Quote>>({});
  // Inquiries whose search turned up nothing — a real (if uncommon) outcome
  // for a brand-new search, distinct from the seed inquiries which always
  // have quotes. Never touches generateQuotes itself, so it can't affect the
  // already-Quoted/Booked accepted-quote flow.
  const [failedSearchIds, setFailedSearchIds] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(
    () =>
      items.filter((inq) =>
        `${inq.reference} ${inq.origin.city} ${inq.destination.city} ${inq.description}`
          .toLowerCase()
          .includes(listQuery.trim().toLowerCase()),
      ),
    [items, listQuery],
  );

  const quotes = useMemo(() => {
    if (!activeInquiry) return [];
    if (failedSearchIds.has(activeInquiry.id)) return [];
    const generated = generateQuotes(activeInquiry);
    if (sortOrder === 'price-asc') return [...generated].sort((a, b) => a.price - b.price);
    if (sortOrder === 'price-desc') return [...generated].sort((a, b) => b.price - a.price);
    return [...generated].sort((a, b) => a.transitDays - b.transitDays);
  }, [activeInquiry, sortOrder, failedSearchIds]);

  function bookQuote(inquiry: Inquiry, quote: Quote) {
    setItems((current) => current.map((inq) => (inq.id === inquiry.id ? { ...inq, status: 'Booked' } : inq)));
    setActiveInquiry((current) => (current && current.id === inquiry.id ? { ...current, status: 'Booked' } : current));
    setAcceptedQuotes((current) => ({ ...current, [inquiry.id]: quote }));
    toast.success('Quote booked', { description: `${inquiry.reference} · €${quote.price.toLocaleString()}` });
  }

  function viewQuote(quote: Quote) {
    toast('Quote details', { description: `€${quote.price.toLocaleString()} · ${quote.transitDays} day transit` });
  }

  function resetDraft() {
    setOrigin(null);
    setDestination(null);
    setCargoMode('FCL');
    setCargoLines([{ quantity: 1, containerType: containerTypes[1] }]);
    setLclVolume('');
    setLclWeight('');
    setReadyDate(undefined);
    setIncoterm(null);
    setMainTransport(null);
    setDestinationTransport(null);
    setDescription('');
  }

  function startCreate() {
    resetDraft();
    setView('create');
  }

  // Loads a Received inquiry's saved values into the same draft state the
  // create flow uses, so its results view can reuse the create flow's
  // editable spec grid pre-filled instead of the old read-only summary bar.
  function loadDraftFromInquiry(inquiry: Inquiry) {
    setOrigin(inquiry.origin);
    setDestination(inquiry.destination);
    const lclLine = inquiry.cargo.length === 1 ? inquiry.cargo[0].containerType.match(/^LCL · (.*) cbm, (.*) kg$/) : null;
    if (lclLine) {
      setCargoMode('LCL');
      setLclVolume(lclLine[1] === '—' ? '' : lclLine[1]);
      setLclWeight(lclLine[2] === '—' ? '' : lclLine[2]);
    } else {
      setCargoMode('FCL');
      setCargoLines(inquiry.cargo);
      setLclVolume('');
      setLclWeight('');
    }
    setReadyDate(new Date(`${inquiry.readyDate}T00:00:00`));
    setIncoterm(incotermOptions.find((o) => o.label === inquiry.incoterm)?.value ?? null);
    setMainTransport(inquiry.mainTransport);
    setDestinationTransport(inquiry.destinationTransport);
  }

  // Applies the draft state back onto the active (Received) inquiry, so
  // editing origin/destination/cargo/etc. and hitting Search re-runs the
  // quote generation with the updated details.
  function applyInquiryEdits() {
    if (!activeInquiry || !origin || !destination) return;
    const updated: Inquiry = {
      ...activeInquiry,
      origin,
      destination,
      readyDate: readyDate ? readyDate.toISOString().slice(0, 10) : activeInquiry.readyDate,
      incoterm: incotermOptions.find((o) => o.value === incoterm)?.label ?? activeInquiry.incoterm,
      mainTransport: mainTransport ?? activeInquiry.mainTransport,
      destinationTransport: destinationTransport ?? activeInquiry.destinationTransport,
      cargo:
        cargoMode === 'FCL'
          ? cargoLines
          : [{ quantity: 1, containerType: `LCL · ${lclVolume || '—'} cbm, ${lclWeight || '—'} kg` }],
    };
    setItems((current) => current.map((inq) => (inq.id === updated.id ? updated : inq)));
    setActiveInquiry(updated);
    toast.success('Inquiry updated', { description: updated.reference });
  }

  function cargoSummary() {
    if (cargoMode === 'LCL') {
      if (!lclVolume && !lclWeight) return null;
      return `LCL · ${lclVolume || '—'} cbm, ${lclWeight || '—'} kg`;
    }
    const total = cargoLines.reduce((sum, l) => sum + l.quantity, 0);
    if (!total) return null;
    return `${total} ${cargoLines[0]?.containerType ?? ''}${cargoLines.length > 1 ? ' +' : ''}`;
  }

  const canSearch = Boolean(origin && destination);

  function submitInquiry() {
    if (!origin || !destination || !description.trim()) return;
    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      reference: newReference(),
      origin,
      destination,
      description: description.trim(),
      readyDate: readyDate ? readyDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      incoterm: incotermOptions.find((o) => o.value === incoterm)?.label ?? "I don't know yet",
      mainTransport: mainTransport ?? 'sea',
      destinationTransport: destinationTransport ?? 'Direct truck',
      cargo:
        cargoMode === 'FCL'
          ? cargoLines
          : [{ quantity: 1, containerType: `LCL · ${lclVolume || '—'} cbm, ${lclWeight || '—'} kg` }],
      requestedBy: 'Mohan Madhuv',
      status: 'Received',
    };
    setItems((current) => [inquiry, ...current]);
    setActiveInquiry(inquiry);
    setDescriptionOpen(false);
    setView('results');
    // A real search sometimes turns up nothing — simulate that outcome for
    // newly submitted inquiries instead of always guaranteeing quotes.
    if (Math.random() < 0.25) {
      setFailedSearchIds((current) => new Set(current).add(inquiry.id));
    }
  }

  // The editable spec grid: used both for composing a brand-new inquiry and,
  // pre-filled via loadDraftFromInquiry, for reconfiguring a Received one
  // before re-searching — only the Search button's behavior differs.
  function renderSpecGrid(onSearch: () => void) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 border">
          <div className="grid grid-cols-2 divide-x border-b">
            <SpecField label="Origin" value={formatLocation(origin)} placeholder="City, country">
              <LocationEditor kind="origin" onSave={setOrigin} />
            </SpecField>
            <SpecField label="Destination" value={formatLocation(destination)} placeholder="City, country">
              <LocationEditor kind="destination" onSave={setDestination} />
            </SpecField>
          </div>
          <div className="grid grid-cols-4 divide-x">
            <SpecField label="Type of cargo" value={cargoSummary()} placeholder="Add cargo">
              <div>
                <Tabs value={cargoMode} onValueChange={(v) => setCargoMode(v as typeof cargoMode)}>
                  <TabsList className={cn(sharp, 'w-full')}>
                    <TabsTrigger value="FCL" className={sharp}>
                      FCL
                    </TabsTrigger>
                    <TabsTrigger value="LCL" className={sharp}>
                      LCL
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {cargoMode === 'FCL' ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-muted-foreground text-xs">Please specify the number and types of your containers</p>
                    {cargoLines.map((line, i) => (
                      <div key={i} className="flex items-end gap-2">
                        <div className="grid w-16 gap-1">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            min={1}
                            className={sharp}
                            value={line.quantity}
                            onChange={(e) =>
                              setCargoLines((current) =>
                                current.map((l, idx) => (idx === i ? { ...l, quantity: Number(e.target.value) || 1 } : l)),
                              )
                            }
                          />
                        </div>
                        <div className="grid flex-1 gap-1">
                          <Label className="text-xs">Container type</Label>
                          <Select
                            value={line.containerType}
                            onValueChange={(v) =>
                              setCargoLines((current) => current.map((l, idx) => (idx === i ? { ...l, containerType: v } : l)))
                            }
                          >
                            <SelectTrigger className={cn(sharp, 'w-full')}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {containerTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {cargoLines.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(sharp, 'text-muted-foreground shrink-0')}
                            aria-label="Remove container"
                            onClick={() => setCargoLines((current) => current.filter((_, idx) => idx !== i))}
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className={sharp}
                      onClick={() => setCargoLines((current) => [...current, { quantity: 1, containerType: containerTypes[0] }])}
                    >
                      <Plus className="size-4" /> Add container
                    </Button>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-xs">Volume (cbm)</Label>
                      <Input className={sharp} value={lclVolume} onChange={(e) => setLclVolume(e.target.value)} />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-xs">Weight (kg)</Label>
                      <Input className={sharp} value={lclWeight} onChange={(e) => setLclWeight(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </SpecField>

            <SpecField
              label="Cargo ready date"
              value={readyDate ? readyDate.toLocaleDateString() : null}
              placeholder="Select date"
            >
              <Calendar
                mode="single"
                selected={readyDate}
                onSelect={setReadyDate}
                className="p-0"
              />
            </SpecField>

            <SpecField
              label="Incoterm"
              value={incotermOptions.find((o) => o.value === incoterm)?.label}
              placeholder="Select incoterm"
              info="The Incoterm defines who is responsible for shipping, insurance, and customs at each stage of transport."
            >
              <div className="space-y-0.5">
                {incotermOptions.map((option, i) => (
                  <div key={option.value}>
                    {i === 1 && <p className="text-muted-foreground px-2 py-1 text-xs font-semibold">Common options</p>}
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between px-2 py-1.5 text-left text-sm hover:bg-muted/60',
                        incoterm === option.value && 'bg-muted',
                      )}
                      onClick={() => setIncoterm(option.value)}
                    >
                      {option.label}
                    </button>
                  </div>
                ))}
              </div>
            </SpecField>

            <SpecField
              label="Transport modes"
              value={
                mainTransport
                  ? `${mainTransportOptions.find((o) => o.value === mainTransport)?.label} → ${destinationTransport ?? 'Direct truck'}`
                  : null
              }
              placeholder="Select modes"
              info="Main transport covers port of loading to discharge. Destination transport covers the final leg."
              className="border-r-0"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="flex size-4 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: BRAND_DARK }}
                  >
                    1
                  </span>
                  <p className="text-sm font-medium">Main transport</p>
                </div>
                <p className="text-muted-foreground ml-5.5 text-xs">Port of loading → discharge</p>
                <div className="mt-2 ml-5.5 flex gap-1.5">
                  {mainTransportOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={mainTransport === option.value ? 'default' : 'outline'}
                      size="sm"
                      className={sharp}
                      style={mainTransport === option.value ? { backgroundColor: BRAND_DARK, color: 'white' } : undefined}
                      onClick={() => setMainTransport(option.value)}
                    >
                      <option.icon className="size-4" /> {option.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className="flex size-4 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: BRAND_DARK }}
                  >
                    2
                  </span>
                  <p className="text-sm font-medium">Destination transport</p>
                </div>
                <p className="text-muted-foreground ml-5.5 text-xs">Rail and barge include the final truck leg</p>
                <div className="mt-2 ml-5.5 flex gap-1.5">
                  {destinationTransportOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={destinationTransport === option.value ? 'default' : 'outline'}
                      size="sm"
                      className={sharp}
                      style={
                        destinationTransport === option.value ? { backgroundColor: BRAND_DARK, color: 'white' } : undefined
                      }
                      onClick={() => setDestinationTransport(option.value)}
                    >
                      <option.icon className="size-4" /> {option.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" className={sharp}>
                    Cancel
                  </Button>
                  <Button size="sm" className={sharp} style={{ backgroundColor: BRAND_DARK, color: 'white' }}>
                    Save
                  </Button>
                </div>
              </div>
            </SpecField>
          </div>
        </div>
        <Button
          type="button"
          disabled={!canSearch}
          className={cn(sharp, 'shrink-0')}
          style={{ backgroundColor: BRAND_DARK, color: 'white' }}
          onClick={onSearch}
        >
          <SearchIcon className="size-4" /> Search
        </Button>
      </div>
    );
  }

  return (
    <CargoplotShell backLabel={view !== 'list' ? 'Back to Inquiries' : undefined} onBack={() => setView('list')}>
      {view === 'list' && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h1 className={cn(sora.className, 'text-xl font-bold')}>Inquiries</h1>
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
                  value={listQuery}
                  onChange={(e) => setListQuery(e.target.value)}
                />
              </div>
              <Button className={sharp} style={{ backgroundColor: BRAND_DARK, color: 'white' }} onClick={startCreate}>
                <Plus className="size-4" /> New Inquiry
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28 truncate">Reference</TableHead>
                  <TableHead className="w-44 truncate">Route</TableHead>
                  <TableHead className="truncate">Description</TableHead>
                  <TableHead className="w-28 truncate">Ready date</TableHead>
                  <TableHead className="w-16 truncate">Mode</TableHead>
                  <TableHead className="w-56 truncate">Specifications</TableHead>
                  <TableHead className="w-32 truncate">Requested by</TableHead>
                  <TableHead className="w-24 truncate">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
                      No inquiries yet. Click &ldquo;New Inquiry&rdquo; to request your first quote.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((inq) => {
                    const MainIcon = modeIcon[inq.mainTransport];
                    const cargoText = inq.cargo
                      .map((line) => `${line.quantity} ${line.containerType}`)
                      .join(', ');
                    return (
                      <TableRow
                        key={inq.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setActiveInquiry(inq);
                          if (inq.status === 'Received') loadDraftFromInquiry(inq);
                          setView('results');
                        }}
                      >
                        <TableCell className="truncate font-medium">{inq.reference}</TableCell>
                        <TableCell className="truncate">
                          <span className="font-medium">{inq.origin.city}</span>{' '}
                          <span className="text-muted-foreground">To</span>{' '}
                          <span className="font-medium">{inq.destination.city}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate">{inq.description}</TableCell>
                        <TableCell className="truncate">{inq.readyDate}</TableCell>
                        <TableCell className="truncate">
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <MainIcon className="size-4 shrink-0" />
                            <Truck className="size-4 shrink-0" />
                          </div>
                        </TableCell>
                        <TableCell className="truncate">
                          <div className="text-muted-foreground flex min-w-0 items-center gap-1.5">
                            <Package className="size-4 shrink-0" />
                            <span className="min-w-0 truncate">{cargoText}</span>
                          </div>
                        </TableCell>
                        <TableCell className="truncate">{inq.requestedBy}</TableCell>
                        <TableCell className="truncate">
                          <Badge
                            className={cn(sharp, statusStyles[inq.status])}
                            style={
                              inq.status === 'Quoted'
                                ? { backgroundColor: BRAND_MINT }
                                : inq.status === 'Booked'
                                  ? { backgroundColor: BRAND_DARK }
                                  : undefined
                            }
                          >
                            {inq.status}
                          </Badge>
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

      {view === 'create' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
            {renderSpecGrid(() => setDescriptionOpen(true))}

            <div className="mt-4 border p-6" style={{ backgroundColor: BRAND_PALE }}>
              <div className="flex items-start gap-3">
                <Bot className="mt-0.5 size-6 shrink-0" style={{ color: BRAND_DARK }} />
                <div className="flex-1">
                  <p className={cn(sora.className, 'font-bold')} style={{ color: BRAND_DARK }}>
                    Our AI assistant can help you!
                  </p>
                  <p className="mt-1 text-sm" style={{ color: BRAND_DARK }}>
                    Upload a packing list and let our AI assistant compose this inquiry for you, saving you valuable time
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                      <UploadCloud className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                      <Input
                        disabled
                        placeholder="Select the PDF file of your packing list"
                        className={cn(sharp, 'bg-white pl-8')}
                      />
                    </div>
                    <Button disabled className={sharp}>
                      <UploadCloud className="size-4" /> Upload
                    </Button>
                  </div>
                  <p className="mt-2 text-xs opacity-70" style={{ color: BRAND_DARK }}>
                    Please provide us with your feedback on this new feature, so we know how it works for you and where to
                    improve.
                  </p>
                </div>
              </div>
            </div>
          </div>
      )}

      {view === 'results' && activeInquiry && activeInquiry.status !== 'Received' && (
        <AcceptedQuoteDocument inquiry={activeInquiry} bookedQuote={acceptedQuotes[activeInquiry.id]} />
      )}

      {view === 'results' && activeInquiry && activeInquiry.status === 'Received' && quotes.length === 0 && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="p-4">{renderSpecGrid(applyInquiryEdits)}</div>
          <div className="text-muted-foreground m-auto flex max-w-xs flex-col items-center gap-2 text-center">
            <PackageSearch className="size-8" />
            <p className={cn(sora.className, 'text-foreground font-bold')}>No results found</p>
            <p className="text-sm">We couldn&apos;t find any quotes for this search. Try adjusting your inquiry and search again.</p>
          </div>
        </div>
      )}

      {view === 'results' && activeInquiry && activeInquiry.status === 'Received' && quotes.length > 0 && (
        <div className="flex min-h-0 flex-1">
          {/* Filters rail */}
          <div className="w-72 shrink-0 space-y-4 overflow-y-auto border-r p-4">
            <div className="grid gap-1">
              <Label className="text-xs">Sorting</Label>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as typeof sortOrder)}>
                <SelectTrigger className={cn(sharp, 'w-full')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={sharp}>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="fastest">Fastest transit time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-semibold">Filters</p>
              <div>
                <p className="mb-1.5 text-xs font-medium">Shipment stages</p>
                <div className="space-y-1.5">
                  {shipmentStages.map((stage, i) => (
                    <label key={stage} className="flex items-center gap-2 text-sm">
                      <Checkbox className={sharp} defaultChecked={i !== 0} />
                      {stage}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  Transit time
                  <Info className="text-muted-foreground size-3" />
                </div>
                <p className="text-muted-foreground text-xs">All transit times</p>
                <input type="range" className="mt-1 w-full accent-current" style={{ accentColor: BRAND_DARK }} />
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  Demurrage
                  <Info className="text-muted-foreground size-3" />
                </div>
                <p className="text-muted-foreground text-xs">All periods</p>
                <input type="range" className="mt-1 w-full" style={{ accentColor: BRAND_DARK }} />
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  Detention
                  <Info className="text-muted-foreground size-3" />
                </div>
                <p className="text-muted-foreground text-xs">All periods</p>
                <input type="range" className="mt-1 w-full" style={{ accentColor: BRAND_DARK }} />
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  Agent rating
                  <Info className="text-muted-foreground size-3" />
                </div>
                <p className="text-muted-foreground text-xs">All ratings</p>
                <input type="range" className="mt-1 w-full" style={{ accentColor: BRAND_DARK }} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Carriers</Label>
                <Select>
                  <SelectTrigger className={cn(sharp, 'w-full')}>
                    <SelectValue placeholder="All carriers" />
                  </SelectTrigger>
                  <SelectContent className={sharp}>
                    <SelectItem value="maersk">Maersk</SelectItem>
                    <SelectItem value="hapag">Hapag-Lloyd</SelectItem>
                    <SelectItem value="msc">MSC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Other requirements</Label>
                <Select>
                  <SelectTrigger className={cn(sharp, 'w-full')}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className={sharp}>
                    <SelectItem value="dangerous">Dangerous goods</SelectItem>
                    <SelectItem value="temperature">Temperature controlled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div>
                <p className="text-sm font-semibold">Extra options</p>
                <p className="text-muted-foreground text-xs">Additional options and services that may affect the price</p>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Special contents</Label>
                <Select>
                  <SelectTrigger className={cn(sharp, 'w-full')}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className={sharp}>
                    <SelectItem value="batteries">Batteries</SelectItem>
                    <SelectItem value="chemicals">Chemicals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Suppliers</Label>
                <Select>
                  <SelectTrigger className={cn(sharp, 'w-full')}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className={sharp}>
                    <SelectItem value="own">My own network</SelectItem>
                    <SelectItem value="cargoplot">CargoPlot network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input type="number" className={sharp} defaultValue={0} />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Unique HS codes</Label>
                  <Input type="number" className={sharp} defaultValue={1} />
                </div>
              </div>
              <label className="flex items-center justify-between text-sm">
                Insurance
                <Switch />
              </label>
              <label className="flex items-center justify-between text-sm">
                Gas measurement
                <Switch />
              </label>
              <label className="flex items-center justify-between text-sm">
                Side loader delivery
                <Switch />
              </label>
            </div>

            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-semibold">Documents</p>
              <p className="text-muted-foreground text-xs">
                Please provide us with documents which you think are relevant. For products containing chemicals/batteries,
                please provide a Material Safety Data Sheet (MSDS).
              </p>
              {['Commercial invoice', 'Packing list'].map((doc) => (
                <div key={doc} className="text-muted-foreground flex items-center gap-2 border border-dashed p-2.5 text-sm">
                  <FileText className="size-4" />
                  {doc}
                </div>
              ))}
              <div className="text-muted-foreground flex flex-col items-center gap-1 border border-dashed p-4 text-center text-xs">
                <UploadCloud className="size-5" />
                Drag and drop other files to create a new slot
              </div>
            </div>
          </div>

          {/* Quotes */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
            {renderSpecGrid(applyInquiryEdits)}
            <div className="mt-4 space-y-3">
              {quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  inquiry={activeInquiry}
                  onBook={() => bookQuote(activeInquiry, quote)}
                  onView={() => viewQuote(quote)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog open={descriptionOpen} onOpenChange={setDescriptionOpen}>
        <DialogContent className={sharp}>
          <DialogHeader>
            <DialogTitle className={sora.className}>Description</DialogTitle>
            <DialogDescription>
              Please provide a short description for this shipment (e.g. goods that are shipped, your P.O. number)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="inquiry-description" className="text-xs">
              Description
            </Label>
            <Input
              id="inquiry-description"
              autoFocus
              className={sharp}
              placeholder="Describe your shipment shortly here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              className={sharp}
              style={{ backgroundColor: BRAND_DARK, color: 'white' }}
              disabled={!description.trim()}
              onClick={submitInquiry}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CargoplotShell>
  );
}
