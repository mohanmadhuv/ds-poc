'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  ChevronsUpDown,
  LayoutGrid,
  Plug,
  Scale,
  Search as SearchIcon,
  Settings,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Guzco's own brand (guzco.ai): a black "GUZCO" wordmark, warm orange accent,
// white product surface. Scoped to this mock product's own shell via the
// constants below — it does not apply to this tool's own chrome.
export const GUZCO_INK = '#0a0a0a';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/guzco' },
  { icon: Scale, label: 'Disputes', href: undefined },
  { icon: ShieldCheck, label: 'Risk Scoring', href: undefined },
  { icon: Truck, label: 'Delivery Intelligence', href: undefined },
  { icon: Users, label: 'Client Segmentation', href: undefined },
] as const;

const secondaryNavItems = [
  { icon: Plug, label: 'Integrations', href: undefined },
  { icon: Settings, label: 'Settings', href: undefined },
] as const;

interface GuzcoShellProps {
  backLabel?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function GuzcoShell({ backLabel, onBack, children }: GuzcoShellProps) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden">
      <aside
        className={cn(
          'relative flex shrink-0 flex-col text-white transition-[width] duration-200 ease-in-out',
          navCollapsed ? 'w-14' : 'w-64',
        )}
        style={{ backgroundColor: GUZCO_INK }}
      >
        <div className={cn('flex items-center px-4 py-5', navCollapsed ? 'justify-center px-0' : 'justify-between')}>
          {navCollapsed ? (
            <button
              type="button"
              aria-label="Expand sidebar"
              className="flex size-8 items-center justify-center rounded-md bg-orange-500 text-sm font-bold text-white"
              onClick={() => setNavCollapsed(false)}
            >
              G
            </button>
          ) : (
            <>
              <span className="text-lg font-bold tracking-tight text-white">
                GUZCO<span className="text-orange-500">.</span>
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Collapse sidebar"
                onClick={() => setNavCollapsed(true)}
              >
                <ArrowLeft className="size-4" />
              </Button>
            </>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const active = item.href ? pathname === item.href : false;
            const button = (
              <Button
                variant="ghost"
                title={navCollapsed ? item.label : undefined}
                aria-label={item.label}
                className={cn(
                  'h-9 w-full gap-2.5 rounded-md px-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white',
                  navCollapsed ? 'justify-center px-0' : 'justify-start',
                  active && 'bg-white/10 text-white',
                )}
              >
                <item.icon className={cn('size-4 shrink-0', active && 'text-orange-500')} />
                {!navCollapsed && <span className="truncate">{item.label}</span>}
              </Button>
            );
            return item.href ? (
              <Link key={item.label} href={item.href}>
                {button}
              </Link>
            ) : (
              <div key={item.label}>{button}</div>
            );
          })}

          <div className="my-2 border-t border-white/10" />

          {secondaryNavItems.map((item) => (
            <div key={item.label}>
              <Button
                variant="ghost"
                title={navCollapsed ? item.label : undefined}
                aria-label={item.label}
                className={cn(
                  'h-9 w-full gap-2.5 rounded-md px-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white',
                  navCollapsed ? 'justify-center px-0' : 'justify-start',
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!navCollapsed && <span className="truncate">{item.label}</span>}
              </Button>
            </div>
          ))}
        </nav>

        <div className={cn('flex items-center gap-2 border-t border-white/10 px-3 py-3', navCollapsed && 'justify-center px-0')}>
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-orange-500 text-xs font-semibold text-white">SB</AvatarFallback>
          </Avatar>
          {!navCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Sanne de Boer</p>
                <p className="truncate text-xs text-white/50">Disputes Lead</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="relative text-white/50 hover:bg-white/10 hover:text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="size-3.5" />
                    <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-orange-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72">
                  <p className="text-sm font-medium">7 disputes due this week</p>
                  <p className="text-muted-foreground mt-1 text-sm">Sunday has the heaviest deadline load — 7 cases.</p>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="text-white/50 hover:bg-white/10 hover:text-white">
                    <ChevronsUpDown className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Account settings</DropdownMenuItem>
                  <DropdownMenuItem>Switch workspace</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </aside>

      <div className="light bg-background text-foreground flex min-h-0 flex-1 flex-col">
        <header className="relative flex h-16 shrink-0 items-center border-b px-6">
          {backLabel && (
            <button
              type="button"
              className="text-muted-foreground absolute left-6 flex items-center gap-1.5 text-sm hover:text-foreground"
              onClick={onBack}
            >
              <ArrowLeft className="size-4" /> {backLabel}
            </button>
          )}
          <div className="relative mx-auto w-full max-w-md">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input placeholder="Search cases, orders, customers..." className="pl-8" />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 justify-center overflow-y-auto">
          <div className="flex min-h-0 w-full max-w-[1400px] flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
