'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/playground', label: 'Playground' },
  { href: '/components', label: 'Component inventory' },
  { href: '/brand-foundations', label: 'Brand foundations' },
];

// Matches the easing Squarespace's own editor uses when swapping its canvas
// between editing chrome and a clean live preview.
const TRANSITION = 'duration-150 ease-[cubic-bezier(0.32,0.94,0.6,1)]';

export function AppShell({ children }: { children: ReactNode }) {
  // Single state drives everything that used to be two separate toggles
  // (preview mode and the nav panel): expanded === panel open === header
  // and outer dark container visible === content card scaled down.
  // Defaults to false so the app starts in a clean, full-bleed preview.
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded) setExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  const pathname = usePathname();
  const toggle = () => setExpanded((value) => !value);

  return (
    // The outer container: dark theme, holds the page header, the
    // background gutter revealed around the scaled-down card, and the
    // right side panel — everything except the actual page content.
    <div className="dark bg-background text-foreground flex min-h-svh flex-col">
      <div
        className={cn(
          'grid shrink-0 transition-[grid-template-rows]',
          TRANSITION,
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <header className="flex h-14 items-center gap-2 px-4">
            <span className="text-sm font-semibold tracking-tight">DS-PoC</span>
          </header>
        </div>
      </div>

      <SidebarProvider open={expanded} onOpenChange={setExpanded} className="min-h-0 flex-1">
        {/* SidebarInset is rendered before Sidebar so the sidebar's in-flow
            spacer reserves space at the end of the flex row (the right edge)
            instead of the start — required for a right-docked sidebar. The
            "light" class keeps the actual page content on the light theme
            while everything around it (this outer container) stays dark. */}
        <SidebarInset
          className={cn(
            'light bg-background text-foreground origin-center transition-[transform,border-radius]',
            TRANSITION,
            expanded && 'scale-[0.97] overflow-hidden rounded-xl',
          )}
        >
          {/* The single menu toggle lives inside the content card itself —
              pinned to the corner of the actual page viewport, not the
              outer browser window — so it moves and scales with the card
              instead of floating fixed above everything. */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            aria-label={expanded ? 'Collapse view' : 'Expand view'}
            onClick={toggle}
          >
            <ArrowUpRight />
          </Button>
          <main id="main-content" className="flex-1 px-8 py-8">
            {children}
          </main>
        </SidebarInset>
        <Sidebar side="right" collapsible="offcanvas">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>{item.label}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
