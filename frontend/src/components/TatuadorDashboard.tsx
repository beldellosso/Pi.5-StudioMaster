import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Agendamento, Estoque } from '../types';
import { Calendar, Package, AlertTriangle, LogOut, DollarSign, CheckCircle } from 'lucide-react';


const API_URL = 'http://localhost:5000/api';

export default function TatuadorDashboard() {
  const { usuario, signOut } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'estoque'>('agendamentos');

  useEffect(() => {
    loadAgendamentos();
    loadEstoque();

    
  }, []);

  const loadAgendamentos = async () => {
    try {
      const response = await axios.get(`${API_URL}/agendamentos`);
      if (response.data) setAgendamentos(response.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos do Atlas:", err);
    }
  };

  const loadEstoque = async () => {
    try {
      const response = await axios.get(`${API_URL}/estoque`);
      if (response.data) setEstoque(response.data);
    } catch (err) {
      console.error("Erro ao carregar estoque:", err);
    }
  };

  const handleConfirmar = async (id: string) => {
    try {
      await axios.put(`${API_URL}/agendamentos/${id}`, { status: 'confirmado' });
      loadAgendamentos();
    } catch (err) {
      alert('Erro ao confirmar agendamento no servidor');
    }
  };

  const handleConcluir = async (id: string) => {
    try {
      await axios.put(`${API_URL}/agendamentos/${id}`, { status: 'concluido' });
      alert('✅ Agendamento concluído! Materiais foram baixados do estoque.');
      
      
      await baixarEstoqueNoServidor();
      
      loadAgendamentos();
    } catch (err) {
      alert('Erro ao concluir agendamento');
    }
  };

  const baixarEstoqueNoServidor = async () => {
    const itensParaBaixar = [
      { nome: 'Agulhas Descartáveis', quantidade: 2 },
      { nome: 'Luvas Descartáveis', quantidade: 2 },
    ];

    try {
      
      await axios.post(`${API_URL}/estoque/baixa`, { itens: itensParaBaixar });
      loadEstoque();
    } catch (err) {
      console.error("Erro ao processar baixa de estoque");
    }
  };

  const handleReporEstoque = async (id: string, quantidade: number) => {
    const novaQuantidade = prompt('Digite a nova quantidade:', quantidade.toString());
    if (novaQuantidade) {
      try {
        await axios.put(`${API_URL}/estoque/${id}`, { 
          quantidade: parseInt(novaQuantidade) 
        });
        loadEstoque();
      } catch (err) {
        alert('Erro ao atualizar estoque');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
      confirmado: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
      pago: 'bg-green-900/30 text-green-400 border-green-500/30',
      cancelado: 'bg-red-900/30 text-red-400 border-red-500/30',
      concluido: 'bg-gray-700 text-gray-300 border-gray-600'
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  const agendamentosFuturos = agendamentos.filter(a =>
    new Date(a.data_hora) >= new Date() && a.status !== 'concluido' && a.status !== 'cancelado'
  );

  const estoqueAlerta = estoque.filter(e => e.quantidade <= e.nivel_minimo);
  const totalFaturamento = agendamentos
    .filter(a => a.status === 'pago' || a.status === 'concluido')
    .reduce((sum, a) => sum + a.valor_total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Dashboard - StudioMaster
            </h1>
            <p className="text-gray-400">Área Administrativa - {usuario?.nome}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Cards de Métricas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-2xl p-6 border border-blue-700/30">
            <div className="flex items-center gap-4">
              <Calendar className="w-12 h-12 text-blue-400" />
              <div>
                <p className="text-blue-300 text-sm">Agendamentos Futuros</p>
                <p className="text-3xl font-bold text-white">{agendamentosFuturos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-2xl p-6 border border-yellow-700/30">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
              <div>
                <p className="text-yellow-300 text-sm">Alertas de Estoque</p>
                <p className="text-3xl font-bold text-white">{estoqueAlerta.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-2xl p-6 border border-green-700/30">
            <div className="flex items-center gap-4">
              <DollarSign className="w-12 h-12 text-green-400" />
              <div>
                <p className="text-green-300 text-sm">Faturamento Total</p>
                <p className="text-3xl font-bold text-white">R$ {totalFaturamento.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Controle */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('agendamentos')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'agendamentos'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar className="inline w-5 h-5 mr-2" />
              Agendamentos
            </button>
            <button
              onClick={() => setActiveTab('estoque')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'estoque'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Package className="inline w-5 h-5 mr-2" />
              Controle de Estoque
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'agendamentos' ? (
              <div className="space-y-4">
                {agendamentos.length === 0 ? (
                  <p className="text-gray-400 text-center py-12">Nenhum agendamento registrado no Atlas</p>
                ) : (
                  agendamentos.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="bg-gray-700 rounded-xl p-6 border border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg">{agendamento.servico?.nome}</h3>
                          <p className="text-gray-300">Cliente: {agendamento.cliente?.nome}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(agendamento.status)}`}>
                          {agendamento.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Data e Hora</p>
                          <p className="text-white font-semibold">{new Date(agendamento.data_hora).toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Valor</p>
                          <p className="text-yellow-400 font-bold text-lg">R$ {agendamento.valor_total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {agendamento.status === 'pendente' && (
                          <button
                            onClick={() => handleConfirmar(agendamento.id)}
                            className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                          >
                            Confirmar Agendamento
                          </button>
                        )}
                        {agendamento.status === 'confirmado' && (
                          <button
                            onClick={() => handleConcluir(agendamento.id)}
                            className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Concluir e Baixar Estoque
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {estoque.map((item) => (
                    <div key={item.id} className={`rounded-xl p-5 border-2 ${item.quantidade <= item.nivel_minimo ? 'bg-red-900/20 border-red-500/50' : 'bg-gray-700 border-gray-600'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white text-lg">{item.nome}</h3>
                        <p className="text-3xl font-bold text-yellow-400">{item.quantidade}</p>
                      </div>
                      <button
                        onClick={() => handleReporEstoque(item.id, item.quantidade)}
                        className="w-full px-4 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-700 transition-all text-sm"
                      >
                        Repor Estoque
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}