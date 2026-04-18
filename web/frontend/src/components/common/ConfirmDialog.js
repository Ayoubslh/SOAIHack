import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const toneStyles = {
  danger: {
    icon: "text-danger",
    badge: "bg-danger-bg text-danger",
    confirmVariant: "danger",
  },
  warning: {
    icon: "text-warning",
    badge: "bg-warning/10 text-warning",
    confirmVariant: "primary",
  },
  neutral: {
    icon: "text-primary",
    badge: "bg-primary-light text-primary",
    confirmVariant: "primary",
  },
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  tone = "danger",
  maxWidthClassName = "max-w-md",
}) => {
  const theme = toneStyles[tone] || toneStyles.danger;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidthClassName={maxWidthClassName}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={theme.confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.badge}`}>
          <AlertTriangle size={20} className={theme.icon} />
        </div>
        <div className="space-y-3">
          <p className="text-sm leading-6 text-text-muted">{message}</p>
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
