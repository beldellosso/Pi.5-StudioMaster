import { LayoutDashboard, Calendar, Camera, Users, DollarSign, Settings, LogOut, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { signOut, usuario } = useAuth();

  // Padronização de role para evitar erros de undefined
  const userRole = (usuario?.role || usuario?.tipo || '').toLowerCase();

  const allMenuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, roles: ['admin', 'funcionario'] },
    { id: 'agenda', label: 'Minha Agenda', icon: Calendar, roles: ['admin', 'funcionario'] },
    { id: 'portfolio', label: 'Meu Portfólio', icon: Camera, roles: ['admin', 'funcionario'] },
    { id: 'equipe', label: 'Gestão de Equipe', icon: Users, roles: ['admin'] },
    { id: 'servicos', label: 'Serviços/Preços', icon: Settings, roles: ['admin'] },
    { id: 'estoque', label: 'Suprimentos', icon: Package, roles: ['admin', 'funcionario'] },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, roles: ['admin'] },
  ];

  // Filtra o menu com base nas permissões
  const filteredMenu = allMenuItems.filter(item =>
    item.roles.includes(userRole)
  );

  if (!usuario) return null;

  return (
    <aside className="w-64 bg-[#0f1117] h-screen border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      
      {/* BRANDING */}
      <div className="p-8">
        <h2 className="text-[#EAB308] font-black text-2xl italic tracking-tighter">
          STUDIO<span className="text-white">MASTER</span>
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">
            {userRole === 'admin' ? 'Administração' : 'Área do Tatuador'}
          </p>
        </div>
      </div>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="flex-1 px-4 space-y-1.5">
        {filteredMenu.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? 'bg-[#EAB308] text-black shadow-[0_0_20px_rgba(234,179,8,0.2)] scale-[1.02]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* PERFIL E LOGOUT */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#EAB308] to-yellow-600 flex items-center justify-center text-black font-black border border-white/10 shadow-lg">
            {usuario?.nome?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{usuario?.nome}</p>
            <p className="text-[9px] text-[#EAB308] uppercase font-black tracking-widest opacity-80">
              {userRole}
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full group flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 text-xs font-bold transition-all"
        >
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}