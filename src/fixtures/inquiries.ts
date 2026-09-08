export type TransportMode = 'sea' | 'air' | 'rail' | 'road';

export type ContainerLine = {
  quantity: number;
  containerType: string;
};

export type Location = {
  city: string;
  country: string;
  streetName?: string;
  streetNumber?: string;
  postalCode?: string;
  province?: string;
  portOfDischarge?: string;
  companyName?: string;
};

export type Inquiry = {
  id: string;
  reference: string;
  origin: Location;
  destination: Location;
  description: string;
  readyDate: string;
  incoterm: string;
  mainTransport: TransportMode;
  destinationTransport: string;
  cargo: ContainerLine[];
  requestedBy: string;
  status: 'Received' | 'Quoted' | 'Booked';
};

export const incotermOptions = [
  { value: 'unknown', label: "I don't know yet" },
  { value: 'exw', label: 'EXW - Ex Works' },
  { value: 'fca', label: 'FCA - Free Carrier' },
  { value: 'fob', label: 'FOB - Free On Board' },
  { value: 'dap', label: 'DAP - Delivered At Place' },
];

export const containerTypes = [
  "20' standard dry container",
  "40' standard dry container",
  "40' high cube container",
  "20' refrigerated container",
];

export const shipmentStages = ['Export & Handling', 'Local Charges and Transit', 'Import', 'Handling', 'Delivery'];

export const inquiries: Inquiry[] = [
  {
    id: 'c697-xmm6',
    reference: 'C697-XMM6',
    origin: { city: 'Amsterdam', country: 'The Netherlands' },
    destination: { city: 'Ottawa', country: 'Canada' },
    description: 'Machine parts, PO 88213',
    readyDate: '2026-09-05',
    incoterm: 'FCA - Free Carrier',
    mainTransport: 'air',
    destinationTransport: 'Road',
    cargo: [{ quantity: 1, containerType: "20' standard dry container" }],
    requestedBy: 'Mohan Madhuv',
    status: 'Received',
  },
  {
    id: 'b482-tk91',
    reference: 'B482-TK91',
    origin: { city: 'Shanghai', country: 'China' },
    destination: { city: 'Los Angeles', country: 'United States' },
    description: 'Electronics components, PO 55210',
    readyDate: '2026-09-10',
    incoterm: 'FOB - Free On Board',
    mainTransport: 'sea',
    destinationTransport: 'Direct truck',
    cargo: [{ quantity: 2, containerType: "40' standard dry container" }],
    requestedBy: 'Sarah Chen',
    status: 'Quoted',
  },
  {
    id: 'a659-hlm3',
    reference: 'A659-HLM3',
    origin: { city: 'Hamburg', country: 'Germany' },
    destination: { city: 'Toronto', country: 'Canada' },
    description: 'Automotive parts, PO 91002',
    readyDate: '2026-09-12',
    incoterm: 'DAP - Delivered At Place',
    mainTransport: 'sea',
    destinationTransport: 'Rail',
    cargo: [{ quantity: 1, containerType: "40' high cube container" }],
    requestedBy: 'David Kim',
    status: 'Booked',
  },
  {
    id: 'd204-qyx8',
    reference: 'D204-QYX8',
    origin: { city: 'Dubai', country: 'United Arab Emirates' },
    destination: { city: 'Mumbai', country: 'India' },
    description: 'Textile shipment, PO 33871',
    readyDate: '2026-09-08',
    incoterm: 'EXW - Ex Works',
    mainTransport: 'sea',
    destinationTransport: 'Direct truck',
    cargo: [{ quantity: 3, containerType: "20' standard dry container" }],
    requestedBy: 'Aisha Rahman',
    status: 'Booked',
  },
  {
    id: 'f317-zrp2',
    reference: 'F317-ZRP2',
    origin: { city: 'New York', country: 'United States' },
    destination: { city: 'London', country: 'United Kingdom' },
    description: 'Pharmaceutical samples, PO 47790',
    readyDate: '2026-09-14',
    incoterm: "I don't know yet",
    mainTransport: 'air',
    destinationTransport: 'Direct truck',
    cargo: [{ quantity: 1, containerType: "20' refrigerated container" }],
    requestedBy: 'Emily Novak',
    status: 'Quoted',
  },
  {
    id: 'g845-mnb6',
    reference: 'G845-MNB6',
    origin: { city: 'Rotterdam', country: 'The Netherlands' },
    destination: { city: 'Casablanca', country: 'Morocco' },
    description: 'Construction equipment, PO 61245',
    readyDate: '2026-09-20',
    incoterm: 'FCA - Free Carrier',
    mainTransport: 'sea',
    destinationTransport: 'Barge',
    cargo: [
      { quantity: 1, containerType: "40' standard dry container" },
      { quantity: 1, containerType: "20' standard dry container" },
    ],
    requestedBy: 'Youssef El Amrani',
    status: 'Received',
  },
  {
    id: 'h126-vwd4',
    reference: 'H126-VWD4',
    origin: { city: 'Singapore', country: 'Singapore' },
    destination: { city: 'Sydney', country: 'Australia' },
    description: 'Consumer electronics, PO 70012',
    readyDate: '2026-09-16',
    incoterm: 'FOB - Free On Board',
    mainTransport: 'sea',
    destinationTransport: 'Direct truck',
    cargo: [{ quantity: 2, containerType: "40' high cube container" }],
    requestedBy: 'Wei Tan',
    status: 'Booked',
  },
  {
    id: 'j973-xke1',
    reference: 'J973-XKE1',
    origin: { city: 'Frankfurt', country: 'Germany' },
    destination: { city: 'Chicago', country: 'United States' },
    description: 'Industrial sensors, PO 82093',
    readyDate: '2026-09-09',
    incoterm: 'DAP - Delivered At Place',
    mainTransport: 'air',
    destinationTransport: 'Rail',
    cargo: [{ quantity: 1, containerType: "20' standard dry container" }],
    requestedBy: 'Lukas Becker',
    status: 'Received',
  },
  {
    id: 'k540-trp9',
    reference: 'K540-TRP9',
    origin: { city: 'Toronto', country: 'Canada' },
    destination: { city: 'Detroit', country: 'United States' },
    description: 'Retail packaging, PO 40218',
    readyDate: '2026-09-11',
    incoterm: 'FCA - Free Carrier',
    mainTransport: 'road',
    destinationTransport: 'Direct truck',
    cargo: [{ quantity: 1, containerType: "40' standard dry container" }],
    requestedBy: 'Priya Nair',
    status: 'Booked',
  },
  {
    id: 'm681-cjh5',
    reference: 'M681-CJH5',
    origin: { city: 'Chongqing', country: 'China' },
    destination: { city: 'Duisburg', country: 'Germany' },
    description: 'Consumer goods, PO 20456',
    readyDate: '2026-09-18',
    incoterm: 'FCA - Free Carrier',
    mainTransport: 'rail',
    destinationTransport: 'Barge',
    cargo: [{ quantity: 2, containerType: "40' standard dry container" }],
    requestedBy: 'Ji-ho Park',
    status: 'Received',
  },
];
