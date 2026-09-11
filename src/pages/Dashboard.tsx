import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { DashboardTable } from '../components/dashboard/DashboardTable';
import { GuestDetailsModal } from '../components/dashboard/GuestDetailsModal';
import { ProofModal } from '../components/dashboard/ProofModal';
import { DeleteConfirmModal } from '../components/dashboard/DeleteConfirmModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const {
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
  } = useDashboard();

  return (
    <div className="min-h-screen bg-[#F0F4F2] py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#1D373C]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader
          userEmail={user?.email}
          onRefresh={fetchGuests}
          onExportCSV={handleExportCSV}
          loading={loading}
        />

        {/* Metrics Summary Cards */}
        <DashboardStats metrics={metrics} />

        {/* Search & Status Filters */}
        <DashboardFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Guests Table / Responsive Cards */}
        <DashboardTable
          guests={filteredGuests}
          loading={loading}
          error={error}
          actionLoading={actionLoading}
          onStatusChange={handleStatusChange}
          onSelectDetails={setSelectedGuestDetails}
          onSelectDelete={setGuestToDelete}
        />
      </div>

      {/* Guest Full Details Modal */}
      <GuestDetailsModal
        guest={selectedGuestDetails}
        copiedId={copiedId}
        actionLoading={actionLoading}
        onClose={() => setSelectedGuestDetails(null)}
        onCopyPaymentLink={handleCopyPaymentLink}
        onStatusChange={handleStatusChange}
        onSelectProof={setSelectedProofUrl}
        onSelectDelete={setGuestToDelete}
      />

      {/* Payment Proof Image / PDF Modal */}
      <ProofModal
        proof={selectedProofUrl}
        onClose={() => setSelectedProofUrl(null)}
      />

      {/* Delete Confirmation Popup */}
      <DeleteConfirmModal
        guestToDelete={guestToDelete}
        actionLoading={actionLoading}
        onCancel={() => setGuestToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Dashboard;
