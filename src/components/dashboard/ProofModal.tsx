import React from 'react';
import type { SelectedProof } from '../../types/dashboard';

interface ProofModalProps {
  proof: SelectedProof | null;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({ proof, onClose }) => {
  if (!proof) return null;

  const isPdf = proof.url.toLowerCase().includes('.pdf');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0B272D] truncate">
            {proof.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          {isPdf ? (
            <iframe
              src={proof.url}
              className="w-full h-[600px] border-none rounded-xl"
              title="PDF Preview"
            />
          ) : (
            <img
              src={proof.url}
              alt="Comprobante"
              className="max-h-[600px] object-contain rounded-xl shadow-xs"
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-white">
          <a
            href={proof.url}
            target="_blank"
            rel="noreferrer"
            download
            className="px-4 py-2 bg-[#0B272D] text-white text-xs font-bold rounded-xl hover:bg-[#051518]"
          >
            Descargar / Abrir en pestaña nueva ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
