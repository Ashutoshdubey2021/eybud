import React from 'react';

type View = 'all' | 'favorites';

interface ViewNavigatorProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewNavigator: React.FC<ViewNavigatorProps> = ({ currentView, onViewChange }) => {
  const getButtonClass = (view: View) => {
    const baseClass = "px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300";
    if (currentView === view) {
      return `${baseClass} bg-orange-600 text-white`;
    }
    return `${baseClass} bg-transparent text-gray-300 hover:bg-gray-800`;
  };

  return (
    <div className="px-4 md:px-8 pb-4">
      <div className="bg-gray-900/80 p-1 rounded-full flex items-center w-max">
        <button onClick={() => onViewChange('all')} className={getButtonClass('all')}>
          Library
        </button>
        <button onClick={() => onViewChange('favorites')} className={getButtonClass('favorites')}>
          Favorites
        </button>
      </div>
    </div>
  );
};

export default ViewNavigator;
