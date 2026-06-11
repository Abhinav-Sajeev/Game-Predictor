import flags from 'country-flag-emoji-json';

const FlagDisplay = ({ emoji, className = "w-6 h-4" }) => {
  if (!emoji) return null;
  const flag = flags.find(f => f.emoji === emoji);
  
  if (flag && flag.image) {
    return (
      <img 
        src={flag.image} 
        alt={flag.name || 'flag'} 
        className={`object-cover rounded-[2px] shadow-[0_0_2px_rgba(0,0,0,0.5)] flex-shrink-0 inline-block ${className}`} 
      />
    );
  }
  
  return <span className={`inline-block ${className}`}>{emoji}</span>;
};

export default FlagDisplay;
