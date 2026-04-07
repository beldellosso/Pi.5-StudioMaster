import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { Usuario } from '../types';

const API_URL = 'http://localhost:5000/api';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string, tipo: 'cliente' | 'tatuador', telefone?: string) => Promise<void>;
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
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (e) {
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
      
      const dadosUsuario = response.data.user;
      setUsuario(dadosUsuario);
      localStorage.setItem('@StudioMaster:user', JSON.stringify(dadosUsuario));
    } catch (error: any) {
      console.error('Erro no login:', error);
      const mensagem = error.response?.data?.error || 'Erro ao realizar login';
      throw new Error(mensagem);
    }
  };

  const signUp = async (email: string, password: string, nome: string, tipo: 'cliente' | 'tatuador', telefone?: string) => {
    try {
      // Ajustado 'senha' para casar com o padrão do seu backend
      await axios.post(`${API_URL}/usuarios/registrar`, {
        email,
        senha: password, 
        nome,
        tipo,
        telefone
      });
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      // Pega a mensagem detalhada do backend se disponível (404, 400, etc)
      const mensagem = error.response?.data?.error || error.response?.data?.message || 'Erro ao realizar cadastro';
      throw new Error(mensagem);
    }
  };

  const signOut = () => {
    localStorage.removeItem('@StudioMaster:user');
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
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}