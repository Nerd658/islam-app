import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import ReloadPrompt from './components/ReloadPrompt';

const Home = lazy(() => import('./pages/Home'));
const Goals = lazy(() => import('./pages/Goals'));
const Adhkar = lazy(() => import('./pages/Adhkar'));
const Quran = lazy(() => import('./pages/Quran'));
const Tasbih = lazy(() => import('./pages/Tasbih'));
const Events = lazy(() => import('./pages/Events'));
const Chat = lazy(() => import('./pages/Chat'));
const Names = lazy(() => import('./pages/Names'));
const Qibla = lazy(() => import('./pages/Qibla'));
const Hadiths = lazy(() => import('./pages/Hadiths'));
const Wird = lazy(() => import('./pages/Wird'));
const Memorization = lazy(() => import('./pages/Memorization'));

// Dedicated Standalone Arabic Sub-pages
const ArabicAlphabet = lazy(() => import('./pages/arabic/ArabicAlphabet'));
const ArabicVocabulary = lazy(() => import('./pages/arabic/ArabicVocabulary'));
const ArabicTajweed = lazy(() => import('./pages/arabic/ArabicTajweed'));
const ArabicQuiz = lazy(() => import('./pages/arabic/ArabicQuiz'));
const ArabicGrammar = lazy(() => import('./pages/arabic/ArabicGrammar'));

function App() {
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-black text-gray-100 font-sans selection:bg-gray-800 selection:text-white'>
      <Navigation />
      <div className="flex-grow overflow-y-auto pb-24 md:pb-0 md:ml-64 custom-scrollbar w-full">
        <Suspense fallback={
          <div className="flex justify-center items-center h-screen text-gray-400 font-medium">
            Chargement...
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/adhkar" element={<Adhkar />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/tasbih" element={<Tasbih />} />
            <Route path="/events" element={<Events />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/names" element={<Names />} />
            <Route path="/qibla" element={<Qibla />} />
            <Route path="/hadiths" element={<Hadiths />} />
            <Route path="/wird" element={<Wird />} />
            <Route path="/memorization" element={<Memorization />} />

            {/* Arabic Dedicated Standalone Routes */}
            <Route path="/arabic" element={<Navigate to="/arabic/alphabet" replace />} />
            <Route path="/arabic/alphabet" element={<ArabicAlphabet />} />
            <Route path="/arabic/vocabulary" element={<ArabicVocabulary />} />
            <Route path="/arabic/tajweed" element={<ArabicTajweed />} />
            <Route path="/arabic/quiz" element={<ArabicQuiz />} />
            <Route path="/arabic/grammar" element={<ArabicGrammar />} />
          </Routes>
        </Suspense>
      </div>
      <ReloadPrompt />
    </div>
  );
}

export default App;
