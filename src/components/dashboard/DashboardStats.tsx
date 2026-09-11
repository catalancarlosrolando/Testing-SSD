import React from 'react';
import type { DashboardMetrics } from '../../types/dashboard';

interface DashboardStatsProps {
  metrics: DashboardMetrics;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Confirmed People */}
      <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-xs">
        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
          Personas Confirmadas
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-[#0B272D]">
          {metrics.totalPeople}
        </span>
        <span className="text-[11px] text-[#5A9696] block mt-1">
          en {metrics.totalConfirmed} reservas
        </span>
      </div>

      {/* Confirmed Revenue */}
      <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-xs">
        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
          Recaudado Confirmado
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-[#0B272D]">
          ${metrics.totalRevenue.toLocaleString('es-AR')}
        </span>
        <span className="text-[11px] text-[#5A9696] block mt-1">
          pagos validados
        </span>
      </div>

      {/* Pending Proofs to Review */}
      <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-xs">
        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
          Comprobantes por Revisar
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-[#8C5A00]">
          {metrics.pendingProofCount}
        </span>
        <span className="text-[11px] text-gray-500 block mt-1">
          requieren tu validación
        </span>
      </div>

      {/* Declined / Not Attending */}
      <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-xs">
        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
          No Asistirán
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-gray-400">
          {metrics.declinedCount}
        </span>
        <span className="text-[11px] text-gray-500 block mt-1">
          agradecieron invitación
        </span>
      </div>
    </div>
  );
};
