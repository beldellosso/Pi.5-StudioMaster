import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import AdminConfig from './AdminConfig';
import TatuadorDashboard from './TatuadorDashboard';
import { Scissors, Users as UsersIcon, Star, LayoutDashboard } from 'lucide-react';

/**
 * Componente Interno: Home do Administrador
 */
function AdminHome() {
  const stats = [
    { label: 'Ganhos Mensais', value: 'R$ 12.450', icon: <Star size={20} className="text-[#EAB308]" /> },
    { label: 'Tattoos Realizadas', value: '48', icon: <Scissors size={20} className="text-[#EAB308]" /> },
    { label: 'Novos Clientes', value: '+12', icon: <UsersIcon size={20} className="text-[#EAB308]" /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-700 space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          PAINEL DE <span className="text-[#EAB308]">CONTROLE</span>
        </h1>
        <p className="text-white/40 font-medium mt-2 italic border-l-2 border-[#EAB308] pl-4">
          Bem-vindo ao StudioMaster. Gerencie seu estúdio com precisão técnica e agilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0f1117] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-[#EAB308]/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[10px] text-[#EAB308] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">Live</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[10px] text-white/40 uppercase font-bold mt-1 tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardContainer() {
  const { usuario, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Padronização de role
  const userRole = (usuario?.role || usuario?.tipo || 'cliente').toLowerCase();

  if (loading || !usuario) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    // 1. Dashboard Inicial
    if (activeTab === 'dashboard') {
      return userRole === 'admin' 
        ? <AdminHome /> 
        : <TatuadorDashboard activeTab="dashboard" />;
    }

    // 2. Configurações Administrativas
    if ((activeTab === 'equipe' || activeTab === 'servicos') && userRole === 'admin') {
      return <AdminConfig tab={activeTab} />;
    }

    // 3. Demais rotas (TatuadorDashboard assume o controle)
    return <TatuadorDashboard activeTab={activeTab} />;
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Sidebar recebendo a prop role para renderização dinâmica */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={userRole} 
      />

      <main className="flex-1 ml-64 p-10 overflow-y-auto bg-[#050505]">
        <div className="max-w-6xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}