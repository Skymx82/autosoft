'use client';

import AuthGuard from '@/components/AuthGuard';

export default function SecretaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['secretaire']}>
      {children}
    </AuthGuard>
  );
}
