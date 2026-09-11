import React from 'react';
import type { Invitado, EstadoPago } from '../../types/dashboard';
import { calculateGuestBalance } from '../../utils/dashboardMetrics';

interface GuestTableRowProps {
  guest: Invitado;
  actionLoading: string | null;
  onStatusChange: (id: string, newStatus: EstadoPago) => void;
  onSelectDetails: (guest: Invitado) => void;
  onSelectDelete: (guest: { id: string; name: string }) => void;
}

export const GuestTableRow: React.FC<GuestTableRowProps> = ({
  guest,
  actionLoading,
  onStatusChange,
  onSelectDetails,
  onSelectDelete,
}) => {
  const { balance } = calculateGuestBalance(guest.montoTotal, guest.montoPagado);
  const isActionLoading = actionLoading === guest.id;

  return (
    <tr className="hover:bg-[#F9FBFA] transition-colors">
      {/* Name & Dietary */}
      <td className="py-4 px-6">
        <div className="font-bold text-[#0B272D]">
          {guest.nombre} {guest.apellido}
        </div>
        {guest.restriccionAlimentaria && guest.restriccionAlimentaria !== 'ninguno' && (
          <span className="text-[10px] text-[#5A9696] font-medium block">
            Dieta: {guest.restriccionAlimentaria}
          </span>
        )}
      </td>

      {/* Phone & WhatsApp */}
      <td className="py-4 px-4 font-mono text-[#0B272D]">
        <a
          href={`https://api.whatsapp.com/send?phone=549${guest.telefono}`}
          target="_blank"
          rel="noreferrer"
          className="hover:underline text-[#5A9696] font-semibold flex items-center gap-1"
        >
          <span>💬</span>
          <span>{guest.telefono}</span>
        </a>
      </td>

      {/* Guest Count */}
      <td className="py-4 px-4">
        {guest.asistencia === 'attending' ? (
          <span className="font-bold text-[#0B272D]">
            {guest.invitados} {guest.invitados > 1 ? 'personas' : 'persona'}
          </span>
        ) : (
          <span className="text-gray-400 italic">No asiste</span>
        )}
      </td>

      {/* Total Amount */}
      <td className="py-4 px-4 font-bold text-[#0B272D]">
        {guest.montoTotal ? `$${guest.montoTotal.toLocaleString('es-AR')}` : '-'}
      </td>

      {/* Paid Amount & Balance */}
      <td className="py-4 px-4 font-bold">
        {guest.asistencia === 'declined' ? (
          <span className="text-gray-400">-</span>
        ) : guest.montoPagado && guest.montoPagado > 0 ? (
          <div>
            <span className="text-[#3E7B27]">${guest.montoPagado.toLocaleString('es-AR')}</span>
            {balance > 0 && (
              <span className="text-[10px] text-gray-400 block font-normal">
                Resta: ${balance.toLocaleString('es-AR')}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 font-normal">$0</span>
        )}
      </td>

      {/* Payment Status Badge */}
      <td className="py-4 px-4">
        {guest.asistencia === 'declined' ? (
          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
            No Aplica
          </span>
        ) : guest.estadoPago === 'aprobado' ? (
          <span className="bg-[#BBDB93] text-[#0B272D] px-2.5 py-1 rounded-full text-[10px] font-bold">
            ✓ Aprobado
          </span>
        ) : guest.estadoPago === 'parcialmente_pagado' ? (
          <span className="bg-[#E6F0FA] text-[#1E56A0] px-2.5 py-1 rounded-full text-[10px] font-bold">
            💳 Parcial
          </span>
        ) : guest.estadoPago === 'en_revision' ? (
          <span className="bg-[#E0E8E5] text-[#0B272D] px-2.5 py-1 rounded-full text-[10px] font-bold">
            ⏳ En Revisión
          </span>
        ) : (
          <span className="bg-[#FAF0E6] text-[#8C5A00] px-2.5 py-1 rounded-full text-[10px] font-bold">
            ⚠️ Pendiente
          </span>
        )}
      </td>

      {/* Details Button */}
      <td className="py-4 px-4 text-center">
        <button
          type="button"
          onClick={() => onSelectDetails(guest)}
          className="px-3 py-1.5 bg-[#F0F4F2] hover:bg-[#BBDB93] text-[#0B272D] rounded-xl font-bold text-xs transition-colors shadow-xs inline-flex items-center gap-1 border border-[#0B272D]/10"
        >
          <span>🔍</span>
          <span>Detalles</span>
        </button>
      </td>

      {/* Action Buttons */}
      <td className="py-4 px-6 text-right space-x-1.5">
        {guest.asistencia === 'attending' && guest.estadoPago !== 'aprobado' && (
          <button
            type="button"
            onClick={() => onStatusChange(guest.id, 'aprobado')}
            disabled={isActionLoading}
            className="px-2.5 py-1 bg-[#BBDB93] hover:bg-[#A3C775] text-[#0B272D] rounded-lg font-bold text-[10px] transition-colors"
            title="Aprobar pago"
          >
            ✓ Aprobar
          </button>
        )}
        {guest.asistencia === 'attending' && guest.estadoPago === 'aprobado' && (
          <button
            type="button"
            onClick={() => onStatusChange(guest.id, 'pendiente')}
            disabled={isActionLoading}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-[10px] transition-colors"
            title="Marcar como pendiente"
          >
            Deshacer
          </button>
        )}
        <button
          type="button"
          onClick={() => onSelectDelete({ id: guest.id, name: `${guest.nombre} ${guest.apellido}` })}
          disabled={isActionLoading}
          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-[10px] transition-colors"
          title="Eliminar invitado"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};
