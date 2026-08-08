import React, { useState } from 'react';
import { 
  BookOpen, Key, Clock, Coins, Moon, Globe, Heart, 
  Feather, Book, Users, Scale, Compass, Star, 
  Handshake, ArrowDownCircle, CheckSquare, Gem, ShieldCheck 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import fundamentalsData from '../data/fundamentals.json';

const iconMap = {
  Key, Clock, Coins, Moon, Globe, Heart, Feather, Book, 
  Users, Scale, Compass, Star, Handshake, ArrowDownCircle, 
  CheckSquare, Gem, ShieldCheck, BookOpen
};

export default function Fundamentals() {
  const [activeTab, setActiveTab] = useState('islam'); // 'islam', 'iman', 'ihsan', 'shahada'

  const currentData = 
    activeTab === 'islam' ? fundamentalsData.islam_pillars :
    activeTab === 'iman' ? fundamentalsData.iman_pillars :
    activeTab === 'ihsan' ? fundamentalsData.ihsan_pillars :
    fundamentalsData.shahada_conditions;

  return (
    <div className="pt-8 px-4 max-w-6xl mx-auto pb-24">
      <PageHeader 
        icon={<BookOpen size={32} />} 
        title="Fondements & Croyance" 
        subtitle="Les piliers de l'Islam (actes) et de la Foi (croyance) authentiques." 
      />

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row flex-wrap bg-theme-surface border border-theme-border rounded-xl p-1 mb-8 max-w-4xl mx-auto gap-1">
        <button
          onClick={() => setActiveTab('islam')}
          className={`flex-1 min-w-[140px] py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'islam' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          L'Islam (5)
        </button>
        <button
          onClick={() => setActiveTab('iman')}
          className={`flex-1 min-w-[140px] py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'iman' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          La Foi (6)
        </button>
        <button
          onClick={() => setActiveTab('ihsan')}
          className={`flex-1 min-w-[140px] py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'ihsan' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          L'Excellence (1)
        </button>
        <button
          onClick={() => setActiveTab('shahada')}
          className={`flex-1 min-w-[140px] py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'shahada' ? 'bg-theme-primary text-black shadow-md' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          Conditions Chahada (7)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.map((item) => {
          const IconComponent = iconMap[item.icon] || BookOpen;
          return (
            <div key={item.id} className="bg-theme-surface border border-theme-border rounded-2xl p-6 flex flex-col h-full hover:border-theme-primary/30 transition-colors shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-theme-bg rounded-xl text-theme-primary border border-theme-border">
                  <IconComponent size={24} />
                </div>
                <span className="font-arabic text-3xl text-theme-text-muted opacity-30 select-none">
                  {item.arabic}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {item.id}
                </span>
                <h3 className="text-lg font-bold text-theme-text">{item.title}</h3>
              </div>
              
              <p className="text-theme-text-muted text-sm leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>
              
              <div className="bg-theme-bg/50 border-l-2 border-theme-primary p-3 rounded-r-lg mt-auto">
                <p className="text-xs text-theme-text-muted italic leading-relaxed font-medium">
                  {item.source}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
