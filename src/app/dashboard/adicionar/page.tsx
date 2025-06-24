// src/app/dashboard/adicionar/page.tsx
'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { createImovel, FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="md:col-span-2 w-full" disabled={pending}>
      {pending ? 'Cadastrando...' : 'Cadastrar Imóvel'}
    </Button>
  );
}

export default function AdicionarImovelPage() {
  const [cep, setCep] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [cidade, setCidade] = React.useState('');
  const [estado, setEstado] = React.useState('');
  const [state, setState] = React.useState<FormState>({ success: false, message: '' });

  // Busca automática do endereço ao digitar o CEP
  React.useEffect(() => {
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setEndereco(`${data.logradouro}, ${data.bairro}`);
            setCidade(data.localidade);
            setEstado(data.uf);
          }
        });
    }
  }, [cep]);

  async function handleSubmit(formData: FormData) {
    const result = await createImovel(formData);
    setState(result);
  }

  return (
    <div className="flex justify-center items-center py-8 px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Cadastrar Novo Imóvel</CardTitle>
          <CardDescription>Preencha os detalhes do imóvel que será anunciado.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mensagem de erro */}
            {!state.success && state.message && (
              <div className="md:col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{state.message}</span>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                name="endereco"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                placeholder="Ex: Av. Juracy Magalhães, 123"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" name="preco" type="number" placeholder="Ex: 350000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Input id="tipo" name="tipo" placeholder="Ex: Casa, Apartamento" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quartos">Quartos</Label>
              <Input id="quartos" name="quartos" type="number" placeholder="Ex: 3" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banheiros">Banheiros</Label>
              <Input id="banheiros" name="banheiros" type="number" placeholder="Ex: 2" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input id="area" name="area" type="number" placeholder="Ex: 120" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" placeholder="Descreva detalhes do imóvel" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imagem">Imagem</Label>
              <Input id="imagem" name="imagem" type="file" accept="image/*" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vagasGaragem">Vagas de Garagem</Label>
              <Input id="vagasGaragem" name="vagasGaragem" type="number" placeholder="Ex: 2" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaTotal">Área Total (m²)</Label>
              <Input id="areaTotal" name="areaTotal" type="number" placeholder="Ex: 150" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaConstruida">Área Construída (m²)</Label>
              <Input id="areaConstruida" name="areaConstruida" type="number" placeholder="Ex: 120" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                name="cidade"
                value={cidade}
                onChange={e => setCidade(e.target.value)}
                placeholder="Ex: Salvador"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado (UF)</Label>
              <Input
                id="estado"
                name="estado"
                value={estado}
                onChange={e => setEstado(e.target.value)}
                placeholder="Ex: BA"
                maxLength={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={cep}
                onChange={e => setCep(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 40010000"
                required
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}