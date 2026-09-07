'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Sora } from 'next/font/google';
import {
  ArrowLeft,
  Bot,
  Calendar as CalendarIcon,
  Columns3,
  FileText,
  Filter,
  Info,
  MapPin,
  Package,
  PackageSearch,
  Pencil,
  Plane,
  Plus,
  Route,
  Search as SearchIcon,
  Ship,
  TrainFront,
  TriangleAlert,
  Truck,
  UploadCloud,
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
} from '@/fixtures/inquiries';
import { BRAND_DARK, BRAND_MINT, BRAND_PALE, CargoplotShell, sharp } from '@/components/cargoplot-shell';

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

function formatLocation(loc: Location | null) {
  return loc ? `${loc.city}, ${loc.country}` : null;
}

function newReference() {
  return `C${Math.floor(100 + Math.random() * 900)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
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

  const filteredItems = useMemo(
    () =>
      items.filter((inq) =>
        `${inq.reference} ${inq.origin.city} ${inq.destination.city} ${inq.description}`
          .toLowerCase()
          .includes(listQuery.trim().toLowerCase()),
      ),
    [items, listQuery],
  );

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
  }

  return (
    <CargoplotShell crumb="Inquiries">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Ready date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Specifications</TableHead>
                  <TableHead>Requested by</TableHead>
                  <TableHead>Status</TableHead>
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
                          setView('results');
                        }}
                      >
                        <TableCell className="font-medium">{inq.reference}</TableCell>
                        <TableCell>
                          <span className="font-medium">{inq.origin.city}</span>{' '}
                          <span className="text-muted-foreground">To</span>{' '}
                          <span className="font-medium">{inq.destination.city}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{inq.description}</TableCell>
                        <TableCell>{inq.readyDate}</TableCell>
                        <TableCell>
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <MainIcon className="size-4" />
                            <Truck className="size-4" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <Package className="size-4" />
                            {cargoText}
                          </div>
                        </TableCell>
                        <TableCell>{inq.requestedBy}</TableCell>
                        <TableCell>
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
        <div className="flex min-h-0 flex-1">
          {/* Inquiries list rail */}
          <div className="flex w-64 shrink-0 flex-col border-r p-3">
            <button
              type="button"
              className="text-muted-foreground mb-3 flex items-center gap-1.5 text-sm hover:text-foreground"
              onClick={() => setView('list')}
            >
              <ArrowLeft className="size-4" /> Back to overview
            </button>
            <h2 className={cn(sora.className, 'text-lg font-bold')}>Inquiries</h2>
            <div className="relative mt-3">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input placeholder="Search" className={cn(sharp, 'pl-8')} />
            </div>
            <Button
              className={cn(sharp, 'mt-3')}
              style={{ backgroundColor: BRAND_DARK, color: 'white' }}
              onClick={startCreate}
            >
              <Plus className="size-4" /> New inquiry
            </Button>
            <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
              {items.map((inq) => (
                <button
                  key={inq.id}
                  type="button"
                  className="border-border/70 flex w-full flex-col items-start gap-1 border p-2.5 text-left text-sm hover:bg-muted/40"
                  onClick={() => {
                    setActiveInquiry(inq);
                    setView('results');
                  }}
                >
                  <span className="font-medium">{inq.reference}</span>
                  <span className="text-muted-foreground text-xs">{inq.description}</span>
                  <Badge className={cn(sharp, statusStyles[inq.status])}>{inq.status}</Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
            <div className="flex border">
              <div className="flex-1">
                <div className="grid grid-cols-2 divide-x border-b">
                  <SpecField label="Origin" value={formatLocation(origin)} placeholder="City, country" invalid={!origin}>
                    <LocationEditor kind="origin" onSave={setOrigin} />
                  </SpecField>
                  <SpecField
                    label="Destination"
                    value={formatLocation(destination)}
                    placeholder="City, country"
                    invalid={!destination}
                  >
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
              <button
                type="button"
                disabled={!canSearch}
                className="flex w-28 shrink-0 flex-col items-center justify-center gap-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: BRAND_DARK }}
                onClick={() => setDescriptionOpen(true)}
              >
                <SearchIcon className="size-4" />
                Search
              </button>
            </div>

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
        </div>
      )}

      {view === 'results' && activeInquiry && (
        <div className="flex min-h-0 flex-1">
          {/* Inquiries list rail */}
          <div className="flex w-64 shrink-0 flex-col border-r p-3">
            <button
              type="button"
              className="text-muted-foreground mb-3 flex items-center gap-1.5 text-sm hover:text-foreground"
              onClick={() => setView('list')}
            >
              <ArrowLeft className="size-4" /> Back to overview
            </button>
            <h2 className={cn(sora.className, 'text-lg font-bold')}>Inquiries</h2>
            <div className="relative mt-3">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input placeholder="Search" className={cn(sharp, 'pl-8')} />
            </div>
            <Button className={cn(sharp, 'mt-3')} style={{ backgroundColor: BRAND_DARK, color: 'white' }} onClick={startCreate}>
              <Plus className="size-4" /> New inquiry
            </Button>
            <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
              {items.map((inq) => (
                <button
                  key={inq.id}
                  type="button"
                  className={cn(
                    'flex w-full flex-col items-start gap-1 border p-2.5 text-left text-sm hover:bg-muted/40',
                    inq.id === activeInquiry.id ? 'border-l-4' : 'border-border/70',
                  )}
                  style={inq.id === activeInquiry.id ? { borderLeftColor: BRAND_MINT } : undefined}
                  onClick={() => setActiveInquiry(inq)}
                >
                  <span className="font-medium">{inq.reference}</span>
                  <span className="text-muted-foreground text-xs">{inq.description}</span>
                  <Badge className={cn(sharp, statusStyles[inq.status])}>{inq.status}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Filters rail */}
          <div className="w-72 shrink-0 space-y-4 overflow-y-auto border-r p-4">
            <div className="grid gap-1">
              <Label className="text-xs">Sorting</Label>
              <Select defaultValue="price-asc">
                <SelectTrigger className={cn(sharp, 'w-full')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                      <Checkbox defaultChecked={i !== 0} />
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
                  <SelectContent>
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
                  <SelectContent>
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
                  <SelectContent>
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
                  <SelectContent>
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border p-3 text-sm">
              <span className="flex items-center gap-1.5">
                <Route className="text-muted-foreground size-4" />
                <span className="font-medium">{activeInquiry.origin.city}</span>
                <span className="text-muted-foreground">to</span>
                <span className="font-medium">{activeInquiry.destination.city}</span>
              </span>
              <span className="text-muted-foreground">·</span>
              <span>{activeInquiry.readyDate}</span>
              <span className="text-muted-foreground">·</span>
              <span>{activeInquiry.incoterm}</span>
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1">
                {(() => {
                  const MainIcon = modeIcon[activeInquiry.mainTransport];
                  return <MainIcon className="size-4" />;
                })()}
                <Truck className="size-4" />
              </span>
            </div>
            <div className="text-muted-foreground m-auto flex max-w-xs flex-col items-center gap-2 text-center">
              <PackageSearch className="size-8" />
              <p className={cn(sora.className, 'text-foreground font-bold')}>No generated quotes</p>
              <p className="text-sm">
                We&apos;re gathering quotes from our carrier network for {activeInquiry.reference}. This can take a few
                minutes.
              </p>
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
