import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Adhkar from './pages/Adhkar';
import Quran from './pages/Quran';
import Tasbih from './pages/Tasbih';

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white'>
      <div className="flex-grow overflow-y-auto pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adhkar" element={<Adhkar />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/tasbih" element={<Tasbih />} />
        </Routes>
      </div>
      <Navigation />
    </div>
  );
}

export default App;
