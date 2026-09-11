import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getAllInvitados,
  updateEstadoPago,
  deleteInvitado,
} from '../services/rsvpService';
import type {
  Invitado,
  EstadoPago,
  DashboardStatusFilter,
  SelectedProof,
} from '../types/dashboard';
import { computeDashboardMetrics, filterGuests } from '../utils/dashboardMetrics';
import { exportGuestsToCSV } from '../utils/dashboardExport';

export const useDashboard = () => {
  const [guests, setGuests] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DashboardStatusFilter>('todos');
  const [selectedProofUrl, setSelectedProofUrl] = useState<SelectedProof | null>(null);
  const [selectedGuestDetails, setSelectedGuestDetails] = useState<Invitado | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<{ id: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInvitados();
      setGuests(data);
    } catch (err) {
      console.error('Error loading guests:', err);
      setError('No se pudieron cargar los datos de los invitados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const data = await getAllInvitados();
        if (isMounted) {
          setGuests(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading guests:', err);
          setError('No se pudieron cargar los datos de los invitados.');
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: EstadoPago) => {
    setActionLoading(id);
    try {
      await updateEstadoPago(id, newStatus);
      setGuests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, estadoPago: newStatus } : item))
      );
      if (selectedGuestDetails && selectedGuestDetails.id === id) {
        setSelectedGuestDetails((prev) => (prev ? { ...prev, estadoPago: newStatus } : null));
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Error al actualizar el estado de pago.');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteInvitado(id);
      setGuests((prev) => prev.filter((item) => item.id !== id));
      if (selectedGuestDetails && selectedGuestDetails.id === id) {
        setSelectedGuestDetails(null);
      }
      setGuestToDelete(null);
    } catch (err) {
      console.error('Error deleting guest:', err);
      alert('Error al eliminar el registro.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyPaymentLink = (id: string) => {
    const url = `${window.location.origin}/pago?id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    exportGuestsToCSV(guests);
  };

  const metrics = useMemo(() => computeDashboardMetrics(guests), [guests]);

  const filteredGuests = useMemo(
    () => filterGuests(guests, searchTerm, statusFilter),
    [guests, searchTerm, statusFilter]
  );

  return {
    guests,
    filteredGuests,
    metrics,
    loading,
    error,
    searchTerm,
    statusFilter,
    selectedProofUrl,
    selectedGuestDetails,
    guestToDelete,
    actionLoading,
    copiedId,
    setSearchTerm,
    setStatusFilter,
    setSelectedProofUrl,
    setSelectedGuestDetails,
    setGuestToDelete,
    fetchGuests,
    handleStatusChange,
    confirmDelete,
    handleCopyPaymentLink,
    handleExportCSV,
  };
};
