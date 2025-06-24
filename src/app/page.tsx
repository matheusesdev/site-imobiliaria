// src/app/page.tsx

import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Imovel } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  searchParams: {
    busca?: string;
    quartos?: string;
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const { busca, quartos } = searchParams || {};
  const minQuartos = Number(quartos) || 0;

  const where: any = { AND: [] };
  if (busca) { where.AND.push({ OR: [ { endereco: { contains: busca, mode: 'insensitive' } }, { cidade: { contains: busca, mode: 'insensitive' } } ] }); }
  if (minQuartos > 0) { where.AND.push({ quartos: { gte: minQuartos } }); }

  const imoveis = await prisma.imovel.findMany({
    where: where.AND.length > 0 ? where : undefined,
    orderBy: { criadoEm: 'desc' },
  });

  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-brand-primary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
            alt="Casa moderna com uma bela arquitetura"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display">Seu novo lar está aqui.</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">A plataforma definitiva para encontrar, comprar e vender imóveis com confiança e segurança.</p>
          <Card className="mt-8 max-w-2xl mx-auto bg-black/30 backdrop-blur-sm border-gray-400">
            <CardContent className="p-4">
              <form className="flex flex-col sm:flex-row items-center gap-4">
                <Input className="bg-white text-gray-800 placeholder:text-gray-500 flex-grow" name="busca" placeholder="Busque por endereço ou cidade..." defaultValue={busca}/>
                <Input className="bg-white text-gray-800 placeholder:text-gray-500 w-full sm:w-auto" name="quartos" type="number" min="0" placeholder="Quartos (mín.)" defaultValue={quartos}/>
                <Button type="submit" className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent/90">Buscar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-brand-light">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center font-display text-brand-primary">Imóveis em Destaque</h2>
          {imoveis.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum imóvel encontrado com esses filtros.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {imoveis.map((imovel: Imovel) => (
                <Link href={`/imovel/${imovel.id}`} key={imovel.id} className="block">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
                    {/* AQUI ESTÁ A CORREÇÃO: O container da imagem agora é 'relative' */}
                    <div className="relative w-full h-56">
                      {imovel.imagemUrl ? (
                          <Image src={imovel.imagemUrl} alt={`Foto do imóvel: ${imovel.endereco}`} fill className="object-cover"/>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center"><p className="text-gray-500">Sem foto</p></div>
                        )}
                    </div>
                    <div className="p-4">
                      <CardHeader className='p-0'>
                        <CardTitle className="text-lg font-display text-brand-primary line-clamp-2">{imovel.endereco}</CardTitle>
                        <CardDescription>{imovel.cidade}, {imovel.estado}</CardDescription>
                      </CardHeader>
                      <CardContent className='p-0 pt-4'>
                        <div className="font-bold text-xl text-green-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}