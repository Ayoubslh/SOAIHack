import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => {
          const typeStyles = {
            success: 'bg-bg-card border-success text-text-dark',
            error: 'bg-bg-card border-danger text-text-dark',
            warning: 'bg-bg-card border-warning text-text-dark'
          };
          
          const icons = {
            success: <CheckCircle className="text-success" size={20} />,
            error: <XCircle className="text-danger" size={20} />,
            warning: <AlertCircle className="text-warning" size={20} />
          };

          return (
            <div 
              key={toast.id} 
              className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 min-w-[300px] transition-all transform animate-fade-in-up ${typeStyles[toast.type]}`}
            >
              {icons[toast.type]}
              <span className="flex-grow text-sm font-medium">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-dark transition-colors">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
