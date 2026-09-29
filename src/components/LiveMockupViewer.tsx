import React from 'react';
import { ExternalLink, X, Monitor, Smartphone } from 'lucide-react';

interface LiveMockupViewerProps {
  businessName: string;
  websiteUrl: string;
  onClose: () => void;
}

export const LiveMockupViewer: React.FC<LiveMockupViewerProps> = ({ businessName, websiteUrl, onClose }) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Modal Header */}
        <div className="bg-emerald-950 text-emerald-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">Live Client Mockup: {businessName}</h3>
            <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline flex items-center space-x-1">
              <span>{websiteUrl}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-emerald-900/80 p-1 rounded-xl flex items-center space-x-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'desktop' ? 'bg-emerald-700 text-white' : 'text-emerald-300'}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'mobile' ? 'bg-emerald-700 text-white' : 'text-emerald-300'}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-emerald-900/50 hover:bg-emerald-800 rounded-xl text-emerald-200 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mockup Frame Preview Container */}
        <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center overflow-auto">
          <div className={`bg-white rounded-xl shadow-inner border border-gray-300 transition-all duration-300 overflow-hidden ${
            viewMode === 'desktop' ? 'w-full h-full' : 'w-[380px] h-[650px]'
          }`}>
            <iframe
              src={websiteUrl}
              title={businessName}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

      </div>
    </div>
  );
};