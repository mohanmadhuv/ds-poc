'use client';

import { type ReactNode, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis } from 'recharts';
import { Settings, Search as SearchIcon } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { barData, donutData, lineData } from '@/fixtures/cargoplot/charts';
import { componentFamilies } from '@/fixtures/cargoplot/inventory';

const barConfig = {
  requests: { label: 'Requests', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const lineConfig = {
  requests: { label: 'Requests', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const donutConfig = {
  services: { label: 'Services' },
  healthy: { label: 'Healthy', color: 'var(--chart-1)' },
  degraded: { label: 'Degraded', color: 'var(--chart-3)' },
  down: { label: 'Down', color: 'var(--chart-5)' },
} satisfies ChartConfig;

export function ComponentsInventory() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <p className="text-primary text-xs font-medium">Approved vocabulary</p>
      <h1 className="mt-2 text-3xl font-normal tracking-tight">Component inventory</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        One representative, usable state for each of the 30 approved component families.
      </p>

      <Alert className="mt-6 max-w-3xl">
        <AlertTitle>30 approved families</AlertTitle>
        <AlertDescription>
          Examples are intentionally compact; exact APIs come from the active shadcn adapter.
        </AlertDescription>
      </Alert>

      <div className="mt-6 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <InventoryCard family="Button">
          <Button>Primary action</Button>
        </InventoryCard>

        <InventoryCard family="IconButton">
          <Button variant="ghost" size="icon" aria-label="Open settings">
            <Settings />
          </Button>
        </InventoryCard>

        <InventoryCard family="Menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InventoryCard>

        <InventoryCard family="TextField">
          <div className="grid gap-1.5">
            <Label htmlFor="inventory-name">Name</Label>
            <Input id="inventory-name" placeholder="Service name" />
          </div>
        </InventoryCard>

        <InventoryCard family="TextArea">
          <div className="grid gap-1.5">
            <Label htmlFor="inventory-notes">Notes</Label>
            <Textarea id="inventory-notes" placeholder="Add context" />
          </div>
        </InventoryCard>

        <InventoryCard family="NumberField">
          <div className="grid gap-1.5">
            <Label htmlFor="inventory-capacity">Capacity</Label>
            <Input id="inventory-capacity" type="number" defaultValue={8} min={0} />
          </div>
        </InventoryCard>

        <InventoryCard family="Select">
          <div className="grid gap-1.5">
            <Label>Environment</Label>
            <Select defaultValue="production">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </InventoryCard>

        <InventoryCard family="ComboBox">
          <Command className="w-full rounded-md border">
            <CommandInput placeholder="Choose a region" />
            <CommandList>
              <CommandEmpty>No region found.</CommandEmpty>
              <CommandGroup>
                <CommandItem>Toronto</CommandItem>
                <CommandItem>Dublin</CommandItem>
                <CommandItem>Tokyo</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </InventoryCard>

        <InventoryCard family="MultiSelect">
          <div className="flex flex-wrap gap-1.5">
            <Badge>North America</Badge>
            <Badge variant="outline">Europe</Badge>
            <Badge variant="outline">Asia</Badge>
          </div>
        </InventoryCard>

        <InventoryCard family="Checkbox">
          <div className="flex items-center gap-2">
            <Checkbox id="inventory-check" />
            <Label htmlFor="inventory-check">Include archived</Label>
          </div>
        </InventoryCard>

        <InventoryCard family="RadioGroup">
          <RadioGroup defaultValue="standard">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="standard" id="inventory-standard" />
              <Label htmlFor="inventory-standard">Standard</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="enterprise" id="inventory-enterprise" />
              <Label htmlFor="inventory-enterprise">Enterprise</Label>
            </div>
          </RadioGroup>
        </InventoryCard>

        <InventoryCard family="Switch">
          <div className="flex items-center gap-2">
            <Switch id="inventory-toggle" />
            <Label htmlFor="inventory-toggle">Auto refresh</Label>
          </div>
        </InventoryCard>

        <InventoryCard family="DatePicker">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Start date</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" />
            </PopoverContent>
          </Popover>
        </InventoryCard>

        <InventoryCard family="Search">
          <div className="relative">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input placeholder="Search services" className="pl-8" aria-label="Search services" />
          </div>
        </InventoryCard>

        <InventoryCard family="DataTable">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Checkout API</TableCell>
                <TableCell>Operational</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Catalog worker</TableCell>
                <TableCell>Degraded</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </InventoryCard>

        <InventoryCard family="Pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </InventoryCard>

        <InventoryCard family="Badge">
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Operational</Badge>
        </InventoryCard>

        <InventoryCard family="Card">
          <Card className="w-full gap-1 p-4">
            <p className="text-muted-foreground text-xs">Active services</p>
            <strong className="text-2xl font-semibold">24</strong>
          </Card>
        </InventoryCard>

        <InventoryCard family="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Service overview</TabsContent>
            <TabsContent value="activity">Recent activity</TabsContent>
          </Tabs>
        </InventoryCard>

        <InventoryCard family="Accordion">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced">
              <AccordionTrigger>Advanced details</AccordionTrigger>
              <AccordionContent>Optional operational context.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </InventoryCard>

        <InventoryCard family="Dialog">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground text-sm">This focused decision preserves page context.</p>
            </DialogContent>
          </Dialog>
        </InventoryCard>

        <InventoryCard family="Notification">
          <Alert>
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>The local action completed.</AlertDescription>
          </Alert>
        </InventoryCard>

        <InventoryCard family="Loading">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="border-muted-foreground/30 border-t-foreground size-4 animate-spin rounded-full border-2" />
            Loading data
          </div>
        </InventoryCard>

        <InventoryCard family="Skeleton">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </InventoryCard>

        <InventoryCard family="ProgressIndicator">
          <div className="grid gap-2">
            <Progress value={66} />
            <p className="text-muted-foreground text-xs">Step 2 of 3 &middot; Review</p>
          </div>
        </InventoryCard>

        <InventoryCard family="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </InventoryCard>

        <InventoryCard family="AppShell">
          <p className="text-muted-foreground text-sm">Persistent sidebar and header are visible on this page.</p>
        </InventoryCard>

        <InventoryCard family="BarChart">
          <ChartContainer config={barConfig} className="h-[180px] w-full">
            <BarChart data={[...barData]}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
            </BarChart>
          </ChartContainer>
        </InventoryCard>

        <InventoryCard family="LineChart">
          <ChartContainer config={lineConfig} className="h-[180px] w-full">
            <LineChart data={[...lineData]}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="requests" stroke="var(--color-requests)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </InventoryCard>

        <InventoryCard family="DonutChart">
          <ChartContainer config={donutConfig} className="h-[180px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={[...donutData]} dataKey="services" nameKey="status" innerRadius={40} />
            </PieChart>
          </ChartContainer>
        </InventoryCard>
      </div>
    </>
  );
}

function InventoryCard({ family, children }: { family: string; children: ReactNode }) {
  const metadata = componentFamilies.find((item) => item.name === family);
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{family}</h2>
        <p className="text-muted-foreground mt-1 text-xs">{metadata?.purpose}</p>
      </div>
      <div className="flex min-h-28 items-center px-4 py-4">{children}</div>
    </Card>
  );
}
