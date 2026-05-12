import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, Package, LogOut, 
  Users, Plus, Trash2, Camera, Clock, Loader2, CheckCircle2
} from 'lucide-react';
import AdminConfig from './AdminConfig'; 

const API_URL = 'http://localhost:5000/api';

interface TatuadorDashboardProps {
  activeTab?: string;
}

export default function TatuadorDashboard({ activeTab: externalTab }: TatuadorDashboardProps) {
  const { usuario, signOut } = useAuth(); 
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeTab = externalTab || 'dashboard';
  const [novaFoto, setNovaFoto] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [a, e] = await Promise.all([
          axios.get(`${API_URL}/agendamentos`),
          axios.get(`${API_URL}/estoque`)
        ]);
        setAgendamentos(a.data || []);
        setEstoque(e.data || []);
      } catch (err) { 
        console.error("Erro ao carregar dados", err); 
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  // Funcionalidade do Loader2: Tela de carregamento técnica e elegante
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-[#EAB308] animate-spin" size={40} />
        <p className="text-[#EAB308] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Sincronizando StudioMaster...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER COM LOGOUT E USUÁRIOS */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            PAINEL DO <span className="text-[#EAB308]">TATUADOR</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-white/40 font-medium italic border-l-2 border-[#EAB308] pl-4 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Users size={12} className="text-[#EAB308]" /> Profissional: {usuario?.nome}
            </p>
          </div>
        </div>

        <button 
          onClick={signOut}
          className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={14} /> Sair do Sistema
        </button>
      </div>

      <main className="bg-[#0f1117] rounded-[32px] border border-white/5 p-8 min-h-[550px] shadow-2xl relative">
        
        {/* ABA: AGENDA / DASHBOARD */}
        {(activeTab === 'agenda' || activeTab === 'dashboard') && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
              <Calendar className="text-[#EAB308]" size={24} /> Próximas Sessões
            </h2>
            
            {/* Funcionalidade do Clock: Estado vazio para agenda */}
            {agendamentos.length === 0 ? (
              <div className="p-20 border border-dashed border-white/10 rounded-[32px] text-center">
                <Clock className="mx-auto text-white/10 mb-4" size={48} />
                <p className="text-white/20 font-bold uppercase text-[10px] tracking-[0.2em]">
                  Nenhuma sessão agendada para hoje
                </p>
              </div>
            ) : (
              agendamentos.map((ag) => (
                <div key={ag._id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[#EAB308]/30 transition-all">
                  <div>
                    <h3 className="font-bold text-lg text-white">{ag.cliente?.nome}</h3>
                    <p className="text-gray-500 text-sm">{ag.servico?.nome}</p>
                  </div>
                  {/* Funcionalidade do CheckCircle2: Confirmação de ação */}
                  <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] hover:bg-[#EAB308] transition-all uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} /> Finalizar
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA: ESTOQUE */}
        {activeTab === 'estoque' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
                <Package className="text-[#EAB308]" size={24} /> Inventário
              </h3>
              <button className="bg-white text-black px-4 py-2 rounded-lg font-black text-[10px] hover:bg-[#EAB308] transition-all uppercase tracking-widest flex items-center gap-2">
                <Plus size={14} /> Novo Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {estoque.map((item: any) => (
                <div key={item._id} className="bg-black/40 p-6 rounded-2xl border border-white/5 group hover:border-[#EAB308]/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-white text-sm uppercase">{item.nome}</p>
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{item.categoria}</p>
                    </div>
                    <button className="p-2 text-white/10 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className={`text-xl font-black ${item.quantidade < 5 ? 'text-red-500' : 'text-[#EAB308]'}`}>
                      {item.quantidade} <small className="text-[10px] opacity-50 uppercase">un</small>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: GESTÃO / PORTFÓLIO */}
        {(activeTab === 'gestao' || activeTab === 'equipe' || activeTab === 'servicos') && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminConfig tab={activeTab === 'equipe' ? 'equipe' : 'servicos'} />

            <div className="border-t border-white/5 pt-12">
              <h3 className="font-black flex items-center gap-3 text-white uppercase text-sm tracking-[0.2em] italic mb-8">
                <Camera size={20} className="text-[#EAB308]" /> Galeria de Trabalhos
              </h3>

              <div className="flex gap-3 mb-10">
                <input 
                  value={novaFoto} 
                  onChange={e => setNovaFoto(e.target.value)} 
                  type="text" 
                  placeholder="URL da nova obra..." 
                  className="flex-1 bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-[#EAB308] text-xs transition-all text-white" 
                />
                <button className="bg-[#EAB308] text-black px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                   <Plus size={14} /> Adicionar
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-black rounded-3xl border border-white/5 overflow-hidden group relative">
                    <img src={`https://picsum.photos/400/400?random=${i}`} alt="Portfolio" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-red-600 text-white p-3 rounded-full hover:scale-110 transition-transform">
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}