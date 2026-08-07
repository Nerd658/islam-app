import React, { useState, useRef, useEffect } from 'react';
import nasheedsData from '../data/nasheeds.json';
import { Play, Pause, X, Music, CheckCircle, Disc3 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Nasheeds() {
  const [vocalOnly, setVocalOnly] = useState(false);
  const [activeNasheed, setActiveNasheed] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const filteredNasheeds = vocalOnly
    ? nasheedsData.filter(n => n.isVocalOnly)
    : nasheedsData;

  const handlePlayNasheed = (nasheed) => {
    if (activeNasheed?.id === nasheed.id) {
        togglePlay();
    } else {
        setActiveNasheed(nasheed);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (activeNasheed && audioRef.current) {
      audioRef.current.src = activeNasheed.audioUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error('Playback error', e);
        setIsPlaying(false);
      });
    }
  }, [activeNasheed]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    setActiveNasheed(null);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="pt-8 px-4 max-w-6xl mx-auto pb-32">
      <PageHeader 
        icon={<Music size={32} />}
        title="Nasheeds"
        subtitle="Écoutez une sélection de chants islamiques inspirants."
      />
      
      <div className="flex justify-start mb-8">
        <button
          onClick={() => setVocalOnly(!vocalOnly)}
          className={`flex items-center px-5 py-2.5 rounded-full border transition-all font-bold text-sm shadow-sm ${
            vocalOnly 
                ? 'bg-theme-primary border-theme-primary text-black' 
                : 'bg-theme-surface border-theme-border text-theme-text-muted hover:text-theme-text'
          }`}
        >
          {vocalOnly ? <CheckCircle className="w-4 h-4 mr-2" /> : <Music className="w-4 h-4 mr-2" />}
          Vocal Only (Sans instruments)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNasheeds.map((nasheed) => {
          const isActive = activeNasheed?.id === nasheed.id;
          return (
            <div
              key={nasheed.id}
              onClick={() => handlePlayNasheed(nasheed)}
              className={`bg-theme-surface border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group ${
                  isActive ? 'border-theme-primary shadow-lg shadow-theme-primary/10' : 'border-theme-border hover:border-theme-text-muted/50'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-theme-primary' : 'text-theme-text group-hover:text-theme-primary'}`}>
                    {nasheed.title}
                  </h3>
                  <div className={`p-3 rounded-full transition-transform ${isActive && isPlaying ? 'bg-theme-primary text-black' : 'bg-theme-bg text-theme-text-muted group-hover:bg-theme-primary/10 group-hover:text-theme-primary'}`}>
                    {isActive && isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
                  </div>
                </div>
                <p className="text-theme-text-muted">{nasheed.artist}</p>
              </div>
              {nasheed.isVocalOnly && (
                <span className="inline-block mt-4 text-xs font-bold bg-theme-bg border border-theme-border text-theme-text-muted px-3 py-1.5 rounded-full w-max">
                  Sans instruments
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Sticky Bottom Player */}
      {activeNasheed && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-theme-surface border-t border-theme-border p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-10">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-theme-primary transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
          
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-theme-bg border border-theme-border rounded-xl flex items-center justify-center shrink-0">
                    <Disc3 size={24} className={`text-theme-primary ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-theme-text font-bold text-sm sm:text-base truncate">{activeNasheed.title}</h4>
                    <p className="text-theme-text-muted text-xs sm:text-sm truncate">{activeNasheed.artist}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-theme-primary hover:brightness-110 text-black rounded-full flex items-center justify-center shadow-lg shadow-theme-primary/20 transition-all active:scale-95"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                    onClick={closePlayer}
                    className="w-10 h-10 bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-text-muted hover:text-white rounded-full flex items-center justify-center transition-all"
                    title="Fermer le lecteur"
                >
                    <X size={18} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
