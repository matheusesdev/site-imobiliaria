// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Importamos o bcrypt

// Inicializa o Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Apaga todos os dados existentes para começar do zero
  // Primeiro apaga imóveis (dependentes), depois usuários
  await prisma.imovel.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Dados existentes foram deletados.');

  // 2. Cria um usuário (corretor) de teste
  const hashedPassword = await bcrypt.hash('senha123', 10); // Criptografa a senha
  const user = await prisma.user.create({
    data: {
      email: 'corretor@email.com',
      name: 'Corretor Teste',
      hashedPassword: hashedPassword,
    },
  });
  console.log(`Usuário de teste '${user.name}' criado com sucesso.`);

  // 3. Cria os imóveis de exemplo, associando-os ao usuário criado
  await prisma.imovel.createMany({
    data: [
      {
        endereco: 'Av. Olívia Flores, 200',
        cidade: 'Vitória da Conquista',
        estado: 'BA',
        quartos: 3,
        banheiros: 2,
        vagasGaragem: 2,
        areaTotal: 250.0,
        areaConstruida: 180.0,
        descricao: 'Casa espaçosa no bairro Candeias...',
        preco: 650000.00,
        corretorId: user.id, // Associa o imóvel ao usuário
      },
      {
        endereco: 'Praça Barão do Rio Branco, 50',
        cidade: 'Vitória da Conquista',
        estado: 'BA',
        quartos: 2,
        banheiros: 1,
        vagasGaragem: 0,
        areaTotal: 90.0,
        areaConstruida: 90.0,
        descricao: 'Apartamento aconchegante no coração da cidade...',
        preco: 280000.00,
        corretorId: user.id, // Associa o imóvel ao usuário
      },
      {
        endereco: 'Rua das Acácias, 123',
        cidade: 'Vitória da Conquista',
        estado: 'BA',
        quartos: 4,
        banheiros: 4,
        vagasGaragem: 3,
        areaTotal: 400.0,
        areaConstruida: 320.0,
        descricao: 'Excelente imóvel de alto padrão...',
        preco: 980000.00,
        corretorId: user.id, // Associa o imóvel ao usuário
      },
    ],
  });
  console.log('Novos imóveis foram criados e associados ao corretor de teste.');

  console.log('Seeding finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });