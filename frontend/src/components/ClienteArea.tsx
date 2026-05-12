import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, Clock, LogOut, Sparkles, MessageSquare, AlertTriangle, Search
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ClienteArea() {
  const { usuario, signOut } = useAuth(); // 'usuario' agora é utilizado
  const [abaAtiva, setAbaAtiva] = useState<'explorar' | 'agendar' | 'sessoes' | 'ajuda'>('explorar');
  const [tatuadores, setTatuadores] = useState<any[]>([]); // 'tatuadores' pronto para uso na listagem real

  useEffect(() => {
    const carregarStudios = async () => {
      try {
        const response = await axios.get(`${API_URL}/tatuadores`);
        setTatuadores(response.data || []);
      } catch (err) { 
        console.error("Erro ao carregar studios parceiros"); 
      }
    };
    carregarStudios();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f1117] border-r border-white/5 p-6 flex flex-col fixed h-full">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-[#EAB308] tracking-tighter italic">
            STUDIO<span className="text-white">MASTER</span>
          </h1>
          {/* Saudação personalizada usando a variável 'usuario' */}
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em] mt-2">
            Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'}
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setAbaAtiva('explorar')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${abaAtiva === 'explorar' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Search size={18} /> Explorar Studios
          </button>
          <button onClick={() => setAbaAtiva('agendar')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${abaAtiva === 'agendar' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Calendar size={18} /> Agendar Sessão
          </button>
          <button onClick={() => setAbaAtiva('sessoes')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${abaAtiva === 'sessoes' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Clock size={18} /> Meus Agendamentos
          </button>
          <button onClick={() => setAbaAtiva('ajuda')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${abaAtiva === 'ajuda' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <AlertTriangle size={18} /> Central de Ajuda
          </button>
        </nav>

        <button onClick={signOut} className="flex items-center gap-3 p-3 text-red-500/60 hover:text-red-500 font-bold transition-all mt-auto border-t border-white/5 pt-6 uppercase text-[10px] tracking-widest">
          <LogOut size={18} /> Sair do App
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-10">
        {abaAtiva === 'explorar' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                Descubra seu <span className="text-[#EAB308]">Próximo Artista</span>
                <Sparkles className="text-[#EAB308] animate-pulse" size={24} /> {/* 'Sparkles' utilizado aqui */}
              </h2>
              <p className="text-gray-500 text-sm">Conheça os melhores studios parceiros do StudioMaster.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Uso do array 'tatuadores' ou fallback para os cards */}
              {(tatuadores.length > 0 ? tatuadores : [1, 2, 3]).map((item: any, idx) => {
                const id = item._id || item;
                const nome = item.nome || `Studio ArtExemplo ${id}`;
                return (
                  <div key={id} className="bg-[#0f1117] rounded-3xl border border-white/5 overflow-hidden group hover:border-[#EAB308]/40 transition-all">
                    <div className="h-28 bg-gradient-to-br from-[#EAB308]/20 to-black p-6 flex justify-end">
                      <span className="bg-black/50 backdrop-blur-md h-fit px-3 py-1 rounded-full text-[10px] font-bold text-[#EAB308] border border-[#EAB308]/20">DISPONÍVEL</span>
                    </div>
                    <div className="px-6 pb-6 -mt-10">
                      <img src={`https://i.pravatar.cc/150?u=${id}`} alt="Avatar" className="w-20 h-20 rounded-2xl border-4 border-[#050505] mb-4 object-cover" />
                      <h3 className="font-bold text-xl">{nome}</h3>
                      <p className="text-[#EAB308] text-[10px] font-black uppercase tracking-widest mb-4">Blackwork & Fine Line</p>
                      
                      <div className="flex gap-2 mb-6">
                        {[1, 2, 3].map(img => (
                          <img key={img} src={`https://picsum.photos/200/200?random=${img+idx*10}`} alt="Portfolio" className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all border border-white/5" />
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setAbaAtiva('agendar')} className="flex-1 bg-white text-black text-xs font-black py-3 rounded-xl hover:bg-[#EAB308] transition-all uppercase tracking-widest">VER AGENDA</button>
                        <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                          <MessageSquare size={18} className="text-[#EAB308]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {abaAtiva === 'ajuda' && (
          <div className="max-w-2xl bg-[#0f1117] p-8 rounded-3xl border border-white/5 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 italic uppercase tracking-tighter">
              <AlertTriangle className="text-[#EAB308]" /> Suporte ao Usuário
            </h2>
            <div className="space-y-4">
              <details className="bg-black/40 p-4 rounded-xl border border-white/5 cursor-pointer group">
                <summary className="font-bold text-sm list-none flex justify-between items-center uppercase tracking-widest">
                  Como agendar minha primeira tattoo? <span className="text-[#EAB308]">+</span>
                </summary>
                <p className="text-gray-500 text-[10px] mt-3 leading-relaxed uppercase font-medium">
                  Navegue pela aba 'Explorar', escolha seu artista favorito e clique em 'Ver Agenda'. Selecione o estilo, a data disponível e aguarde a confirmação do studio.
                </p>
              </details>
              <div className="p-6 bg-[#EAB308]/5 border border-[#EAB308]/10 rounded-2xl mt-10">
                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-[0.2em]">
                  Dúvidas urgentes? Envie um e-mail para <br/>
                  <span className="text-[#EAB308]">suporte@studiomaster.com</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}