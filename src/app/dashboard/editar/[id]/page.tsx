// src/app/dashboard/editar/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateImovel } from "@/app/actions"; // Vamos criar esta ação agora

type SessionUserWithId = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
};

export default async function EditarImovelPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions) as { user: SessionUserWithId } | null;
  if (!session?.user?.id) {
    redirect('/login');
  }

  const imovel = await prisma.imovel.findUnique({
    where: {
      id: params.id,
      corretorId: session.user.id, // Garante que o usuário só pode editar seus próprios imóveis
    }
  });

  if (!imovel) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Imóvel não encontrado ou você não tem permissão para editá-lo.</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Editar Imóvel</CardTitle>
          <CardDescription>Atualize os detalhes do seu imóvel.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Note que o formulário agora chama 'updateImovel' */}
          <form action={updateImovel as unknown as string} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo oculto para passar o ID do imóvel para a Server Action */}
            <input type="hidden" name="id" value={imovel.id} />
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input id="endereco" name="endereco" required defaultValue={imovel.endereco} />
            </div>
            {/* ... outros campos pré-preenchidos ... */}
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="cidade" required defaultValue={imovel.cidade} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado (UF)</Label>
              <Input id="estado" name="estado" maxLength={2} required defaultValue={imovel.estado} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição do Imóvel</Label>
              <Textarea id="descricao" name="descricao" required defaultValue={imovel.descricao} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quartos">Quartos</Label>
              <Input id="quartos" name="quartos" type="number" min="0" required defaultValue={imovel.quartos} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banheiros">Banheiros</Label>
              <Input id="banheiros" name="banheiros" type="number" min="0" required defaultValue={imovel.banheiros} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vagasGaragem">Vagas de Garagem</Label>
              <Input id="vagasGaragem" name="vagasGaragem" type="number" min="0" required defaultValue={imovel.vagasGaragem} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaTotal">Área Total (m²)</Label>
              <Input id="areaTotal" name="areaTotal" type="number" step="0.01" min="0" required defaultValue={imovel.areaTotal} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="areaConstruida">Área Construída (m²)</Label>
              <Input id="areaConstruida" name="areaConstruida" type="number" step="0.01" min="0" required defaultValue={imovel.areaConstruida} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input id="preco" name="preco" type="number" step="0.01" min="0" required defaultValue={Number(imovel.preco)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imagem">Imagem</Label>
              <Input
                id="imagem"
                name="imagem"
                type="file"
                accept="image/*"
                required
              />
            </div>
            <Button type="submit" className="md:col-span-2 w-full">Salvar Alterações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}