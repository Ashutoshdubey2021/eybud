
import React, { useRef } from 'react';

interface HeaderProps {
  onFilesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 18c0-5.523 4.477-10 10-10a.75.75 0 000-1.5 11.25 11.25 0 00-7.537-2.714z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M11.166 21.886A11.25 11.25 0 0021.75 10.5a.75.75 0 00-1.5 0 9.75 9.75 0 01-9.75 9.75.75.75 0 00.666 1.336z"
      clipRule="evenodd"
    />
  </svg>
);

// FIX: Completed the PlusIcon component which was cut off.
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

// FIX: Implemented the Header component and added a default export to fix the import error in App.tsx.
const Header: React.FC<HeaderProps> = ({ onFilesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="relative z-20 flex-shrink-0 flex items-center justify-between p-4 md:px-8">
      <div className="flex items-center gap-2">
        <FireIcon className="w-8 h-8 text-orange-500" />
        <h1 className="text-xl font-bold tracking-tight text-white">EYEBUD</h1>
      </div>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFilesChange}
          className="hidden"
          accept="audio/*,.mp3"
          multiple
        />
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center w-10 h-10 bg-gray-800/80 hover:bg-gray-700/70 rounded-full transition-colors"
          aria-label="Add songs"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
