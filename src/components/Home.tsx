import React, { useState, useEffect } from 'react';
import Graph3D from './Graph3D';

function Home() {
  const [bicarbonate, setBicarbonate] = useState(24); // mEq/L
  const [va, setVa] = useState(5); // L/min
  const [vco2, setVco2] = useState(200); // mL/min
  const [pco2, setPco2] = useState<number | null>(null);
  const [ph, setPh] = useState<number | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number; z: number }[]>([]);

  // Calculate PaCO2 and fetch pH whenever inputs change
  useEffect(() => {
    const newPaCO2 = (vco2 * 0.863) / va; // mmHg
    setPco2(newPaCO2);

    fetch(`http://localhost:8000/calculate-ph?bicarbonate=${bicarbonate}&pco2=${newPaCO2}`)
      .then(res => res.json())
      .then(data => {
        const newPh = data.pH;
        setPh(newPh);
        setPoints([{ x: bicarbonate, y: newPaCO2, z: newPh }]);
      });
  }, [bicarbonate, va, vco2]);

  // Generate surface data for graph
  const generateSurfaceData = () => {
    const x = Array.from({ length: 31 }, (_, i) => i + 10); // HCO3 range
    const y = Array.from({ length: 61 }, (_, i) => i + 20); // PaCO2 range
    const z = y.map(p => x.map(b => 6.1 + Math.log10(b / (0.03 * p))));
    return { x, y, z };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
      <div style={{ flex: 2 }}>
        <h1>Alveolar Ventilation & Acid-Base Balance</h1>

        {/* Sliders and Inputs */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Alveolar Ventilation (VA):&nbsp;
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={va}
              onChange={(e) => setVa(Number(e.target.value))}
            />
            &nbsp;{va} L/min
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            CO₂ Production (VCO₂):&nbsp;
            <input
              type="range"
              min="100"
              max="400"
              step="10"
              value={vco2}
              onChange={(e) => setVco2(Number(e.target.value))}
            />
            &nbsp;{vco2} mL/min
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Bicarbonate [HCO₃⁻]:&nbsp;
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={bicarbonate}
              onChange={(e) => setBicarbonate(Number(e.target.value))}
            />
            &nbsp;{bicarbonate} mEq/L
          </label>
        </div>

        {/* Display calculated values */}
        <div style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
          <p>PaCO₂: {pco2?.toFixed(1)} mmHg | pH: {ph}</p>
        </div>

        {/* 3D Graph */}
        <Graph3D data={generateSurfaceData()} points={points} />
      </div>
    </div>
  );
}

export default Home;