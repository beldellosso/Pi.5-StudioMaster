import { useState, useEffect } from 'react';
import { LogIn as LoginIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginProps {
  tipo?: 'tatuador' | 'cliente' | 'funcionario';
}

export default function Login({ tipo: tipoInicial }: LoginProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'tatuador' | 'funcionario'>(tipoInicial || 'cliente');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tipoInicial) setTipo(tipoInicial);
  }, [tipoInicial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // O signIn agora retorna o objeto completo com token e tipo
      const usuarioLogado = await signIn(email, password);
      
      toast.success('Bem-vindo de volta!', {
        style: { background: '#0f1117', color: '#fff', border: '1px solid #eab308' },
      });

      // Redirecionamento baseado no tipo vindo do banco de dados (mais seguro)
      switch (usuarioLogado.tipo) {
        case 'tatuador':
          navigate('/dashboard-profissional');
          break;
        case 'funcionario':
          navigate('/dashboard-recepcao');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } catch (err: any) {
      const msgErro = err.response?.data?.message || err.response?.data?.error || err.message || 'Falha na conexão.';
      toast.error(msgErro, { style: { background: '#0f1117', color: '#ef4444', border: '1px solid #ef4444' } });
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
      <div className="w-full max-w-3xl min-h-[460px] bg-[#0f1117]/95 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* COLUNA ESQUERDA: Formulário de Login */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-5">
            <h1 className="text-lg font-black text-white uppercase tracking-tight">Fazer Login</h1>
            <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold">
              Acesso exclusivo · {tipo}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-3.5 animate-in fade-in duration-300">
              
              {/* CAMPO: E-mail */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">
                  E-mail
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#EAB308] outline-none transition-all text-xs" 
                  placeholder="nome@estudio.com"
                  required 
                />
              </div>

              {/* CAMPO: Senha */}
              <div>
                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-0.5">
                  Senha
                </label>
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
              className="w-full bg-[#EAB308] hover:bg-yellow-400 text-black font-black py-3 rounded-xl transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 uppercase text-[10px] tracking-widest shadow-md"
            >
              {loading ? 'Entrando...' : <><LoginIcon size={14} /> <span>Entrar no Sistema</span></>}
            </button>
          </form>
        </div>

        {/* COLUNA DIREITA: Boas-vindas e Chamada para o Cadastro */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-zinc-900 via-neutral-950 to-black p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-l border-white/5 order-1 md:order-2">
          <div className="p-3 bg-yellow-500/10 rounded-xl mb-3">
            <Sparkles className="w-5 h-5 text-[#EAB308]" />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            Não tem uma conta?
          </h2>
          <p className="text-white/40 text-[11px] mt-2 max-w-[200px] leading-relaxed">
            Crie seu perfil profissional ou de cliente no StudioMaster.
          </p>
          <Link 
            to="/cadastro" 
            className="mt-6 px-6 py-2.5 bg-[#EAB308] hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-yellow-900/10 block text-center w-full max-w-[160px]"
          >
            Cadastre-se
          </Link>
        </div>

      </div>
    </div>
  );
}