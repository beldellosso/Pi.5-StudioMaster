import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, UserPlus, X, Save, Users, User } from 'lucide-react';
import { Usuario } from '../types';

const API_URL = 'http://localhost:5000/api';

// Helper para pegar o token de forma segura
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('@StudioMaster:user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

interface AdminConfigProps { tab?: string; }
interface Servico { _id: string; nome: string; preco: number; }
interface Funcionario { _id: string; nome: string; email: string; }

export default function AdminConfig({ tab }: AdminConfigProps) {
  const { usuario } = useAuth();
  const user = usuario as Usuario; 

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [equipe, setEquipe] = useState<Funcionario[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [novoServico, setNovoServico] = useState({ nome: '', preco: 0 });
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', email: '', senha: '' });

  const loadDados = async () => {
    if (!user?.id) return;
    try {
      if (tab === 'servicos') {
        const res = await axios.get(`${API_URL}/servicos?estudioId=${user.id}`, getAuthHeaders());
        setServicos(res.data);
      } else if (tab === 'equipe') {
        const res = await axios.get(`${API_URL}/usuarios/equipe?donoId=${user.id}`, getAuthHeaders());
        setEquipe(res.data);
      }
    } catch (err) { 
      console.error("Erro ao carregar dados", err); 
    }
  };

  useEffect(() => { if (user) loadDados(); }, [tab, user]);

  const handleSaveServico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${API_URL}/servicos/${editingId}`, novoServico, getAuthHeaders());
      else await axios.post(`${API_URL}/servicos`, { ...novoServico, estudioId: user.id }, getAuthHeaders());
      setIsModalOpen(false);
      setNovoServico({ nome: '', preco: 0 });
      setEditingId(null);
      loadDados();
    } catch { alert("Erro ao salvar serviço"); }
  };

  const handleCreateFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/usuarios/funcionario`, { 
        ...novoFuncionario, 
        role: 'funcionario', 
        donoId: user.id 
      }, getAuthHeaders());
      alert("✅ Funcionário cadastrado!");
      setNovoFuncionario({ nome: '', email: '', senha: '' });
      setIsUserModalOpen(false);
      loadDados();
    } catch { alert("Erro ao criar funcionário"); }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* SEÇÃO DE SERVIÇOS */}
      {tab === 'servicos' && (
        <>
          <header className="flex justify-between items-center mb-10 bg-[#0f1117] p-6 rounded-2xl border border-white/5">
            <h1 className="text-2xl font-black text-[#EAB308] uppercase italic">Estilos de Tattoo</h1>
            <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-[#EAB308] text-black px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110">
              <Plus size={16} /> Novo Estilo
            </button>
          </header>

          <section className="bg-[#0f1117] rounded-3xl border border-white/5 overflow-hidden">
             <table className="w-full text-left">
               <tbody>
               {servicos.map((s) => (
                 <tr key={s._id} className="border-b border-white/[0.02]">
                   <td className="p-6">{s.nome}</td>
                   <td className="p-6 text-[#EAB308]">R$ {s.preco.toFixed(2)}</td>
                   <td className="p-6 text-right">
                      <button onClick={() => { setEditingId(s._id); setNovoServico({nome: s.nome, preco: s.preco}); setIsModalOpen(true); }} className="mr-4"><Edit2 size={16} /></button>
                      <button onClick={async () => { await axios.delete(`${API_URL}/servicos/${s._id}`, getAuthHeaders()); loadDados(); }}><Trash2 size={16} /></button>
                   </td>
                 </tr>
               ))}
               </tbody>
             </table>
          </section>
        </>
      )}

      {/* SEÇÃO DE EQUIPE */}
      {tab === 'equipe' && (
        <section className="space-y-6">
          <div className="flex justify-between items-center bg-[#0f1117] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold uppercase italic flex items-center gap-3">
                <Users className="text-[#EAB308]" /> Minha Equipe
            </h2>
            <button onClick={() => setIsUserModalOpen(true)} className="bg-[#EAB308] text-black px-6 py-2 rounded-lg font-black text-xs uppercase flex items-center gap-2">
              <UserPlus size={16} /> Cadastrar Membro
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipe.map(membro => (
              <div key={membro._id} className="bg-[#0f1117] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-full"><User className="text-[#EAB308]" /></div>
                <div>
                  <p className="font-bold">{membro.nome}</p>
                  <p className="text-xs text-white/50">{membro.email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL SERVIÇOS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f1117] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6"><X size={20}/></button>
             <h2 className="text-xl font-black italic uppercase mb-6">{editingId ? 'Editar' : 'Novo'} <span className="text-[#EAB308]">Estilo</span></h2>
             <form onSubmit={handleSaveServico} className="space-y-4">
               <input required className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Nome" value={novoServico.nome} onChange={e => setNovoServico({...novoServico, nome: e.target.value})} />
               <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Preço" value={novoServico.preco} onChange={e => setNovoServico({...novoServico, preco: Number(e.target.value)})} />
               <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-4 rounded-xl mt-4 uppercase text-xs flex items-center justify-center gap-2">
                 <Save size={16}/> Salvar
               </button>
             </form>
          </div>
        </div>
      )}
      
      {/* MODAL EQUIPE */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f1117] w-full max-w-md p-8 rounded-3xl border border-white/10 relative">
            <button onClick={() => setIsUserModalOpen(false)} className="absolute top-6 right-6"><X size={20}/></button>
            <h2 className="text-xl font-black italic uppercase mb-6">Novo <span className="text-[#EAB308]">Tatuador</span></h2>
            <form onSubmit={handleCreateFuncionario} className="space-y-4">
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Nome" value={novoFuncionario.nome} onChange={e => setNovoFuncionario({...novoFuncionario, nome: e.target.value})} />
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="E-mail" value={novoFuncionario.email} onChange={e => setNovoFuncionario({...novoFuncionario, email: e.target.value})} />
              <input required type="password" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Senha" value={novoFuncionario.senha} onChange={e => setNovoFuncionario({...novoFuncionario, senha: e.target.value})} />
              <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-4 rounded-xl mt-4 uppercase text-xs">Finalizar Cadastro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}