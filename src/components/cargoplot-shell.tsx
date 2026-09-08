'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instrument_Sans } from 'next/font/google';
import {
  ArrowLeft,
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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Brand foundations from cargoplot.com (design-system/adapters/shadcn.md and
// the Brand foundations page): Sora for headings, Instrument Sans for body,
// and a 0px border radius throughout — sharp corners, no rounding. That
// shape language is scoped to this mock product only, via `sharp` below; it
// does not apply to this tool's own chrome.
const instrumentSans = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const BRAND_DARK = '#002d28';
export const BRAND_MINT = '#39f2af';
export const BRAND_PALE = '#ebf0fa';

export const sharp = 'rounded-none';

// Cap on every page's content column, applied once here so it's automatic
// for every nav item — present and future — rather than something each page
// has to remember to opt into. Keeps content from stretching edge-to-edge on
// wide monitors, per the shadcn sidebar-10 reference pattern: the shell's own
// header stays full-bleed, everything rendered as `children` gets centered
// and capped.
const contentMaxW = 'max-w-[1200px]';

const navItems = [
  { icon: Grip, label: 'Dashboard', href: '/' },
  { icon: SearchIcon, label: 'Inquiries', href: '/inquiries' },
  { icon: Box, label: 'Shipments', href: '/shipments' },
  { icon: Store, label: 'Deliveries', href: undefined },
  { icon: MessagesSquare, label: 'Messages', href: '/messages' },
  { icon: Banknote, label: 'Invoices', href: undefined },
  { icon: Star, label: 'Favorite routes', href: undefined },
  { icon: Contact, label: 'Address book', href: undefined },
] as const;

interface CargoplotShellProps {
  hasNotification?: boolean;
  notifications?: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function CargoplotShell({ hasNotification, notifications, backLabel, onBack, children }: CargoplotShellProps) {
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
          navCollapsed ? 'w-14' : 'w-64',
        )}
        style={{ backgroundColor: BRAND_DARK }}
      >
        {/* Toggle lives inline in the header row, horizontally aligned with
            the logo (chatgpt.com's pattern): expanded shows logo + a
            dedicated collapse button side by side; collapsed shrinks that
            row to a single slot where the logomark swaps to the expand icon
            on hover. */}
        <div className={cn('flex items-center px-4 py-5', navCollapsed ? 'justify-center px-0' : 'justify-between')}>
          {navCollapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className={cn(sharp, 'group relative size-9 text-white/70 hover:bg-white/10 hover:text-white')}
              aria-label="Expand sidebar"
              onClick={() => setNavCollapsed(false)}
            >
              <Image
                src="/cargoplot-mark.png"
                alt="CargoPlot"
                width={200}
                height={200}
                className="size-7 rounded-sm transition-opacity group-hover:opacity-0"
                priority
              />
              <PanelLeftOpen className="absolute size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
          ) : (
            <>
              <Image src="/cargoplot-logo.png" alt="CargoPlot" width={944} height={206} className="h-6 w-auto" priority />
              <Button
                variant="ghost"
                size="icon"
                className={cn(sharp, 'size-7 text-white/70 hover:bg-white/10 hover:text-white')}
                aria-label="Collapse sidebar"
                onClick={() => setNavCollapsed(true)}
              >
                <PanelLeftClose className="size-4" />
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(sharp, 'relative size-7 text-white/60 hover:bg-white/10 hover:text-white')}
                    aria-label="Notifications"
                  >
                    <Bell className="size-3.5" />
                    {hasNotification && (
                      <span
                        className="absolute top-1 right-1 size-1.5 rounded-full"
                        style={{ backgroundColor: BRAND_MINT }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className={cn(sharp, 'w-72')}>
                  {notifications ?? <p className="text-muted-foreground text-sm">You&apos;re all caught up.</p>}
                </PopoverContent>
              </Popover>
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
            <Input placeholder="Search cargo, routes..." className={cn(sharp, 'pl-8')} />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 justify-center overflow-hidden">
          <div className={cn('flex min-h-0 w-full flex-col', contentMaxW)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
