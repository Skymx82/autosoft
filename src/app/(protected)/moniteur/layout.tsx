'use client';

import AuthGuard from '@/components/AuthGuard';

export default function MoniteurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['moniteur']}>
      {children}
    </AuthGuard>
  );
}
