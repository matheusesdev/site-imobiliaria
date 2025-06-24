// src/components/Footer.tsx

import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">ImobiliáriaPRO</h3>
            <p className="text-gray-400">Encontrando o imóvel dos seus sonhos.</p>
          </div>
          <div className="flex mb-6 md:mb-0 gap-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contato</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link>
          </div>
          <div className="flex justify-center gap-6">
            <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={24} />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={24} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={24} />
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} ImobiliáriaPRO. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}