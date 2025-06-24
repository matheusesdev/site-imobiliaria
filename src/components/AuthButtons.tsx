// src/components/AuthButtons.tsx

'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <p className="text-sm hidden md:block">Olá, {session.user?.name}</p>
        {/* NOVO LINK PARA O DASHBOARD */}
        <Link href="/dashboard">
          <Button variant="ghost">Meu Painel</Button>
        </Link>
        <Link href="/dashboard/adicionar">
          <Button variant="outline">Anunciar Imóvel</Button>
        </Link>
        <Button onClick={() => signOut()} variant="destructive">
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button>Entrar</Button>
    </Link>
  );
}