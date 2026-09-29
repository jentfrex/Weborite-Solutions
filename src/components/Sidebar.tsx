import React from 'react';
import { LayoutDashboard, Users, BarChart2, Settings, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedVertical: string;
  setSelectedVertical: (v: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, selectedVertical, setSelectedVertical }) => {
  const verticals = ['All', 'Airco Installer', 'Builder', 'Kebab Shop', 'Local Eatery', 'Medical Assistance'];

  return (
    <aside className="w-64 bg-emerald-950 text-emerald-100 flex flex-col h-[calc(100vh-4rem)] border-r border-emerald-900">
      <div className="p-4 space-y-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'leads' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Leads</span>
        </button>
        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'benchmarks' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Benchmarks</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'settings' ? 'bg-emerald-800 text-white' : 'hover:bg-emerald-900/50 text-emerald-300'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      <div className="px-4 py-3 mt-4 border-t border-emerald-900/80">
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <Layers className="h-3 w-3" />
          <span>Verticals</span>
        </div>
        <div className="space-y-1">
          {verticals.map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVertical(v)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedVertical === v ? 'bg-emerald-800 text-white' : 'text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};