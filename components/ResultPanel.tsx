
import React from 'react';

const ResultPanel = ({ lastResult, scanHistory, scanTime, library }) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-lg shadow-xl p-6 space-y-6 h-full">
      <div>
        <h2 className="text-sm font-semibold text-cyan-400 mb-2">LAST SCAN RESULT</h2>
        <div className="bg-gray-700 p-4 rounded-lg min-h-[80px] flex items-center justify-center">
          {lastResult ? (
            <p className="text-xl font-mono break-all text-center text-green-300">{lastResult.text}</p>
          ) : (
            <p className="text-gray-400">Waiting for scan...</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-cyan-400 mb-2">PERFORMANCE</h2>
        <div className="bg-gray-700 p-4 rounded-lg flex justify-around text-center">
            <div>
                <span className="text-xs text-gray-400">Scan Time</span>
                <p className="text-2xl font-bold text-green-300">
                    {scanTime ? `${scanTime.toFixed(0)} ms` : '-'}
                </p>
            </div>
            <div>
                <span className="text-xs text-gray-400">Library</span>
                <p className="text-2xl font-bold">{library}</p>
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-cyan-400 mb-2">SCAN HISTORY</h2>
        <div className="bg-gray-700 p-4 rounded-lg">
          {scanHistory.length > 0 ? (
            <ul className="space-y-2">
              {scanHistory.map((item) => (
                <li key={item.timestamp} className="flex justify-between items-center bg-gray-600/50 p-2 rounded">
                  <span className="font-mono text-sm break-all">{item.text}</span>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">No scans yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
