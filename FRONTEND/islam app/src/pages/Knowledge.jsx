import React, { useState } from 'react';
import { BookOpen, Droplets, Heart, ExternalLink, PlaySquare, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import knowledgeData from '../data/knowledge.json';

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState('ablutions');
  const [expandedSteps, setExpandedSteps] = useState({});

  const toggleAccordion = (id) => {
    setExpandedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-4 pb-20 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center p-4 bg-[#111] rounded-full border border-[#333] shadow-lg">
            <BookOpen className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Savoir & Ressources</h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            Apprenez les bases de votre religion et découvrez des ressources fiables.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveTab('ablutions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium ${
              activeTab === 'ablutions'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#111] border-[#333] text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Droplets className="w-5 h-5" />
            Ablutions
          </button>
          <button
            onClick={() => setActiveTab('priere')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium ${
              activeTab === 'priere'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#111] border-[#333] text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            Prière
          </button>
          <button
            onClick={() => setActiveTab('ressources')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium ${
              activeTab === 'ressources'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#111] border-[#333] text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <ExternalLink className="w-5 h-5" />
            Ressources
          </button>
        </div>

        <div className="bg-[#111] border border-[#333] rounded-3xl p-6 md:p-8 shadow-2xl">
          {activeTab === 'ablutions' && (
            <div className="space-y-6">
              {knowledgeData.ablutions.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} isExpanded={expandedSteps[tutorial.id]} onToggle={() => toggleAccordion(tutorial.id)} />
              ))}
            </div>
          )}

          {activeTab === 'priere' && (
            <div className="space-y-6">
              {knowledgeData.priere.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} isExpanded={expandedSteps[tutorial.id]} onToggle={() => toggleAccordion(tutorial.id)} />
              ))}
            </div>
          )}

          {activeTab === 'ressources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeData.ressources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[#0a0a0a] border border-[#333] rounded-2xl p-5 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#111] rounded-xl text-emerald-400 border border-[#222] group-hover:border-emerald-500/30 transition-colors">
                        {resource.type === 'YouTube' ? <PlaySquare className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{resource.title}</h3>
                        <span className="text-xs font-medium text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TutorialCard = ({ tutorial, isExpanded, onToggle }) => {
  return (
    <div className="bg-[#0a0a0a] border border-[#333] rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-[#111] transition-colors text-left"
      >
        <h3 className="text-xl font-semibold text-white">{tutorial.title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-5 pt-2 border-t border-[#222]">
          <div className="relative border-l-2 border-[#333] ml-3 space-y-6 mt-4">
            {tutorial.steps.map((step, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#111] border-2 border-emerald-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-sm md:text-base text-gray-300 bg-[#111] border border-[#222] p-4 rounded-xl shadow-sm">
                  <span className="font-semibold text-emerald-400 mr-2">Étape {index + 1}:</span>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Knowledge;
