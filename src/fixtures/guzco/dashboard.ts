// Sourced from the Guzco dashboard elements collected in the DS-PoC Figma file
// (node 39:129) and cross-checked against guzco.ai's own marketing copy —
// figures are the client's real reference numbers, not placeholders.

export const kpis = [
  { label: 'At risk', value: '€14,646', helper: '56 action required', tone: 'critical' as const },
  { label: 'Win rate', value: '97.2%', helper: '2,235 closed', tone: 'success' as const },
  { label: 'Recovered', value: '€369,523', helper: 'all time', tone: 'neutral' as const },
  { label: 'Avg. handling', value: '<2 min', helper: 'per dispute', tone: 'accent' as const },
];

export const upcomingDeadlines = [
  { day: 'Today', count: 2, severity: 'medium' as const },
  { day: 'Tue', count: 0, severity: 'low' as const },
  { day: 'Wed', count: 1, severity: 'medium' as const },
  { day: 'Thu', count: 0, severity: 'low' as const },
  { day: 'Fri', count: 1, severity: 'medium' as const },
  { day: 'Sat', count: 3, severity: 'high' as const },
  { day: 'Sun', count: 7, severity: 'critical' as const },
];

export const winRateTrend = [
  { month: 'Sept', rate: 82 },
  { month: 'Oct', rate: 84.5 },
  { month: 'Nov', rate: 85 },
  { month: 'Dec', rate: 89 },
  { month: 'Jan', rate: 93 },
  { month: 'Feb', rate: 97.2 },
];

export const actionRequired = [
  { id: 'CLM-28491', reason: 'Goods Not Received', amount: '€289.95', due: 'Tomorrow', urgent: true },
  { id: 'CLM-28487', reason: 'Faulty Goods', amount: '€219.00', due: 'Tomorrow', urgent: true },
  { id: 'CLM-28483', reason: 'Goods Not Received', amount: '€459.95', due: 'In 2 days', urgent: false },
];

export const pipelineStages = [
  { label: 'Dispute received', count: 12 },
  { label: 'Gathering evidence', count: 34 },
  { label: 'Submitted', count: 21 },
  { label: 'Awaiting decision', count: 18 },
  { label: 'Won this week', count: 47 },
];

export const featuredCase = {
  id: 'CASE-4827',
  provider: 'Klarna',
  reason: 'Item not received',
  customer: 'L. van der Meer',
  order: 'ORD-4827, 3 items',
  amount: '€1,299',
  outcome: 'Won, funds returned to merchant',
  evidence: [
    { label: 'Track and trace', detail: 'PostNL, delivered 14:32' },
    { label: 'Proof of delivery', detail: 'Photo and signature on file' },
    { label: 'No support contact', detail: '0 tickets in 14 days post-delivery' },
  ],
};

export type ProviderQueue = {
  id: string;
  label: string;
  stats: { label: string; value: string; helper: string; tone: 'neutral' | 'success' | 'accent' }[];
  queueLabel: string;
  rows: {
    id: string;
    stage: string;
    reason: string;
    coverage: string;
    coverageOk: boolean;
    strength: 'Strong' | 'Partial';
    amount: string;
    due: string;
    urgent: boolean;
  }[];
};

export const providerQueues: ProviderQueue[] = [
  {
    id: 'klarna',
    label: 'Klarna',
    queueLabel: 'Klarna queue',
    stats: [
      { label: 'Klarna cases', value: '62', helper: 'open', tone: 'neutral' },
      { label: 'Filed by us', value: '184', helper: 'this month', tone: 'accent' },
      { label: 'Avg. response', value: '11h', helper: 'before deadline', tone: 'success' },
      { label: 'Missed deadlines', value: '0', helper: 'this year', tone: 'success' },
    ],
    rows: [
      { id: 'KL-91284', stage: 'Open', reason: 'Item Not Received', coverage: 'MP Eligible', coverageOk: true, strength: 'Strong', amount: '€129.95', due: 'In 2 days', urgent: false },
      { id: 'KL-91278', stage: 'Day 14 of 21', reason: 'Significant Deviation', coverage: 'MP Eligible', coverageOk: true, strength: 'Strong', amount: '€289.00', due: 'In 7 days', urgent: false },
      { id: 'KL-91275', stage: 'Open', reason: 'Item Not Received', coverage: 'MP Signature missing', coverageOk: false, strength: 'Partial', amount: '€849.00', due: 'In 3 days', urgent: false },
      { id: 'KL-91271', stage: 'Open', reason: 'Unauthorized Transaction', coverage: 'MP Eligible', coverageOk: true, strength: 'Strong', amount: '€459.50', due: 'In 1 day', urgent: true },
    ],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    queueLabel: 'PayPal queue',
    stats: [
      { label: 'PayPal cases', value: '47', helper: 'open', tone: 'neutral' },
      { label: 'In inquiry', value: '31', helper: 'before escalation', tone: 'accent' },
      { label: 'Auto-responded', value: '29', helper: 'this week', tone: 'success' },
      { label: 'SP-eligible', value: '94%', helper: 'of recent orders', tone: 'success' },
    ],
    rows: [
      { id: 'PP-48291', stage: 'Inquiry', reason: 'Item Not Received', coverage: 'SP Eligible', coverageOk: true, strength: 'Strong', amount: '€189.00', due: 'In 2 days', urgent: false },
      { id: 'PP-48287', stage: 'Inquiry', reason: 'Significantly Not As Described', coverage: 'SP Not covered', coverageOk: false, strength: 'Strong', amount: '€84.50', due: 'In 6 days', urgent: false },
      { id: 'PP-48283', stage: 'Claim', reason: 'Item Not Received', coverage: 'SP Eligible', coverageOk: true, strength: 'Partial', amount: '€312.95', due: 'In 4 days', urgent: false },
      { id: 'PP-48279', stage: 'Claim', reason: 'Unauthorised Transaction', coverage: 'SP Eligible', coverageOk: true, strength: 'Strong', amount: '€459.00', due: 'In 1 day', urgent: true },
    ],
  },
  {
    id: 'card',
    label: 'Credit card',
    queueLabel: 'Card queue',
    stats: [
      { label: 'Open cases', value: '38', helper: 'Visa + Mastercard', tone: 'neutral' },
      { label: 'Visa ratio', value: '0.42%', helper: 'below 0.65% threshold', tone: 'success' },
      { label: 'MC ratio', value: '0.38%', helper: 'well within range', tone: 'success' },
      { label: 'Filed by us', value: '126', helper: 'this month', tone: 'accent' },
    ],
    rows: [
      { id: 'CB-77129', stage: 'Visa · Representment', reason: '13.1 Merchandise Not Received', coverage: '', coverageOk: true, strength: 'Strong', amount: '€229.00', due: 'In 2 days', urgent: false },
      { id: 'CB-77124', stage: 'MC · Pre-arbitration', reason: '4853 Cardholder Dispute', coverage: '', coverageOk: true, strength: 'Strong', amount: '€548.50', due: 'In 5 days', urgent: false },
      { id: 'CB-77118', stage: 'Visa · Representment', reason: '10.4 Other Fraud, Card Absent', coverage: '', coverageOk: false, strength: 'Partial', amount: '€189.95', due: 'In 3 days', urgent: false },
      { id: 'CB-77113', stage: 'MC · Representment', reason: '4837 No Cardholder Authorization', coverage: '', coverageOk: true, strength: 'Strong', amount: '€312.00', due: 'In 1 day', urgent: true },
    ],
  },
];

export const riskAssessment = {
  order: '#38201',
  score: 0.21,
  band: 'Medium' as const,
  passed: 6,
  flagged: 1,
  recommendation: 'Monitor — enhanced monitoring, require signature on delivery.',
  signals: [
    { label: 'Address verification', detail: 'Verified residential address, 3+ year occupancy', status: 'passed' as const },
    { label: 'Delivery zone risk', detail: 'Low-risk postcode, standard delivery window', status: 'passed' as const },
    { label: 'Order velocity', detail: '1 order in 30 days — normal frequency', status: 'passed' as const },
    { label: 'Customer tenure', detail: 'Account age 14 days — new customer', status: 'flagged' as const },
    { label: 'Device fingerprint', detail: 'Recognised device, 2 prior sessions', status: 'passed' as const },
    { label: 'Payment consistency', detail: 'Card and billing address match', status: 'passed' as const },
    { label: 'Carrier reliability', detail: 'PostNL — 98.2% on-time in this zone', status: 'passed' as const },
  ],
};

export const riskBands = [
  { band: 'Low', range: '0.0 – 0.3', tone: 'success' as const, action: 'Auto-approve — ship with standard carrier.' },
  { band: 'Medium', range: '0.3 – 0.6', tone: 'warning' as const, action: 'Monitor — require signature on delivery.' },
  { band: 'High', range: '0.6 – 0.8', tone: 'high' as const, action: 'Review — photo-on-delivery required.' },
  { band: 'Critical', range: '0.8 – 1.0', tone: 'critical' as const, action: 'Block — flag for investigation.' },
];

export const deliveryTimeline = {
  order: '#38201',
  events: [
    { time: '09:02', source: 'Shopify', title: 'Order placed', detail: 'Order #38201 — €189.00 — Amsterdam', done: true },
    { time: '09:14', source: 'PostNL', title: 'Label created', detail: 'Tracking 3SPOST2847291 assigned', done: true },
    { time: '10:41', source: 'PostNL', title: 'Picked up by carrier', detail: 'Package scanned at sorting facility Nieuwegein', done: true },
    { time: '14:23', source: 'PostNL', title: 'In transit — on vehicle', detail: 'Out for delivery, Amsterdam-West route', done: true },
    { time: '15:07', source: 'PostNL', title: 'Delivery attempted', detail: 'No answer at door — driver rescheduling', done: true, current: true },
    { time: '', source: 'PostNL', title: 'Delivered — photo captured', detail: '', done: false },
    { time: '', source: 'PostNL', title: 'Delivery verified', detail: '', done: false },
  ],
  footer: 'Evidence package building — GPS, photo, signature, timestamps',
  evidenceCount: 4,
};

export const segmentation = [
  { label: 'Trusted', value: 72, tone: 'success' as const },
  { label: 'New / Unknown', value: 18, tone: 'warning' as const },
  { label: 'Flagged', value: 7, tone: 'high' as const },
  { label: 'Blocked', value: 3, tone: 'critical' as const },
];

export const loyalCustomer = {
  milestones: [
    { day: 'Day 1', label: 'First order placed', done: true },
    { day: 'Day 30', label: 'Second order, on-time payment', done: true },
    { day: 'Day 60', label: 'Third order, trust building', done: true },
    { day: 'Day 120', label: 'Loyal customer unlocked', done: true, current: true },
  ],
  title: 'Loyal customer unlocked',
  status: 'Trusted',
  description:
    'Qualifies for frictionless checkout, extended return windows, and priority shipping — increasing order value by 23%.',
  riskLevel: 8,
  signals: ['Repeat buyer', 'High CLV', 'Zero claims', 'VIP eligible'],
};
