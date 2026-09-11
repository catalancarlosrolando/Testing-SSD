import React from 'react';
import type { Invitado, EstadoPago } from '../../types/dashboard';
import { calculateGuestBalance } from '../../utils/dashboardMetrics';

interface GuestCardMobileProps {
  guest: Invitado;
  actionLoading: string | null;
  onStatusChange: (id: string, newStatus: EstadoPago) => void;
  onSelectDetails: (guest: Invitado) => void;
  onSelectDelete: (guest: { id: string; name: string }) => void;
}

export const GuestCardMobile: React.FC<GuestCardMobileProps> = ({
  guest,
  actionLoading,
  onStatusChange,
  onSelectDetails,
  onSelectDelete,
}) => {
  const { balance } = calculateGuestBalance(guest.montoTotal, guest.montoPagado);
  const isActionLoading = actionLoading === guest.id;

  return (
    <div className="bg-[#F7FAF9] rounded-2xl p-4 border border-[#0B272D]/10 space-y-3 shadow-xs pt-4">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm text-[#0B272D]">
            {guest.nombre} {guest.apellido}
          </h3>
          {guest.restriccionAlimentaria && guest.restriccionAlimentaria !== 'ninguno' && (
            <span className="text-[10px] text-[#5A9696] font-medium block mt-0.5">
              🌿 Dieta: {guest.restriccionAlimentaria}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {guest.asistencia === 'declined' ? (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              No Aplica
            </span>
          ) : guest.estadoPago === 'aprobado' ? (
            <span className="bg-[#BBDB93] text-[#0B272D] px-2 py-0.5 rounded-full text-[10px] font-bold">
              ✓ Aprobado
            </span>
          ) : guest.estadoPago === 'parcialmente_pagado' ? (
            <span className="bg-[#E6F0FA] text-[#1E56A0] px-2 py-0.5 rounded-full text-[10px] font-bold">
              💳 Parcial
            </span>
          ) : guest.estadoPago === 'en_revision' ? (
            <span className="bg-[#E0E8E5] text-[#0B272D] px-2 py-0.5 rounded-full text-[10px] font-bold">
              ⏳ En Revisión
            </span>
          ) : (
            <span className="bg-[#FAF0E6] text-[#8C5A00] px-2 py-0.5 rounded-full text-[10px] font-bold">
              ⚠️ Pendiente
            </span>
          )}
        </div>
      </div>

      {/* Card Info Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#0B272D]/5">
        <div>
          <span className="text-[10px] text-gray-400 block font-semibold uppercase">Teléfono</span>
          <a
            href={`https://api.whatsapp.com/send?phone=549${guest.telefono}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[#5A9696] font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
          >
            <span>💬</span>
            <span>{guest.telefono}</span>
          </a>
        </div>

        <div>
          <span className="text-[10px] text-gray-400 block font-semibold uppercase">Lugares</span>
          <span className="font-bold text-[#0B272D] block mt-0.5">
            {guest.asistencia === 'attending' ? `${guest.invitados} pers.` : 'No asiste'}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 block font-semibold uppercase">Monto Total</span>
          <span className="font-bold text-[#0B272D] block mt-0.5">
            {guest.montoTotal ? `$${guest.montoTotal.toLocaleString('es-AR')}` : '-'}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 block font-semibold uppercase">Abonado</span>
          {guest.montoPagado && guest.montoPagado > 0 ? (
            <div>
              <span className="font-bold text-[#3E7B27] block mt-0.5">
                ${guest.montoPagado.toLocaleString('es-AR')}
              </span>
              {balance > 0 && (
                <span className="text-[9px] text-gray-400 block">
                  Resta: ${balance.toLocaleString('es-AR')}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 font-normal block mt-0.5">$0</span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onSelectDetails(guest)}
          className="flex-1 py-2 bg-white hover:bg-[#BBDB93] border border-[#0B272D]/15 rounded-xl font-bold text-xs text-[#0B272D] transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>🔍</span>
          <span>Ver Ficha Completa</span>
        </button>

        {guest.asistencia === 'attending' && guest.estadoPago !== 'aprobado' && (
          <button
            type="button"
            onClick={() => onStatusChange(guest.id, 'aprobado')}
            disabled={isActionLoading}
            className="px-3 py-2 bg-[#BBDB93] hover:bg-[#A3C775] text-[#0B272D] rounded-xl font-bold text-xs transition-colors shadow-xs"
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
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs transition-colors"
            title="Marcar como pendiente"
          >
            Deshacer
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelectDelete({ id: guest.id, name: `${guest.nombre} ${guest.apellido}` })}
          disabled={isActionLoading}
          className="px-2.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-xs transition-colors"
          title="Eliminar invitado"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
