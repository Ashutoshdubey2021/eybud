import React from 'react';
import { Song, RepeatMode } from '../types';
import ProgressBar from './ProgressBar';

// --- SVG Icons --- //
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
);
const NextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l7.58 4.347 7.58 4.347c1.295.742 1.295 2.545 0 3.286l-7.58 4.347-7.58 4.347c-1.25.717-2.779-.217-2.779-1.643V5.653z" /></svg>
);
const PrevIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.75 5.653c0-1.426-1.529-2.33-2.779-1.643l-7.58 4.347-7.58 4.347c-1.295.742-1.295 2.545 0 3.286l7.58 4.347 7.58 4.347c1.25.717 2.779-.217 2.779-1.643V5.653z" /></svg>
);
const ShuffleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v4.992h-4.992M21.015 4.356v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0L2.985 9.348" /></svg>
);
const RepeatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 16.023L18 18m0 0l-1.977-1.977m1.977 1.977v-4.477m-4.477 0l1.977 1.977M5.977 5.977L4 4m0 0l1.977 1.977M4 4v4.477m4.477 0L4 4" /></svg>
);
const RepeatOneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 16.023L18 18m0 0l-1.977-1.977m1.977 1.977v-4.477m-4.477 0l1.977 1.977M5.977 5.977L4 4m0 0l1.977 1.977M4 4v4.477m4.477 0L4 4m12 4.01V12a1 1 0 01-1 1h-1.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5H15a1 1 0 011 1v.01" /></svg>
);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);
const HeartIconSolid: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.185 15.185 0 01-3.044-2.03.537.537 0 01-.068-.068 13.18 13.18 0 01-3.1-4.043 12.074 12.074 0 01-1.42-5.021 9.38 9.38 0 013.82-7.554 9.34 9.34 0 015.821-2.437 9.34 9.34 0 015.821 2.437 9.38 9.38 0 013.82 7.554 12.074 12.074 0 01-1.42 5.021 13.18 13.18 0 01-3.1 4.043.537.537 0 01-.068.068 15.185 15.185 0 01-3.044 2.03c-.456.286-.92.534-1.383.597l-.022.012-.007.003z" />
    </svg>
);
const HeartIconOutline: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);


// --- Interfaces --- //
interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  duration: number;
  currentTrack: Song | null;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleFavorite: (songId: string) => void;
}

// --- Helper Components --- //
const MiniPlayerProgressBar: React.FC<{ currentTime: number; duration: number }> = ({ currentTime, duration }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-700">
      <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
    </div>
  );
};

// --- Main Component --- //
const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying, onPlayPause, onNext, onPrev, onSeek, currentTime, duration, currentTrack,
  repeatMode, onToggleRepeat, isShuffle, onToggleShuffle, isExpanded, onToggleExpand,
  onToggleFavorite,
}) => {

  if (!currentTrack) {
    return null; // Return nothing if no track is loaded
  }

  const getRepeatIcon = () => {
    switch(repeatMode) {
      case RepeatMode.ONE: return <RepeatOneIcon className="w-6 h-6" />;
      case RepeatMode.ALL: return <RepeatIcon className="w-6 h-6" />;
      default: return <RepeatIcon className="w-6 h-6" />;
    }
  };

  // --- Expanded Player View --- //
  if (isExpanded) {
    return (
      <div className={`fixed inset-0 bg-black z-50 flex flex-col transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 blur-md scale-110" style={{ backgroundImage: `url(${currentTrack.artwork})`, opacity: 0.2 }} key={currentTrack.id} />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/20 via-black/60 to-black" />

        {/* Header */}
        <header className="relative z-10 flex-shrink-0 px-4 pt-6">
          <button onClick={onToggleExpand} aria-label="Collapse player" className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
            <ChevronDownIcon className="w-8 h-8"/>
          </button>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4 overflow-hidden">
            <div className="w-full max-w-xs sm:max-w-sm aspect-square rounded-lg overflow-hidden shadow-2xl mb-8">
                <img src={currentTrack.artwork || ''} alt={currentTrack.album} className="w-full h-full object-cover" />
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="flex-grow min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold truncate">{currentTrack.title}</h2>
                    <p className="text-lg text-gray-300 truncate">{currentTrack.artist}</p>
                </div>
                <button 
                  onClick={() => onToggleFavorite(currentTrack.id)} 
                  aria-label={currentTrack.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  className="p-2 text-gray-400 hover:text-white flex-shrink-0"
                >
                  {currentTrack.isFavorite ? <HeartIconSolid className="w-7 h-7 text-orange-500"/> : <HeartIconOutline className="w-7 h-7"/>}
                </button>
            </div>
        </main>
        
        {/* Controls */}
        <footer className="relative z-10 flex flex-col items-center justify-center gap-4 px-4 pb-6 sm:pb-8">
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />
          <div className="flex items-center justify-between w-full max-w-xl mt-2">
            <button onClick={onToggleShuffle} aria-label="Toggle shuffle" className={`p-2 transition-colors ${isShuffle ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}>
              <ShuffleIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <button onClick={onPrev} aria-label="Previous track" className="p-2 text-gray-200 hover:text-white transition-colors">
                <PrevIcon className="w-10 h-10" />
              </button>
              <button onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} className="bg-orange-600 hover:bg-orange-500 rounded-full w-20 h-20 flex items-center justify-center text-white transition-transform duration-200 active:scale-95">
                {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10 pl-1" />}
              </button>
              <button onClick={onNext} aria-label="Next track" className="p-2 text-gray-200 hover:text-white transition-colors">
                <NextIcon className="w-10 h-10" />
              </button>
            </div>
            <button onClick={onToggleRepeat} aria-label="Toggle repeat" className={`p-2 transition-colors ${repeatMode !== RepeatMode.OFF ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}>
              {getRepeatIcon()}
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // --- Mini Player View --- //
  return (
    <div className="relative bg-gray-900/80 backdrop-blur-md p-2 text-white cursor-pointer" onClick={onToggleExpand}>
      <MiniPlayerProgressBar currentTime={currentTime} duration={duration} />
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
          <img src={currentTrack.artwork || ''} alt={currentTrack.album} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="font-semibold truncate">{currentTrack.title}</p>
          <p className="text-sm text-gray-400 truncate hidden sm:block">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center gap-2 pr-2">
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(currentTrack.id); }} aria-label={currentTrack.isFavorite ? "Remove from favorites" : "Add to favorites"} className="text-gray-400 hover:text-white transition-colors p-2 hidden sm:block">
                {currentTrack.isFavorite ? <HeartIconSolid className="w-6 h-6 text-orange-500"/> : <HeartIconOutline className="w-6 h-6"/>}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onPlayPause(); }} aria-label={isPlaying ? 'Pause' : 'Play'} className="text-gray-200 hover:text-white transition-colors p-2">
                {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next track" className="text-gray-200 hover:text-white transition-colors p-2 hidden sm:block">
                <NextIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
