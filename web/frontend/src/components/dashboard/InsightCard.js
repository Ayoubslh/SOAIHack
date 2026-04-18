import React from 'react';

const InsightCard = ({ title, description, icon: Icon, type }) => {
  const typeStyles = {
    weather: 'bg-[#e0f2fe] text-[#0ea5e9]',
    history: 'bg-[#fce7f3] text-[#db2777]',
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-md bg-border-subtle mb-3 last:mb-0">
      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${typeStyles[type]}`}>
        <Icon size={18} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-dark mb-1">{title}</span>
        <span className="text-[11px] text-text-muted leading-relaxed">{description}</span>
      </div>
    </div>
  );
};

export default InsightCard;
