import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, DollarSign, Check, LogOut, Package, MapPin } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ClienteArea() {
  const { usuario, signOut } = useAuth();
  const [servicos, setServicos] = useState<any[]>([]);
  const [regioes, setRegioes] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedRegiao, setSelectedRegiao] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [precoTotal, setPrecoTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadAgendamentos = async () => {
    try {
      const res = await axios.get(`${API_URL}/agendamentos`);
      const meusAgendamentos = res.data
        .filter((i: any) => i.cliente?.email === usuario?.email)
        .map((i: any) => ({ ...i, id: i._id }));
      setAgendamentos(meusAgendamentos);
    } catch (err) {
      console.error("Erro ao carregar agendamentos", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, r] = await Promise.all([
          axios.get(`${API_URL}/servicos`),
          axios.get(`${API_URL}/regioes`)
        ]);
        setServicos(s.data.map((i: any) => ({ ...i, id: i._id })));
        setRegioes(r.data.map((i: any) => ({ ...i, id: i._id })));
        await loadAgendamentos();
      } catch (err) {
        console.error("Erro inicial de carregamento", err);
      }
    };
    if (usuario) fetchData();
  }, [usuario]);

  useEffect(() => {
    const s = servicos.find(x => x.id === selectedServico);
    const r = regioes.find(x => x.id === selectedRegiao);
    setPrecoTotal((s?.preco || 0) + (r?.adicional || 0));
  }, [selectedServico, selectedRegiao, servicos, regioes]);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const s = servicos.find(x => x.id === selectedServico);
      const r = regioes.find(x => x.id === selectedRegiao);
      
      await axios.post(`${API_URL}/agendar`, {
        cliente: { nome: usuario?.nome, email: usuario?.email },
        servico: { nome: s.nome, valor_base: s.preco },
        regiao: { nome: r.nome, adicional: r.adicional },
        data_hora: dataHora,
        valor_total: precoTotal,
        observacoes,
        status: 'pendente'
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      setSelectedServico(''); setSelectedRegiao(''); setDataHora(''); setObservacoes('');
      await loadAgendamentos();
    } catch (err) { 
      alert("Erro ao agendar"); 
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = async (id: string) => {
    try {
      const idLimpo = id.split(':')[0];
      await axios.put(`${API_URL}/agendamentos/${idLimpo}`, { status: 'pago' });
      alert("✅ Pagamento Confirmado!");
      await loadAgendamentos();
    } catch (err) { 
      alert("Erro ao processar pagamento"); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">StudioMaster</h1>
            <p className="text-gray-400 text-sm">Cliente: {usuario?.nome}</p>
          </div>
          <button onClick={signOut} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center gap-2">
            <LogOut size={20} /> <span className="hidden md:inline">Sair</span>
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-500">
              <Calendar /> Novo Agendamento
            </h2>
            <form onSubmit={handleAgendar} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase">Estilo da Tattoo</label>
                <select value={selectedServico} onChange={e => setSelectedServico(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none transition-all" required>
                  <option value="">Selecione o Estilo</option>
                  {servicos.map(s => (
                    <option key={s.id || s._id} value={s.id || s._id}>{s.nome} (R$ {s.preco})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase">Local do Corpo</label>
                <select value={selectedRegiao} onChange={e => setSelectedRegiao(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none transition-all" required>
                  <option value="">Onde será a tattoo?</option>
                  {regioes.map(r => (
                    <option key={r.id || r._id} value={r.id || r._id}>{r.nome} (+ R$ {r.adicional})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase">Data e Hora</label>
                <input type="datetime-local" value={dataHora} onChange={e => setDataHora(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none text-white" required />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase">Observações</label>
                <textarea placeholder="Detalhes da arte..." value={observacoes} onChange={e => setObservacoes(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none h-24 resize-none" />
              </div>
              
              <div className="bg-black/50 p-4 rounded-lg flex justify-between items-center border border-yellow-500/20">
                <span className="text-gray-400">Preço Estimado:</span>
                <span className="text-2xl font-bold text-yellow-500">R$ {precoTotal.toFixed(2)}</span>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-yellow-600 p-4 rounded-lg font-black text-black hover:bg-yellow-500 transition-all disabled:opacity-50 uppercase tracking-widest">
                {loading ? "Processando..." : "RESERVAR AGORA"}
              </button>
              
              {success && (
                <div className="flex items-center justify-center gap-2 text-green-500 font-bold animate-bounce">
                  <Check size={20} /> Agendamento concluído!
                </div>
              )}
            </form>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-500">
              <Clock /> Minhas Sessões
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {agendamentos.length === 0 ? (
                <p className="text-gray-500 italic text-center py-10">Você ainda não possui agendamentos.</p>
              ) : (
                agendamentos.map(ag => (
                  <div key={ag.id || ag._id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-yellow-500 transition-colors">{ag.servico.nome}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-yellow-500" /> {ag.regiao?.nome}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-black border ${
                        ag.status === 'pago' 
                        ? 'bg-green-950 text-green-400 border-green-800' 
                        : 'bg-yellow-950 text-yellow-400 border-yellow-800'
                      }`}>
                        {ag.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-4">
                      <p className="text-gray-300">{new Date(ag.data_hora).toLocaleString('pt-BR')}</p>
                      <p className="font-bold text-white">R$ {ag.valor_total.toFixed(2)}</p>
                    </div>
                    
                    {ag.status === 'pendente' ? (
                      <button 
                        onClick={() => handlePagar(ag.id || ag._id)} 
                        className="w-full bg-green-700 hover:bg-green-600 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
                      >
                        <DollarSign size={14}/> PAGAR AGORA
                      </button>
                    ) : (
                      <div className="flex items-center justify-between mt-4 p-2 bg-green-950/30 rounded-lg border border-green-900/50">
                        <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase">
                          <Check size={14} /> Pagamento OK
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold uppercase">
                          <Package size={14}/> Reservado
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}