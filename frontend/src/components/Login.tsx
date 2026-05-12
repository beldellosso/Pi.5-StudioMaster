import { useState, useEffect } from 'react';
import { LogIn as LoginIcon, UserPlus, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';


interface LoginProps {
  tipo?: 'tatuador' | 'cliente';
}

export default function Login({ tipo: tipoInicial }: LoginProps) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'tatuador'>(tipoInicial || 'cliente');
  const [loading, setLoading] = useState(false);

  // Sincroniza o estado interno se a prop mudar
  useEffect(() => {
    if (tipoInicial) setTipo(tipoInicial);
  }, [tipoInicial]);

  const limparCampos = () => {
    setEmail('');
    setPassword('');
    setNome('');
    setTelefone('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Bem-vindo de volta!', {
          style: { background: '#0f1117', color: '#fff', border: '1px solid #eab308' },
        });
        navigate('/dashboard'); 
      } else {
        await signUp(email, password, nome, tipo, telefone);
        limparCampos();
        setIsLogin(true);
        toast.success('Cadastro realizado! Faça seu login.', {
          icon: '✨',
          style: { background: '#0f1117', color: '#fff', border: '1px solid #eab308' },
        });
      }
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      const msgErro = err.response?.data?.message || err.response?.data?.error || 'Falha na conexão com o servidor.';
      toast.error(msgErro, {
        style: { background: '#0f1117', color: '#ef4444', border: '1px solid #ef4444' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0f1117] rounded-3xl p-8 border border-white/5 shadow-2xl relative">
        
        {/* Link de Retorno para Home */}
        <Link to="/" className="absolute -top-12 left-0 flex items-center gap-2 text-white/40 hover:text-[#EAB308] text-[10px] font-bold uppercase tracking-widest transition-all">
           <ArrowLeft size={14} /> Voltar para o site
        </Link>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-yellow-500/10 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-[#EAB308]" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Studio<span className="text-[#EAB308]">Master</span>
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mt-2 font-bold">
            {isLogin ? `Acesso ${tipo}` : 'Crie sua conta profissional'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-1">Nome Completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EAB308] outline-none transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-1">Telefone</label>
                  <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EAB308] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-1">Perfil</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value as 'cliente' | 'tatuador')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EAB308] outline-none appearance-none">
                    <option value="cliente" className="bg-[#0f1117]">Cliente</option>
                    <option value="tatuador" className="bg-[#0f1117]">Tatuador</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EAB308] outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 ml-1">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#EAB308] outline-none transition-all" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#EAB308] hover:brightness-110 text-black font-black py-4 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50 uppercase text-xs tracking-widest shadow-lg shadow-yellow-900/20">
            {loading ? 'Processando...' : isLogin ? <><LoginIcon className="w-4 h-4" /> <span>Entrar no Sistema</span></> : <><UserPlus className="w-4 h-4" /> <span>Finalizar Cadastro</span></>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <button onClick={() => { limparCampos(); setIsLogin(!isLogin); }} className="text-[#EAB308] hover:text-yellow-400 text-[10px] font-black uppercase tracking-widest transition-colors">
            {isLogin ? 'Não tem uma conta? Cadastre-se aqui' : 'Já possui acesso? Faça o login'}
          </button>
        </div>
      </div>
    </div>
  );
}