import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  width = 480
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        {title && (
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
          </div>
        )}

        <div className="mb-4">{children}</div>

        {footer && (
          <div className="pt-3 border-t flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
