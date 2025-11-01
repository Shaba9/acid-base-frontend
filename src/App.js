import React, { useState, useEffect } from 'react';
import Graph3D from './components/Graph3D';
import Sliders from './components/Sliders';

function App() {
  const [bicarbonate, setBicarbonate] = useState(24);
  const [pco2, setPco2] = useState(40);
  const [ph, setPh] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/calculate-ph?bicarbonate=${bicarbonate}&pco2=${pco2}`)
      .then(res => res.json())
      .then(data => setPh(data.pH));
  }, [bicarbonate, pco2]);

  const generateSurfaceData = () => {
    const x = Array.from({ length: 31 }, (_, i) => i + 10);
    const y = Array.from({ length: 61 }, (_, i) => i + 20);
    const z = y.map(p => x.map(b => 6.1 + Math.log10(b / (0.03 * p))));
    return { x, y, z };
  };

  return (
    <div>
      <h1>Acid-Base Balance Visualizer</h1>
      <Sliders bicarbonate={bicarbonate} setBicarbonate={setBicarbonate} pco2={pco2} setPco2={setPco2} />
      <p>Calculated pH: {ph}</p>
      <Graph3D data={generateSurfaceData()} />
    </div>
  );
}

export default App;
