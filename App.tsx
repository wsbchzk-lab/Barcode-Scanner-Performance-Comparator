
import React, { useState, useCallback } from 'react';
import { LibraryType } from './types.ts';
import Header from './components/Header.tsx';
import Scanner from './components/Scanner.tsx';
import ResultPanel from './components/ResultPanel.tsx';

const App = () => {
  const [selectedLibrary, setSelectedLibrary] = useState(LibraryType.ZXing);
  const [lastResult, setLastResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleResult = useCallback((result, scanTime) => {
    const newResult = { text: result, timestamp: Date.now() };
    setLastResult(newResult);
    setScanHistory(prev => [newResult, ...prev.slice(0, 9)]);
    setLastScanTime(scanTime);
  }, []);

  const handleLibraryChange = (library) => {
    setIsScanning(false);
    setSelectedLibrary(library);
    setLastResult(null);
    setLastScanTime(null);
    // Give time for the old scanner to unmount before starting the new one
    setTimeout(() => setIsScanning(true), 100);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header 
        selectedLibrary={selectedLibrary}
        onLibraryChange={handleLibraryChange}
      />
      <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col items-center">
          <div className="w-full max-w-2xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden relative">
             <Scanner 
                library={selectedLibrary}
                onResult={handleResult}
                isScanning={isScanning}
              />
          </div>
        </div>
        <div className="lg:w-1/3">
          <ResultPanel 
            lastResult={lastResult}
            scanHistory={scanHistory}
            scanTime={lastScanTime}
            library={selectedLibrary}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Point your camera at a barcode to test the selected library.</p>
      </footer>
    </div>
  );
};

export default App;