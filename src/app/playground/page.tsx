import { Suspense } from 'react';
import { TeamManagement } from '@/components/team-management';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TeamManagement />
    </Suspense>
  );
}
