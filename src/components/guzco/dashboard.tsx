'use client';

import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Banknote,
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  Circle,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, XAxis, YAxis } from 'recharts';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GuzcoShell } from '@/components/guzco/shell';
import {
  actionRequired,
  deliveryTimeline,
  featuredCase,
  kpis,
  loyalCustomer,
  pipelineStages,
  providerQueues,
  riskAssessment,
  riskBands,
  segmentation,
  upcomingDeadlines,
  winRateTrend,
} from '@/fixtures/guzco/dashboard';

const severityColor: Record<(typeof upcomingDeadlines)[number]['severity'], string> = {
  low: '#e4e4e7',
  medium: '#fdba74',
  high: '#f97316',
  critical: '#ef4444',
};

const toneText: Record<string, string> = {
  critical: 'text-red-600',
  success: 'text-emerald-600',
  neutral: 'text-foreground',
  accent: 'text-orange-600',
  warning: 'text-amber-600',
  high: 'text-orange-600',
};

const toneChip: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  success: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-muted text-foreground',
  accent: 'bg-orange-100 text-orange-700',
  warning: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
};

const bandBarColor: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-400',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const segmentColor: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-400',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const kpiIcons = [AlertTriangle, TrendingUp, Banknote, Timer];

const deadlinesConfig = {
  count: { label: 'Cases due', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const winRateConfig = {
  rate: { label: 'Win rate', color: 'var(--chart-1)' },
} satisfies ChartConfig;

function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="border-b pb-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

function ModuleLink({ label }: { label: string }) {
  return (
    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
      {label} <ChevronRight className="size-3.5" />
    </Button>
  );
}

export function GuzcoDashboard() {
  return (
    <GuzcoShell>
      <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Chargeback automation, risk scoring, delivery intelligence, and client segmentation — in one view.
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
          <CalendarIcon className="size-4" /> Last 90 days
        </Button>
      </div>

      <div className="flex-1 space-y-4 px-6 pb-6">
        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi, i) => {
            const Icon = kpiIcons[i];
            return (
              <Card key={kpi.label}>
                <CardContent className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{kpi.label}</p>
                    <p className={cn('mt-2 text-2xl font-semibold tabular-nums', toneText[kpi.tone])}>{kpi.value}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{kpi.helper}</p>
                  </div>
                  <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md', toneChip[kpi.tone])}>
                    <Icon className="size-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts + action required */}
        <div className="grid grid-cols-3 gap-4">
          <SectionCard title="Upcoming deadlines" description="Cases due, next 7 days">
            <ChartContainer config={deadlinesConfig} className="h-[180px] w-full">
              <BarChart data={[...upcomingDeadlines]}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {upcomingDeadlines.map((d) => (
                    <Cell key={d.day} fill={severityColor[d.severity]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </SectionCard>

          <SectionCard title="Win rate trend" description="Last 6 months">
            <ChartContainer config={winRateConfig} className="h-[180px] w-full">
              <LineChart data={[...winRateTrend]}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis hide domain={[75, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} />
              </LineChart>
            </ChartContainer>
          </SectionCard>

          <SectionCard title="Action required" description={`${actionRequired.length} claims need a response`}>
            <div className="-mx-4 -mt-2 -mb-2">
              {actionRequired.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b px-4 py-2.5 last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.id}</p>
                    <p className="text-muted-foreground truncate text-xs">{item.reason}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium tabular-nums">{item.amount}</p>
                    <p className={cn('text-xs', item.urgent ? 'text-red-600' : 'text-amber-600')}>{item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Pipeline + featured case */}
        <div className="grid grid-cols-3 gap-4">
          <SectionCard title="Dispute pipeline" description="Where every open case sits right now" className="col-span-2">
            <div className="flex items-center">
              {pipelineStages.map((stage, i) => (
                <div key={stage.label} className="flex flex-1 items-center">
                  <div className="flex flex-1 flex-col items-center gap-1 text-center">
                    <p className="text-xl font-semibold tabular-nums">{stage.count}</p>
                    <p className="text-muted-foreground text-xs">{stage.label}</p>
                  </div>
                  {i < pipelineStages.length - 1 && <ChevronRight className="text-muted-foreground/40 size-4 shrink-0" />}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent win" description={featuredCase.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">{featuredCase.provider}</Badge>
                <span className="text-muted-foreground text-xs">{featuredCase.reason}</span>
              </div>
              <p className="text-sm font-semibold tabular-nums">{featuredCase.amount}</p>
            </div>
            <p className="mt-2 text-sm font-medium">{featuredCase.customer}</p>
            <p className="text-muted-foreground text-xs">{featuredCase.order}</p>

            <div className="mt-3 space-y-1.5">
              {featuredCase.evidence.map((e) => (
                <div key={e.label} className="bg-emerald-50 flex items-start gap-2 rounded-md px-2.5 py-1.5">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-emerald-900">{e.label}</p>
                    <p className="text-[11px] text-emerald-700/80">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <p className="text-muted-foreground text-xs">{featuredCase.outcome}</p>
              <p className="text-sm font-semibold tabular-nums text-emerald-600">{featuredCase.amount}</p>
            </div>
          </SectionCard>
        </div>

        {/* Provider queues */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle>Provider queues</CardTitle>
            <CardDescription>Open cases by payment method, sorted by deadline</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue={providerQueues[0].id}>
              <TabsList>
                {providerQueues.map((q) => (
                  <TabsTrigger key={q.id} value={q.id}>
                    {q.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {providerQueues.map((queue) => (
                <TabsContent key={queue.id} value={queue.id} className="mt-4 space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {queue.stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg border p-3">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{stat.label}</p>
                        <p className={cn('mt-1 text-lg font-semibold tabular-nums', toneText[stat.tone])}>{stat.value}</p>
                        <p className="text-muted-foreground text-xs">{stat.helper}</p>
                      </div>
                    ))}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead>Evidence</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queue.rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.stage}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{row.reason}</TableCell>
                          <TableCell>
                            {row.coverage && (
                              <span className={cn('text-xs font-medium', row.coverageOk ? 'text-emerald-600' : 'text-amber-600')}>
                                {row.coverage}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5 text-xs">
                              <Circle
                                className={cn(
                                  'size-2 fill-current',
                                  row.strength === 'Strong' ? 'text-emerald-500' : 'text-amber-500',
                                )}
                              />
                              {row.strength}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">{row.amount}</TableCell>
                          <TableCell className={cn('text-right text-xs', row.urgent ? 'text-red-600 font-medium' : 'text-muted-foreground')}>
                            {row.due}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Risk scoring + delivery intelligence */}
        <div className="grid grid-cols-2 gap-4">
          <SectionCard
            title="Risk scoring"
            description={`Order ${riskAssessment.order} — evaluated just now`}
            action={<ModuleLink label="Open" />}
          >
            <div className="flex items-center gap-4">
              <div className={cn('shrink-0 text-3xl font-semibold tabular-nums', toneText[riskAssessment.band === 'Medium' ? 'warning' : 'success'])}>
                {riskAssessment.score.toFixed(2)}
              </div>
              <div className="flex-1">
                <div className="flex h-2 w-full overflow-hidden rounded-full">
                  {riskBands.map((b) => (
                    <div key={b.band} className={cn('h-full', bandBarColor[b.tone])} style={{ width: `${b.band === 'Low' || b.band === 'Medium' ? 30 : 20}%` }} />
                  ))}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {riskAssessment.passed} passed &middot; {riskAssessment.flagged} flagged
                  </span>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{riskAssessment.band} risk</Badge>
                </div>
              </div>
            </div>

            <p className="bg-muted mt-3 rounded-md px-3 py-2 text-xs">{riskAssessment.recommendation}</p>

            <div className="mt-3 space-y-1.5">
              {riskAssessment.signals.slice(0, 5).map((s) => (
                <div key={s.label} className="flex items-start gap-2 text-xs">
                  {s.status === 'passed' ? (
                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                  )}
                  <div className="min-w-0">
                    <span className="font-medium">{s.label}</span>{' '}
                    <span className="text-muted-foreground">— {s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Delivery intelligence"
            description={`Order ${deliveryTimeline.order} — tracking shipment`}
            action={<ModuleLink label="Open" />}
          >
            <div className="space-y-0">
              {deliveryTimeline.events.slice(0, 5).map((event, i, arr) => (
                <div key={event.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'mt-0.5 size-2.5 shrink-0 rounded-full',
                        event.done ? (event.current ? 'bg-orange-500' : 'bg-emerald-500') : 'bg-muted-foreground/30',
                      )}
                    />
                    {i < arr.length - 1 && <div className="bg-border my-0.5 w-px flex-1" />}
                  </div>
                  <div className={cn('min-w-0 pb-3', !event.done && 'opacity-40')}>
                    <div className="flex items-center gap-1.5">
                      {event.time && <span className="text-muted-foreground font-mono text-[11px]">{event.time}</span>}
                      <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                        {event.source}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.detail && <p className="text-muted-foreground text-xs">{event.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground border-t pt-2 text-xs">
              {deliveryTimeline.footer} &middot; {deliveryTimeline.evidenceCount} evidence items
            </p>
          </SectionCard>
        </div>

        {/* Client segmentation */}
        <div className="grid grid-cols-2 gap-4">
          <SectionCard title="Client segmentation" description="Customers by trust and revenue" action={<ModuleLink label="Open" />}>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full">
              {segmentation.map((s) => (
                <div key={s.label} className={cn('h-full', segmentColor[s.tone])} style={{ width: `${s.value}%` }} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {segmentation.map((s) => (
                <div key={s.label} className="rounded-lg border p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('size-1.5 rounded-full', segmentColor[s.tone])} />
                    <span className="text-muted-foreground text-xs">{s.label}</span>
                  </div>
                  <p className={cn('mt-1 text-lg font-semibold tabular-nums', toneText[s.tone])}>{s.value}%</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={loyalCustomer.title} description="Client lifecycle milestone">
            <div className="mb-3 flex items-center gap-1">
              {loyalCustomer.milestones.map((m, i) => (
                <div key={m.day} className="flex flex-1 items-center gap-1">
                  <div className={cn('h-1.5 flex-1 rounded-full', m.done ? (m.current ? 'bg-orange-500' : 'bg-emerald-500') : 'bg-muted')} />
                  {i < loyalCustomer.milestones.length - 1 && null}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">{loyalCustomer.milestones[loyalCustomer.milestones.length - 1].day}</p>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{loyalCustomer.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">{loyalCustomer.description}</p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Risk level</span>
                <span className="font-medium text-emerald-600">{loyalCustomer.riskLevel}%</span>
              </div>
              <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${loyalCustomer.riskLevel}%` }} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {loyalCustomer.signals.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </GuzcoShell>
  );
}
