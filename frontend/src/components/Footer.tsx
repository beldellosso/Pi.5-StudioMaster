import { Star, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 px-10 relative z-20 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* PARTE SUPERIOR: Alinhada à esquerda com espaçamento controlado entre os blocos */}
        <div className="flex flex-col md:flex-row justify-start items-start gap-12 md:gap-32 pb-12">
          
          {/* LOGO E SLOGAN */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-start gap-2 text-lg font-black italic tracking-tighter uppercase">
              <Star className="text-[#EAB308]" size={18} />
              STUDIO<span className="text-[#EAB308]">MASTER</span>
            </div>
            <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-bold">
              Gestão de elite para artistas
            </p>
          </div>

          {/* BLOCO DE LINKS: Colado próximo à logo, mantendo os textos internos centralizados se quiser */}
          <div className="flex gap-16">
            
            {/* NAVEGAÇÃO */}
            <div className="space-y-3 flex flex-col items-center min-w-[100px]">
              <h4 className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] text-center">Navegação</h4>
              <ul className="space-y-2 text-[10px] font-bold uppercase tracking-wider text-white/60 text-center">
                <li><a href="#funcionalidades" className="hover:text-[#EAB308] transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-[#EAB308] transition-colors">Planos</a></li>
              </ul>
            </div>

            {/* SUPORTE */}
            <div className="space-y-3 flex flex-col items-center min-w-[100px]">
              <h4 className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] text-center">Suporte</h4>
              <ul className="space-y-2 text-[10px] font-bold uppercase tracking-wider text-white/60 text-center">
                <li><a href="#" className="hover:text-[#EAB308] transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-[#EAB308] transition-colors">Privacidade</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* LINHA DIVISÓRIA SUTIL */}
        <hr className="border-white/5 w-full mb-10" />

        {/* PARTE INFERIOR: Redes Sociais e Copyright (Mantidos no centro) */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          
          {/* ÍCONES SOCIAIS */}
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#EAB308] hover:border-[#EAB308] transition-all"
            >
              <Instagram size={14} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#EAB308] hover:border-[#EAB308] transition-all"
            >
              <Facebook size={14} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#EAB308] hover:border-[#EAB308] transition-all"
            >
              <Youtube size={14} />
            </a>
          </div>

          {/* COPYRIGHT */}
          <p className="text-white/20 text-[9px] uppercase tracking-[0.15em] font-semibold mt-1">
            © Copyright {new Date().getFullYear()}. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}