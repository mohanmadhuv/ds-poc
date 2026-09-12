export type ProjectStatus = 'In review' | 'In progress' | 'Delivered';

export type Project = {
  slug: string;
  name: string;
  description: string;
  status: ProjectStatus;
};

// Registry of client demo platforms. Each project's own product playground
// and back room (component inventory + brand foundations) live under
// src/app/<slug>/, src/components/<slug>/, and src/fixtures/<slug>/ — add a
// new entry here once that project's routes exist.
export const projects: Project[] = [
  {
    slug: 'cargoplot',
    name: 'CargoPlot',
    description: 'Freight forwarding platform — inquiries, quoting, shipments, and messaging.',
    status: 'In review',
  },
  {
    slug: 'guzco',
    name: 'Guzco',
    description: 'Dispute management platform — chargeback automation, risk scoring, delivery intelligence, and client segmentation.',
    status: 'In review',
  },
];
