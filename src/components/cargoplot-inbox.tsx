'use client';

import { useMemo, useState } from 'react';
import { Sora } from 'next/font/google';
import { toast } from 'sonner';
import {
  Check,
  Mail,
  Paperclip,
  Plus,
  Search as SearchIcon,
  Send,
  Trash2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { conversations as initialConversations, teammates, type Conversation } from '@/fixtures/inbox';
import { BRAND_DARK, BRAND_MINT, BRAND_PALE, CargoplotShell, sharp } from '@/components/cargoplot-shell';

// Brand foundations from cargoplot.com (design-system/adapters/shadcn.md and
// the Brand foundations page): Sora for headings, Instrument Sans for body,
// and a 0px border radius throughout — sharp corners, no rounding. That
// shape language is scoped to this mock product only, via `sharp` below; it
// does not apply to this tool's own chrome.
const sora = Sora({ subsets: ['latin'], weight: ['600', '700'] });

const allTags = ['Urgent', 'Customs', 'Routing', 'Documentation', 'Delay', 'Booking'];

export function CargoplotInbox() {
  const [items, setItems] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const [assignee, setAssignee] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [priority, setPriority] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState<Date | undefined>();
  const [snoozeOpen, setSnoozeOpen] = useState(false);

  const [replyMode, setReplyMode] = useState<'email' | 'note'>('email');
  const [reply, setReply] = useState('');

  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [newTo, setNewTo] = useState('');
  const [newBody, setNewBody] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);

  const selected = items.find((c) => c.id === selectedId) ?? null;
  const unreadCount = items.filter((c) => c.unread).length;

  const displayed = useMemo(() => {
    const filtered = items
      .filter((c) => filter === 'all' || c.unread)
      .filter((c) =>
        `${c.name} ${c.company} ${c.preview}`.toLowerCase().includes(query.trim().toLowerCase()),
      );
    return sort === 'newest' ? filtered : [...filtered].reverse();
  }, [items, filter, query, sort]);

  function selectConversation(id: string) {
    if (id === selectedId) return;
    setSwitching(true);
    setSelectedId(id);
    setAssignee(null);
    setPriority(false);
    setSnoozeDate(undefined);
    setItems((current) => current.map((c) => (c.id === id ? { ...c, unread: false } : c)));
    window.setTimeout(() => setSwitching(false), 350);
  }

  function toggleChecked(id: string) {
    setCheckedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function markCheckedAsRead() {
    setItems((current) => current.map((c) => (checkedIds.has(c.id) ? { ...c, unread: false } : c)));
    toast.success(`Marked ${checkedIds.size} conversation${checkedIds.size === 1 ? '' : 's'} as read`);
    setCheckedIds(new Set());
  }

  function toggleTag(tag: string) {
    if (!selected) return;
    setItems((current) =>
      current.map((c) =>
        c.id === selected.id
          ? { ...c, tags: c.tags.includes(tag) ? c.tags.filter((t) => t !== tag) : [...c.tags, tag] }
          : c,
      ),
    );
  }

  function sendReply() {
    if (!selected || !reply.trim()) return;
    setItems((current) =>
      current.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [...c.messages, { id: `local-${Date.now()}`, from: 'me', text: reply.trim(), time: 'Just now' }],
            }
          : c,
      ),
    );
    toast.success(replyMode === 'email' ? 'Reply sent' : 'Internal note added', { description: selected.name });
    setReply('');
  }

  function sendNewMessage() {
    if (!newTo.trim() || !newBody.trim()) return;
    toast.success('Message sent', { description: newTo.trim() });
    setNewTo('');
    setNewBody('');
    setNewMessageOpen(false);
  }

  function deleteConversation() {
    if (!selected) return;
    setItems((current) => current.filter((c) => c.id !== selected.id));
    toast.success('Conversation deleted', { description: selected.name });
    setSelectedId(null);
    setDeleteOpen(false);
  }

  return (
    <CargoplotShell
      crumb="Inbox"
      hasNotification={unreadCount > 0}
      notifications={
        <>
          <p className="text-sm font-medium">Notifications</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {unreadCount} unread message{unreadCount === 1 ? '' : 's'} in your inbox.
          </p>
        </>
      }
    >
      <>
      <div className="flex min-h-0 flex-1">
          {/* List pane */}
          <div className="flex w-96 min-h-0 shrink-0 flex-col border-r">
            <div className="flex items-center gap-2 border-b p-3">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="flex-1">
                <TabsList className={cn(sharp, 'w-full')}>
                  <TabsTrigger value="all" className={sharp}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className={sharp}>
                    Unread
                    {unreadCount > 0 && (
                      <Badge className={cn(sharp, 'ml-1 px-1.5 py-0')} style={{ backgroundColor: BRAND_MINT, color: BRAND_DARK }}>
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                size="icon"
                className={cn(sharp, 'shrink-0')}
                style={{ backgroundColor: BRAND_DARK, color: 'white' }}
                aria-label="New message"
                onClick={() => setNewMessageOpen(true)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 border-b p-3">
              <div className="relative flex-1">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Search messages..."
                  className={cn(sharp, 'pl-8')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className={cn(sharp, 'w-28 shrink-0')} aria-label="Sort order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {checkedIds.size > 0 && (
              <div className="bg-muted flex items-center justify-between border-b px-3 py-2">
                <p className="text-xs font-medium">{checkedIds.size} selected</p>
                <Button size="sm" variant="outline" className={sharp} onClick={markCheckedAsRead}>
                  Mark as read
                </Button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {displayed.length === 0 ? (
                <div className="grid gap-2 p-6 text-center">
                  <p className="text-sm font-medium">No messages match</p>
                  <p className="text-muted-foreground text-xs">Try a different search or filter.</p>
                </div>
              ) : (
                displayed.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      'flex items-start gap-2.5 border-b p-3 transition-colors',
                      conversation.id === selectedId && 'bg-accent',
                    )}
                    style={conversation.unread && conversation.id !== selectedId ? { backgroundColor: BRAND_PALE } : undefined}
                  >
                    <Checkbox
                      className="mt-1"
                      checked={checkedIds.has(conversation.id)}
                      onCheckedChange={() => toggleChecked(conversation.id)}
                      aria-label={`Select conversation with ${conversation.name}`}
                    />
                    <Button
                      variant="ghost"
                      onClick={() => selectConversation(conversation.id)}
                      className={cn(
                        sharp,
                        'h-auto min-w-0 flex-1 items-start justify-start gap-2.5 p-0 text-left whitespace-normal hover:bg-transparent',
                      )}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-xs" style={{ backgroundColor: BRAND_DARK, color: 'white' }}>
                          {conversation.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {conversation.name}{' '}
                            <span className="text-muted-foreground font-normal">({conversation.company})</span>
                          </p>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span className="text-muted-foreground text-xs">{conversation.timestamp}</span>
                            {conversation.unread && (
                              <span className="size-1.5 rounded-full" style={{ backgroundColor: BRAND_MINT }} />
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm font-normal">{conversation.preview}</p>
                      </div>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail pane */}
          <div className="flex min-h-0 flex-1 flex-col">
            {!selected ? (
              <div className="m-auto grid max-w-xs gap-3 text-center">
                <div
                  className="mx-auto flex size-14 items-center justify-center"
                  style={{ backgroundColor: BRAND_PALE }}
                >
                  <Mail className="size-6" style={{ color: BRAND_DARK }} />
                </div>
                <h2 className={cn(sora.className, 'text-lg font-bold')}>Select a conversation</h2>
                <p className="text-muted-foreground text-sm">Choose an inquiry or shipment chat from the list on the left.</p>
              </div>
            ) : switching ? (
              <div className="grid gap-4 p-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-2/3" />
              </div>
            ) : (
              <>
                <div className="border-b p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback style={{ backgroundColor: BRAND_DARK, color: 'white' }}>
                          {selected.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={cn(sora.className, 'font-bold')}>{selected.name}</p>
                        <p className="text-muted-foreground text-sm">{selected.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="priority-switch" className="text-muted-foreground text-xs">
                          Priority
                        </Label>
                        <Switch id="priority-switch" checked={priority} onCheckedChange={setPriority} />
                      </div>
                      <Popover open={snoozeOpen} onOpenChange={setSnoozeOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className={sharp}>
                            {snoozeDate ? `Snoozed to ${snoozeDate.toLocaleDateString()}` : 'Snooze'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={snoozeDate}
                            onSelect={(date) => {
                              setSnoozeDate(date);
                              setSnoozeOpen(false);
                              if (date) toast.success('Conversation snoozed', { description: date.toLocaleDateString() });
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover open={assignOpen} onOpenChange={setAssignOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className={sharp}>
                            {assignee ?? 'Assign to'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {teammates.map((name) => (
                                  <CommandItem
                                    key={name}
                                    onSelect={() => {
                                      setAssignee(name);
                                      setAssignOpen(false);
                                    }}
                                  >
                                    <Check className={cn('size-4', assignee === name ? 'opacity-100' : 'opacity-0')} />
                                    {name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(sharp, 'text-muted-foreground hover:text-destructive')}
                        aria-label={`Delete conversation with ${selected.name}`}
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className={sharp}>
                        {tag}
                      </Badge>
                    ))}
                    <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className={cn(sharp, 'text-muted-foreground h-6 px-2 text-xs')}>
                          <Plus className="size-3" /> Tag
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {allTags.map((tag) => (
                                <CommandItem key={tag} onSelect={() => toggleTag(tag)}>
                                  <Check className={cn('size-4', selected.tags.includes(tag) ? 'opacity-100' : 'opacity-0')} />
                                  {tag}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selected.shipment && (
                    <Accordion type="single" collapsible className="mt-3">
                      <AccordionItem value="shipment" className="border-none">
                        <AccordionTrigger className="py-1.5 text-sm font-medium hover:no-underline">
                          Shipment details &middot; {selected.shipment.reference}
                        </AccordionTrigger>
                        <AccordionContent>
                          <Progress value={((selected.shipment.step + 1) / selected.shipment.steps.length) * 100} className={sharp} />
                          <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                            {selected.shipment.steps.map((step, i) => (
                              <span
                                key={step}
                                className={i <= selected.shipment!.step ? 'text-foreground font-medium' : undefined}
                              >
                                {step}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {selected.messages.map((message) => (
                    <div key={message.id} className={cn('flex', message.from === 'me' ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-md', sharp, 'px-3.5 py-2.5')} style={
                        message.from === 'me'
                          ? { backgroundColor: BRAND_MINT, color: BRAND_DARK }
                          : { backgroundColor: BRAND_PALE, color: BRAND_DARK }
                      }>
                        <p className="text-sm">{message.text}</p>
                        <p className="mt-1 text-xs opacity-60">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <RadioGroup
                    value={replyMode}
                    onValueChange={(v) => setReplyMode(v as typeof replyMode)}
                    className="mb-2 flex items-center gap-4"
                  >
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="email" id="mode-email" />
                      <Label htmlFor="mode-email" className="text-xs font-normal">
                        Email reply
                      </Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="note" id="mode-note" />
                      <Label htmlFor="mode-note" className="text-xs font-normal">
                        Internal note
                      </Label>
                    </div>
                  </RadioGroup>
                  <Textarea
                    placeholder={replyMode === 'email' ? `Reply to ${selected.name}...` : 'Add an internal note...'}
                    className={cn(sharp, 'min-h-16 resize-none')}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <Button variant="ghost" size="icon" className={cn(sharp, 'text-muted-foreground')} aria-label="Attach file">
                      <Paperclip className="size-4" />
                    </Button>
                    <Button
                      className={sharp}
                      style={{ backgroundColor: BRAND_DARK, color: 'white' }}
                      disabled={!reply.trim()}
                      onClick={sendReply}
                    >
                      <Send className="size-4" /> {replyMode === 'email' ? 'Send' : 'Add note'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className={sharp}>
          <DialogHeader>
            <DialogTitle className={sora.className}>New message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="new-to">To</Label>
              <Input id="new-to" className={sharp} placeholder="Name or company" value={newTo} onChange={(e) => setNewTo(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new-body">Message</Label>
              <Textarea id="new-body" className={cn(sharp, 'min-h-24')} value={newBody} onChange={(e) => setNewBody(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className={sharp} onClick={() => setNewMessageOpen(false)}>
              Cancel
            </Button>
            <Button className={sharp} style={{ backgroundColor: BRAND_DARK, color: 'white' }} onClick={sendNewMessage}>
              <Send className="size-4" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className={sharp}>
          <AlertDialogHeader>
            <AlertDialogTitle className={sora.className}>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected?.name} and this entire message thread will be permanently removed. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={sharp}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" className={sharp} onClick={deleteConversation}>
              Delete conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    </CargoplotShell>
  );
}
