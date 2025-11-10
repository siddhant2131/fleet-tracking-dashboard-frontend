import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

const PlaybackControls = ({ isPlaying, playbackSpeed, onTogglePlayback, onChangeSpeed, onReset }) => {
  const speeds = [1, 5, 10];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Playback Controls
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onTogglePlayback}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
        <div className="flex gap-2 ml-auto">
          <span className="text-sm text-gray-600 flex items-center mr-2">Speed:</span>
          {speeds.map(speed => (
            <button
              key={speed}
              onClick={() => onChangeSpeed(speed)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                playbackSpeed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;