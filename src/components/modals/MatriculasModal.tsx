import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MatriculasModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  matriculas: string[];
}

export function MatriculasModal({ isOpen, onClose, title, category, matriculas }: MatriculasModalProps) {
  if (!isOpen) return null;

  const formatMatricula = (matricula: string | number | null | undefined): string => {
    if (matricula === null || matricula === undefined) return '';
    const strMatricula = String(matricula);
    return strMatricula.replace(/^320-/, '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {title}: <span className="text-blue-600">{category}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 gap-2">
            {matriculas.map((matricula, index) => (
              <Link
                key={index}
                to={`/matricula/${formatMatricula(matricula)}`}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-between group transition-colors"
              >
                <span className="font-medium">{matricula}</span>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver detalles →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}