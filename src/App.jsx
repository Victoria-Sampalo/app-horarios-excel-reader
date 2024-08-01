import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Footer from './components/Footer';
import Header from './components/Header'; // Importar Header
import ExcelReader from './components/ExcelReader.jsx';
import './styles/global.css';
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />  {/* Renderizar Header */}
        {/* <Home /> */}
        <ExcelReader/>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
