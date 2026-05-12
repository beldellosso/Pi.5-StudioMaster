import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

import Home from './components/Home';
import Login from './components/Login';
import ClienteArea from './components/ClienteArea';
import DashboardContainer from './components/DashboardContainer';

function AppContent() {
  const { usuario, loading } = useAuth();

  // Enquanto o AuthContext verifica se há alguém logado, mostramos uma tela preta
  if (loading) return <div className="bg-black min-h-screen" />;

  return (
    <Routes>
      {/* Rota Inicial: Landing Page */}
      <Route path="/" element={<Home />} />
      
      {/* Rotas de Login: Passando o 'tipo' como prop para o componente Login */}
      <Route path="/login/empresa" element={<Login tipo="tatuador" />} />
      <Route path="/login/cliente" element={<Login tipo="cliente" />} />

      {/* Rota de Dashboard: Protegida e Condicional */}
      <Route 
        path="/dashboard" 
        element={
          usuario ? (
            usuario.tipo === 'cliente' ? <ClienteArea /> : <DashboardContainer />
          ) : <Navigate to="/" />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  );
}