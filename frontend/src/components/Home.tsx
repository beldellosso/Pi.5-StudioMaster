import { useState } from 'react';
import { Target, Star, User, Building2, Check, Camera, MessageSquare, ArrowRight, Zap, Trophy, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-white bg-[#050505] font-['Barlow',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Barlow:wght@400;600;700&display=swap');
        
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          /* Imagem de estúdio de tattoo em alta resolução */
          background: url('https://plus.unsplash.com/premium_photo-1664303969129-db0ba804b2ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D') center/cover no-repeat;
          opacity: 0.15;
          z-index: 0;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #050505 30%, transparent 100%);
          z-index: 1;
        }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-10">
        <a href="/" className="flex items-center gap-2 text-xl font-black italic tracking-tighter uppercase">
          <Star className="text-[#EAB308]" size={20} />
          STUDIO<span className="text-[#EAB308]">MASTER</span>
        </a>

        <nav className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/50">
          <a href="#funcionalidades" className="hover:text-[#EAB308] transition-colors">Recursos</a>
          <a href="#planos" className="hover:text-[#EAB308] transition-colors">Planos</a>
        </nav>

        <div className="relative">
          <button onClick={() => setLoginMenuOpen(!loginMenuOpen)} className="bg-[#EAB308] text-black text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-md flex items-center gap-2 hover:brightness-110 transition-all">
            Área de Acesso <ArrowRight size={12} />
          </button>

          {loginMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
              <Link to="/login/empresa" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <Building2 size={18} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Sou Tatuador</span>
              </Link>
              <Link to="/login/cliente" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors border-t border-gray-50">
                <User size={18} className="text-[#EAB308]" />
                <span className="text-sm font-bold text-[#EAB308]">Sou Cliente</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="hero-bg relative min-h-screen flex flex-col justify-center px-10">
        <div className="relative z-10 max-w-4xl mx-auto w-full pt-20">
          <span className="inline-flex items-center gap-2 bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#EAB308] text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            <Zap size={12} /> Tecnologia para sua arte
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter mb-6">
            GESTÃO DE <span className="text-[#EAB308]">ALTO NÍVEL</span> <br /> PARA O SEU STUDIO.
          </h1>
          <p className="text-white/40 text-base max-w-md leading-relaxed mb-10">
            Controle agenda, estoque e portfólio em uma única plataforma desenvolvida para artistas que não aceitam o comum.
          </p>
          <a href="#planos" className="inline-flex items-center gap-3 bg-[#EAB308] text-black font-black uppercase tracking-widest text-xs px-8 py-5 rounded-lg hover:scale-105 transition-transform">
            Ver Planos Disponíveis <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="funcionalidades" className="py-24 px-10 bg-[#0a0a0a]">
        <div className="text-center mb-16">
          <span className="text-[#EAB308] text-[10px] font-black uppercase tracking-widest">Diferenciais</span>
          <h2 className="text-4xl font-black italic uppercase mt-2">EXCELÊNCIA EM <span className="text-[#EAB308]">CADA TRAÇO</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: <Target />, title: "Foco Criativo", desc: "Automação de agendamentos que te liberta da recepção." },
            { icon: <Camera />, title: "Portfólio Vitrine", desc: "Seus melhores trabalhos expostos com visual de elite." },
            { icon: <MessageSquare />, title: "Aviso por Whats", desc: "Lembretes automáticos que reduzem as faltas em até 80%." }
          ].map((feat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:border-[#EAB308]/30 transition-all group">
              <div className="w-12 h-12 bg-[#EAB308]/10 text-[#EAB308] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold italic uppercase mb-3">{feat.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section id="planos" className="py-24 px-10 bg-[#0f1117]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic uppercase">Planos de <span className="text-[#EAB308]">Crescimento</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: <Zap />, name: 'SKETCH (FREE)', price: '0', desc: 'Para quem está começando a carreira.', features: ['Até 50 agendamentos/mês', 'Agenda Digital básica', 'Perfil Público'] },
            { icon: <Trophy />, name: 'ARTIST PRO', price: '49', featured: true, desc: 'Para artistas que buscam autoridade.', features: ['Agendamentos Ilimitados', 'Gestão de Estoque', 'WhatsApp Automático'] },
            { icon: <Crown />, name: 'STUDIO MASTER', price: '99', desc: 'Para studios com múltiplos artistas.', features: ['Gestão de Equipe', 'Financeiro Avançado', 'Relatórios de Performance'] },
          ].map((plan, i) => (
            <div key={i} className={`p-10 rounded-3xl border ${plan.featured ? 'border-[#EAB308] bg-[#0a0a0a]' : 'border-white/5 bg-white/5'} flex flex-col`}>
              <div className="text-[#EAB308] mb-4">{plan.icon}</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#EAB308] mb-2">{plan.name}</p>
              <div className="text-5xl font-black italic mb-4"><sup>R$</sup>{plan.price}<sub className="text-xs text-white/30 italic">/mês</sub></div>
              <p className="text-xs text-white/40 mb-8">{plan.desc}</p>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs text-white/60"><Check size={14} className="text-[#EAB308]" /> {f}</li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.featured ? 'bg-[#EAB308] text-black hover:brightness-110' : 'border border-white/20 text-white/50 hover:border-[#EAB308] hover:text-[#EAB308]'}`}>
                {plan.price === '0' ? 'Começar Grátis' : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}