import { useState, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  DataTable,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  InlineLoading,
  InlineNotification,
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
      <Header aria-label="Carbon Agentic POC">
        <HeaderMenuButton
          aria-label="Toggle navigation"
          isActive={sideNavExpanded}
          onClick={() => setSideNavExpanded((expanded) => !expanded)}
        />
        <HeaderName prefix="Carbon">Agentic POC</HeaderName>
        <HeaderNavigation aria-label="Primary navigation">
          <HeaderMenuItem isActive={location.pathname === '/playground'} href="/playground">
            Playground
          </HeaderMenuItem>
          <HeaderMenuItem isActive={location.pathname === '/components'} href="/components">
            Components
          </HeaderMenuItem>
        </HeaderNavigation>
      </Header>
      <SideNav
        aria-label="Application navigation"
        expanded={sideNavExpanded}
        isFixedNav
        isPersistent
      >
        <SideNavItems>
          <SideNavLink as={NavLink} to="/playground" isActive={location.pathname === '/playground'}>
            Playground
          </SideNavLink>
          <SideNavLink as={NavLink} to="/components" isActive={location.pathname === '/components'}>
            Component inventory
          </SideNavLink>
        </SideNavItems>
      </SideNav>
      <main className="app-main" id="main-content">
        <Routes>
          <Route path="/" element={<NavigateToPlayground />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/components" element={<ComponentsInventory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function NavigateToPlayground() {
  return <Link className="route-forward" to="/playground">Open the playground</Link>;
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
  return (
    <>
      <PageHeader
        eyebrow="Scenario workspace"
        title="Playground"
        description="A stable Carbon workspace for generated product scenarios. Feature demos will be added here later."
      />
      <InlineNotification
        kind="info"
        lowContrast
        title="Ready for scenarios"
        subtitle="Use the component inventory to inspect the approved Carbon vocabulary before composing a workflow."
      />
      <section className="playground-grid" aria-label="POC orientation">
        <Tile>
          <p className="cds--label">Current surface</p>
          <h2 className="cds--type-heading-03">Generated scenarios</h2>
          <p>Scenario routes will preserve this shell and use deterministic fixture data.</p>
          <Button kind="primary" renderIcon={Settings} as={Link} to="/components">
            Inspect components
          </Button>
        </Tile>
        <Tile>
          <p className="cds--label">Design contract</p>
          <h2 className="cds--type-heading-03">Carbon g10</h2>
          <p>Runtime styling comes from Carbon packages. App CSS only supplies page structure.</p>
          <Tag type="blue">System ready</Tag>
        </Tile>
      </section>
    </>
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
