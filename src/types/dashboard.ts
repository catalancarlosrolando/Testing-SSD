import type { Invitado, EstadoPago, PagoItem } from '../services/rsvpService';

export type DashboardStatusFilter =
  | 'todos'
  | 'pendiente'
  | 'parcialmente_pagado'
  | 'en_revision'
  | 'aprobado'
  | 'declined';

export interface DashboardMetrics {
  totalConfirmed: number;
  totalPeople: number;
  totalRevenue: number;
  pendingProofCount: number;
  declinedCount: number;
}

export interface DashboardFilterState {
  searchQuery: string;
  statusFilter: DashboardStatusFilter;
}

export interface SelectedProof {
  url: string;
  name: string;
}

export interface GuestBalance {
  total: number;
  paid: number;
  balance: number;
}

export type { Invitado, EstadoPago, PagoItem };
