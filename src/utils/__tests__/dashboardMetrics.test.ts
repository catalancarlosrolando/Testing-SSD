import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  computeDashboardMetrics,
  filterGuests,
  calculateGuestBalance,
} from '../dashboardMetrics.ts';
import type { Invitado } from '../../types/dashboard.ts';

const mockGuests: Invitado[] = [
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Catalan',
    telefono: '2645123456',
    asistencia: 'attending',
    invitados: 2,
    restriccionAlimentaria: 'ninguno',
    otros: '',
    opcionPago: 'ahora',
    montoTotal: 50000,
    montoPagado: 50000,
    estadoPago: 'aprobado',
    comprobanteUrl: 'https://example.com/receipt1.jpg',
    comprobanteNombre: 'receipt1.jpg',
    fechaRegistro: new Date(),
    fechaPago: new Date(),
  },
  {
    id: '2',
    nombre: 'Lucia',
    apellido: 'Gomez',
    telefono: '2645987654',
    asistencia: 'attending',
    invitados: 3,
    restriccionAlimentaria: 'celiaco',
    otros: '',
    opcionPago: 'fraccionado',
    montoTotal: 75000,
    montoPagado: 25000,
    estadoPago: 'parcialmente_pagado',
    comprobanteUrl: 'https://example.com/receipt2.jpg',
    comprobanteNombre: 'receipt2.jpg',
    fechaRegistro: new Date(),
    fechaPago: new Date(),
  },
  {
    id: '3',
    nombre: 'Martin',
    apellido: 'Perez',
    telefono: '1145678901',
    asistencia: 'attending',
    invitados: 1,
    restriccionAlimentaria: 'ninguno',
    otros: '',
    opcionPago: 'ahora',
    montoTotal: 25000,
    montoPagado: 0,
    estadoPago: 'en_revision',
    comprobanteUrl: 'https://example.com/receipt3.jpg',
    comprobanteNombre: 'receipt3.jpg',
    fechaRegistro: new Date(),
    fechaPago: null,
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'Lopez',
    telefono: '2615432109',
    asistencia: 'declined',
    invitados: 1,
    restriccionAlimentaria: 'ninguno',
    otros: '',
    opcionPago: 'no_aplica',
    montoTotal: 0,
    montoPagado: 0,
    estadoPago: 'no_aplica',
    comprobanteUrl: null,
    comprobanteNombre: null,
    fechaRegistro: new Date(),
    fechaPago: null,
  },
];

describe('computeDashboardMetrics', () => {
  it('should accurately calculate total headcounts, confirmed guests, revenue, and pending reviews', () => {
    const metrics = computeDashboardMetrics(mockGuests);

    // 3 attending guests (2 + 3 + 1 = 6 people)
    assert.strictEqual(metrics.totalConfirmed, 3);
    assert.strictEqual(metrics.totalPeople, 6);

    // Approved: 50000 + Partial: 25000 = 75000
    assert.strictEqual(metrics.totalRevenue, 75000);

    // 1 guest with 'en_revision'
    assert.strictEqual(metrics.pendingProofCount, 1);

    // 1 guest declined
    assert.strictEqual(metrics.declinedCount, 1);
  });

  it('should return zeros for empty guest list', () => {
    const metrics = computeDashboardMetrics([]);

    assert.strictEqual(metrics.totalConfirmed, 0);
    assert.strictEqual(metrics.totalPeople, 0);
    assert.strictEqual(metrics.totalRevenue, 0);
    assert.strictEqual(metrics.pendingProofCount, 0);
    assert.strictEqual(metrics.declinedCount, 0);
  });
});

describe('filterGuests', () => {
  it('should filter by search query matching first name', () => {
    const result = filterGuests(mockGuests, 'carlos', 'todos');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].nombre, 'Carlos');
  });

  it('should filter by search query matching surname', () => {
    const result = filterGuests(mockGuests, 'gomez', 'todos');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].nombre, 'Lucia');
  });

  it('should filter by search query matching phone number', () => {
    const result = filterGuests(mockGuests, '114567', 'todos');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].nombre, 'Martin');
  });

  it('should filter by status en_revision', () => {
    const result = filterGuests(mockGuests, '', 'en_revision');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, '3');
  });

  it('should filter by status parcialmente_pagado', () => {
    const result = filterGuests(mockGuests, '', 'parcialmente_pagado');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, '2');
  });

  it('should filter by status declined', () => {
    const result = filterGuests(mockGuests, '', 'declined');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].nombre, 'Ana');
  });

  it('should return all guests when status filter is todos and search is empty', () => {
    const result = filterGuests(mockGuests, '', 'todos');
    assert.strictEqual(result.length, 4);
  });
});

describe('calculateGuestBalance', () => {
  it('should calculate remaining balance correctly', () => {
    const balance = calculateGuestBalance(50000, 20000);
    assert.strictEqual(balance.total, 50000);
    assert.strictEqual(balance.paid, 20000);
    assert.strictEqual(balance.balance, 30000);
  });

  it('should return 0 balance when paid exceeds or equals total', () => {
    const balance = calculateGuestBalance(50000, 50000);
    assert.strictEqual(balance.balance, 0);
  });

  it('should handle undefined or zero amounts safely', () => {
    const balance = calculateGuestBalance(undefined, undefined);
    assert.strictEqual(balance.total, 0);
    assert.strictEqual(balance.paid, 0);
    assert.strictEqual(balance.balance, 0);
  });
});
