import React, { useEffect } from "react";
import { X } from "lucide-react";
import Card from "./Card";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidthClassName = "max-w-lg",
}) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}></div>

      {/* Modal Content */}
      <div
        className={`relative z-10 w-full ${maxWidthClassName} transform transition-all flex flex-col max-h-[90vh]`}>
        <Card className="flex flex-col shadow-2xl overflow-hidden w-full h-full p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light shrink-0">
            <h3 className="text-lg font-bold text-text-dark">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-dark hover:bg-border-subtle p-1.5 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto custom-scrollbar flex-grow">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-border-light bg-border-subtle/30 flex justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Modal;
