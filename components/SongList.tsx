import React from 'react';
import { Song } from '../types';

interface SongListProps {
  songs: Song[];
  onPlay: (index: number) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  onSortChange: (criteria: 'playCount' | 'title' | 'artist' | 'dateAdded') => void;
  onShufflePlay: () => void;
  onToggleFavorite: (songId: string) => void;
  isFavoritesView: boolean;
}

const MusicNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 3v10.55A4.001 4.001 0 1014 17V7h4V3h-6z" />
  </svg>
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

const ShuffleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v4.992h-4.992M21.015 4.356v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0L2.985 9.348" />
  </svg>
);

const ListControls: React.FC<{ onSortChange: Function, onShufflePlay: Function }> = ({ onSortChange, onShufflePlay }) => (
  <div className="px-4 md:px-8 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
    <button
      onClick={() => onShufflePlay()}
      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
    >
      <ShuffleIcon className="w-5 h-5" />
      Shuffle Play
    </button>
    <div className="w-full sm:w-auto">
      <label htmlFor="sort-select" className="sr-only">Sort by</label>
      <select
        id="sort-select"
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full bg-gray-800/80 border border-gray-700 text-white text-sm rounded-full py-2 px-4 focus:ring-orange-500 focus:border-orange-500"
      >
        <option value="playCount">Sort by: Popularity</option>
        <option value="title">Sort by: Title</option>
        <option value="artist">Sort by: Artist</option>
        <option value="dateAdded">Sort by: Recently Added</option>
      </select>
    </div>
  </div>
);


const SongList: React.FC<SongListProps> = ({ songs, onPlay, currentTrackId, isPlaying, onSortChange, onShufflePlay, onToggleFavorite, isFavoritesView }) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
        {isFavoritesView ? (
            <>
                <HeartIconOutline className="w-24 h-24 mb-4 text-gray-600"/>
                <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
                <p>Click the heart on any song to add it here.</p>
            </>
        ) : (
            <>
                <MusicNoteIcon className="w-24 h-24 mb-4 text-gray-600"/>
                <h2 className="text-2xl font-bold mb-2">Your library is empty</h2>
                <p>Click the plus icon to add your local MP3 files.</p>
            </>
        )}
      </div>
    );
  }

  return (
    <>
      <ListControls onSortChange={onSortChange} onShufflePlay={onShufflePlay} />
      <div className="px-4 md:px-8">
        <ul className="space-y-2">
          {songs.map((song, index) => {
            const isActive = song.id === currentTrackId;
            return (
              <li
                key={song.id}
                onClick={() => onPlay(index)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${isActive ? 'bg-orange-600/30' : 'bg-gray-800/50 hover:bg-gray-700/70'}`}
              >
                <div className="w-12 h-12 flex-shrink-0 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                  {song.artwork ? (
                    <img src={song.artwork} alt={song.album} className="w-full h-full object-cover" />
                  ) : (
                    <MusicNoteIcon className="w-6 h-6 text-gray-400"/>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className={`font-semibold truncate ${isActive ? 'text-orange-400' : 'text-white'}`}>{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(song.id); }} 
                  aria-label={song.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  {song.isFavorite ? <HeartIconSolid className="w-6 h-6 text-orange-500"/> : <HeartIconOutline className="w-6 h-6"/>}
                </button>

                {isActive && isPlaying && (
                  <div className="flex items-center space-x-0.5 ml-2">
                      <span className="w-1 h-2 sm:h-4 bg-orange-400 rounded-full animate-[bounce_1.2s_ease-in-out_infinite] delay-0"></span>
                      <span className="w-1 h-3 sm:h-5 bg-orange-400 rounded-full animate-[bounce_1.2s_ease-in-out_infinite] delay-150"></span>
                      <span className="w-1 h-2 sm:h-3 bg-orange-400 rounded-full animate-[bounce_1.2s_ease-in-out_infinite] delay-300"></span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <style>{`
          @keyframes bounce {
            0%, 100% { transform: scaleY(0.4); }
            50% { transform: scaleY(1.0); }
          }
        `}</style>
    </>
  );
};

export default SongList;
