export type Message = {
  id: string;
  from: 'them' | 'me';
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  company: string;
  initials: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  tags: string[];
  shipment?: {
    reference: string;
    step: number;
    steps: string[];
  };
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    company: 'Port Operations',
    initials: 'SJ',
    preview: 'Container MSC-4029 cleared Rotterdam customs checks successfully.',
    timestamp: '10m ago',
    unread: true,
    tags: ['Customs', 'Urgent'],
    shipment: {
      reference: 'MSC-4029',
      step: 3,
      steps: ['Booked', 'In transit', 'Customs', 'Cleared'],
    },
    messages: [
      { id: 'm1', from: 'them', text: 'Heads up — MSC-4029 just arrived at Rotterdam.', time: '9:02 AM' },
      { id: 'm2', from: 'me', text: 'Thanks Sarah, keep me posted on the customs check.', time: '9:04 AM' },
      {
        id: 'm3',
        from: 'them',
        text: 'Container MSC-4029 cleared Rotterdam customs checks successfully.',
        time: '9:21 AM',
      },
    ],
  },
  {
    id: 'robert-chen',
    name: 'Robert Chen',
    company: 'Freight Lead',
    initials: 'RC',
    preview: 'Urgent inquiry regarding route NYC-SGP updated schedule.',
    timestamp: '1h ago',
    unread: false,
    tags: ['Routing'],
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Urgent inquiry regarding route NYC-SGP updated schedule.',
        time: '8:14 AM',
      },
      { id: 'm2', from: 'them', text: 'Can you confirm the new departure window?', time: '8:15 AM' },
    ],
  },
  {
    id: 'emma-watson',
    name: 'Emma Watson',
    company: 'Hapag-Lloyd',
    initials: 'EW',
    preview: 'Final bill of lading documents attached for booking #99281.',
    timestamp: '4h ago',
    unread: false,
    tags: ['Documentation'],
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Final bill of lading documents attached for booking #99281.',
        time: '5:40 AM',
      },
    ],
  },
  {
    id: 'jan-de-nul',
    name: 'Jan De Nul',
    company: 'Customs Broker',
    initials: 'JD',
    preview: 'Gas measurement reports completed for Antwerp imports.',
    timestamp: '1d ago',
    unread: true,
    tags: ['Customs'],
    shipment: {
      reference: 'ANT-7712',
      step: 2,
      steps: ['Booked', 'In transit', 'Customs', 'Cleared'],
    },
    messages: [
      { id: 'm1', from: 'them', text: 'Starting gas measurement on the Antwerp imports today.', time: 'Yesterday' },
      { id: 'm2', from: 'them', text: 'Gas measurement reports completed for Antwerp imports.', time: 'Yesterday' },
    ],
  },
  {
    id: 'miriam-visser',
    name: 'Miriam Visser',
    company: 'Maersk',
    initials: 'MV',
    preview: 'Vessel delay notification on transpacific corridor SHA-LAX.',
    timestamp: '2d ago',
    unread: false,
    tags: ['Delay'],
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Vessel delay notification on transpacific corridor SHA-LAX.',
        time: '2 days ago',
      },
      { id: 'm2', from: 'them', text: 'Expect a 36 hour delay into Long Beach.', time: '2 days ago' },
    ],
  },
];

export const teammates = ['Alex Lindgren', 'Priya Nair', 'Tom Berg'];
