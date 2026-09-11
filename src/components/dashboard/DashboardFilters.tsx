import React from 'react';
import type { DashboardStatusFilter } from '../../types/dashboard';

interface DashboardFiltersProps {
  searchTerm: string;
  statusFilter: DashboardStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: DashboardStatusFilter) => void;
}

const FILTER_TABS: Array<{ id: DashboardStatusFilter; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'en_revision', label: '⏳ En Revisión' },
  { id: 'parcialmente_pagado', label: '💳 Parciales' },
  { id: 'pendiente', label: '⚠️ Pendientes' },
  { id: 'aprobado', label: '✓ Aprobados' },
  { id: 'declined', label: '✕ No Asisten' },
];

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0B272D]/10 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="w-full md:w-80">
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl bg-[#F7FAF9] border border-[#0B272D]/20 text-xs text-[#0B272D] placeholder-[#426B6B]/60 focus:outline-none focus:ring-2 focus:ring-[#5A9696]"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusFilterChange(tab.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? 'bg-[#0B272D] text-white'
                : 'bg-[#F0F4F2] text-[#0B272D] hover:bg-[#E0E8E5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
