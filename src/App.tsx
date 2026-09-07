import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Content,
  DataTable,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Header,
  HeaderMenuButton,
  HeaderName,
  InlineLoading,
  InlineNotification,
  Loading,
  MultiSelect,
  Modal,
  NumberInput,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  ProgressIndicator,
  ProgressStep,
  RadioButton,
  RadioButtonGroup,
  Search,
  Select,
  SelectItem,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkeletonText,
  Tag,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TextArea,
  TextInput,
  Tile,
  Toggle,
} from '@carbon/react';
import { SimpleBarChart as BarChart, DonutChart, LineChart } from '@carbon/charts-react';
import { Settings } from '@carbon/react/icons';
import { barData, donutData, lineData } from './fixtures/charts';
import { componentFamilies } from './fixtures/inventory';
import { initialTeamMembers, type MemberRole, type TeamMember } from './fixtures/team';

const chartOptions = {
  axes: { left: { mapsTo: 'value' }, bottom: { mapsTo: 'group' } },
  height: '180px',
  toolbar: { enabled: false },
};

const lineOptions = {
  axes: { left: { mapsTo: 'value' }, bottom: { mapsTo: 'date' } },
  curve: 'curveMonotoneX' as const,
  height: '180px',
  toolbar: { enabled: false },
};

const donutOptions = {
  donut: { center: { label: 'Services' } },
  height: '180px',
  legend: { alignment: 'center' as const },
  toolbar: { enabled: false },
};

function AppShell() {
  const location = useLocation();
  const [sideNavExpanded, setSideNavExpanded] = useState(true);

  return (
    <div className="app-shell">
      <Header aria-label="DS-PoC">
        <HeaderMenuButton
          aria-label="Toggle navigation"
          isActive={sideNavExpanded}
          onClick={() => setSideNavExpanded((expanded) => !expanded)}
        />
        <HeaderName prefix="">DS-PoC</HeaderName>
      </Header>
      <SideNav
        aria-label="Application navigation"
        expanded={sideNavExpanded}
        isFixedNav
        isPersistent
      >
        <SideNavItems>
          <SideNavLink as={NavLink} to="/" isActive={location.pathname === '/'}>
            Overview
          </SideNavLink>
          <SideNavLink as={NavLink} to="/playground" isActive={location.pathname === '/playground'}>
            Playground
          </SideNavLink>
          <SideNavLink as={NavLink} to="/components" isActive={location.pathname === '/components'}>
            Component inventory
          </SideNavLink>
        </SideNavItems>
      </SideNav>
      <Content className="app-main" id="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/components" element={<ComponentsInventory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
    </div>
  );
}

function Overview() {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <p className="doc-eyebrow">DS-PoC</p>
        <h1 className="doc-title">Mission</h1>
        <p className="doc-subtitle">What this platform is for</p>
      </header>
      <hr className="doc-divider" />
      <div className="doc-body">
        <p className="doc-lead">
          Give coding agents a single, authoritative Carbon Design System vocabulary so natural-language
          product requests turn into precise, accessible, enterprise-grade SaaS interfaces instead of
          generic AI dashboards.
        </p>
        <div className="doc-paragraphs">
          <p>
            Agents save time and avoid drift by composing only from the 30 approved Carbon component
            families and documented SaaS patterns in <code>design-system/COMPONENTS.md</code>, instead of
            inventing custom UI.
          </p>
          <p>
            Reviewers can trust generated screens because every token, state, and composition decision
            traces back to <code>design-system/DESIGN.md</code>.
          </p>
          <p>
            Teams adopting this workflow know that generated interfaces already meet Carbon&rsquo;s
            accessibility and interaction conventions, with loading, empty, error, and
            destructive-confirmation states built in from the start.
          </p>
          <p>
            The <Link to="/playground">Playground</Link> is a stable reference implementation today. The
            goal is a validated plan &rarr; generate &rarr; validate loop, defined in{' '}
            <code>agent/09-generation-validation-protocol.md</code>, that turns free-form prompts into
            Carbon UI safely.
          </p>
        </div>
      </div>
    </article>
  );
}

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="page-header">
      <p className="cds--label">{eyebrow}</p>
      <h1 className="cds--type-heading-04">{title}</h1>
      <p className="page-description">{description}</p>
    </header>
  );
}

function Playground() {
  return <TeamManagement />;
}

type LoadState = 'loading' | 'ready' | 'error';

function TeamManagement() {
  const location = useLocation();
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleMember, setRoleMember] = useState<TeamMember | null>(null);
  const [revokeMember, setRevokeMember] = useState<TeamMember | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('Viewer');
  const [nextRole, setNextRole] = useState<MemberRole>('Viewer');
  const [inviteError, setInviteError] = useState('');
  const [notification, setNotification] = useState<{ title: string; subtitle: string } | null>(null);

  const loadMembers = (recover = false) => {
    setLoadState('loading');
    const requestedState = recover ? null : new URLSearchParams(location.search).get('state');
    window.setTimeout(() => {
      if (requestedState === 'error') {
        setLoadState('error');
        return;
      }
      setMembers(requestedState === 'empty' ? [] : initialTeamMembers);
      setLoadState('ready');
    }, 450);
  };

  useEffect(() => {
    setLoadState('loading');
    const requestedState = new URLSearchParams(location.search).get('state');
    const timer = window.setTimeout(() => {
      if (requestedState === 'error') {
        setLoadState('error');
        return;
      }
      setMembers(requestedState === 'empty' ? [] : initialTeamMembers);
      setLoadState('ready');
    }, 450);
    return () => window.clearTimeout(timer);
  }, [location.search]);

  const visibleMembers = members.filter((member) => {
    const matchesSearch = [member.name, member.email].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const clearNotification = () => setNotification(null);

  const openInvite = () => {
    setInviteError('');
    setInviteOpen(true);
  };

  const handleInvite = () => {
    if (!inviteName.trim() || !inviteEmail.includes('@')) {
      setInviteError('Enter a name and a valid email address.');
      return;
    }
    const newMember: TeamMember = {
      id: `member-new-${members.length + 1}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Invited',
      lastActive: 'Not active yet',
    };
    setMembers((currentMembers) => [...currentMembers, newMember]);
    setInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Viewer');
    setNotification({ title: 'Invitation sent', subtitle: `${newMember.email} was invited as ${newMember.role}.` });
  };

  const handleRoleChange = () => {
    if (!roleMember) return;
    setMembers((currentMembers) => currentMembers.map((member) => member.id === roleMember.id ? { ...member, role: nextRole } : member));
    setNotification({ title: 'Role updated', subtitle: `${roleMember.name} now has the ${nextRole} role.` });
    setRoleMember(null);
  };

  const handleRevoke = () => {
    if (!revokeMember) return;
    setMembers((currentMembers) => currentMembers.filter((member) => member.id !== revokeMember.id));
    setNotification({ title: 'Access revoked', subtitle: `${revokeMember.name} no longer has access to this workspace.` });
    setRevokeMember(null);
  };

  const openRoleChange = (member: TeamMember) => {
    setNextRole(member.role);
    setRoleMember(member);
  };

  return (
    <>
      <div className="team-breadcrumb">
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Team</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="team-page-header">
        <PageHeader
          eyebrow="Administration"
          title="Team members"
          description="Invite people to the workspace, manage their roles, and review access status."
        />
        <Button onClick={openInvite}>Invite member</Button>
      </div>

      {notification && (
        <InlineNotification
          className="team-notification"
          kind="success"
          lowContrast
          title={notification.title}
          subtitle={notification.subtitle}
          onCloseButtonClick={clearNotification}
        />
      )}

      {loadState === 'loading' && (
        <div className="team-state" role="status">
          <Loading description="Loading team members" withOverlay={false} />
          <p>Loading member access and activity.</p>
        </div>
      )}

      {loadState === 'error' && (
        <div className="team-state team-state-error" role="alert">
          <h2 className="cds--type-heading-03">Team members could not load</h2>
          <p>There was a problem retrieving the member list. Try again to continue managing access.</p>
          <Button kind="tertiary" onClick={() => loadMembers(true)}>Retry loading</Button>
        </div>
      )}

      {loadState === 'ready' && (
        <>
          <section className="team-controls" aria-label="Team member filters">
            <Search
              id="team-member-search"
              labelText="Search members"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Select id="team-role-filter" labelText="Role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <SelectItem value="all" text="All roles" />
              <SelectItem value="Admin" text="Admin" />
              <SelectItem value="Editor" text="Editor" />
              <SelectItem value="Viewer" text="Viewer" />
            </Select>
            {(searchQuery || roleFilter !== 'all') && (
              <Button kind="ghost" onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}>Clear filters</Button>
            )}
          </section>

          {members.length === 0 ? (
            <EmptyMembersState onInvite={openInvite} />
          ) : visibleMembers.length === 0 ? (
            <div className="team-state">
              <h2 className="cds--type-heading-03">No members match these filters</h2>
              <p>Try a different name, email address, or role.</p>
              <Button kind="tertiary" onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}>Clear filters</Button>
            </div>
          ) : (
            <TeamMembersTable members={visibleMembers} onChangeRole={openRoleChange} onRevoke={setRevokeMember} />
          )}
        </>
      )}

      <InviteMemberModal
        open={inviteOpen}
        name={inviteName}
        email={inviteEmail}
        role={inviteRole}
        error={inviteError}
        onNameChange={setInviteName}
        onEmailChange={setInviteEmail}
        onRoleChange={setInviteRole}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
      />

      <Modal
        open={Boolean(roleMember)}
        modalHeading="Change member role"
        primaryButtonText="Save role"
        secondaryButtonText="Cancel"
        onRequestClose={() => setRoleMember(null)}
        onRequestSubmit={handleRoleChange}
      >
        <p className="modal-copy">Choose the access level for {roleMember?.name}.</p>
        <Select id="change-role" labelText="Role" value={nextRole} onChange={(event) => setNextRole(event.target.value as MemberRole)}>
          <SelectItem value="Admin" text="Admin" />
          <SelectItem value="Editor" text="Editor" />
          <SelectItem value="Viewer" text="Viewer" />
        </Select>
      </Modal>

      <Modal
        open={Boolean(revokeMember)}
        danger
        modalHeading="Revoke access?"
        primaryButtonText="Revoke access"
        secondaryButtonText="Cancel"
        onRequestClose={() => setRevokeMember(null)}
        onRequestSubmit={handleRevoke}
      >
        <p className="modal-copy">{revokeMember?.name} will lose access to this workspace immediately. This action cannot be undone.</p>
      </Modal>
    </>
  );
}

function EmptyMembersState({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="team-state">
      <h2 className="cds--type-heading-03">No team members yet</h2>
      <p>Invite your first member to start collaborating in this workspace.</p>
      <Button onClick={onInvite}>Invite member</Button>
    </div>
  );
}

function TeamMembersTable({ members, onChangeRole, onRevoke }: { members: TeamMember[]; onChangeRole: (member: TeamMember) => void; onRevoke: (member: TeamMember) => void }) {
  const rows = members.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    status: member.status,
    lastActive: member.lastActive,
    actions: '',
  }));
  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'lastActive', header: 'Last active' },
    { key: 'actions', header: '' },
  ];

  return (
    <DataTable rows={rows} headers={headers} isSortable>
      {({ rows: renderedRows, headers: renderedHeaders, getHeaderProps, getRowProps, getTableProps }) => (
        <div className="team-table-frame">
          <TableContainer title="Team members" description={`${members.length} member${members.length === 1 ? '' : 's'} shown`}>
            <Table {...getTableProps()} size="lg" className="team-table">
            <TableHead><TableRow>{renderedHeaders.map((header) => <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>)}</TableRow></TableHead>
            <TableBody>
              {renderedRows.map((row) => {
                const member = members.find((item) => item.id === row.id);
                if (!member) return null;
                const rowProps = getRowProps({ row });
                return (
                  <TableRow {...rowProps}>
                    {row.cells.map((cell) => {
                      if (cell.info.header === '') {
                        return <TableCell key={cell.id}><OverflowMenu aria-label={`Actions for ${member.name}`} size="sm"><OverflowMenuItem itemText="Change role" onClick={() => onChangeRole(member)} /><OverflowMenuItem itemText="Revoke access" isDelete onClick={() => onRevoke(member)} /></OverflowMenu></TableCell>;
                      }
                      if (cell.info.header === 'Status') {
                        const tagType = member.status === 'Active' ? 'green' : member.status === 'Invited' ? 'blue' : 'red';
                        return <TableCell key={cell.id}><Tag type={tagType}>{member.status}</Tag></TableCell>;
                      }
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </DataTable>
  );
}

function InviteMemberModal({ open, name, email, role, error, onNameChange, onEmailChange, onRoleChange, onClose, onSubmit }: { open: boolean; name: string; email: string; role: MemberRole; error: string; onNameChange: (value: string) => void; onEmailChange: (value: string) => void; onRoleChange: (value: MemberRole) => void; onClose: () => void; onSubmit: () => void }) {
  return (
    <Modal open={open} modalHeading="Invite team member" primaryButtonText="Send invitation" secondaryButtonText="Cancel" onRequestClose={onClose} onRequestSubmit={onSubmit}>
      {error && <InlineNotification kind="error" lowContrast title="Invitation not sent" subtitle={error} />}
      <div className="modal-form">
        <TextInput id="invite-name" labelText="Full name" value={name} onChange={(event) => onNameChange(event.target.value)} />
        <TextInput id="invite-email" labelText="Email address" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} />
        <Select id="invite-role" labelText="Role" value={role} onChange={(event) => onRoleChange(event.target.value as MemberRole)}>
          <SelectItem value="Admin" text="Admin" />
          <SelectItem value="Editor" text="Editor" />
          <SelectItem value="Viewer" text="Viewer" />
        </Select>
      </div>
    </Modal>
  );
}

function ComponentsInventory() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Approved vocabulary"
        title="Component inventory"
        description="One representative, usable state for each of the 30 approved component families."
      />
      <div className="inventory-note">
        <InlineNotification kind="info" lowContrast title="30 approved families" subtitle="Examples are intentionally compact; exact APIs come from the installed Carbon packages." />
      </div>
      <div className="inventory-grid">
        <InventoryCard family="Button"><Button>Primary action</Button></InventoryCard>
        <InventoryCard family="IconButton"><Button kind="ghost" hasIconOnly renderIcon={Settings} iconDescription="Open settings" /></InventoryCard>
        <InventoryCard family="OverflowMenu"><OverflowMenu aria-label="More actions"><OverflowMenuItem itemText="Edit" /><OverflowMenuItem itemText="Archive" /></OverflowMenu></InventoryCard>
        <InventoryCard family="TextInput"><TextInput id="inventory-name" labelText="Name" placeholder="Service name" /></InventoryCard>
        <InventoryCard family="TextArea"><TextArea id="inventory-notes" labelText="Notes" placeholder="Add context" /></InventoryCard>
        <InventoryCard family="NumberInput"><NumberInput id="inventory-capacity" label="Capacity" min={0} defaultValue={8} /></InventoryCard>
        <InventoryCard family="Select"><Select id="inventory-select" labelText="Environment" defaultValue="production"><SelectItem value="production" text="Production" /><SelectItem value="staging" text="Staging" /></Select></InventoryCard>
        <InventoryCard family="Dropdown"><Dropdown id="inventory-dropdown" titleText="Region" label="Choose a region" items={['Toronto', 'Dublin', 'Tokyo']} initialSelectedItem="Toronto" /></InventoryCard>
        <InventoryCard family="MultiSelect"><MultiSelect id="inventory-multi" titleText="Regions" label="Select regions" items={['North America', 'Europe', 'Asia']} initialSelectedItems={['North America']} /></InventoryCard>
        <InventoryCard family="Checkbox"><Checkbox id="inventory-check" labelText="Include archived" /></InventoryCard>
        <InventoryCard family="RadioButtonGroup"><RadioButtonGroup legendText="Plan" name="inventory-plan" defaultSelected="standard"><RadioButton id="standard" labelText="Standard" value="standard" /><RadioButton id="enterprise" labelText="Enterprise" value="enterprise" /></RadioButtonGroup></InventoryCard>
        <InventoryCard family="Toggle"><Toggle id="inventory-toggle" labelText="Auto refresh" /></InventoryCard>
        <InventoryCard family="DatePicker"><DatePicker datePickerType="single"><DatePickerInput id="inventory-date" labelText="Start date" placeholder="mm/dd/yyyy" /></DatePicker></InventoryCard>
        <InventoryCard family="Search"><Search labelText="Search services" placeholder="Search" /></InventoryCard>
        <InventoryCard family="DataTable"><InventoryTable /></InventoryCard>
        <InventoryCard family="Pagination"><Pagination page={1} pageSize={10} pageSizes={[10, 25, 50]} totalItems={50} onChange={() => undefined} /></InventoryCard>
        <InventoryCard family="Tag"><Tag type="green">Operational</Tag></InventoryCard>
        <InventoryCard family="Tile"><Tile><p className="cds--label">Active services</p><strong className="metric">24</strong></Tile></InventoryCard>
        <InventoryCard family="Tabs"><Tabs><TabList aria-label="Service views"><Tab>Overview</Tab><Tab>Activity</Tab></TabList><TabPanels><TabPanel><p>Service overview</p></TabPanel><TabPanel><p>Recent activity</p></TabPanel></TabPanels></Tabs></InventoryCard>
        <InventoryCard family="Accordion"><Accordion><AccordionItem title="Advanced details"><p>Optional operational context.</p></AccordionItem></Accordion></InventoryCard>
        <InventoryCard family="Modal"><Button onClick={() => setModalOpen(true)}>Open modal</Button><Modal open={modalOpen} modalHeading="Confirm action" primaryButtonText="Confirm" secondaryButtonText="Cancel" onRequestClose={() => setModalOpen(false)}><p>This focused decision preserves page context.</p></Modal></InventoryCard>
        <InventoryCard family="Notification"><InlineNotification kind="success" title="Saved" subtitle="The local action completed." /></InventoryCard>
        <InventoryCard family="Loading"><InlineLoading status="active" description="Loading data" /></InventoryCard>
        <InventoryCard family="Skeleton"><SkeletonText paragraph /></InventoryCard>
        <InventoryCard family="ProgressIndicator"><ProgressIndicator currentIndex={1}><ProgressStep label="Configure" /><ProgressStep label="Review" /><ProgressStep label="Launch" /></ProgressIndicator></InventoryCard>
        <InventoryCard family="Breadcrumb"><Breadcrumb noTrailingSlash><BreadcrumbItem href="#">Workspace</BreadcrumbItem><BreadcrumbItem href="#" isCurrentPage>Services</BreadcrumbItem></Breadcrumb></InventoryCard>
        <InventoryCard family="UI Shell"><p>Persistent Header and SideNav are visible on this page.</p></InventoryCard>
        <InventoryCard family="BarChart"><BarChart data={barData} options={chartOptions} /></InventoryCard>
        <InventoryCard family="LineChart"><LineChart data={lineData} options={lineOptions} /></InventoryCard>
        <InventoryCard family="DonutChart"><DonutChart data={donutData} options={donutOptions} /></InventoryCard>
      </div>
    </>
  );
}

function InventoryCard({ family, children }: { family: string; children: ReactNode }) {
  const metadata = componentFamilies.find((item) => item.name === family);
  return (
    <article className="inventory-card">
      <div className="inventory-card-heading">
        <h2 className="cds--type-heading-02">{family}</h2>
        <p>{metadata?.purpose}</p>
      </div>
      <div className="inventory-card-example">{children}</div>
    </article>
  );
}

function InventoryTable() {
  const rows = [
    { id: 'one', name: 'Checkout API', status: 'Operational' },
    { id: 'two', name: 'Catalog worker', status: 'Degraded' },
  ];
  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
  ];
  return (
    <DataTable rows={rows} headers={headers} isSortable>
      {({ rows: renderedRows, headers: renderedHeaders, getHeaderProps, getRowProps, getTableProps }) => (
        <TableContainer title="Services">
          <Table {...getTableProps()} className="inventory-table">
            <TableHead><TableRow>{renderedHeaders.map((header) => <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>)}</TableRow></TableHead>
            <TableBody>{renderedRows.map((row) => <TableRow {...getRowProps({ row })}>{row.cells.map((cell) => <TableCell key={cell.id}>{cell.value}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}

function NotFound() {
  return <PageHeader eyebrow="404" title="Page not found" description="Use the application navigation to return to the POC workspace." />;
}

export default function App() {
  return <AppShell />;
}
