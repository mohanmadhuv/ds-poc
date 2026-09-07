'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MoreVertical, Search as SearchIcon } from 'lucide-react';
import { toast } from 'sonner';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { initialTeamMembers, type MemberRole, type TeamMember } from '@/fixtures/team';

type LoadState = 'loading' | 'ready' | 'error';

const statusStyles: Record<TeamMember['status'], string> = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Invited: 'border-sky-200 bg-sky-50 text-sky-700',
  Suspended: 'border-red-200 bg-red-50 text-red-700',
};

export function TeamManagement() {
  const searchParams = useSearchParams();
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

  const requestedState = searchParams.get('state');

  const loadMembers = (recover = false) => {
    setLoadState('loading');
    const target = recover ? null : requestedState;
    window.setTimeout(() => {
      if (target === 'error') {
        setLoadState('error');
        return;
      }
      setMembers(target === 'empty' ? [] : initialTeamMembers);
      setLoadState('ready');
    }, 450);
  };

  useEffect(() => {
    setLoadState('loading');
    const timer = window.setTimeout(() => {
      if (requestedState === 'error') {
        setLoadState('error');
        return;
      }
      setMembers(requestedState === 'empty' ? [] : initialTeamMembers);
      setLoadState('ready');
    }, 450);
    return () => window.clearTimeout(timer);
  }, [requestedState]);

  const visibleMembers = members.filter((member) => {
    const matchesSearch = [member.name, member.email].some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
    setMembers((current) => [...current, newMember]);
    setInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Viewer');
    toast.success('Invitation sent', { description: `${newMember.email} was invited as ${newMember.role}.` });
  };

  const openRoleChange = (member: TeamMember) => {
    setNextRole(member.role);
    setRoleMember(member);
  };

  const handleRoleChange = () => {
    if (!roleMember) return;
    setMembers((current) =>
      current.map((member) => (member.id === roleMember.id ? { ...member, role: nextRole } : member)),
    );
    toast.success('Role updated', { description: `${roleMember.name} now has the ${nextRole} role.` });
    setRoleMember(null);
  };

  const handleRevoke = () => {
    if (!revokeMember) return;
    setMembers((current) => current.filter((member) => member.id !== revokeMember.id));
    toast.success('Access revoked', { description: `${revokeMember.name} no longer has access to this workspace.` });
    setRevokeMember(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Team</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex max-w-4xl items-start justify-between gap-6">
        <div>
          <p className="text-primary text-xs font-medium">Administration</p>
          <h1 className="mt-2 text-3xl font-normal tracking-tight">Team members</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Invite people to the workspace, manage their roles, and review access status.
          </p>
        </div>
        <Button onClick={openInvite} className="shrink-0">
          Invite member
        </Button>
      </div>

      {loadState === 'loading' && (
        <div className="grid min-h-52 max-w-lg content-center gap-3 py-10" role="status">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="border-muted-foreground/30 border-t-foreground size-4 animate-spin rounded-full border-2" />
            Loading team members
          </div>
          <p className="text-muted-foreground text-sm">Loading member access and activity.</p>
        </div>
      )}

      {loadState === 'error' && (
        <div className="mt-6 max-w-lg border-l-2 border-red-500 pl-4" role="alert">
          <h2 className="text-lg font-semibold">Team members could not load</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            There was a problem retrieving the member list. Try again to continue managing access.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => loadMembers(true)}>
            Retry loading
          </Button>
        </div>
      )}

      {loadState === 'ready' && (
        <>
          <section
            aria-label="Team member filters"
            className="mt-6 grid max-w-3xl grid-cols-1 items-end gap-4 border-y py-4 sm:grid-cols-[2fr_1fr_auto]"
          >
            <div className="grid gap-1.5">
              <Label htmlFor="team-member-search">Search members</Label>
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  id="team-member-search"
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="team-role-filter">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="team-role-filter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || roleFilter !== 'all') && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </section>

          {members.length === 0 ? (
            <EmptyMembersState onInvite={openInvite} />
          ) : visibleMembers.length === 0 ? (
            <div className="mt-6 grid max-w-lg gap-3 py-10">
              <h2 className="text-lg font-semibold">No members match these filters</h2>
              <p className="text-muted-foreground text-sm">Try a different name, email address, or role.</p>
              <Button variant="outline" className="w-fit" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <TeamMembersTable members={visibleMembers} onChangeRole={openRoleChange} onRevoke={setRevokeMember} />
          )}
        </>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
          </DialogHeader>
          {inviteError && (
            <Alert variant="destructive">
              <AlertTitle>Invitation not sent</AlertTitle>
              <AlertDescription>{inviteError}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="invite-name">Full name</Label>
              <Input id="invite-name" value={inviteName} onChange={(event) => setInviteName(event.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as MemberRole)}>
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(roleMember)} onOpenChange={(open) => !open && setRoleMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change member role</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">Choose the access level for {roleMember?.name}.</p>
          <Select value={nextRole} onValueChange={(value) => setNextRole(value as MemberRole)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Save role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(revokeMember)} onOpenChange={(open) => !open && setRevokeMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke access?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeMember?.name} will lose access to this workspace immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleRevoke}>
              Revoke access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EmptyMembersState({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="mt-6 grid max-w-lg gap-3 py-10">
      <h2 className="text-lg font-semibold">No team members yet</h2>
      <p className="text-muted-foreground text-sm">Invite your first member to start collaborating in this workspace.</p>
      <Button className="w-fit" onClick={onInvite}>
        Invite member
      </Button>
    </div>
  );
}

function TeamMembersTable({
  members,
  onChangeRole,
  onRevoke,
}: {
  members: TeamMember[];
  onChangeRole: (member: TeamMember) => void;
  onRevoke: (member: TeamMember) => void;
}) {
  return (
    <div className="mt-6 max-w-4xl overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last active</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell className="text-muted-foreground">{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <Badge className={statusStyles[member.status]}>{member.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Actions for ${member.name}`}>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onChangeRole(member)}>Change role</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onRevoke(member)}>
                      Revoke access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
