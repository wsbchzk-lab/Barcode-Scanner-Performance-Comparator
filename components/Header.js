import React from 'react';
import { LibraryType } from '../types.js';

const Header = ({ selectedLibrary, onLibraryChange }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400 mb-3 sm:mb-0">
          Barcode Scanner Comparator
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Test Library:</span>
          <div className="flex gap-4 rounded-lg p-1 bg-gray-700">
            {(Object.values(LibraryType)).map((lib) => (
              <button
                key={lib}
                onClick={() => onLibraryChange(lib)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedLibrary === lib
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                {lib}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;