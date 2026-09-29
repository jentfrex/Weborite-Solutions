import React from 'react';
import { Search, Plus, Cloud, Calendar } from 'lucide-react';

interface HeaderProps {
  onAddLeadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddLeadClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-gray-800 text-lg">Weborite Solutions</span>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onAddLeadClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add lead</span>
        </button>
        <div className="flex items-center text-gray-500 text-sm space-x-1 bg-gray-100 px-3 py-1.5 rounded-lg">
          <Cloud className="h-4 w-4 text-emerald-600" />
          <span>Cloud</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm space-x-1 bg-gray-100 px-3 py-1.5 rounded-lg">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>September 25, 2026</span>
        </div>
      </div>
    </header>
  );
};