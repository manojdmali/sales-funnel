import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: 'text-red-600',
            iconBg: 'bg-red-100',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        warning: {
            icon: 'text-yellow-600',
            iconBg: 'bg-yellow-100',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        }
    };

    const styles = typeStyles[type] || typeStyles.danger;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 animate-scaleIn">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${styles.iconBg} flex-shrink-0`}>
                            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;