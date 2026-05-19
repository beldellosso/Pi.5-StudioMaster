import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Calendar, Clock, LogOut, Sparkles, MessageSquare, AlertTriangle, Search, ArrowLeft, MapPin, SlidersHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

interface PortfolioItem {
  imagem_url: string;
}

interface StudioItem {
  id?: string;
  _id?: string;
  nome: string;
  studio?: string;
  nomeFantasia?: string;
  endereco: string;
  especialidade: string;
  avatar: string;
  portfolio: PortfolioItem[];
}

const STUDIOS_EXEMPLO: StudioItem[] = [
  {
    id: 'studio_sp_01',
    nome: 'avolkov.tattoo',
    studio: 'Studio Master São Paulo',
    endereco: 'Rua Oscar Freire, 1000, Jardins - São Paulo, SP',
    especialidade: 'BLACKWORK & FINE LINE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    portfolio: [
      { imagem_url: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=500&auto=format&fit=crop" },
      { imagem_url: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=500&auto=format&fit=crop" },
      { imagem_url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=500&auto=format&fit=crop" }
    ]
  },
  {
    id: 'studio_rj_02',
    nome: 'marcelo.ink',
    studio: 'NeoArt Studio',
    endereco: 'Av. Atlântica, 420, Copacabana - Rio de Janeiro, RJ',
    especialidade: 'REALISMO BRUTALIST & SOMBREADO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    portfolio: [
      { imagem_url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=500&auto=format&fit=crop" },
      { imagem_url: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=500&auto=format&fit=crop" }
    ]
  },
  {
    id: 'studio_rs_03',
    nome: 'gabs.traditional',
    studio: 'Velha Escola Ink',
    endereco: 'Rua Gonçalo de Carvalho, 310, Moinhos de Vento - Porto Alegre, RS',
    especialidade: 'OLD SCHOOL & TRADICIONAL AMERICANO',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    portfolio: [
      { imagem_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop" },
      { imagem_url: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=500&auto=format&fit=crop" }
    ]
  }
];

export default function ClienteArea() {
  const { usuario, signOut } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState<'explorar' | 'agendar' | 'sessoes' | 'ajuda'>('explorar');
  const [tatuadores, setTatuadores] = useState<StudioItem[]>([]);
  const [studioSelecionado, setStudioSelecionado] = useState<StudioItem | null>(null);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados do formulário de agendamento
  const [servico, setServico] = useState('flash');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const carregarStudios = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tatuadores`);
        
        let listaCompleta: StudioItem[] = response.data && response.data.length > 0 
          ? [...response.data, ...STUDIOS_EXEMPLO] 
          : STUDIOS_EXEMPLO;

        const listaComPortfoliosReais = await Promise.all(
          listaCompleta.map(async (tatuador: StudioItem) => {
            const currentId = tatuador.id || tatuador._id;
            if (String(currentId).startsWith('studio_')) return tatuador;

            const { data: fotos } = await supabase
              .from('portfolio')
              .select('imagem_url')
              .eq('tatuador_id', currentId);

            if (fotos && fotos.length > 0) {
              return { ...tatuador, portfolio: fotos as PortfolioItem[] };
            }
            return tatuador;
          })
        );

        setTatuadores(listaComPortfoliosReais);
      } catch (err) {
        console.error("Erro ao carregar studios parceiros, aplicando fallback local", err);
        setTatuadores(STUDIOS_EXEMPLO);
      } finally {
        setLoading(false);
      }
    };
    carregarStudios();
  }, []);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioSelecionado) return;
    
    setEnviando(true);
    try {
      await axios.post(`${API_URL}/agendamentos`, {
        tatuador_id: studioSelecionado.id || studioSelecionado._id,
        cliente_email: usuario?.email,
        servico,
        data: dataAgendamento
      });
      
      toast.success('Solicitação de agendamento enviada ao estúdio!');
      setAbaAtiva('sessoes'); // Redireciona para ver o status
    } catch (err) {
      console.error(err);
      toast.error('Erro ao solicitar agendamento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const studiosFiltrados = tatuadores.filter(item => {
    const termo = busca.toLowerCase();
    return (
      (item.studio || item.nomeFantasia || '').toLowerCase().includes(termo) ||
      (item.nome || '').toLowerCase().includes(termo) ||
      (item.especialidade || '').toLowerCase().includes(termo) ||
      (item.endereco || '').toLowerCase().includes(termo)
    );
  });

  const abrirDetalhesStudio = (studio: StudioItem) => {
    setStudioSelecionado(studio);
    setAbaAtiva('agendar');
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <aside className="w-64 bg-[#0f1117] border-r border-white/5 p-6 flex flex-col fixed h-full">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-[#EAB308] tracking-tighter italic">
            STUDIO<span className="text-white">MASTER</span>
          </h1>
          <div className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em] mt-2">
            Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'}
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setAbaAtiva('explorar')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${abaAtiva === 'explorar' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}><Search size={18} /> Explorar Studios</button>
          <button onClick={() => setAbaAtiva('agendar')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${abaAtiva === 'agendar' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}><Calendar size={18} /> Agendar Sessão</button>
          <button onClick={() => setAbaAtiva('sessoes')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${abaAtiva === 'sessoes' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}><Clock size={18} /> Meus Agendamentos</button>
          <button onClick={() => setAbaAtiva('ajuda')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${abaAtiva === 'ajuda' ? 'bg-[#EAB308] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}><AlertTriangle size={18} /> Central de Ajuda</button>
        </nav>

        <button onClick={signOut} className="flex items-center gap-3 p-3 text-red-500/60 hover:text-red-500 font-bold transition-all mt-auto border-t border-white/5 pt-6 uppercase text-[10px] tracking-widest"><LogOut size={18} /> Sair do App</button>
      </aside>

      <main className="flex-1 ml-64 p-10">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-[#EAB308] animate-spin" size={40} />
            <p className="text-[#EAB308] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Carregando Vitrine...</p>
          </div>
        ) : (
          <>
            {abaAtiva === 'explorar' && (
              <div className="animate-in fade-in duration-500">
                <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3 uppercase italic tracking-tight">Descubra seu <span className="text-[#EAB308]">Próximo Artista</span> <Sparkles className="text-[#EAB308]" size={24} /></h2>
                    <p className="text-gray-500 text-sm">Conheça e filtre os melhores studios parceiros do StudioMaster pelo Brasil.</p>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="text" placeholder="Buscar por estúdio, cidade ou estilo..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full bg-[#0f1117] border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-[#EAB308] outline-none transition-all shadow-inner" />
                  </div>
                </header>

                {studiosFiltrados.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {studiosFiltrados.map((item: StudioItem) => (
                      <div key={item.id || item._id} className="bg-[#0f1117] rounded-3xl border border-white/5 overflow-hidden group hover:border-[#EAB308]/40 transition-all flex flex-col h-full">
                        <div className="h-24 bg-gradient-to-br from-[#EAB308]/10 to-black/20 p-4 flex justify-end">
                          <span className="bg-black/60 backdrop-blur-md h-fit px-3 py-1 rounded-full text-[9px] font-black text-[#EAB308] border border-[#EAB308]/10 tracking-widest">DISPONÍVEL</span>
                        </div>
                        <div className="px-6 pb-6 -mt-10 flex flex-col flex-1">
                          <img src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'} alt="Avatar" className="w-16 h-16 rounded-2xl border-4 border-[#050505] mb-4 object-cover" />
                          <h3 className="font-bold text-lg text-white leading-snug">{item.studio || item.nomeFantasia || 'Estúdio Desconhecido'}</h3>
                          <p className="text-[#EAB308] text-[10px] font-black uppercase tracking-widest mb-1">{item.nome || 'artista.tattoo'}</p>
                          <p className="text-gray-500 text-[10px] mb-2 font-semibold tracking-wide uppercase">{item.especialidade || 'Estilo Livre'}</p>
                          <p className="text-gray-400 text-[10px] mb-4 flex items-center gap-1 line-clamp-1"><MapPin size={10} className="text-[#EAB308] shrink-0" /> {item.endereco || 'Brasil'}</p>
                          
                          <div className="flex gap-2 mb-6 mt-auto">
                            {item.portfolio && item.portfolio.slice(0, 3).map((pic: PortfolioItem, idx: number) => (
                              <img key={idx} src={pic.imagem_url} alt="Portfolio" className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-300 border border-white/5" />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => abrirDetalhesStudio(item)} className="flex-1 bg-white text-black text-xs font-black py-3 rounded-xl hover:bg-[#EAB308] transition-all uppercase tracking-widest">VER AGENDA</button>
                            <button type="button" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-[#EAB308]"><MessageSquare size={18} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center max-w-md mx-auto mt-16">
                    <SlidersHorizontal className="mx-auto text-white/10 mb-4" size={32} />
                    <h3 className="font-bold text-base mb-1 text-white">Nenhum estúdio encontrado</h3>
                    <p className="text-white/40 text-xs mb-4">Não encontramos resultados para sua busca.</p>
                    <button onClick={() => setBusca('')} className="text-[#EAB308] font-bold text-xs uppercase tracking-wider underline">Limpar Filtros</button>
                  </div>
                )}
              </div>
            )}

            {abaAtiva === 'agendar' && (
              <div className="animate-in fade-in duration-500 max-w-5xl">
                {studioSelecionado ? (
                  <>
                    <button onClick={() => setAbaAtiva('explorar')} className="text-xs text-[#EAB308] font-black uppercase tracking-widest mb-6 flex items-center gap-2 hover:underline"><ArrowLeft size={14} /> Voltar para os Estúdios</button>
                    
                    <div className="bg-[#0f1117] p-8 rounded-[32px] border border-white/5 shadow-2xl">
                      <div className="flex items-center gap-5 pb-6 border-b border-white/5">
                        <img src={studioSelecionado.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} alt="Perfil" className="w-20 h-20 rounded-full border-2 border-[#EAB308] object-cover shadow-lg" />
                        <div>
                          <h2 className="text-3xl font-black text-white tracking-tight uppercase">{studioSelecionado.studio || studioSelecionado.nomeFantasia}</h2>
                          <div className="text-[#EAB308] text-sm font-bold tracking-wide mt-0.5">{studioSelecionado.nome} &bull; <span className="text-white/40 text-[11px] font-medium tracking-normal normal-case">{studioSelecionado.especialidade}</span></div>
                          <p className="text-white/40 text-[11px] mt-1 flex items-center gap-1 font-medium"><MapPin size={12} className="text-[#EAB308] shrink-0" /> {studioSelecionado.endereco}</p>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#EAB308] mb-4 flex items-center gap-2">Galeria de Inspiração <Sparkles size={14} /></h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {studioSelecionado.portfolio && studioSelecionado.portfolio.map((pic: PortfolioItem, n: number) => (
                              <div key={n} className="overflow-hidden rounded-xl border border-white/5 aspect-square bg-black group">
                                <img src={pic.imagem_url} alt={`Trabalho ${n + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <form onSubmit={handleAgendar} className="lg:col-span-5 bg-black/40 p-6 rounded-2xl border border-white/5 h-fit space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Solicitar Sessão</h4>
                          <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-1">Selecione o Estilo/Serviço</label>
                            <select value={servico} onChange={(e) => setServico(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-[#EAB308] outline-none text-xs cursor-pointer">
                              <option value="flash">Flash Tattoo Recente</option>
                              <option value="custom">Desenho Customizado / Autoral</option>
                              <option value="projeto">Fechamento / Grande Porte</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-1">Data Desejada</label>
                            <input type="date" value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)} required className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-[#EAB308] outline-none text-xs" />
                          </div>
                          <button type="submit" disabled={enviando} className="w-full bg-[#EAB308] text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg mt-4 disabled:opacity-50">
                            {enviando ? 'Enviando...' : 'Enviar Proposta de Sessão'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 border border-dashed border-white/10 rounded-[32px] text-center max-w-xl mx-auto mt-10">
                    <Calendar className="mx-auto text-white/10 mb-4" size={48} />
                    <h3 className="font-bold text-lg mb-2">Nenhum estúdio selecionado</h3>
                    <p className="text-white/40 text-xs mb-6 max-w-xs mx-auto">Escolha um dos artistas disponíveis na nossa lista.</p>
                    <button onClick={() => setAbaAtiva('explorar')} className="bg-[#EAB308] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest hover:brightness-110 transition-all">Explorar Lista de Artistas</button>
                  </div>
                )}
              </div>
            )}

            {/* ABA: MEUS AGENDAMENTOS */}
            {abaAtiva === 'sessoes' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6">Minhas <span className="text-[#EAB308]">Sessões</span></h2>
                <div className="p-12 border border-dashed border-white/10 rounded-[32px] text-center max-w-xl">
                  <Clock className="mx-auto text-white/10 mb-4" size={40} />
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Nenhuma sessão confirmada ou em andamento.</p>
                </div>
              </div>
            )}

            {/* ABA: AJUDA */}
            {abaAtiva === 'ajuda' && (
              <div className="max-w-2xl bg-[#0f1117] p-8 rounded-3xl border border-white/5 animate-in zoom-in-95 duration-300">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 italic uppercase tracking-tighter">
                  <AlertTriangle className="text-[#EAB308]" /> Central de Suporte
                </h2>
                <div className="space-y-4">
                  <details className="bg-black/40 p-4 rounded-xl border border-white/5 cursor-pointer group">
                    <summary className="font-bold text-xs list-none flex justify-between items-center uppercase tracking-widest">
                      Como funciona a aprovação? <span className="text-[#EAB308]">+</span>
                    </summary>
                    <p className="text-gray-500 text-[10px] mt-3 leading-relaxed uppercase font-medium">
                      O estúdio parceiro recebe sua requisição e confere com os horários disponíveis da agenda interna.
                    </p>
                  </details>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}