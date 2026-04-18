import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-[#0284c7] border border-primary",
    secondary:
      "bg-border-subtle text-text-dark hover:bg-border-light border border-transparent",
    outline:
      "bg-bg-card text-text-dark border border-border-light hover:bg-border-subtle",
    ghost:
      "bg-transparent text-text-muted hover:text-text-dark hover:bg-border-subtle",
    danger: "bg-danger text-white hover:bg-[#b91c1c] border border-danger",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && (
        <Icon
          size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
          className="mr-2"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
