// src/app/actions.ts
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import auth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Tipos para estado do formulário
export type FormState = {
  success: boolean;
  message: string;
};

// --- AÇÕES DE AUTENTICAÇÃO ---

const RegisterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export async function registerUser(formData: FormData): Promise<FormState> {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.errors.map(e => e.message).join(', ') };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Este email já está em uso.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro no servidor. Tente novamente.' };
  }

  redirect('/login');
}


// --- AÇÕES DE IMÓVEIS ---

const ImovelSchema = z.object({
  id: z.string().optional(),
  endereco: z.string().min(5, 'Endereço muito curto'),
  cidade: z.string().min(3, 'Cidade muito curta'),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres (UF)'),
  descricao: z.string().min(10, 'Descrição muito curta'),
  quartos: z.coerce.number().int().min(0, 'Número de quartos inválido'),
  banheiros: z.coerce.number().int().min(0, 'Número de banheiros inválido'),
  vagasGaragem: z.coerce.number().int().min(0, 'Número de vagas inválido'),
  areaTotal: z.coerce.number().min(1, 'Área total inválida'),
  areaConstruida: z.coerce.number().min(1, 'Área construída inválida'),
  preco: z.coerce.number().min(1, 'Preço inválido'),
  imagem: z.instanceof(File).optional(),
});


export async function createImovel(formData: FormData): Promise<FormState> {
  try {
    // Obtém a sessão do usuário autenticado
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, message: "Usuário não autenticado." };
    }

    // Campos do formulário
    const endereco = String(formData.get("endereco") || "");
    const descricao = String(formData.get("descricao") || "");
    const imagem = formData.get("imagem") as File | null;

    // Campos numéricos convertidos
    const quartos = Number(formData.get("quartos"));
    const banheiros = Number(formData.get("banheiros"));
    const vagasGaragem = Number(formData.get("vagasGaragem"));
    const areaTotal = Number(formData.get("areaTotal"));
    const areaConstruida = Number(formData.get("areaConstruida"));
    const preco = Number(formData.get("preco"));

    // Campos cidade e estado (ajuste conforme seu formulário)
    const cidade = String(formData.get("cidade") || "");
    const estado = String(formData.get("estado") || "");

    // Validação dos campos obrigatórios
    if (
      !endereco ||
      !descricao ||
      !imagem ||
      isNaN(quartos) ||
      isNaN(banheiros) ||
      isNaN(vagasGaragem) ||
      isNaN(areaTotal) ||
      isNaN(areaConstruida) ||
      isNaN(preco) ||
      !cidade ||
      !estado
    ) {
      return { success: false, message: "Preencha todos os campos obrigatórios corretamente." };
    }

    // Upload da imagem
    let imagemUrl = "";
    if (imagem) {
      const uploadResult = await uploadToCloudinary(imagem);
      if (!uploadResult?.secure_url) {
        return { success: false, message: "Falha ao enviar imagem." };
      }
      imagemUrl = uploadResult.secure_url;
    }

    // Busca o usuário logado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return { success: false, message: "Usuário não encontrado." };
    }

    // Criação do imóvel
    await prisma.imovel.create({
      data: {
        endereco,
        descricao,
        imagemUrl,
        quartos,
        banheiros,
        vagasGaragem,
        areaTotal,
        areaConstruida,
        preco,
        corretorId: user.id,
        cidade,
        estado,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Imóvel cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return { success: false, message: "Falha ao criar o imóvel. Tente novamente." };
  }
}

export async function updateImovel(formData: FormData): Promise<FormState> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return { success: false, message: 'Acesso não autorizado.' };
  }

  const validatedFields = ImovelSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success || !validatedFields.data.id) {
    return { success: false, message: 'Dados inválidos.' };
  }

  const data = validatedFields.data;

  try {
    // Garante que o usuário só pode editar seu próprio imóvel
    const imovel = await prisma.imovel.findFirst({
        where: { id: data.id, corretorId: userId }
    });

    if (!imovel) {
        return { success: false, message: "Imóvel não encontrado ou sem permissão para editar." };
    }

    await prisma.imovel.update({
      where: { id: data.id },
      data: { ...data },
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Falha ao atualizar o imóvel.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/imovel/${data.id}`);
  redirect('/dashboard');
}

export async function deleteImovel(formData: FormData) {
  const session = await getServerSession(authOptions);
  const id = formData.get('id') as string;
  const userId = (session?.user as { id?: string })?.id;

  if (!userId || !id) {
    throw new Error('Não autorizado');
  }

  // Garante que o usuário só pode apagar seu próprio imóvel
  const imovel = await prisma.imovel.findFirst({
      where: { id: id, corretorId: userId }
  });

  if (!imovel) {
      throw new Error("Imóvel não encontrado ou sem permissão para apagar.");
  }
  
  await prisma.imovel.delete({ where: { id } });

  revalidatePath('/dashboard');
}