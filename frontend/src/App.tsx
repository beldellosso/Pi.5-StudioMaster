import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

import Home from './components/Home';
import Login from './components/Login';
import Cadastro from './components/Cadastro'; 
import ClienteArea from './components/ClienteArea';
import DashboardContainer from './components/DashboardContainer';
import TatuadorDashboard from './components/TatuadorDashboard'; // <--- 1. IMPORTANTE: Importe o seu componente

function AppContent() {
  const { usuario, loading } = useAuth();

  if (loading) return <div className="bg-black min-h-screen" />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/empresa" element={<Login tipo="tatuador" />} />
      <Route path="/login/cliente" element={<Login tipo="cliente" />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rota de Dashboard com lógica de redirecionamento de tela */}
      <Route 
        path="/dashboard" 
        element={
          usuario ? (
            usuario.tipo === 'cliente' ? (
              <ClienteArea />
            ) : usuario.tipo === 'tatuador' ? (
              <TatuadorDashboard /> // <--- 2. AQUI: Mostra o seu dashboard de ADM
            ) : (
              <DashboardContainer /> // Fallback para outros tipos (ex: funcionário)
            )
          ) : <Navigate to="/" />
        } 
      />

      {/* Rota de segurança: se alguém tentar acessar o nome antigo, joga para o /dashboard */}
      <Route path="/dashboard-profissional" element={<Navigate to="/dashboard" replace />} />
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