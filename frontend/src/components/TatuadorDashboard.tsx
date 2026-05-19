import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient'; 
import { Calendar, Package, Users, Camera, Loader2, Save, Trash2 } from 'lucide-react';
import Sidebar from './Sidebar'; 
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export default function TatuadorDashboard({ activeTab: externalTab = 'dashboard' }) {
  const { usuario } = useAuth(); 
  const [activeTab, setActiveTab] = useState(externalTab);
  
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [endereco, setEndereco] = useState('');
  
  const userId = usuario?.id;

  useEffect(() => {
    // GUARDIAO: Se não for tatuador ou não tiver ID, não busca nada e para o loading
    if (!userId || usuario?.tipo !== 'tatuador') {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [a, e] = await Promise.all([
          axios.get(`${API_URL}/agendamentos`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/estoque`).catch(() => ({ data: [] }))
        ]);
        
        setAgendamentos(a.data || []);
        setEstoque(e.data || []);
        
        const perfilRes = await axios.get(`${API_URL}/tatuadores/${userId}`).catch(() => null);
        if (perfilRes?.data) {
          setNomeFantasia(perfilRes.data.nomeFantasia || usuario?.nome || '');
          setEspecialidade(perfilRes.data.especialidade || '');
          setEndereco(perfilRes.data.endereco || '');
        }
      } catch (err) { 
        console.error("Erro ao carregar dados", err); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, [userId, usuario]);

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/tatuadores/${userId}`, { nomeFantasia, especialidade, endereco });
      toast.success('Dados salvos!');
    } catch (err) { toast.error('Erro ao salvar'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#EAB308]">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="tatuador" />

      <main className="flex-1 ml-64 p-10 text-white">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            PAINEL DO <span className="text-[#EAB308]">TATUADOR</span>
          </h1>
        </div>

        <div className="bg-[#0f1117] rounded-[32px] border border-white/5 p-8 min-h-[550px] shadow-2xl">
          
          {(activeTab === 'dashboard' || activeTab === 'agenda') && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase italic">
                <Calendar className="text-[#EAB308]" size={24} /> Agenda
              </h2>
              {agendamentos.map((ag) => (
                <div key={ag.id} className="bg-black/40 p-6 rounded-2xl border border-white/10 flex justify-between items-center">
                  <h3 className="font-bold">{ag.cliente?.nome}</h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'estoque' && (
             <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                  <Package className="text-[#EAB308]" size={24} /> Inventário
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {estoque.map((item: any) => (
                    <div key={item.id} className="bg-black/40 p-6 rounded-2xl border border-white/10">
                      <p className="font-black text-lg">{item.nome}</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'equipe' && (
             <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                  <Users className="text-[#EAB308]" size={24} /> Gestão de Equipe
                </h3>
             </div>
          )}

          {activeTab === 'portfolio' && (
            <form onSubmit={handleSalvarPerfil} className="space-y-8">
              <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3 border-b border-white/10 pb-4">
                 <Camera className="text-[#EAB308]" size={24} /> Configurações de Perfil
              </h3>
              <input value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl" />
              <button type="submit" className="bg-[#EAB308] text-black px-8 py-3 rounded-xl font-black">Atualizar</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}