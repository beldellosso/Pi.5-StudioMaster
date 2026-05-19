// components/RoleGuard.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: 'cliente' | 'funcionario' | 'admin';
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const { usuario, loading } = useAuth();

  // Enquanto o AuthContext estiver carregando o perfil, exibe um loading
  if (loading) return <div>Carregando...</div>;

  // Se não estiver logado, manda para o login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se o cargo não for permitido, manda para uma página de "Sem Acesso" ou Home
  if (usuario.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se estiver tudo certo, renderiza a página
  return <>{children}</>;
}