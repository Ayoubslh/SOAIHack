import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    neutral: 'bg-border-subtle text-text-muted',
    primary: 'bg-primary-light text-primary',
    success: 'bg-success-bg text-success-text',
    warning: 'bg-warning-bg text-warning-text',
    danger: 'bg-danger-bg text-danger-text',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[12px] tracking-tight ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
