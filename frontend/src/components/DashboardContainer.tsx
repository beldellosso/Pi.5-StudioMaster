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

      {/* Grid de Estatísticas */}
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

  // Padronização de role para evitar erros de case
  const userRole = (usuario?.role || usuario?.tipo || '').toLowerCase();

  if (loading || !usuario) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#EAB308] font-black uppercase text-xs tracking-[0.3em] animate-pulse">Sincronizando...</p>
        </div>
      </div>
    );
  }

  /**
   * Lógica de Renderização de Conteúdo (Sem perder funcionalidades)
   */
  const renderContent = () => {
    // 1. Abas exclusivas de Configuração do Admin
    if (activeTab === 'servicos' || activeTab === 'equipe') {
      return <AdminConfig tab={activeTab} />;
    }

    // 2. Se a aba for 'dashboard', Admin vê AdminHome e Tatuador vê sua própria Home
    if (activeTab === 'dashboard') {
      return userRole === 'admin' 
        ? <AdminHome /> 
        : <TatuadorDashboard activeTab="dashboard" />;
    }

    // 3. Para qualquer outra aba (agenda, estoque, clientes):
    // Se for admin, mostramos o fallback "Em Breve" ou o componente específico se você já o criou.
    // Se for tatuador, o TatuadorDashboard assume o controle total da renderização dessas abas.
    if (userRole !== 'admin') {
      return <TatuadorDashboard activeTab={activeTab} />;
    }

    // Fallback para abas que o Admin ainda não tem implementadas individualmente
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="p-10 bg-[#0f1117] rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <LayoutDashboard size={48} className="text-white/10 mb-6 mx-auto group-hover:text-[#EAB308]/20 transition-colors" />
          <p className="text-5xl font-black uppercase tracking-tighter text-[#EAB308] opacity-20">
            Módulo
          </p>
          <p className="text-white/60 font-black uppercase tracking-widest text-xl mt-[-10px]">
            {activeTab}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] mt-6 text-white/20">
            Disponível na próxima atualização
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Sidebar recebe as funções de controle de aba */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-10 overflow-y-auto bg-[#050505]">
        <div className="max-w-6xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}