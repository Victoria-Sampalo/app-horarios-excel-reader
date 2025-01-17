import React, { useState } from 'react';
import TotalDays from '../components/TotalDays';
import Incidencias from '../components/Incidencias';
import AnualOcurrences from '../components/AnualOcurrences';

const Home = () => {
  const [view, setView] = useState('totalDays'); // Default view

  return (
    <div className="home">
      <h2>Bienvenido</h2>
      <div className="buttons">
        <button onClick={() => setView('totalDays')}>Días Totales</button>
        <button onClick={() => setView('incidencias')}>Incidencias</button>
        <button onClick={() => setView('anualOcurrences')}>Computo Anual</button>
      </div>
      <div className="content">
        {view === 'totalDays' && <TotalDays />}
        {view === 'incidencias' && <Incidencias />}
        {view === 'anualOcurrences' && <AnualOcurrences />}
      </div>
    </div>
  );
};

export default Home;
