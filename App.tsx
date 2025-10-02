import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Song } from './types';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import Header from './components/Header';
import SongList from './components/SongList';
import PlayerControls from './components/PlayerControls';
import ViewNavigator from './components/ViewNavigator';
import { readSongMetadata } from './utils/audioUtils';
import { getSongsFromDB, saveSongsToDB, updateSongInDB } from './utils/db';


type SortCriteria = 'playCount' | 'title' | 'artist' | 'dateAdded';
type View = 'all' | 'favorites';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('playCount');
  const [currentView, setCurrentView] = useState<View>('all');

  // Effect to load songs from IndexedDB on initial app load
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const songsFromDb = await getSongsFromDB();
        setSongs(songsFromDb);
      } catch (error) {
        console.error("Failed to load songs from IndexedDB:", error);
      }
    };
    loadSongs();
  }, []);
  
  // Removed the useEffect that revoked blob URLs, as this is now handled within useMusicPlayer.

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = [...songs];
    const existingSongIds = new Set(songs.map(s => s.id));

    for (const file of Array.from(files)) {
      // FIX: Changed check from file.type to file extension for better mobile compatibility
      if (file.name.toLowerCase().endsWith('.mp3')) {
        const songData = await readSongMetadata(file);
        if (songData && !existingSongIds.has(songData.id)) {
          newSongs.push(songData);
          existingSongIds.add(songData.id);
        }
      }
    }
    
    // If new songs were added, update state and save to DB
    if (newSongs.length > songs.length) {
      setSongs(newSongs);
      try {
        await saveSongsToDB(newSongs);
      } catch (error) {
        console.error("Failed to save songs to database:", error);
      }
    }
  };
  
  const handleIncrementPlayCount = useCallback((songId: string) => {
      setSongs(currentSongs => {
        let songToUpdate: Song | undefined;
        const updatedSongs = currentSongs.map(song => {
           if (song.id === songId) {
                songToUpdate = { ...song, playCount: song.playCount + 1 };
                return songToUpdate;
           }
           return song;
        });

        if (songToUpdate) {
            updateSongInDB(songToUpdate).catch(error => {
                console.error("Failed to update play count in DB:", error);
            });
        }
        
        return updatedSongs;
      });
  }, []);

  const handleToggleFavorite = useCallback((songId: string) => {
    setSongs(currentSongs => {
      let songToUpdate: Song | undefined;
      const updatedSongs = currentSongs.map(song => {
        if (song.id === songId) {
          songToUpdate = { ...song, isFavorite: !song.isFavorite };
          return songToUpdate;
        }
        return song;
      });

      if (songToUpdate) {
        updateSongInDB(songToUpdate).catch(error => {
          console.error("Failed to update favorite status in DB:", error);
        });
      }

      return updatedSongs;
    });
  }, []);
  
    const handleDurationChange = useCallback((songId: string, duration: number) => {
        setSongs(currentSongs => {
            let songToUpdate: Song | undefined;
            const updatedSongs = currentSongs.map(song => {
                // Update duration only if it was 0 before, to avoid unnecessary updates
                if (song.id === songId && song.duration === 0) {
                    songToUpdate = { ...song, duration };
                    return songToUpdate;
                }
                return song;
            });

            if (songToUpdate) {
                updateSongInDB(songToUpdate).catch(error => {
                    console.error("Failed to update duration in DB:", error);
                });
                return updatedSongs; // Return the new array if an update happened
            }
            
            return currentSongs; // Return the original array if no update
        });
    }, []);

  const displayedSongs = useMemo(() => {
    const filteredSongs = currentView === 'favorites' ? songs.filter(s => s.isFavorite) : songs;
    
    return [...filteredSongs].sort((a, b) => {
      switch (sortCriteria) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'dateAdded':
          return b.dateAdded - a.dateAdded;
        case 'playCount':
        default:
          return b.playCount - a.playCount;
      }
    });
  }, [songs, sortCriteria, currentView]);

  const player = useMusicPlayer(displayedSongs, handleIncrementPlayCount, handleDurationChange);

  // Sync player index if sorting or filtering changes while a song is playing
  useEffect(() => {
    if (player.currentTrack && player.jumpToIndex) {
      const newIndex = displayedSongs.findIndex(s => s.id === player.currentTrack.id);
      if (newIndex !== -1) {
        player.jumpToIndex(newIndex);
      } else {
        // If the current track is no longer in the visible list (e.g., unfavorited from favorites view)
        // A more advanced implementation might pause or stop playback. For now, we just desync.
      }
    }
  }, [displayedSongs, player.currentTrack, player.jumpToIndex]);


  const handleShufflePlay = useCallback(() => {
    if(displayedSongs.length === 0) return;
    if (!player.isShuffle) {
      player.toggleShuffle();
    }
    const randomIndex = Math.floor(Math.random() * displayedSongs.length);
    player.playTrack(randomIndex);
    setIsPlayerExpanded(true);
  }, [displayedSongs.length, player]);

  const currentArtwork = player.currentTrack?.artwork || null;

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: currentArtwork ? `url(${currentArtwork})` : 'none', 
          opacity: currentArtwork ? 0.1 : 0,
          filter: 'blur(16px)',
          transform: 'scale(1.1)'
        }}
        key={currentArtwork}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />

      <div className="relative z-10 flex flex-col h-screen">
        <Header onFilesChange={handleFilesChange} />
        <ViewNavigator currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-grow overflow-y-auto" style={{ paddingBottom: player.currentTrack ? '7rem' : '1rem' }}>
          <SongList 
            songs={displayedSongs} 
            onPlay={(index) => {
              player.playTrack(index);
              setIsPlayerExpanded(true);
            }} 
            currentTrackId={player.currentTrack?.id} 
            isPlaying={player.isPlaying}
            onSortChange={setSortCriteria}
            onShufflePlay={handleShufflePlay}
            onToggleFavorite={handleToggleFavorite}
            isFavoritesView={currentView === 'favorites'}
          />
        </main>
        
        <div className={`fixed bottom-0 left-0 right-0 z-20 transition-transform duration-500 ease-in-out ${isPlayerExpanded || !player.currentTrack ? 'translate-y-full' : 'translate-y-0'}`}>
           <PlayerControls
              currentTrack={player.currentTrack}
              isPlaying={player.isPlaying}
              currentTime={player.currentTime}
              duration={player.duration}
              onPlayPause={player.togglePlayPause}
              onNext={player.playNext}
              onPrev={player.playPrev}
              onSeek={player.seek}
              repeatMode={player.repeatMode}
              onToggleRepeat={player.toggleRepeat}
              isShuffle={player.isShuffle}
              onToggleShuffle={player.toggleShuffle}
              isExpanded={false}
              onToggleExpand={() => setIsPlayerExpanded(true)}
              onToggleFavorite={handleToggleFavorite}
            />
        </div>
        
        {/* Fullscreen Player Modal */}
        {isPlayerExpanded && player.currentTrack && (
            <PlayerControls
              currentTrack={player.currentTrack}
              isPlaying={player.isPlaying}
              currentTime={player.currentTime}
              duration={player.duration}
              onPlayPause={player.togglePlayPause}
              onNext={player.playNext}
              onPrev={player.playPrev}
              onSeek={player.seek}
              repeatMode={player.repeatMode}
              onToggleRepeat={player.toggleRepeat}
              isShuffle={player.isShuffle}
              onToggleShuffle={player.toggleShuffle}
              isExpanded={true}
              onToggleExpand={() => setIsPlayerExpanded(false)}
              onToggleFavorite={handleToggleFavorite}
            />
        )}
      </div>
    </div>
  );
};

export default App;
