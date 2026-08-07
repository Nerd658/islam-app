import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Stories = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prophets');
  
  const [prophetStories, setProphetStories] = useState([]);
  const [scholarStories, setScholarStories] = useState([]);
  
  const [loadingList, setLoadingList] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchIndexes = async () => {
      setLoadingList(true);
      try {
        const [prophetsRes, scholarsRes] = await Promise.all([
          fetch('/data/stories/index.json'),
          fetch('https://stories.api.islamic.network/v1/stories')
        ]);
        
        if (prophetsRes.ok) {
          const data = await prophetsRes.json();
          setProphetStories(data);
        }
        if (scholarsRes.ok) {
          const data = await scholarsRes.json();
          setScholarStories(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch stories", err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchIndexes();
  }, []);

  const currentList = activeTab === 'prophets' ? prophetStories : scholarStories;
  const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE);
  const paginatedList = currentList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pb-24 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        <PageHeader 
            icon={<BookOpen size={32} />} 
            title="Histoires & Récits" 
            subtitle="Découvrez les récits inspirants des Prophètes et des pieux prédécesseurs." 
        />

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-theme-surface p-1.5 rounded-xl border border-theme-border inline-flex shadow-sm">
            <button
              onClick={() => { setActiveTab('prophets'); setCurrentPage(1); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'prophets' ? 'bg-theme-surface-hover text-theme-text shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
            >
              Les Prophètes (FR)
            </button>
            <button
              onClick={() => { setActiveTab('scholars'); setCurrentPage(1); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'scholars' ? 'bg-theme-surface-hover text-theme-text shadow-sm border border-theme-border' : 'text-theme-text-muted hover:text-theme-text'}`}
            >
              Les Savants (EN)
            </button>
          </div>
        </div>

        {loadingList ? (
          <div className="flex flex-col items-center justify-center py-20 text-theme-primary">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-theme-text-muted text-sm">Chargement du catalogue...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'prophets' && paginatedList.map((story) => (
                <div 
                  key={story.id} 
                  className="bg-theme-surface border border-theme-border rounded-3xl p-6 hover:border-theme-primary/50 transition-all cursor-pointer flex flex-col h-full group shadow-lg hover:shadow-theme-primary/10"
                  onClick={() => navigate(`/stories/prophets/${story.slug}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1.5 bg-theme-primary/10 text-theme-primary border border-theme-primary/20 text-[10px] rounded-lg uppercase tracking-widest font-bold">
                      {story.category}
                    </span>
                    <div className="flex items-center text-theme-text-muted text-sm font-medium">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {story.read_time_minutes} min
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-theme-text mb-3 flex-1 group-hover:text-theme-primary transition-colors">{story.title}</h3>
                  
                  <div className="mt-4 pt-4 border-t border-theme-border flex items-center justify-between text-theme-text-muted">
                    <span className="text-xs font-mono font-semibold">{story.chapter_count} Chapitres</span>
                    <div className="flex items-center text-sm font-bold group-hover:text-theme-primary transition-colors">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Lire
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'scholars' && paginatedList.map((story) => (
                <div 
                  key={story.slug} 
                  className="bg-theme-surface border border-theme-border rounded-3xl p-6 hover:border-theme-accent/50 transition-all cursor-pointer flex flex-col h-full group overflow-hidden relative shadow-lg hover:shadow-theme-accent/10"
                  onClick={() => navigate(`/stories/scholars/${story.slug}`)}
                >
                  {story.image && (
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img src={story.image.url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1.5 bg-theme-accent/10 text-theme-accent border border-theme-accent/20 text-[10px] rounded-lg uppercase tracking-widest font-bold">
                        Sufi Lands
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-theme-text mb-2 flex-1 group-hover:text-theme-accent transition-colors">{story.title.en}</h3>
                    <p className="text-sm text-theme-text-muted line-clamp-2 mb-4 leading-relaxed">{story.description?.en}</p>
                    
                    <div className="mt-auto pt-4 border-t border-theme-border flex items-center justify-between text-theme-text-muted">
                      <span className="text-[10px] text-theme-accent/70 font-mono uppercase tracking-widest">Islamic.Network</span>
                      <div className="flex items-center text-sm font-bold group-hover:text-theme-accent transition-colors">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'bg-theme-surface border-theme-border text-theme-text-muted/30 cursor-not-allowed' : 'bg-theme-surface-hover border-theme-border text-theme-text hover:text-theme-primary shadow-sm'}`}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-theme-text-muted font-mono bg-theme-surface px-4 py-2 rounded-xl border border-theme-border">
                  Page {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'bg-theme-surface border-theme-border text-theme-text-muted/30 cursor-not-allowed' : 'bg-theme-surface-hover border-theme-border text-theme-text hover:text-theme-primary shadow-sm'}`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stories;
