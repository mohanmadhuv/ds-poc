import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { projects, type ProjectStatus } from '@/fixtures/projects';

const statusStyles: Record<ProjectStatus, string> = {
  'In review': 'bg-amber-100 text-amber-700',
  'In progress': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
};

export function ProjectsList() {
  return (
    <div>
      <p className="text-primary text-xs font-medium">Client work</p>
      <h1 className="mt-2 text-3xl font-normal tracking-tight">Projects</h1>
      <p className="text-muted-foreground mt-2 max-w-lg">
        Demo platforms built for each client pitch. Open one for its product playground and back room — component
        inventory and brand foundations.
      </p>

      <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.slug} href={`/${project.slug}`} className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={cn('shrink-0', statusStyles[project.status])}>{project.status}</Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
                <ArrowRight className="text-muted-foreground mt-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
