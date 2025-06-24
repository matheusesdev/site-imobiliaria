// src/lib/auth.ts

import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;
        
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (isPasswordCorrect) return user;

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  // --- ADICIONE ESTE BLOCO DE CALLBACKS ---
  callbacks: {
    // Este callback é chamado quando um JWT é criado ou atualizado.
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Se o objeto 'user' existir (no momento do login),
      // pegamos o ID dele e o colocamos dentro do token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Este callback é chamado quando uma sessão é acessada.
    async session({ session, token }: { session: any; token: JWT }) {
      // Pegamos o ID que colocamos no token e o passamos para o objeto da sessão.
      // Agora, session.user.id estará disponível em qualquer lugar da aplicação.
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};