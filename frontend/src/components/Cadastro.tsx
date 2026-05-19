import { useState } from 'react';
import { UserPlus, Sparkles, ArrowLeft, ChevronDown, User, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CadastroProps {
  tipoInicial?: 'tatuador' | 'cliente' | 'funcionario';
}

export default function Cadastro({ tipoInicial = 'cliente' }: CadastroProps) {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'tatuador' | 'funcionario'>(tipoInicial);

  // --- ESTADO PARA CONTROLAR O MENU DE LOGIN ---
  const [mostrarOpcoesLogin, setMostrarOpcoesLogin] = useState(false);

  // --- ESTADOS DO PERFIL DO TATUADOR ---
  const [cnpj, setCnpj] = useState('');
  const [nomeStudio, setNomeStudio] = useState('');
  const [especialidade, setEspecialidade] = useState('Blackwork & Fine Line');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ehTatuador = tipo === 'tatuador';
      
      // Enviando para o AuthContext
      await signUp({
        email,
        password,
        nome, 
        tipo,
        telefone,
        // CORREÇÃO: mapeando nomeStudio (estado) para nome_studio (backend)
        ...(ehTatuador && { 
            cnpj, 
            nome_studio: nomeStudio, 
            especialidade 
        })
      });
      
      toast.success('Cadastro realizado com sucesso! Faça seu login.', {
        icon: '✨',
        style: { background: '#0f1117', color: '#fff', border: '1px solid #eab308' },
      });

      navigate(ehTatuador ? '/login/empresa' : '/login/cliente');
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      const msgErro = err.response?.data?.message || err.response?.data?.error || err.message || 'Falha na conexão com o servidor.';
      toast.error(msgErro, {
        style: { background: '#0f1117', color: '#ef4444', border: '1px solid #ef4444' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* 🌌 EFEITO ESFUMADO RADIAL COMPACTO DE FUNDO */}
      <div className="absolute w-[600px] h-[600px] bg-white/[0.012] blur-[100px] rounded-full pointer-events-none z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* 🚪 BOTÃO VOLTAR PARA O SITE */}
      <Link 
        to="/" 
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 text-white/30 hover:text-[#EAB308] text-[9px] font-bold uppercase tracking-widest transition-all"
      >
        <ArrowLeft size={12} /> Voltar para o site
      </Link>

      {/* 👥 LAYOUT SPLIT CARD EM DUAS COLUNAS */}
      <div className="w-full max-w-3xl min-h-[520px] bg-[#0f1117]/95 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* COLUNA ESQUERDA: Boas-vindas e Menu de Login Dinâmico */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-zinc-900 via-neutral-950 to-black p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/5">
          <div className="p-3 bg-yellow-500/10 rounded-xl mb-3">
            <Sparkles className="w-5 h-5 text-[#EAB308]" />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            Já tem uma conta?
          </h2>
          <p className="text-white/40 text-[11px] mt-2 max-w-[200px] leading-relaxed">
            Acesse sua área de gerenciamento agora mesmo.
          </p>
          
          {/* BOTÃO PRINCIPAL DE TRIGGER */}
          <button 
            type="button"
            onClick={() => setMostrarOpcoesLogin(!mostrarOpcoesLogin)}
            className="mt-6 w-full max-w-[170px] px-4 py-2.5 bg-[#EAB308] hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-yellow-900/10 flex items-center justify-center gap-2"
          >
            <span>Faça Login</span>
            <ChevronDown size={12} className={`transition-transform duration-300 ${mostrarOpcoesLogin ? 'rotate-180' : ''}`} />
          </button>

          {/* 🔘 DROPDOWN OPÇÕES DE LOGIN SUB-ROTAS */}
          {mostrarOpcoesLogin && (
            <div className="mt-3 w-full max-w-[170px] space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link 
                to="/login/cliente" 
                className="flex items-center gap-2 justify-center w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-[#EAB308] text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                <User size={10} /> Área do Cliente
              </Link>
              <Link 
                to="/login/empresa" 
                className="flex items-center gap-2 justify-center w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-[#EAB308] text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                <Briefcase size={10} /> Área do Estúdio
              </Link>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: Formulário de Cadastro Otimizado */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-center">
          <div className="mb-4">
            <h1 className="text-lg font-black text-white uppercase tracking-tight">Cadastro</h1>
            <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold">Crie sua conta no StudioMaster</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* CAMPO: Nome Completo */}
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">
                {tipo === 'tatuador' ? 'Nome do Responsável' : 'Nome Completo'}
              </label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none transition-all text-xs" 
                required 
              />
            </div>
            
            {/* LINHA DUPLA: Telefone e Perfil */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">Telefone</label>
                <input 
                  type="text" 
                  placeholder="(11) 99999-9999" 
                  value={telefone} 
                  onChange={(e) => setTelefone(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none transition-all text-xs" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">Perfil</label>
                <select 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value as 'cliente' | 'tatuador' | 'funcionario')} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none text-xs"
                >
                  <option value="cliente" className="bg-[#0f1117]">Cliente</option>
                  <option value="tatuador" className="bg-[#0f1117]">Tatuador</option>
                  <option value="funcionario" className="bg-[#0f1117]">Funcionário</option>
                </select>
              </div>
            </div>

            {/* 💼 SEÇÃO CONDICIONAL VERTICAL E COMPACTA DO TATUADOR */}
            {tipo === 'tatuador' && (
              <div className="space-y-3 border-t border-white/5 pt-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1 ml-0.5">Nome do Estúdio</label>
                    <input 
                      type="text" 
                      placeholder="Studio Master" 
                      value={nomeStudio} 
                      onChange={e => setNomeStudio(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none text-xs" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1 ml-0.5">CNPJ</label>
                    <input 
                      type="text" 
                      placeholder="00.000.000/0001-00" 
                      value={cnpj} 
                      onChange={e => setCnpj(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none text-xs" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1 ml-0.5">Especialidade Principal</label>
                  <select 
                    value={especialidade} 
                    onChange={e => setEspecialidade(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none text-xs"
                  >
                    <option value="Blackwork & Fine Line" className="bg-[#0f1117]">Blackwork & Fine Line</option>
                    <option value="Realismo" className="bg-[#0f1117]">Realismo</option>
                    <option value="Old School" className="bg-[#0f1117]">Old School</option>
                  </select>
                </div>
              </div>
            )}

            {/* CREDENCIAIS DE ACESSO */}
            <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">E-mail</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none transition-all text-xs" 
                  placeholder="exemplo@gmail.com" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">Senha</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none transition-all text-xs" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#EAB308] hover:bg-yellow-400 text-black font-black py-3 rounded-xl transition-all mt-3 flex items-center justify-center gap-2 disabled:opacity-50 uppercase text-[10px] tracking-widest shadow-md"
            >
              {loading ? 'Processando...' : <><UserPlus className="w-3.5 h-3.5" /> <span>Finalizar Cadastro</span></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}