'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sora, Instrument_Sans } from 'next/font/google';
import {
  Banknote,
  Bell,
  Box,
  ChevronsUpDown,
  Contact,
  Grip,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search as SearchIcon,
  Star,
  Store,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Brand foundations from cargoplot.com (design-system/adapters/shadcn.md and
// the Brand foundations page): Sora for headings, Instrument Sans for body,
// and a 0px border radius throughout — sharp corners, no rounding. That
// shape language is scoped to this mock product only, via `sharp` below; it
// does not apply to this tool's own chrome.
const sora = Sora({ subsets: ['latin'], weight: ['600', '700'] });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const BRAND_DARK = '#002d28';
export const BRAND_MINT = '#39f2af';
export const BRAND_PALE = '#ebf0fa';

export const sharp = 'rounded-none';

const navItems = [
  { icon: Grip, label: 'Dashboard', href: undefined },
  { icon: SearchIcon, label: 'Inquiries', href: '/inquiries' },
  { icon: Box, label: 'Shipments', href: undefined },
  { icon: Store, label: 'Deliveries', href: undefined },
  { icon: MessagesSquare, label: 'Messages', href: '/' },
  { icon: Banknote, label: 'Invoices', href: undefined },
  { icon: Star, label: 'Favorite routes', href: undefined },
  { icon: Contact, label: 'Address book', href: undefined },
] as const;

interface CargoplotShellProps {
  crumb: string;
  hasNotification?: boolean;
  notifications?: ReactNode;
  children: ReactNode;
}

export function CargoplotShell({ crumb, hasNotification, notifications, children }: CargoplotShellProps) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(instrumentSans.className, 'flex h-full min-h-0 w-full flex-1 overflow-hidden')}>
      {/* CargoPlot's own product navigation, composed from Button/Avatar/Menu
          primitives rather than reusing this tool's top-level Sidebar system
          (that machinery is scoped to this app's own chrome, not the product
          being designed inside the Playground). */}
      <aside
        className={cn(
          'relative flex shrink-0 flex-col text-white transition-[width] duration-200 ease-in-out',
          navCollapsed ? 'w-14' : 'w-56',
        )}
        style={{ backgroundColor: BRAND_DARK }}
      >
        <div className={cn('flex items-center px-4 py-5', navCollapsed && 'justify-center px-0')}>
          {navCollapsed ? (
            <Image src="/cargoplot-mark.png" alt="CargoPlot" width={200} height={200} className="size-7 rounded-sm" priority />
          ) : (
            <Image src="/cargoplot-logo.png" alt="CargoPlot" width={944} height={206} className="h-6 w-auto" priority />
          )}
        </div>
        {/* Collapse handle sits on the sidebar's own edge, straddling the
            boundary with the content pane, rather than living inline in the
            header row — the conventional placement for this control. */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-5 -right-3.5 z-20 size-7 rounded-full border border-white/10 text-white/70 shadow-sm hover:bg-white/10 hover:text-white"
          style={{ backgroundColor: BRAND_DARK }}
          aria-label={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setNavCollapsed((value) => !value)}
        >
          {navCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const active = item.href ? pathname === item.href : false;
            const button = (
              <Button
                variant="ghost"
                title={navCollapsed ? item.label : undefined}
                aria-label={item.label}
                className={cn(
                  sharp,
                  'h-9 w-full gap-2.5 px-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white',
                  navCollapsed ? 'justify-center px-0' : 'justify-start',
                  active && 'bg-white/10 text-white',
                )}
                style={active ? { color: BRAND_MINT } : undefined}
              >
                <item.icon className="size-4 shrink-0" />
                {!navCollapsed && item.label}
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
        </nav>
        <div className={cn('flex items-center gap-2 border-t border-white/10 px-3 py-3', navCollapsed && 'justify-center px-0')}>
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="text-xs" style={{ backgroundColor: BRAND_MINT, color: BRAND_DARK }}>
              AL
            </AvatarFallback>
          </Avatar>
          {!navCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Alex Lindgren</p>
                <p className="truncate text-xs text-white/60">Operations Lead</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7 text-white/60 hover:bg-white/10 hover:text-white">
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
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className={cn(sora.className, 'font-semibold')}>
                  CargoPlot
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className={cn(sora.className, 'font-semibold')}>{crumb}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto w-72">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input placeholder="Search cargo, routes..." className={cn(sharp, 'pl-8')} />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className={cn(sharp, 'relative')} aria-label="Notifications">
                <Bell className="size-4" />
                {hasNotification && (
                  <span
                    className="absolute top-1.5 right-1.5 size-1.5 rounded-full"
                    style={{ backgroundColor: BRAND_MINT }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className={cn(sharp, 'w-72')}>
              {notifications ?? <p className="text-muted-foreground text-sm">You&apos;re all caught up.</p>}
            </PopoverContent>
          </Popover>
        </header>

        {children}
      </div>
    </div>
  );
}
