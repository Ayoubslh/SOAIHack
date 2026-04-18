import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({
  trigger,
  children,
  align = "right",
  className = "w-48",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-40 mt-2 ${className} rounded-md shadow-lg bg-bg-card ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 transition-all origin-top-right ${align === "right" ? "right-0" : "left-0"}`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onClick: (e) => {
                    if (child.props.onClick) child.props.onClick(e);
                    if (!child.props.keepOpen) setIsOpen(false);
                  },
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  className = "",
  icon: Icon,
  danger = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${danger ? "text-danger hover:bg-danger-bg" : "text-text-dark hover:bg-border-subtle"} ${className}`}
      role="menuitem">
      {Icon && <Icon size={16} className="mr-3" />}
      {children}
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="h-px bg-border-light my-1"></div>;
};

export default Dropdown;
