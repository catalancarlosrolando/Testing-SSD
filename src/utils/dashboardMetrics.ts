import type { Invitado, DashboardMetrics, DashboardStatusFilter, GuestBalance } from '../types/dashboard';

/**
 * Computes aggregate summary metrics for the wedding guests list.
 */
export const computeDashboardMetrics = (guests: Invitado[]): DashboardMetrics => {
  const confirmedGuests = guests.filter((g) => g.asistencia === 'attending');
  const declinedGuests = guests.filter((g) => g.asistencia === 'declined');

  const totalPeople = confirmedGuests.reduce((acc, curr) => acc + (curr.invitados || 1), 0);

  const totalRevenue = confirmedGuests.reduce((acc, curr) => {
    if (curr.estadoPago === 'aprobado') {
      return acc + (curr.montoPagado || curr.montoTotal || 0);
    }
    if (curr.estadoPago === 'parcialmente_pagado') {
      return acc + (curr.montoPagado || 0);
    }
    return acc;
  }, 0);

  const pendingProofCount = confirmedGuests.filter((g) => g.estadoPago === 'en_revision').length;

  return {
    totalConfirmed: confirmedGuests.length,
    totalPeople,
    totalRevenue,
    pendingProofCount,
    declinedCount: declinedGuests.length,
  };
};

/**
 * Filters the guest list based on search term (name, surname, phone) and status filter.
 */
export const filterGuests = (
  guests: Invitado[],
  searchQuery: string,
  statusFilter: DashboardStatusFilter
): Invitado[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return guests.filter((item) => {
    const matchesSearch =
      !normalizedQuery ||
      item.nombre.toLowerCase().includes(normalizedQuery) ||
      item.apellido.toLowerCase().includes(normalizedQuery) ||
      item.telefono.includes(normalizedQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'todos') return true;
    if (statusFilter === 'declined') return item.asistencia === 'declined';
    return item.asistencia === 'attending' && item.estadoPago === statusFilter;
  });
};

/**
 * Computes financial balance for a specific guest.
 */
export const calculateGuestBalance = (montoTotal = 0, montoPagado = 0): GuestBalance => {
  const total = montoTotal || 0;
  const paid = montoPagado || 0;
  const balance = Math.max(0, total - paid);

  return { total, paid, balance };
};
