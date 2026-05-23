import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      button: "bg-red-600 hover:bg-red-700 text-white",
      bg: "bg-red-100"
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-600" size={24} />,
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      bg: "bg-yellow-100"
    },
    info: {
      icon: <AlertTriangle className="text-blue-600" size={24} />,
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      bg: "bg-blue-100"
    }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-surface-hover hover:text-secondary"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-3 ${style.bg}`}>
              {style.icon}
            </div>
            <div>
              <p className="text-sm text-secondary leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 bg-surface-hover p-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-secondary hover:bg-surface"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-6 py-2 text-sm font-bold shadow-sm transition-all ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
