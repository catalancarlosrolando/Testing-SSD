import React from 'react';

interface DeleteConfirmModalProps {
  guestToDelete: { id: string; name: string } | null;
  actionLoading: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  guestToDelete,
  actionLoading,
  onCancel,
  onConfirm,
}) => {
  if (!guestToDelete) return null;

  const isDeleting = actionLoading === guestToDelete.id;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-100 text-center space-y-4 animate-scale-up">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner border border-red-100">
          🗑️
        </div>

        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">
            CONFIRMAR ELIMINACIÓN
          </span>
          <h3 className="text-xl font-bold text-[#0B272D] font-serif-display">
            ¿Eliminar a {guestToDelete.name}?
          </h3>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Estás a punto de borrar este registro de la lista de invitados. Esta acción no se puede deshacer.
          </p>
          <div className="bg-red-50/80 p-3 rounded-2xl mt-3 text-[11px] text-red-700 font-medium border border-red-100 text-left space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-red-800">
              <span>⚠️</span>
              <span>Consecuencias:</span>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-red-600 pl-1">
              <li>Se liberarán los lugares reservados.</li>
              <li>Se eliminarán todos los pagos y comprobantes asociados.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => onConfirm(guestToDelete.id)}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 bg-[#8C1C00] hover:bg-[#6D1500] text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sí, Eliminar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
