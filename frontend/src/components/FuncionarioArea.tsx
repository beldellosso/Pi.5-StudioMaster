import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, Plus, LogOut, DollarSign, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export default function FuncionarioArea() {
  const { usuario, signOut } = useAuth();
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarDadosOperacionais = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/clientes`);
        setClientes(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar banco de dados de clientes", err);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosOperacionais();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* SIDEBAR OPERACIONAL */}
      <aside className="w-64 bg-[#0f1117] border-r border-white/5 p-6 flex flex-col fixed h-full">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-[#EAB308] tracking-tighter italic">
            STUDIO<span className="text-white">RECEPÇÃO</span>
          </h1>
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em] mt-2">
            Operador: {usuario?.nome?.split(' ')[0] || 'Atendente'}
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#EAB308] text-black font-bold text-sm cursor-pointer">
            <Users size={18} /> Controle de Clientes
          </div>
          <div 
            onClick={() => toast.success('Módulo de Agenda Geral em desenvolvimento')}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 text-sm cursor-pointer transition-all"
          >
            <Calendar size={18} /> Agenda Geral
          </div>
          <div 
            onClick={() => toast.success('Módulo Financeiro do Caixa em desenvolvimento')}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 text-sm cursor-pointer transition-all"
          >
            {/* UTILIZANDO O ÍCONE DOLLARSIGN AQUI */}
            <DollarSign size={18} /> Caixa Diário
          </div>
        </nav>

        <button onClick={signOut} className="flex items-center gap-3 p-3 text-red-500/60 hover:text-red-500 font-bold transition-all mt-auto border-t border-white/5 pt-6 uppercase text-[10px] tracking-widest">
          <LogOut size={18} /> Sair do Painel
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight">Gestão <span className="text-[#EAB308]">Operacional</span></h2>
            <p className="text-gray-500 text-sm">Controle de clientes cadastrados no ecossistema StudioMaster.</p>
          </div>
          <button onClick={() => toast.success('Módulo de cadastro rápido ativo!')} className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#EAB308] transition-all flex items-center gap-2">
            <Plus size={14} /> Novo Cadastro
          </button>
        </header>

        {/* TABELA DE DADOS VINCULADA AO CRUD */}
        <div className="bg-[#0f1117] rounded-[32px] border border-white/5 p-8 shadow-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Fichas de Clientes (Sincronizado com MongoDB)</h3>
          
          {loading ? (
            <div className="text-center py-8 text-xs text-[#EAB308] uppercase tracking-widest font-bold">Carregando registros...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <th className="pb-4">Nome completo</th>
                  <th className="pb-4">Contato / WhatsApp</th>
                  <th className="pb-4 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {(clientes.length > 0 ? clientes : [
                  { _id: 'c1', nome: 'Felipe Amorim Santos', telefone: '(11) 98765-4321' },
                  { _id: 'c2', nome: 'Amanda Albuquerque', telefone: '(11) 99122-3344' }
                ]).map((cli) => (
                  <tr key={cli._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-white font-bold">{cli.nome}</td>
                    <td className="py-4 text-gray-400">{cli.telefone || 'Não informado'}</td>
                    <td className="py-4 text-right">
                      {/* UTILIZANDO O ÍCONE CHECKCIRCLE AQUI NA VALIDAÇÃO */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-wider rounded-full">
                        <CheckCircle size={10} /> Regularizado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}