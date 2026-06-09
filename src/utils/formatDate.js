// Date formatting utilities

export const formatMatchDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  
  // Format: "Tue, Jun 10 • 19:30"
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  
  // Format: "10 Jun, 19:30"
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

export const formatCountdown = (targetDateString) => {
  if (!targetDateString) return null;
  
  const target = new Date(targetDateString).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  
  if (diff <= 0) return { expired: true, text: "Closed" };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  let text = "";
  if (days > 0) {
    text = `${days}d ${hours}h`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m`;
  } else {
    text = `${minutes}m ${seconds}s`;
  }
  
  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    text
  };
};
