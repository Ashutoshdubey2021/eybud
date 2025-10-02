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

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onFilesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="flex-shrink-0 bg-transparent p-4 flex justify-between items-center z-10">
      <div className="flex items-center gap-3">
        <FireIcon className="w-8 h-8 text-orange-500" />
        <h1 className="text-2xl font-bold tracking-wider text-white">EYBUD</h1>
      </div>
      <div>
        <input
          type="file"
          accept=".mp3"
          multiple
          onChange={onFilesChange}
          ref={fileInputRef}
          className="hidden"
          id="file-upload"
          aria-hidden="true"
        />
        <button
          onClick={handleAddClick}
          aria-label="Add songs"
          className="bg-orange-600/80 hover:bg-orange-500 text-white font-semibold w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;