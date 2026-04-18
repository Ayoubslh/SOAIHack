import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useTimeSaved } from '../../context/TimeSavedContext';
import { formatTime } from '../../utils/formatTime';

const TimeSavedCard = () => {
  const { totalTimeSaved, todayTimeSaved, weekTimeSaved, monthTimeSaved } = useTimeSaved();
  const [timeFilter, setTimeFilter] = useState('today');

  const getFilteredTime = () => {
    if (timeFilter === 'week') return weekTimeSaved;
    if (timeFilter === 'month') return monthTimeSaved;
    return todayTimeSaved;
  };

  return (
    <div className="bg-surface border border-border-light rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">
            Total Time Saved
          </p>
          <h3 className="text-2xl font-bold text-text-dark">
            {formatTime(totalTimeSaved)}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
          <Clock size={24} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-medium text-success flex items-center gap-1">
          <span className="text-success bg-success/10 px-2 py-0.5 rounded-full text-xs font-bold leading-none">
            +{formatTime(getFilteredTime())}
          </span>
          <span className="text-text-muted text-xs ml-1">{timeFilter}</span>
        </p>

        <div className="flex gap-2">
          {['today', 'week', 'month'].map((filter) => (
             <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`text-xs px-2 py-1 rounded capitalize transition-all ${
                  timeFilter === filter 
                    ? 'bg-bg-card font-medium text-text-dark shadow-sm border border-border-light'
                    : 'text-text-muted hover:text-text-dark'
                }`}
             >
                {filter}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSavedCard;
