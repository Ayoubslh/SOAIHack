import React from "react";

const Card = ({ children, className = "", noPadding = false }) => {
  return (
    <div
      className={`bg-bg-card border border-border-light rounded-lg shadow-sm ${noPadding ? "" : "p-6"} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
