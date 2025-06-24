# Imobiliária - Sistema de Cadastro e Gerenciamento de Imóveis

Este projeto é uma aplicação web para cadastro, gerenciamento e exibição de imóveis, desenvolvida com **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, **PostgreSQL** e autenticação via **NextAuth**. O upload de imagens é feito diretamente para o **Cloudinary**. O sistema permite que corretores cadastrem imóveis, editem, removam e visualizem detalhes, com autenticação segura.

---

## Funcionalidades

- Cadastro de usuários (corretores)
- Login seguro com NextAuth (JWT)
- Cadastro de imóveis com upload de imagem para Cloudinary
- Edição e remoção de imóveis
- Listagem de imóveis cadastrados
- Busca automática de endereço via CEP (integração com ViaCEP)
- Interface responsiva e moderna
- Integração com banco de dados PostgreSQL via Prisma

---

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/) (opcional)
- [ViaCEP API](https://viacep.com.br/) (busca de endereço por CEP)

---

## Como rodar o projeto localmente

### 1. Clone o repositório

```sh
git clone https://github.com/seu-usuario/seu-repo.git
cd imobiliaria-final
```

### 2. Instale as dependências

```sh
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (veja o arquivo `.env.example` para referência):

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/imobiliaria?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=sua_secret_aleatoria
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
```

> ⚠️ **AVISO IMPORTANTE:**  
> **NUNCA** suba o arquivo `.env` para o GitHub ou qualquer repositório público!  
> Ele contém informações sensíveis como senhas, segredos e chaves de API.  
> O arquivo `.env` já está listado no `.gitignore` deste projeto.

### 4. Configure o banco de dados

- Crie um banco PostgreSQL local ou use um serviço na nuvem.
- Ajuste a variável `DATABASE_URL` no `.env` conforme seu ambiente.

### 5. Rode as migrations do Prisma

```sh
npx prisma migrate dev
```

### 6. Rode o projeto

```sh
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Configuração do Cloudinary

1. Crie uma conta em [cloudinary.com](https://cloudinary.com/).
2. Crie um **Upload Preset** com o modo **Unsigned**.
3. Pegue o **Cloud Name** e o nome do **Upload Preset** e coloque nas variáveis de ambiente:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## Estrutura de Pastas

```
imobiliaria-final/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── actions.ts
│   │   └── dashboard/
│   │       └── adicionar/
│   │           └── page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   └── prisma.ts
│   └── ...
├── .env.example
├── .gitignore
└── README.md
```

---

## Segurança

- **NUNCA** suba o arquivo `.env` para o repositório.
- Troque imediatamente qualquer secret que tenha sido exposta.
- Use sempre variáveis de ambiente para dados sensíveis.

---

## Contribuição

Pull requests são bem-vindos!  
Abra uma issue para discutir melhorias ou reportar bugs.

---

## Licença

Este projeto está sob a licença MIT.

---
