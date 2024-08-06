import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import Header from './components/Header'; // Importar Header

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />  {/* Renderizar Header */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
