import React from 'react';

interface DashboardHeaderProps {
  userEmail?: string | null;
  onRefresh: () => void;
  onExportCSV: () => void;
  loading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userEmail,
  onRefresh,
  onExportCSV,
  loading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#0B272D]/10">
      <div>
        <span className="text-[#5A9696] font-bold text-xs uppercase tracking-widest">
          PANEL DE CONTROL · BODA 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#0B272D] mt-1">
          Gestión de Invitados & Pagos
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          Sesión iniciada como: <span className="font-semibold text-[#0B272D]">{userEmail}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExportCSV}
          className="px-4 py-2 bg-white hover:bg-[#D6E4BA] border border-[#0B272D]/20 rounded-xl text-xs font-bold text-[#0B272D] transition-colors flex items-center gap-2 shadow-xs"
          title="Descargar lista en archivo Excel / CSV"
        >
          <span>📥</span>
          <span>Exportar CSV</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-[#BBDB93] border border-[#0B272D]/20 rounded-xl text-xs font-bold text-[#0B272D] transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          <span>Actualizar Datos</span>
        </button>
      </div>
    </div>
  );
};
