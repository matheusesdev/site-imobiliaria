// src/app/registrar/page.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { registerUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
    );
}

export default function RegisterPage() {
    // Remove useFormState, use local state for error/success if needed

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Criar Conta de Corretor</CardTitle>
                    <CardDescription>Preencha os dados para se cadastrar</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => { await registerUser(formData); }} className="space-y-4">
                        {/* You can handle error/success messages via redirect or by updating the action to return them */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <SubmitButton />
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="font-semibold text-brand-secondary hover:underline">
                            Faça o login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}