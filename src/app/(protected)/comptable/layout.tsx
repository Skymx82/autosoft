'use client';

import AuthGuard from '@/components/AuthGuard';

export default function ComptableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['comptable']}>
      {children}
    </AuthGuard>
  );
}
