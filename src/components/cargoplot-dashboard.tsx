'use client';

import { useState, type ReactNode } from 'react';
import {
  Banknote,
  Minus,
  PackageSearch,
  PlaneTakeoff,
  Plus,
  Route,
  Ship,
  Star,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BRAND_DARK, CargoplotShell, sharp } from '@/components/cargoplot-shell';

function DashboardCard({
  title,
  action,
  footer,
  className,
  children,
}: {
  title: string;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col border', className)}>
      <div className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: BRAND_DARK }}>
        {title}
        {action}
      </div>
      <div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-sm">{children}</div>
      {footer && <div className="border-t px-4 py-2 text-center text-sm">{footer}</div>}
    </div>
  );
}

export function CargoplotDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <CargoplotShell>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {bannerOpen && (
          <div className="flex items-center justify-between border p-3 text-sm" style={{ backgroundColor: '#eaf1fb' }}>
            <p>Stay on top of your shipments — set up your email notification preferences.</p>
            <div className="flex shrink-0 items-center gap-4">
              <button type="button" className="font-medium underline underline-offset-2">
                Go to notification settings
              </button>
              <button type="button" aria-label="Dismiss" onClick={() => setBannerOpen(false)}>
                <X className="text-muted-foreground size-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <DashboardCard title="Shipments map" className="col-span-2">
            <div className="relative h-64 w-full overflow-hidden" style={{ backgroundColor: '#dceaf5' }}>
              <Route className="text-muted-foreground/40 absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-2 left-2 flex flex-col border bg-white">
                <Button variant="ghost" size="icon" className={cn(sharp, 'size-7 border-b')} aria-label="Zoom in">
                  <Plus className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className={cn(sharp, 'size-7')} aria-label="Zoom out">
                  <Minus className="size-3.5" />
                </Button>
              </div>
              <p className="text-muted-foreground absolute right-2 bottom-1 text-[10px]">Leaflet | © OpenStreetMap contributors</p>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Relevant inquiries"
            action={
              <button type="button" className="flex items-center gap-1 text-xs font-medium">
                <Plus className="size-3.5" /> Submit new
              </button>
            }
            footer={
              <button type="button" className="text-muted-foreground flex w-full items-center justify-center gap-1.5">
                <PackageSearch className="size-4" /> Show all
              </button>
            }
          >
            No inquiries to show
          </DashboardCard>

          <DashboardCard
            title="Favorite routes"
            action={
              <button type="button" className="flex items-center gap-1 text-xs font-medium">
                <Plus className="size-3.5" /> Add route
              </button>
            }
            footer={
              <button type="button" className="text-muted-foreground flex w-full items-center justify-center gap-1.5">
                <Star className="size-4" /> Show all
              </button>
            }
          >
            No favorite routes yet
          </DashboardCard>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <DashboardCard
            title="Latest messages"
            footer={
              <button type="button" className="text-muted-foreground flex w-full items-center justify-center gap-1.5">
                Show all
              </button>
            }
          >
            No messages to show
          </DashboardCard>
          <DashboardCard title="Departures">
            <div className="flex flex-col items-center gap-1">
              <PlaneTakeoff className="text-muted-foreground/50 size-5" />
              No shipments to show
            </div>
          </DashboardCard>
          <DashboardCard title="Arrivals">
            <div className="flex flex-col items-center gap-1">
              <Ship className="text-muted-foreground/50 size-5" />
              No shipments to show
            </div>
          </DashboardCard>
          <DashboardCard title="Open invoices">
            <div className="flex flex-col items-center gap-1">
              <Banknote className="text-muted-foreground/50 size-5" />
              No invoices to show
            </div>
          </DashboardCard>
        </div>
      </div>
    </CargoplotShell>
  );
}
