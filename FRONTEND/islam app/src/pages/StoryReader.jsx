import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';

const StoryReader = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError(false);
      try {
        if (type === 'prophets') {
          const res = await fetch(`/data/stories/${slug}.json`);
          if (res.ok) {
            const data = await res.json();
            setStory(data);
          } else {
            setError(true);
          }
        } else if (type === 'scholars') {
          const res = await fetch(`https://stories.api.islamic.network/v1/stories/${slug}`);
          if (res.ok) {
            const data = await res.json();
            setStory(data.data);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Failed to load story", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();
  }, [type, slug]);

  const nextChapter = () => {
    if (story && type === 'prophets' && currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center text-theme-primary">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-theme-text-muted font-medium">Chargement du récit...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center text-red-500">
        <p className="font-medium mb-4">Impossible de charger cette histoire.</p>
        <button onClick={() => navigate('/stories')} className="text-theme-text underline">Retourner aux histoires</button>
      </div>
    );
  }

  if (type === 'prophets') {
    const chapter = story.chapters[currentChapterIndex];
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col overflow-hidden text-theme-text-muted">
        <div className="flex items-center justify-between p-4 border-b border-theme-border bg-theme-surface shadow-sm sticky top-0 z-10">
          <button onClick={() => navigate('/stories')} className="flex items-center text-theme-text-muted hover:text-theme-text transition-colors">
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-sm uppercase tracking-wider font-semibold">Retour</span>
          </button>
          <div className="text-center flex-1 px-4 truncate">
            <h2 className="text-theme-text font-bold truncate">{story.title}</h2>
            <span className="text-xs text-theme-text-muted font-mono">Chapitre {currentChapterIndex + 1} / {story.chapters.length}</span>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-8">
          <div className="max-w-prose mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-8 text-center">{chapter.title}</h3>
            <div className="text-lg leading-relaxed text-theme-text space-y-6">
              {chapter.content_fr.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center justify-between mt-12 pt-6 border-t border-theme-border">
              <button 
                onClick={prevChapter}
                disabled={currentChapterIndex === 0}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${currentChapterIndex === 0 ? 'text-theme-text-muted/30 cursor-not-allowed' : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-hover shadow-sm border border-theme-border'}`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Chapitre Précédent</span>
                <span className="sm:hidden">Précédent</span>
              </button>
              
              <span className="text-xs sm:text-sm text-theme-text-muted font-mono bg-theme-surface-hover px-3 py-1.5 rounded-lg border border-theme-border">
                {currentChapterIndex + 1} / {story.chapters.length}
              </span>
              
              <button 
                onClick={nextChapter}
                disabled={currentChapterIndex === story.chapters.length - 1}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${currentChapterIndex === story.chapters.length - 1 ? 'text-theme-text-muted/30 cursor-not-allowed' : 'text-theme-primary hover:text-emerald-400 hover:bg-theme-primary/10 shadow-sm border border-theme-primary/20'}`}
              >
                <span className="hidden sm:inline">Chapitre Suivant</span>
                <span className="sm:hidden">Suivant</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Scholar story
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col text-theme-text-muted">
        <div className="flex items-center justify-between p-4 border-b border-theme-border bg-theme-surface shadow-sm sticky top-0 z-10">
          <button onClick={() => navigate('/stories')} className="flex items-center text-theme-text-muted hover:text-theme-text transition-colors">
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-sm uppercase tracking-wider font-semibold">Retour</span>
          </button>
          <div className="text-center flex-1 px-4 truncate">
            <h2 className="text-theme-text font-bold truncate">{story.title.en}</h2>
            <span className="text-xs text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded border border-theme-primary/20">Source: Islamic Network</span>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="flex-1 p-6 md:p-12 pb-24">
          <div className="max-w-prose mx-auto">
            <h3 className="text-3xl font-bold text-theme-accent mb-6 text-center">{story.title.en}</h3>
            {story.image && (
              <div className="mb-8 rounded-3xl overflow-hidden border border-theme-border shadow-xl">
                <img src={story.image.url} alt={story.image.alt?.en || "Illustration"} className="w-full h-auto" />
              </div>
            )}
            <div 
              className="text-lg leading-relaxed text-theme-text space-y-6 prose prose-invert prose-emerald"
              dangerouslySetInnerHTML={{ __html: story.body?.en?.html || '<p>Contenu non disponible.</p>' }}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default StoryReader;
