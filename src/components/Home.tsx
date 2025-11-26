
import React, { useState, useEffect } from 'react';
import Graph3D from './Graph3D';

function Home() {
  const [bicarbonate, setBicarbonate] = useState(24); // mEq/L
  const [va, setVa] = useState(5); // L/min
  const [vco2, setVco2] = useState(200); // mL/min
  const [pco2, setPco2] = useState<number | null>(null);
  const [ph, setPh] = useState<number | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number; z: number }[]>([]);
  const [matchingCombos, setMatchingCombos] = useState<
    { bicarbonate: number; vco2: number; va: number; pco2: number }[]
  >([]);

  // Calculate PaCO2 and fetch pH whenever VA, VCO2, or bicarbonate changes
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

  // Fetch matching combinations when pH is manually entered
  const handlePhInput = (value: string) => {
    const newPh = parseFloat(value);
    if (!isNaN(newPh)) {
      setPh(newPh);
      fetch(`http://localhost:8000/matching-combos?pH=${newPh}`)
        .then(res => res.json())
        .then(data => setMatchingCombos(data.combos))
        .catch(err => console.error('Error fetching combos:', err));
    }
  };

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

        {/* Alveolar Ventilation */}
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
            &nbsp;
            <input
              type="number"
              min="1"
              max="15"
              step="0.1"
              value={va}
              onChange={(e) => setVa(Number(e.target.value))}
              style={{ width: '80px', marginLeft: '8px' }}
            /> L/min
          </label>
        </div>

        {/* CO₂ Production */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            CO₂ Production (VCO₂):&nbsp;
            <input
              type="range"
              min="100"
              max="1200"
              step="10"
              value={vco2}
              onChange={(e) => setVco2(Number(e.target.value))}
            />
            &nbsp;
            <input
              type="number"
              min="100"
              max="1200"
              step="10"
              value={vco2}
              onChange={(e) => setVco2(Number(e.target.value))}
              style={{ width: '80px', marginLeft: '8px' }}
            /> mL/min
          </label>
        </div>

        {/* Bicarbonate */}
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
            &nbsp;
            <input
              type="number"
              min="10"
              max="40"
              step="1"
              value={bicarbonate}
              onChange={(e) => setBicarbonate(Number(e.target.value))}
              style={{ width: '80px', marginLeft: '8px' }}
            /> mEq/L
          </label>
        </div>

        {/* pH Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Target pH:&nbsp;
            <input
              type="number"
              step="0.01"
              value={ph ?? ''}
              onChange={(e) => handlePhInput(e.target.value)}
              style={{ width: '80px', marginLeft: '8px' }}
            />
          </label>
        </div>

        {/* Display calculated values */}
        <div style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
          <p>PaCO₂: {pco2?.toFixed(1)} mmHg</p>
          <p>pH: {ph}</p>
        </div>

        {/* 3D Graph */}
        <Graph3D data={generateSurfaceData()} points={points} />
      </div>

      {/* Table of matching combos */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
        <h2>Matching Combinations for pH {ph}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc' }}>HCO₃⁻ (mEq/L)</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>VCO₂ (mL/min)</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>VA (L/min)</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>PaCO₂ (mmHg)</th>
            </tr>
          </thead>
          <tbody>
            {matchingCombos.map((combo, index) => (
              <tr key={index}>
                <td style={{ padding: '4px 8px' }}>{combo.bicarbonate}</td>
                <td style={{ padding: '4px 8px' }}>{combo.vco2}</td>
                <td style={{ padding: '4px 8px' }}>{combo.va}</td>
                <td style={{ padding: '4px 8px' }}>{combo.pco2.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
