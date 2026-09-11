import React from 'react';
import type { Invitado, EstadoPago, SelectedProof, PagoItem } from '../../types/dashboard';
import { calculateGuestBalance } from '../../utils/dashboardMetrics';

interface GuestDetailsModalProps {
  guest: Invitado | null;
  copiedId: string | null;
  actionLoading: string | null;
  onClose: () => void;
  onCopyPaymentLink: (id: string) => void;
  onStatusChange: (id: string, newStatus: EstadoPago) => void;
  onSelectProof: (proof: SelectedProof) => void;
  onSelectDelete: (guest: { id: string; name: string }) => void;
}

export const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({
  guest,
  copiedId,
  actionLoading,
  onClose,
  onCopyPaymentLink,
  onStatusChange,
  onSelectProof,
  onSelectDelete,
}) => {
  if (!guest) return null;

  const { total, paid, balance } = calculateGuestBalance(guest.montoTotal, guest.montoPagado);
  const isActionLoading = actionLoading === guest.id;

  const paymentList: PagoItem[] =
    guest.pagos && guest.pagos.length > 0
      ? guest.pagos
      : guest.comprobanteUrl
      ? [
          {
            id: 'legacy',
            monto: guest.montoPagado || 0,
            comprobanteUrl: guest.comprobanteUrl,
            comprobanteNombre: guest.comprobanteNombre || 'Comprobante',
            fecha: guest.fechaPago || guest.fechaRegistro,
          },
        ]
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-[#0B272D]/10">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-start justify-between bg-[#F7FAF9]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                FICHA DE INVITADO & PAGO
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  guest.estadoPago === 'aprobado'
                    ? 'bg-[#BBDB93] text-[#0B272D]'
                    : guest.estadoPago === 'parcialmente_pagado'
                    ? 'bg-[#E6F0FA] text-[#1E56A0]'
                    : guest.estadoPago === 'en_revision'
                    ? 'bg-[#E0E8E5] text-[#0B272D]'
                    : 'bg-[#FAF0E6] text-[#8C5A00]'
                }`}
              >
                {guest.estadoPago}
              </span>
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-[#0B272D]">
              {guest.nombre} {guest.apellido}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
              <span>📞 {guest.telefono}</span>
              <a
                href={`https://api.whatsapp.com/send?phone=549${guest.telefono}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#25D366] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>💬 Abrir WhatsApp</span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Financial Balance Summary Box */}
          <div className="bg-[#EDF4E7] rounded-2xl p-4 sm:p-5 border border-[#BBDB93]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-3 border border-[#0B272D]/10">
              <span className="text-[10px] text-gray-500 uppercase font-bold block mb-0.5">Monto Total</span>
              <span className="text-lg font-bold text-[#0B272D]">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#0B272D]/10">
              <span className="text-[10px] text-gray-500 uppercase font-bold block mb-0.5">Parcial Abonado</span>
              <span className="text-lg font-bold text-[#3E7B27]">
                ${paid.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#0B272D]/10">
              <span className="text-[10px] text-gray-500 uppercase font-bold block mb-0.5">Saldo Restante</span>
              <span className={`text-lg font-bold ${balance === 0 ? 'text-[#3E7B27]' : 'text-[#B85042]'}`}>
                ${balance.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Guest Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#F7FAF9] rounded-2xl p-4 border border-[#0B272D]/10 space-y-2">
              <h3 className="font-bold text-[#0B272D] uppercase tracking-wider text-[11px] pb-1 border-b border-[#0B272D]/10">
                Datos de la Invitación
              </h3>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Asistencia:</span>
                <span className="font-bold text-[#0B272D]">
                  {guest.asistencia === 'attending' ? '🌿 Sí, asiste' : '✕ No asiste'}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Lugares Reservados:</span>
                <span className="font-bold text-[#0B272D]">{guest.invitados} Persona(s)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Modalidad Elegida:</span>
                <span className="font-bold text-[#0B272D] uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-[#0B272D]/10">
                  {guest.opcionPago === 'ahora' && 'Pago Total'}
                  {guest.opcionPago === 'fraccionado' && 'Pago Parcial / Fraccionado'}
                  {guest.opcionPago === 'tarde' && 'Pagar más tarde'}
                  {guest.opcionPago === 'no_aplica' && 'No Aplica'}
                </span>
              </div>
            </div>

            <div className="bg-[#F7FAF9] rounded-2xl p-4 border border-[#0B272D]/10 space-y-2">
              <h3 className="font-bold text-[#0B272D] uppercase tracking-wider text-[11px] pb-1 border-b border-[#0B272D]/10">
                Preferencias & Notas
              </h3>
              <div>
                <span className="text-gray-500 block text-[10px]">Restricción Alimentaria:</span>
                <span className="font-bold text-[#0B272D]">
                  {guest.restriccionAlimentaria || 'Ninguna'}
                  {guest.otros ? ` (${guest.otros})` : ''}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Canción Sugerida:</span>
                <span className="font-bold text-[#0B272D]">
                  {guest.cancion ? `🎵 ${guest.cancion}` : '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Observaciones / Mensaje:</span>
                <p className="text-[#0B272D] italic">
                  {guest.observacion ? `"${guest.observacion}"` : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Historical Receipts Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display text-lg font-bold text-[#0B272D]">
                Galería & Historial de Comprobantes
              </h3>
              <span className="text-xs text-[#5A9696] font-semibold">
                {paymentList.length > 0 ? `${paymentList.length} comprobante(s)` : '0 comprobantes'}
              </span>
            </div>

            {paymentList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentList.map((pago: PagoItem, idx: number) => (
                  <div
                    key={pago.id || idx}
                    className="bg-[#F7FAF9] rounded-2xl p-4 border border-[#0B272D]/10 space-y-2 flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-[#5A9696] uppercase">
                          Entrega #{idx + 1}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {pago.fecha
                            ? new Date(pago.fecha?.toDate ? pago.fecha.toDate() : pago.fecha).toLocaleDateString(
                                'es-AR',
                                { day: '2-digit', month: 'short', year: 'numeric' }
                              )
                            : '-'}
                        </span>
                      </div>
                      <p className="font-bold text-[#0B272D] text-base">
                        ${(pago.monto || 0).toLocaleString('es-AR')} ARS
                      </p>
                      {pago.comprobanteNombre && (
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          📄 {pago.comprobanteNombre}
                        </p>
                      )}
                    </div>

                    {pago.comprobanteUrl ? (
                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onSelectProof({
                              url: pago.comprobanteUrl!,
                              name: pago.comprobanteNombre || `Comprobante Entrega #${idx + 1}`,
                            })
                          }
                          className="flex-1 py-1.5 bg-white hover:bg-[#BBDB93] border border-[#0B272D]/20 rounded-xl font-bold text-[11px] text-[#0B272D] transition-colors text-center shadow-xs"
                        >
                          👁️ Ver en Visor
                        </button>
                        <a
                          href={pago.comprobanteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#0B272D] rounded-xl font-bold text-[11px] transition-colors flex items-center justify-center"
                          title="Abrir en pestaña nueva"
                        >
                          ↗
                        </a>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">Sin archivo</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-xs text-gray-500">
                No se han adjuntado comprobantes de transferencia para este invitado.
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#F7FAF9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCopyPaymentLink(guest.id)}
              className="px-3 py-2 bg-white hover:bg-[#D6E4BA] border border-[#0B272D]/20 rounded-xl text-xs font-bold text-[#0B272D] transition-colors inline-flex items-center gap-1.5"
            >
              <span>🔗</span>
              <span>{copiedId === guest.id ? '¡Link Copiado!' : 'Copiar Link de Pago'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {guest.estadoPago !== 'aprobado' && (
              <button
                type="button"
                onClick={() => onStatusChange(guest.id, 'aprobado')}
                disabled={isActionLoading}
                className="px-4 py-2 bg-[#BBDB93] hover:bg-[#A3C775] text-[#0B272D] rounded-xl font-bold text-xs transition-colors shadow-xs"
              >
                ✓ Aprobar Pago
              </button>
            )}

            {guest.estadoPago === 'aprobado' && (
              <button
                type="button"
                onClick={() => onStatusChange(guest.id, 'pendiente')}
                disabled={isActionLoading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs transition-colors"
              >
                ↩ Deshacer a Pendiente
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectDelete({ id: guest.id, name: `${guest.nombre} ${guest.apellido}` })}
              disabled={isActionLoading}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-xs transition-colors"
            >
              🗑️ Eliminar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
