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

  // Recupera o usuário do localStorage ao carregar a aplicação
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@StudioMaster:user');
    if (usuarioSalvo) {
      try {
        const user = JSON.parse(usuarioSalvo);
        setUsuario(user);
        // Se usar JWT, reconfigura o header aqui:
        if (user.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem('@StudioMaster:user');
      }
    }
    setLoading(false);
  }, []);

  // Função de Login
  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, { 
        email, 
        senha: password 
      });

      const user = response.data.user;

      // Padronização: garante que role exista e esteja em minúsculo
      const dadosUsuario = {
        ...user,
        role: (user.role || user.tipo || 'cliente').toLowerCase()
      };

      setUsuario(dadosUsuario);
      localStorage.setItem('@StudioMaster:user', JSON.stringify(dadosUsuario));
      
      if (user.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.error || 'Erro ao realizar login');
    }
  };

  // Função de Cadastro (Corrigida e incluída no escopo)
  const signUp = async (
    email: string,
    password: string,
    nome: string,
    tipo: 'cliente' | 'tatuador',
    telefone?: string
  ) => {
    try {
      await axios.post(`${API_URL}/usuarios/registrar`, {
        email,
        senha: password,
        nome,
        role: tipo, // Envia o tipo selecionado no formulário
        telefone
      });
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Erro ao realizar cadastro'
      );
    }
  };

  // Função de Logout
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