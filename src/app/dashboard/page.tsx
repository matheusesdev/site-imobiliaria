// src/app/dashboard/page.tsx

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteImovel } from "@/app/actions";
import Image from "next/image"; // Importe o componente de Imagem

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as { user: { id: string; name?: string | null; email?: string | null; image?: string | null } } | null;
  if (!session?.user?.id) {
    redirect('/login');
  }

  const imoveis = await prisma.imovel.findMany({
    where: {
      corretorId: session.user.id,
    },
    orderBy: {
      criadoEm: 'desc',
    }
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Meu Painel de Imóveis</h1>
      
      {imoveis.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Você ainda não cadastrou nenhum imóvel.</p>
          <Link href="/dashboard/adicionar">
            <Button>Cadastrar meu primeiro imóvel</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <Card key={imovel.id} className="flex flex-col">
              {/* --- INÍCIO DA MUDANÇA --- */}
              <div className="relative w-full h-48">
                {imovel.imagemUrl ? (
                  <Image
                    src={imovel.imagemUrl}
                    alt={`Foto do imóvel: ${imovel.endereco}`}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Sem foto</p>
                  </div>
                )}
              </div>
              {/* --- FIM DA MUDANÇA --- */}

              <div className="flex flex-col flex-grow p-4">
                <CardHeader className="p-0">
                  <CardTitle className="line-clamp-2 text-base">{imovel.endereco}</CardTitle>
                  <CardDescription>{imovel.cidade}, {imovel.estado}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4 flex-grow">
                  <p className="font-bold text-lg text-green-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco))}
                  </p>
                </CardContent>
                <CardFooter className="p-0 pt-4 flex justify-end gap-2">
                  <Link href={`/dashboard/editar/${imovel.id}`}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </Link>
                  <form action={deleteImovel}>
                    <input type="hidden" name="id" value={imovel.id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Apagar
                    </Button>
                  </form>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}