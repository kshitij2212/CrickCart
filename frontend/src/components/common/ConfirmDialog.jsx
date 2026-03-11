import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const styles = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full animate-scale-up">
        {/* Header */}
        <div className={`${styles.bg} p-6 rounded-t-lg`}>
          <div className="flex items-center gap-4">
            <div className={`${styles.icon} p-3 bg-white rounded-full`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black italic font-athletic text-[#00171f]">
                {title || 'CONFIRM ACTION'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {message || 'Are you sure you want to proceed? This action cannot be undone.'}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-black rounded hover:bg-gray-300 transition"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 ${styles.button} text-white font-black rounded transition`}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;