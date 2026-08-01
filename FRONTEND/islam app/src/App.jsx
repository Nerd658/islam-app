import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Adhkar from './pages/Adhkar';
import Quran from './pages/Quran';
import Tasbih from './pages/Tasbih';
import Events from './pages/Events';
import Chat from './pages/Chat';
import Names from './pages/Names';
import Qibla from './pages/Qibla';
import Goals from './pages/Goals';

function App() {
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-black text-gray-100 font-sans selection:bg-gray-800 selection:text-white'>
      <Navigation />
      <div className="flex-grow overflow-y-auto pb-24 md:pb-0 md:ml-64 custom-scrollbar w-full">
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
