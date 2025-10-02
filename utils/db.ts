import { Song } from '../types';

const DB_NAME = 'EYBUD_DB';
const DB_VERSION = 1;
const STORE_NAME = 'songs';

// Stored in IndexedDB (exclude transient props like fileUrl if needed)
type StoredSong = Omit<Song, 'fileUrl'>;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Open or reuse IndexedDB connection
 */
const getDb = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }
  return dbPromise;
};

/**
 * Save multiple songs (insert or update)
 */
export const saveSongsToDB = async (songs: Song[]): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    songs.forEach((song) => {
      // ensure stable id
      if (!song.id) {
        song.id = crypto.randomUUID();
      }
      store.put(song as StoredSong);
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * Get all stored songs
 */
export const getSongsFromDB = async (): Promise<Song[]> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Song[]);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Update a single song
 */
export const updateSongInDB = async (song: Song): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    if (!song.id) {
      song.id = crypto.randomUUID();
    }

    store.put(song as StoredSong);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * Delete a song by id
 */
export const deleteSongFromDB = async (id: string): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * Clear all songs
 */
export const clearSongsFromDB = async (): Promise<void> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
