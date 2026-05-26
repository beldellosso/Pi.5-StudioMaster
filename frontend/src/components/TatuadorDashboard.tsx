import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Calendar, Package, Users, Camera, Loader2, Trash2, LayoutDashboard, Plus, Save, X } from 'lucide-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export default function TatuadorDashboard({ activeTab: initialTab = 'dashboard' }) {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  
  const [isFuncModalOpen, setIsFuncModalOpen] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', email: '', senha: '' });

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);

  // Função auxiliar para pegar o token
  const getAuthHeader = () => {
  const usuarioSalvo = localStorage.getItem('@StudioMaster:user');
  const user = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

  const fetchDados = async () => {
    if (!usuario?.id) return;
    setLoading(true);
    
    // 1. Busca Equipe (Supabase)
    const { data: eq } = await supabase.from('usuarios').select('*').eq('dono_id', usuario.id);
    setEquipe(eq || []);

    // 2. Busca Portfólio (Supabase)
    const { data: p } = await supabase.from('portfolio').select('*').eq('tatuador_id', usuario.id);
    setPortfolio(p || []);

    // 3. Busca Backend com Token
    try {
      const ag = await axios.get(`${API_URL}/agendamentos`, getAuthHeader());
      setAgendamentos(ag.data || []);
    } catch (e) { console.warn("Erro ao buscar agendamentos:", e); }

    try {
      const est = await axios.get(`${API_URL}/estoque`, { 
        params: { donoId: usuario.id },
        ...getAuthHeader() 
      });
      setEstoque(est.data || []);
    } catch (e) { console.error("Erro ao buscar estoque:", e); }

    setLoading(false);
  };

  const handleCreateFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      nome: novoFuncionario.nome,
      email: novoFuncionario.email,
      senha: novoFuncionario.senha,
      donoId: usuario?.id
    };

    try {
      await axios.post(`${API_URL}/usuarios/funcionario`, payload, getAuthHeader());
      
      toast.success("Funcionário cadastrado!");
      setNovoFuncionario({ nome: '', email: '', senha: '' });
      setIsFuncModalOpen(false);
      fetchDados();
    } catch (err: any) { 
      console.error("DETALHE DO ERRO 400:", err.response?.data);
      toast.error(err.response?.data?.message || "Erro ao cadastrar funcionário.");
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;
    const { data, error } = await supabase.storage.from('portfolio').upload(`${usuario.id}/${Date.now()}`, file);
    if (error) return toast.error("Erro no upload da foto");
    await supabase.from('portfolio').insert({ tatuador_id: usuario.id, imagem_url: data.path });
    fetchDados();
  };

  const updateEstoque = async (id: string, novaQtd: number) => {
    await supabase.from('estoque').update({ quantidade: novaQtd }).eq('id', id);
    toast.success("Estoque atualizado!");
    fetchDados();
  };

  useEffect(() => { fetchDados(); }, [usuario?.id]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#050505]"><Loader2 className="animate-spin text-[#EAB308]" size={48} /></div>;

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="tatuador" userName={usuario?.nome} />
      
      <main className="flex-1 ml-64 p-10">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-black uppercase italic">STUDIO <span className="text-[#EAB308]">MASTER</span></h1>
            <div className="text-right">
                <p className="text-sm text-white/50">Bem-vindo(a),</p>
                <p className="font-bold text-[#EAB308]">{usuario?.nome || 'Usuário'}</p>
            </div>
        </div>
        
        <div className="bg-[#0f1117] rounded-[32px] p-8 border border-white/5 min-h-[500px]">
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="text-[#EAB308]" /> Visão Geral</h2>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                <p>Estúdio: {usuario?.nome_studio || 'Não definido'}</p>
                <p>Especialidade: {usuario?.especialidade || 'Não definida'}</p>
                <p>Endereço: {usuario?.endereco || 'Não definido'}</p>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-[#EAB308]" /> Agenda</h3>
              {agendamentos.length > 0 ? agendamentos.map(ag => (
                <div key={ag.id} className="bg-black/40 p-4 rounded-lg border border-white/10">{ag.cliente_nome} - {ag.data_hora}</div>
              )) : <p className="text-white/40 italic">Nenhum agendamento encontrado.</p>}
            </div>
          )}

          {activeTab === 'equipe' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2"><Users className="text-[#EAB308]" /> Equipe</h3>
                <button onClick={() => setIsFuncModalOpen(true)} className="flex items-center gap-2 bg-[#EAB308] text-black px-4 py-2 rounded-lg font-bold"><Plus size={18}/> Adicionar</button>
              </div>
              {equipe.map(m => (
                <div key={m.id} className="flex justify-between bg-black/40 p-4 rounded-lg border border-white/10 items-center">
                  <div>
                    <p className="font-bold">{m.nome}</p>
                    <p className="text-xs text-white/50">{m.email}</p>
                  </div>
                  <Trash2 className="text-red-500 cursor-pointer hover:text-red-400" onClick={async () => {
                     await supabase.from('usuarios').delete().eq('id', m.id);
                     fetchDados();
                  }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Camera className="text-[#EAB308]" /> Portfólio</h3>
              <label className="cursor-pointer bg-[#EAB308] text-black px-4 py-2 rounded-lg font-bold inline-block">
                Upload Nova Foto
                <input type="file" className="hidden" onChange={handleUploadFoto} />
              </label>
              <div className="grid grid-cols-3 gap-4">
                {portfolio.map(p => (
                  <img key={p.id} src={supabase.storage.from('portfolio').getPublicUrl(p.imagem_url).data.publicUrl} alt="Portfolio" className="w-full h-40 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'estoque' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Package className="text-[#EAB308]" /> Inventário</h3>
              {estoque.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/10">
                  <span className="font-bold">{item.nome}</span>
                  <div className="flex items-center gap-4">
                    <input type="number" defaultValue={item.quantidade} className="w-20 bg-white/5 p-2 rounded text-center" onBlur={(e) => updateEstoque(item.id, Number(e.target.value))} />
                    <button onClick={() => updateEstoque(item.id, item.quantidade)}><Save size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {isFuncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f1117] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
            <button onClick={() => setIsFuncModalOpen(false)} className="absolute top-6 right-6"><X size={20}/></button>
            <h2 className="text-xl font-black italic uppercase mb-6">Novo <span className="text-[#EAB308]">Funcionário</span></h2>
            <form onSubmit={handleCreateFuncionario} className="space-y-4">
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Nome" value={novoFuncionario.nome} onChange={e => setNovoFuncionario({...novoFuncionario, nome: e.target.value})} />
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="E-mail" value={novoFuncionario.email} onChange={e => setNovoFuncionario({...novoFuncionario, email: e.target.value})} />
              <input required type="password" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Senha" value={novoFuncionario.senha} onChange={e => setNovoFuncionario({...novoFuncionario, senha: e.target.value})} />
              <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-4 rounded-xl mt-4 uppercase text-xs">Finalizar Cadastro</button>
            </form>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}