export const formatTime = (totalMinutes) => {
  if (totalMinutes === 0) return "0m";
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;
  
  const sign = totalMinutes < 0 ? "-" : "";
  
  if (hours === 0) return `${sign}${minutes}m`;
  if (minutes === 0) return `${sign}${hours}h`;
  
  return `${sign}${hours}h ${minutes}m`;
};
