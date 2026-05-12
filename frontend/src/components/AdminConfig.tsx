import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, UserPlus, X, Save, Users } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface AdminConfigProps {
  tab?: string;
}

interface Servico {
  _id: string;
  nome: string;
  preco: number;
}

export default function AdminConfig({ tab }: AdminConfigProps) {
  const { usuario } = useAuth();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [novoServico, setNovoServico] = useState({ nome: '', preco: 0 });
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const loadServicos = async () => {
    if (!usuario?.id) return;
    try {
      const res = await axios.get(`${API_URL}/servicos?estudioId=${usuario.id}`);
      setServicos(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços");
    }
  };

  useEffect(() => {
    if (tab === 'servicos' && usuario) {
      loadServicos();
    }
  }, [tab, usuario]);

  const handleSaveServico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/servicos/${editingId}`, novoServico);
      } else {
        await axios.post(`${API_URL}/servicos`, {
          ...novoServico,
          estudioId: usuario.id
        });
      }

      setIsModalOpen(false);
      setNovoServico({ nome: '', preco: 0 });
      setEditingId(null);
      loadServicos();
    } catch {
      alert("Erro ao salvar serviço");
    }
  };

  const handleCreateFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id) return;

    try {
      await axios.post(`${API_URL}/usuarios/funcionario`, {
        ...novoFuncionario,
        role: 'funcionario',
        estudioId: usuario.id
      });

      alert("✅ Funcionário cadastrado!");
      setNovoFuncionario({ nome: '', email: '', senha: '' });
      setIsUserModalOpen(false);
    } catch {
      alert("Erro ao criar funcionário");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* SEÇÃO DE SERVIÇOS */}
      {tab === 'servicos' && (
        <>
          <header className="flex justify-between items-center mb-10 bg-[#0f1117] p-6 rounded-2xl border border-white/5 shadow-2xl">
            <div>
              <h1 className="text-2xl font-black text-[#EAB308] uppercase italic">Estilos de Tattoo</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Catálogo e Preços</p>
            </div>
            <button
              onClick={() => { setEditingId(null); setNovoServico({ nome: '', preco: 0 }); setIsModalOpen(true); }}
              className="bg-[#EAB308] text-black px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <Plus size={16} /> Novo Estilo
            </button>
          </header>

          <section className="bg-[#0f1117] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="text-[10px] text-white/30 uppercase font-black tracking-widest border-b border-white/5">
                <tr>
                  <th className="p-6">Estilo</th>
                  <th className="p-6">Preço Base</th>
                  <th className="p-6 text-right">Gerenciar</th>
                </tr>
              </thead>
              <tbody className="text-white/80 font-medium">
                {servicos.map((s) => (
                  <tr key={s._id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">{s.nome}</td>
                    <td className="p-6 text-[#EAB308]">R$ {s.preco.toFixed(2)}</td>
                    <td className="p-6 text-right space-x-4">
                      <button onClick={() => { setEditingId(s._id); setNovoServico({ nome: s.nome, preco: s.preco }); setIsModalOpen(true); }} className="hover:text-[#EAB308] transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={async () => { if (confirm("Excluir este estilo?")) { await axios.delete(`${API_URL}/servicos/${s._id}`); loadServicos(); } }} className="hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
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
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-white/5 p-8 rounded-full mb-6 border border-white/10">
            <Users size={48} className="text-[#EAB308] opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Gestão de Tatuadores</h2>
          <p className="text-white/40 mb-8 max-w-xs text-xs font-medium uppercase tracking-widest">Adicione novos membros para gerenciar agendas e portfólios.</p>
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="bg-[#EAB308] text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Cadastrar Membro
          </button>
        </div>
      )}

      {/* MODAL SERVIÇOS (REESTILIZADO) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f1117] w-full max-w-sm p-8 rounded-3xl border border-white/10 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-white italic uppercase mb-6">
              {editingId ? 'Editar' : 'Novo'} <span className="text-[#EAB308]">Estilo</span>
            </h2>
            <form onSubmit={handleSaveServico} className="space-y-4">
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#EAB308] transition-all"
                value={novoServico.nome}
                onChange={(e) => setNovoServico({ ...novoServico, nome: e.target.value })}
                placeholder="Nome do Estilo"
              />
              <input
                required
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#EAB308] transition-all"
                value={novoServico.preco}
                onChange={(e) => setNovoServico({ ...novoServico, preco: Number(e.target.value) })}
                placeholder="Preço R$"
              />
              <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-4 rounded-xl mt-4 uppercase text-xs tracking-widest hover:brightness-110 shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2">
                <Save size={16} /> Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EQUIPE (ADICIONADO) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f1117] w-full max-w-md p-8 rounded-3xl border border-white/10 relative shadow-2xl">
            <button onClick={() => setIsUserModalOpen(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-white italic uppercase mb-6">Novo <span className="text-[#EAB308]">Tatuador</span></h2>
            <form onSubmit={handleCreateFuncionario} className="space-y-4">
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#EAB308]"
                placeholder="Nome do Tatuador"
                value={novoFuncionario.nome}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
              />
              <input
                required
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#EAB308]"
                placeholder="E-mail de acesso"
                value={novoFuncionario.email}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
              />
              <input
                required
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#EAB308]"
                placeholder="Senha inicial"
                value={novoFuncionario.senha}
                onChange={(e) => setNovoFuncionario({ ...novoFuncionario, senha: e.target.value })}
              />
              <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-4 rounded-xl mt-4 uppercase text-xs tracking-widest">
                Finalizar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}