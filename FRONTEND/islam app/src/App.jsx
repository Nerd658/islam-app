import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';

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
const Arabic = lazy(() => import('./pages/Arabic'));

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
            <Route path="/arabic" element={<Arabic />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
