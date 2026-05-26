import { LayoutDashboard, Calendar, DollarSign, Package, Users, LogOut, Search, MessageCircle, Camera, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: string;
  userName?: string; // Adicionado para receber o nome
}

export default function Sidebar({ activeTab, setActiveTab, role, userName }: SidebarProps) {
  const { signOut } = useAuth();

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
          { id: 'estoque', label: 'Estoque', icon: Package },
          { id: 'equipe', label: 'Equipe', icon: Users },
        ];
      case 'tatuador': 
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'estoque', label: 'Inventário', icon: Package },
          { id: 'portfolio', label: 'Portfólio', icon: Camera },
          { id: 'equipe', label: 'Equipe', icon: Users },
        ];
      default:
        return [
          { id: 'explorar', label: 'Explorar Studios', icon: Search },
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'meus-agendamentos', label: 'Meus Agendamentos', icon: Clock },
          { id: 'ajuda', label: 'Central de Ajuda', icon: MessageCircle },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-[#050505] border-r border-white/5 h-screen fixed left-0 top-0 p-6 flex flex-col justify-between">
      <div>
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-white italic tracking-tighter">
            ESTÚDIO <span className="text-[#EAB308]">MASTER</span>
          </h1>
          {/* Exibindo o nome do usuário logado */}
          <p className="text-[11px] text-[#EAB308] font-bold uppercase tracking-widest mt-2">{userName || role}</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/5">
        <button onClick={signOut} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 transition-colors">
          <LogOut size={20} /> Sair do App
        </button>
      </div>
    </aside>
  );
}