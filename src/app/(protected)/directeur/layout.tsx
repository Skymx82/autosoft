'use client';

import AuthGuard from '@/components/AuthGuard';

export default function DirecteurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['directeur']}>
      {children}
    </AuthGuard>
  );
}
