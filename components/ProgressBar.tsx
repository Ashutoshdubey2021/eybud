import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-xl">
      <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
      <div className="relative w-full h-1.5 bg-gray-700/70 rounded-full group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: 2 }}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{ width: `${progressPercentage}%`, zIndex: 1 }}
        ></div>
         <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full transition-transform duration-200 w-2 h-2 group-hover:w-3.5 group-hover:h-3.5"
          style={{ left: `${progressPercentage}%`, zIndex: 3 }}
        ></div>
      </div>
      <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;