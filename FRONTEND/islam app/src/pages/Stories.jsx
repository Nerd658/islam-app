import React, { useState } from 'react';
import { BookOpen, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import storiesData from '../data/stories.json';

const Stories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const openStory = (story) => {
    setSelectedStory(story);
    setCurrentChapterIndex(0);
  };

  const closeStory = () => {
    setSelectedStory(null);
    setCurrentChapterIndex(0);
  };

  const nextChapter = () => {
    if (selectedStory && currentChapterIndex < selectedStory.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  if (selectedStory) {
    const chapter = selectedStory.chapters[currentChapterIndex];
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col overflow-hidden text-gray-300">
        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#111]">
          <button 
            onClick={closeStory}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6 mr-2" />
            <span className="text-sm uppercase tracking-wider">Fermer</span>
          </button>
          <div className="text-center flex-1 px-4 truncate">
            <h2 className="text-white font-semibold truncate">{selectedStory.title}</h2>
            <span className="text-xs text-gray-500">Chapitre {currentChapterIndex + 1} / {selectedStory.chapters.length}</span>
          </div>
          <div className="w-16"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-prose mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">{chapter.title}</h3>
            <div className="text-lg leading-relaxed text-gray-300 space-y-6">
              <p>{chapter.content_fr}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-[#333] bg-[#111]">
          <button 
            onClick={prevChapter}
            disabled={currentChapterIndex === 0}
            className={`flex items-center px-4 py-2 rounded ${currentChapterIndex === 0 ? 'text-[#333] cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Précédent
          </button>
          <span className="text-sm text-gray-500">
            {currentChapterIndex + 1} / {selectedStory.chapters.length}
          </span>
          <button 
            onClick={nextChapter}
            disabled={currentChapterIndex === selectedStory.chapters.length - 1}
            className={`flex items-center px-4 py-2 rounded ${currentChapterIndex === selectedStory.chapters.length - 1 ? 'text-[#333] cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}
          >
            Suivant
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Histoires Islamiques</h1>
          <p className="text-gray-400 text-lg">Découvrez les récits inspirants des Prophètes et des pieux prédécesseurs.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storiesData.map((story) => (
            <div 
              key={story.id} 
              className="bg-[#111] border border-[#333] rounded-xl p-6 hover:border-gray-500 transition-colors cursor-pointer flex flex-col h-full"
              onClick={() => openStory(story)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full uppercase tracking-wider">
                  {story.category}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {story.read_time_minutes} min
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 flex-1">{story.title}</h3>
              
              <div className="mt-4 pt-4 border-t border-[#333] flex items-center justify-between text-gray-400 group">
                <span className="text-sm">{story.chapters.length} Chapitres</span>
                <div className="flex items-center text-sm group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lire
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;
