import { Song } from '../types';

// jsmediatags is loaded from a CDN, so we declare it globally for TypeScript
declare const jsmediatags: any;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const readSongMetadata = (file: File): Promise<Song | null> => {
  return new Promise((resolve) => {
    const processMetadata = (tags: any = {}) => {
      const { title, artist, album, picture } = tags;
      
      let artwork: string | null = null;
      if (picture) {
        const base64String = arrayBufferToBase64(picture.data);
        artwork = `data:${picture.format};base64,${base64String}`;
      }
      
      const song: Song = {
        id: `${file.name}-${file.lastModified}-${file.size}`,
        file: file,
        title: title || file.name.replace(/\.mp3$/i, ''),
        artist: artist || 'Unknown Artist',
        album: album || 'Unknown Album',
        artwork,
        playCount: 0,
        duration: 0, // Duration is unknown initially, will be updated on first play
        dateAdded: Date.now(),
        isFavorite: false,
      };
      resolve(song);
    };

    jsmediatags.read(file, {
      onSuccess: (tag: any) => {
        processMetadata(tag.tags);
      },
      onError: (error: any) => {
        console.warn(`Could not read MP3 tags for file "${file.name}". It may not contain them.`, error);
        // Fallback for files without tags
        processMetadata();
      }
    });
  });
};
