import React, { createContext, useContext, useState } from 'react';

const TimeSavedContext = createContext();

export const useTimeSaved = () => useContext(TimeSavedContext);

export const TimeSavedProvider = ({ children }) => {
  const [totalTimeSaved, setTotalTimeSaved] = useState(0);
  const [todayTimeSaved, setTodayTimeSaved] = useState(0);
  const [weekTimeSaved, setWeekTimeSaved] = useState(0);
  const [monthTimeSaved, setMonthTimeSaved] = useState(0);

  const addTimeSaved = (minutes) => {
    setTotalTimeSaved(prev => prev + minutes);
    setTodayTimeSaved(prev => prev + minutes);
    setWeekTimeSaved(prev => prev + minutes);
    setMonthTimeSaved(prev => prev + minutes);
  };

  const resetDaily = () => setTodayTimeSaved(0);
  const resetWeekly = () => setWeekTimeSaved(0);
  const resetMonthly = () => setMonthTimeSaved(0);

  const value = {
    totalTimeSaved,
    todayTimeSaved,
    weekTimeSaved,
    monthTimeSaved,
    addTimeSaved,
    resetDaily,
    resetWeekly,
    resetMonthly
  };

  return (
    <TimeSavedContext.Provider value={value}>
      {children}
    </TimeSavedContext.Provider>
  );
};
