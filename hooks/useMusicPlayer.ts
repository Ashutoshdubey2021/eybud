import { useState, useEffect, useRef, useCallback } from 'react';
import { Song, RepeatMode } from '../types';

export const useMusicPlayer = (
    playlist: Song[], 
    onPlayCountIncrement: (songId: string) => void,
    onDurationChange: (songId: string, duration: number) => void
) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.OFF);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const playedIndexes = useRef<number[]>([]);
  const activeUrlRef = useRef<string | null>(null); // Ref to hold the currently active blob URL
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  // Effect to initialize the audio element once and clean up on unmount
  useEffect(() => {
    const newAudio = new Audio();
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      // Revoke the URL when the component unmounts
      if (activeUrlRef.current) {
        URL.revokeObjectURL(activeUrlRef.current);
      }
    };
  }, []);
  
  const playTrack = useCallback((index: number) => {
    if (audio && index >= 0 && index < playlist.length) {
      if (currentTrackIndex === index) {
        // If the same track is clicked, toggle play/pause
        togglePlayPause();
      } else {
        const track = playlist[index];

        // --- Core Fix: Just-in-time URL generation ---
        // 1. Revoke the old URL if it exists
        if (activeUrlRef.current) {
          URL.revokeObjectURL(activeUrlRef.current);
        }
        // 2. Create a new URL for the selected file
        const newUrl = URL.createObjectURL(track.file);
        activeUrlRef.current = newUrl;
        // 3. Set the audio source to the new, valid URL
        audio.src = newUrl;

        audio.play().then(() => {
          setIsPlaying(true);
          setCurrentTrackIndex(index);
          onPlayCountIncrement(track.id);
          if (isShuffle) {
            // Add to playedIndexes only if it's not already the last one
            if (playedIndexes.current[playedIndexes.current.length - 1] !== index) {
              playedIndexes.current.push(index);
            }
          } else {
             playedIndexes.current = [index];
          }
        }).catch(e => console.error("Error playing audio:", e));
      }
    }
  }, [audio, playlist, currentTrackIndex, onPlayCountIncrement, isShuffle]);

  const togglePlayPause = useCallback(() => {
    if (!audio || currentTrackIndex === null) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Error resuming audio:", e));
    }
  }, [audio, isPlaying, currentTrackIndex]);

  const playNext = useCallback(() => {
    if (!audio || currentTrackIndex === null) return;

    if (repeatMode === RepeatMode.ONE) {
      audio.currentTime = 0;
      audio.play();
      return;
    }

    let nextIndex;
    if (isShuffle) {
        const unplayed = playlist.map((_, i) => i).filter(i => !playedIndexes.current.includes(i));
        if (unplayed.length > 0) {
            nextIndex = unplayed[Math.floor(Math.random() * unplayed.length)];
        } else {
            if (repeatMode === RepeatMode.ALL) {
                playedIndexes.current = [];
                nextIndex = Math.floor(Math.random() * playlist.length);
            } else {
                setIsPlaying(false);
                return;
            }
        }
    } else {
        nextIndex = currentTrackIndex + 1;
        if (nextIndex >= playlist.length) {
            if (repeatMode === RepeatMode.ALL) {
                nextIndex = 0;
            } else {
                setIsPlaying(false);
                return;
            }
        }
    }
    
    if (nextIndex !== undefined) {
      playTrack(nextIndex);
    }
  }, [audio, currentTrackIndex, playlist, repeatMode, isShuffle, playTrack]);

  // Effect to manage audio event listeners. Depends on `playNext` to avoid stale closures.
  useEffect(() => {
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        if (currentTrack && audio.duration) {
            onDurationChange(currentTrack.id, audio.duration);
        }
    };
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, playNext, currentTrack, onDurationChange]);


  const playPrev = useCallback(() => {
    if (!audio || currentTrackIndex === null) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      let prevIndex;
       if (isShuffle) {
         // Pop current track, get previous
         if (playedIndexes.current.length > 1) {
            playedIndexes.current.pop();
            prevIndex = playedIndexes.current[playedIndexes.current.length-1];
         }
       } else {
         prevIndex = currentTrackIndex - 1;
       }

       if (prevIndex !== undefined && prevIndex >= 0) {
         playTrack(prevIndex);
       }
    }
  }, [audio, currentTrackIndex, isShuffle, playTrack]);
  
  const seek = useCallback((time: number) => {
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, [audio]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => (prev + 1) % 3);
  }, []);
  
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
        const turningOn = !prev;
        if (turningOn && currentTrackIndex !== null) {
            playedIndexes.current = [currentTrackIndex];
        }
        return turningOn;
    });
  }, [currentTrackIndex]);

  const jumpToIndex = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentTrackIndex(index);
    }
  }, [playlist.length]);


  // Media Session API integration
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: currentTrack.artwork ? [{ src: currentTrack.artwork }] : [],
      });

      navigator.mediaSession.setActionHandler('play', togglePlayPause);
      navigator.mediaSession.setActionHandler('pause', togglePlayPause);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
    }
  }, [currentTrack, togglePlayPause, playNext, playPrev]);

  return {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    repeatMode,
    isShuffle,
    playTrack,
    togglePlayPause,
    playNext,
    playPrev,
    seek,
    toggleRepeat,
    toggleShuffle,
    jumpToIndex,
  };
};
