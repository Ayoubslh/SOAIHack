import React from 'react';
import Card from '../common/Card';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => {
  const colorMap = {
    primary: 'bg-primary-light text-primary',
    danger: 'bg-danger-bg text-danger',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
  };

  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between mb-4 text-text-muted text-sm font-medium">
        <span>{title}</span>
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${colorMap[colorClass]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-3xl font-bold text-text-dark mb-2">{value}</div>
      <div className="text-sm flex items-center gap-1.5">
        <span className={`font-semibold ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
          {trend}
        </span>
        <span className="text-text-muted">{trendLabel}</span>
      </div>
    </Card>
  );
};

export default StatCard;
