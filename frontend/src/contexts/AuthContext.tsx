import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { Usuario } from '../types';

const API_URL = 'http://localhost:5000/api';

// Interface atualizada para usar o nome correto da coluna do seu banco (nome_studio)
interface CadastroDados {
  email: string;
  password?: string;
  nome: string;
  tipo: 'cliente' | 'tatuador' | 'funcionario';
  telefone?: string;
  cnpj?: string;
  nome_studio?: string; // Alinhado com o SQL
  especialidade?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (dados: CadastroDados) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@StudioMaster:user');
    if (usuarioSalvo) {
      try {
        const user = JSON.parse(usuarioSalvo);
        setUsuario(user);
        if (user.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem('@StudioMaster:user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, { 
        email, 
        senha: password 
      });

      const user = response.data.user;
      const tipoDefinido = (user.tipo || user.role || 'cliente').toLowerCase();
      
      const dadosUsuario = {
        ...user,
        id: user.id || user._id, 
        tipo: tipoDefinido,
        role: tipoDefinido
      };

      setUsuario(dadosUsuario);
      localStorage.setItem('@StudioMaster:user', JSON.stringify(dadosUsuario));
      
      if (user.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      }

      return dadosUsuario;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao realizar login');
    }
  };

  const signUp = async (dados: CadastroDados) => {
    try {
      // Montagem do payload rigoroso, garantindo os nomes que o seu backend espera
      const payload = {
        email: dados.email,
        senha: dados.password,
        nome: dados.nome,
        tipo: dados.tipo,
        role: dados.tipo,
        telefone: dados.telefone || null,
        cnpj: dados.cnpj || null,
        nome_studio: dados.nome_studio || null, // A chave é nome_studio
        especialidade: dados.especialidade || null
      };

      await axios.post(`${API_URL}/usuarios/registrar`, payload);
      
    } catch (error: any) {
      // Log de depuração mantido para que você possa ver o erro exato caso falhe novamente
      console.error('ERRO NO CADASTRO (JSON):', JSON.stringify(error.response?.data, null, 2));
      
      const mensagem = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'Erro ao realizar cadastro';
      throw new Error(mensagem);
    }
  };

  const signOut = () => {
    localStorage.removeItem('@StudioMaster:user');
    setUsuario(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}