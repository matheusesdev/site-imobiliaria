// src/components/LoginForm.tsx

'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, 
      });

      if (result?.error) {
        setError('Email ou senha inválidos.');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="bg-red-100 text-red-700 p-2 rounded-md text-center">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full">Entrar</Button>
      <p className="text-center text-sm text-gray-600 mt-4">
        Não tem uma conta?{' '}
        <Link href="/registrar" className="font-semibold text-green-600 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}