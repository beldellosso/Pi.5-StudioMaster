import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ClienteArea from './components/ClienteArea';
import TatuadorDashboard from './components/TatuadorDashboard';
import { Toaster } from 'react-hot-toast'; // Importação correta

function AppContent() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando StudioMaster...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  // Diferenciação de rotas baseada no tipo de usuário do banco
  return usuario.tipo === 'tatuador' ? (
    <TatuadorDashboard />
  ) : (
    <ClienteArea />
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* O Toaster PRECISA estar aqui dentro para as mensagens funcionarem */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        gutter={8}
      />
      <AppContent />
    </AuthProvider>
  );
}