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
];
