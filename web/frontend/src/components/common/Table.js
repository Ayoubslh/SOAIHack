import React from "react";

export const Table = ({ children, className = "" }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-separate border-spacing-0 text-left">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th
            key={index}
            className={`px-4 py-3 text-[10px] uppercase tracking-wider text-text-muted font-semibold border-b border-border-light bg-bg-main ${col === "Action" || col === "Actions" ? "text-center" : "text-left"}`}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TableRow = ({ children, className = "" }) => {
  return <tr className={`group ${className}`}>{children}</tr>;
};

export const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td
      {...props}
      className={`px-4 py-4 border-b border-border-light group-last:border-none align-middle ${className}`}>
      {children}
    </td>
  );
};
