// src/app/imovel/[id]/page.tsx

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from 'next/image';

type Imovel = {
  id: string;
  imagemUrl?: string | null;
  endereco: string;
  cidade: string;
  estado: string;
  preco: number | string;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  areaConstruida: number;
  areaTotal: number;
  descricao: string;
};

export default async function ImovelDetalhePage({ params }: { params: { id: string } }) {
  const imovel = await prisma.imovel.findUnique({
    where: {
      id: params.id,
    },
  }) as Imovel | null;

  if (!imovel) {
    notFound();
  }

  return (
    // A classe 'p-4 md:p-8' adiciona o espaçamento interno
    <div className="p-4 md:p-8">
      {imovel.imagemUrl ? (
        <div className="w-full mb-8">
          <Image
            src={imovel.imagemUrl}
            alt={`Foto do imóvel: ${imovel.endereco}`}
            width={1200}
            height={800}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            priority
          />
        </div>
      ) : (
        <div className="w-full h-96 mb-8 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Sem foto</p>
        </div>
      )}

      {/* A classe 'max-w-4xl mx-auto' centraliza o bloco de texto */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display text-brand-primary mb-4">{imovel.endereco}</h1>
        <p className="text-lg text-gray-700 mb-6">{imovel.cidade}, {imovel.estado}</p>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 font-display text-brand-secondary">Detalhes do Imóvel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <p><strong>Preço:</strong> <span className="font-mono text-green-600 text-xl">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco))}</span></p>
            <p><strong>Quartos:</strong> {imovel.quartos}</p>
            <p><strong>Banheiros:</strong> {imovel.banheiros}</p>
            <p><strong>Vagas de Garagem:</strong> {imovel.vagasGaragem}</p>
            <p><strong>Área Construída:</strong> {imovel.areaConstruida} m²</p>
            <p><strong>Área Total:</strong> {imovel.areaTotal} m²</p>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 font-display text-brand-secondary">Descrição</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{imovel.descricao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}