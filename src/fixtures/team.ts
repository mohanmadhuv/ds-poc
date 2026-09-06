export type MemberRole = 'Admin' | 'Editor' | 'Viewer';
export type MemberStatus = 'Active' | 'Invited' | 'Suspended';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  lastActive: string;
};

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'member-ava',
    name: 'Ava Patel',
    email: 'ava.patel@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'member-noah',
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '12 minutes ago',
  },
  {
    id: 'member-maya',
    name: 'Maya Chen',
    email: 'maya.chen@example.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: 'Yesterday',
  },
  {
    id: 'member-jon',
    name: 'Jon Bell',
    email: 'jon.bell@example.com',
    role: 'Editor',
    status: 'Invited',
    lastActive: 'Not active yet',
  },
  {
    id: 'member-lina',
    name: 'Lina Okafor',
    email: 'lina.okafor@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastActive: 'Aug 28, 2026',
  },
];
