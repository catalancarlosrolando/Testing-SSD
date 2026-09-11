import React from 'react';
import type { Invitado, EstadoPago } from '../../types/dashboard';
import { GuestTableRow } from './GuestTableRow';
import { GuestCardMobile } from './GuestCardMobile';

interface DashboardTableProps {
  guests: Invitado[];
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  onStatusChange: (id: string, newStatus: EstadoPago) => void;
  onSelectDetails: (guest: Invitado) => void;
  onSelectDelete: (guest: { id: string; name: string }) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
  guests,
  loading,
  error,
  actionLoading,
  onStatusChange,
  onSelectDetails,
  onSelectDelete,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#0B272D]/10 shadow-xs overflow-hidden">
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-[#BBDB93] border-t-[#0B272D] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Cargando invitados...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-[#8C1C00] text-sm font-semibold">
          ⚠️ {error}
        </div>
      ) : guests.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          No se encontraron registros con los filtros seleccionados.
        </div>
      ) : (
        <div>
          {/* DESKTOP VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAF9] border-b border-[#0B272D]/10 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Invitado</th>
                  <th className="py-4 px-4">Teléfono</th>
                  <th className="py-4 px-4">Lugares</th>
                  <th className="py-4 px-4">Monto Total</th>
                  <th className="py-4 px-4">Parcial Abonado</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4 text-center">Detalles</th>
                  <th className="py-4 px-6 text-right">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B272D]/5">
                {guests.map((guest) => (
                  <GuestTableRow
                    key={guest.id}
                    guest={guest}
                    actionLoading={actionLoading}
                    onStatusChange={onStatusChange}
                    onSelectDetails={onSelectDetails}
                    onSelectDelete={onSelectDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden p-4 space-y-3 divide-y divide-[#0B272D]/5">
            {guests.map((guest) => (
              <GuestCardMobile
                key={guest.id}
                guest={guest}
                actionLoading={actionLoading}
                onStatusChange={onStatusChange}
                onSelectDetails={onSelectDetails}
                onSelectDelete={onSelectDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
