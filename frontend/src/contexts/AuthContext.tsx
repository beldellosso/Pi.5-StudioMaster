import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { Usuario } from '../types';

const API_URL = 'http://localhost:5000/api';

interface CadastroDados {
  email: string;
  password?: string;
  nome: string;
  tipo: 'cliente' | 'tatuador' | 'funcionario';
  telefone?: string;
  cnpj?: string;
  nome_studio?: string;
  especialidade?: string;
  endereco?: string;
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
      const user = JSON.parse(usuarioSalvo) as Usuario;
      setUsuario(user);
      if (user.token) axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // A resposta agora é desestruturada para pegar o token e o user separadamente
    const response = await axios.post(`${API_URL}/usuarios/login`, { email, senha: password });
    
    const { token, user } = response.data; 
    
    // Criamos o objeto completo mesclando o usuário com o token
    const usuarioCompleto = { ...user, token } as Usuario;
    
    setUsuario(usuarioCompleto);
    localStorage.setItem('@StudioMaster:user', JSON.stringify(usuarioCompleto));
    
    // Configura o header global para que o Dashboard funcione automaticamente
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return usuarioCompleto;
  };

  const signUp = async (dados: CadastroDados) => {
    await axios.post(`${API_URL}/usuarios/registrar`, dados);
  };

  const signOut = () => {
    localStorage.removeItem('@StudioMaster:user');
    delete axios.defaults.headers.common['Authorization']; // Limpa o header ao sair
    setUsuario(null);
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