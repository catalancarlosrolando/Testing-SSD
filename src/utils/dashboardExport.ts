import type { Invitado } from '../types/dashboard';

/**
 * Generates and downloads a CSV export of the guest list.
 */
export const exportGuestsToCSV = (guests: Invitado[], fileName = 'invitados_boda.csv'): void => {
  const headers = [
    'Nombre',
    'Apellido',
    'Teléfono',
    'Asistencia',
    'Cantidad Invitados',
    'Restricción Alimentaria',
    'Detalle Restricción',
    'Canción',
    'Observaciones',
    'Opción de Pago',
    'Estado de Pago',
    'Monto Total',
    'Monto Pagado',
    'Saldo Restante',
    'Tiene Comprobante',
  ];

  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = guests.map((guest) => {
    const saldo = Math.max(0, (guest.montoTotal || 0) - (guest.montoPagado || 0));
    const hasProof = !!(guest.comprobanteUrl || (guest.pagos && guest.pagos.length > 0));

    return [
      escapeCSV(guest.nombre),
      escapeCSV(guest.apellido),
      escapeCSV(guest.telefono),
      escapeCSV(guest.asistencia === 'attending' ? 'Asiste' : 'No asiste'),
      escapeCSV(guest.invitados || 1),
      escapeCSV(guest.restriccionAlimentaria || 'Ninguna'),
      escapeCSV(guest.otros || ''),
      escapeCSV(guest.cancion || ''),
      escapeCSV(guest.observacion || ''),
      escapeCSV(guest.opcionPago || ''),
      escapeCSV(guest.estadoPago || ''),
      escapeCSV(guest.montoTotal || 0),
      escapeCSV(guest.montoPagado || 0),
      escapeCSV(saldo),
      escapeCSV(hasProof ? 'Sí' : 'No'),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
