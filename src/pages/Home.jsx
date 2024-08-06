import React, { useState } from 'react';
import TotalDays from '../components/TotalDays';
import Incidencias from '../components/Incidencias';

const Home = () => {
  const [view, setView] = useState('totalDays'); // Default view

  return (
    <div className="home">
      <h2>Bienvenido</h2>
      <div className="buttons">
        <button onClick={() => setView('totalDays')}>Días Totales</button>
        <button onClick={() => setView('incidencias')}>Incidencias</button>
      </div>
      <div className="content">
        {view === 'totalDays' && <TotalDays />}
        {view === 'incidencias' && <Incidencias />}
      </div>
    </div>
  );
};

export default Home;
