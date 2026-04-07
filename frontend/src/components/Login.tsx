import { useState } from 'react';
import { LogIn as LoginIcon, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'tatuador'>('cliente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para limpar os campos do formulário
  const limparCampos = () => {
    setEmail('');
    setPassword('');
    setNome('');
    setTelefone('');
    setTipo('cliente');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Bem-vindo de volta!', {
          style: {
            background: '#111827',
            color: '#fff',
            border: '1px solid #eab308',
          },
        });
        navigate('/'); 
      } else {
        await signUp(email, password, nome, tipo, telefone);
        
        // Após cadastrar, limpa os campos e volta para o login
        limparCampos();
        setIsLogin(true);
        
        toast.success('Cadastro realizado! Faça seu login.', {
          duration: 4000,
          icon: '✨',
          style: {
            borderRadius: '10px',
            background: '#111827',
            color: '#fff',
            border: '1px solid #eab308',
          },
        });
      }
    } catch (err: any) {
      const msgErro = err.response?.data?.error || err.message || 'Erro ao processar solicitação.';
      setError(msgErro);
      toast.error(msgErro, {
        style: {
          background: '#111827',
          color: '#ef4444',
          border: '1px solid #ef4444',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-yellow-500/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">StudioMaster</h1>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Bem-vindo!' : 'Crie sua conta no Studio'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Perfil</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as 'cliente' | 'tatuador')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="cliente">Cliente</option>
                  <option value="tatuador">Tatuador (Admin)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              'Processando...'
            ) : isLogin ? (
              <>
                <LoginIcon className="w-5 h-5" /> <span>Entrar</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> <span>Criar Conta</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              limparCampos(); // Limpa ao trocar de tela
              setIsLogin(!isLogin);
            }}
            className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
}