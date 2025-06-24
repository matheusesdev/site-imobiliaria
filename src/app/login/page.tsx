// src/app/login/page.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm"; // Vamos criar este componente agora

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login de Corretor</CardTitle>
          <CardDescription>Acesse sua área restrita</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}