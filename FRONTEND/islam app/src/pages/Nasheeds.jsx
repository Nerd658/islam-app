import React, { useState } from 'react';
import nasheedsData from '../data/nasheeds.json';
import { Play, X, Music, CheckCircle, Video, BookOpen, Layers } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Nasheeds() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [vocalOnly, setVocalOnly] = useState(false);
  const [activeNasheed, setActiveNasheed] = useState(null);

  const filteredNasheeds = nasheedsData.filter(n => {
    if (activeCategory !== 'Tous' && n.category !== activeCategory) return false;
    if (vocalOnly && !n.isVocalOnly) return false;
    return true;
  });

  const closeModal = () => {
    setActiveNasheed(null);
  };

  return (
    <div className="pt-8 px-4 max-w-6xl mx-auto pb-24">
      <PageHeader 
        icon={<Video size={32} />}
        title="Médiathèque Islamique"
        subtitle="Vidéos, Nasheeds et rappels inspirants (YouTube)."
      />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex bg-theme-surface border border-theme-border rounded-xl p-1 shadow-sm overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory('Tous')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeCategory === 'Tous' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Layers size={16} /> Tous
          </button>
          <button
            onClick={() => setActiveCategory('Nasheed')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeCategory === 'Nasheed' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <Music size={16} /> Nasheeds
          </button>
          <button
            onClick={() => setActiveCategory('Rappel')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeCategory === 'Rappel' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            <BookOpen size={16} /> Rappels
          </button>
        </div>

        {/* Vocal Only Filter (Only relevant for Nasheeds) */}
        {(activeCategory === 'Tous' || activeCategory === 'Nasheed') && (
            <button
            onClick={() => setVocalOnly(!vocalOnly)}
            className={`flex items-center px-4 py-2.5 rounded-xl border transition-all font-bold text-sm shadow-sm ${
                vocalOnly 
                    ? 'bg-theme-surface border-theme-primary text-theme-primary' 
                    : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
            }`}
            >
            {vocalOnly ? <CheckCircle className="w-4 h-4 mr-2" /> : <Music className="w-4 h-4 mr-2" />}
            Vocal Only
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNasheeds.map((nasheed) => (
          <div
            key={nasheed.id}
            onClick={() => setActiveNasheed(nasheed)}
            className="bg-theme-surface border border-theme-border rounded-2xl p-5 cursor-pointer hover:border-theme-primary/50 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-theme-text group-hover:text-theme-primary transition-colors pr-4 leading-tight">
                  {nasheed.title}
                </h3>
                <div className="bg-theme-bg border border-theme-border text-theme-primary p-3 rounded-full group-hover:bg-theme-primary group-hover:text-black transition-all shrink-0">
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                </div>
              </div>
              <p className="text-theme-text-muted font-medium">{nasheed.artist}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-6">
                <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border ${
                    nasheed.category === 'Rappel' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                    {nasheed.category}
                </span>
                {nasheed.isVocalOnly && (
                    <span className="inline-block text-xs font-bold bg-theme-bg border border-theme-border text-theme-text-muted px-3 py-1.5 rounded-full">
                    Sans instruments
                    </span>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* YouTube Video Modal */}
      {activeNasheed && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className="bg-theme-surface border border-theme-border rounded-3xl w-full max-w-4xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 flex justify-between items-center border-b border-theme-border bg-theme-bg/50">
              <div>
                <h3 className="text-xl font-bold text-theme-text">{activeNasheed.title}</h3>
                <p className="text-sm font-medium text-theme-primary">{activeNasheed.artist}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 bg-theme-bg hover:bg-red-500/20 hover:text-red-400 border border-theme-border rounded-full transition-all"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative pt-[56.25%] w-full bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeNasheed.youtubeId}?autoplay=1&rel=0`}
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
  );
}
