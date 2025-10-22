'use client';

import AuthGuard from '@/components/AuthGuard';
import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function DirecteurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['directeur']}>
      {children}
      <ChatWidget />
    </AuthGuard>
  );
}
