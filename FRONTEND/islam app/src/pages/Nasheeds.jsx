import React, { useState } from 'react';
import nasheedsData from '../data/nasheeds.json';
import { Play, X, Music, CheckCircle } from 'lucide-react';

export default function Nasheeds() {
  const [vocalOnly, setVocalOnly] = useState(false);
  const [activeNasheed, setActiveNasheed] = useState(null);

  const filteredNasheeds = vocalOnly
    ? nasheedsData.filter(n => n.isVocalOnly)
    : nasheedsData;

  const closeModal = () => {
    setActiveNasheed(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Nasheeds (Anachid)</h1>
          <p className="text-gray-400 mb-6">Écoutez une sélection de chants islamiques inspirants.</p>
          
          <button
            onClick={() => setVocalOnly(!vocalOnly)}
            className={`flex items-center px-4 py-2 rounded-full border border-[#333] transition-colors ${vocalOnly ? 'bg-[#333] text-white' : 'bg-[#111] text-gray-400 hover:bg-[#333] hover:text-white'}`}
          >
            {vocalOnly ? <CheckCircle className="w-4 h-4 mr-2" /> : <Music className="w-4 h-4 mr-2" />}
            Vocal Only (Sans instruments)
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNasheeds.map((nasheed) => (
            <div
              key={nasheed.id}
              onClick={() => setActiveNasheed(nasheed)}
              className="bg-[#111] border border-[#333] rounded-xl p-5 cursor-pointer hover:border-gray-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold group-hover:text-gray-300 transition-colors">{nasheed.title}</h3>
                  <div className="bg-[#333] p-2 rounded-full group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-gray-400">{nasheed.artist}</p>
              </div>
              {nasheed.isVocalOnly && (
                <span className="inline-block mt-4 text-xs bg-[#333] text-gray-300 px-2 py-1 rounded w-max">
                  Sans instruments
                </span>
              )}
            </div>
          ))}
        </div>

        {activeNasheed && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-3xl overflow-hidden relative shadow-2xl">
              <div className="p-4 flex justify-between items-center border-b border-[#333]">
                <div>
                  <h3 className="text-lg font-bold">{activeNasheed.title}</h3>
                  <p className="text-sm text-gray-400">{activeNasheed.artist}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-[#333] rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeNasheed.youtubeId}?autoplay=1`}
                  title={activeNasheed.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
