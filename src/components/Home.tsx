import React, { useState, useEffect } from 'react';
import Graph3D from './Graph3D';
import Sliders from './Sliders';

function Home() {
  const [bicarbonate, setBicarbonate] = useState(24);
  const [pco2, setPco2] = useState(40);
  const [ph, setPh] = useState<number | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number; z: number }[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<{ bicarb: number; pco2: number }[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/calculate-ph?bicarbonate=${bicarbonate}&pco2=${pco2}`)
      .then(res => res.json())
      .then(data => {
        const newPh = data.pH;
        setPh(newPh);
        setPoints([{ x: bicarbonate, y: pco2, z: newPh }]);
      });
  }, [bicarbonate, pco2]);

  const generateSurfaceData = () => {
    const x = Array.from({ length: 31 }, (_, i) => i + 10);
    const y = Array.from({ length: 61 }, (_, i) => i + 20);
    const z = y.map(p => x.map(b => 6.1 + Math.log10(b / (0.03 * p))));
    return { x, y, z };
  };

  const handlePointClick = async (clickedPoint: { x: number; y: number; z: number }) => {
    setPoints([clickedPoint]);

    try {
      const response = await fetch(`http://localhost:8000/matching-pairs?pH=${clickedPoint.z}`);
      const data = await response.json();
      setMatchingPairs(data.pairs);
    } catch (error) {
      console.error('Error fetching matching pairs:', error);
      setMatchingPairs([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
      <div style={{ flex: 2 }}>
        <h1>Acid-Base Balance Visualizer</h1>

        <Sliders
          bicarbonate={bicarbonate}
          setBicarbonate={setBicarbonate}
          pco2={pco2}
          setPco2={setPco2}
        />

        {/* Manual input fields */}
        <div style={{ marginTop: '1rem' }}>
          <label>
            Bicarbonate [HCO₃⁻]:&nbsp;
            <input
              type="number"
              min="10"
              max="40"
              value={bicarbonate}
              onChange={(e) => setBicarbonate(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            &nbsp;mEq/L
          </label>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <label>
            pCO₂:&nbsp;
            <input
              type="number"
              min="20"
              max="80"
              value={pco2}
              onChange={(e) => setPco2(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            &nbsp;mmHg
          </label>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <label>
            pH:&nbsp;
            <input
              type="number"
              step="0.01"
              value={ph ?? ''}
              onChange={(e) => {
                const newPh = parseFloat(e.target.value);
                if (!isNaN(newPh)) {
                  setPh(newPh);
                  handlePointClick({ x: 0, y: 0, z: newPh }); // dummy x/y
                }
              }}
              style={{ width: '80px' }}
            />
          </label>
        </div>

        <Graph3D data={generateSurfaceData()} points={points} onPointClick={handlePointClick} />
      </div>

      {/* Table on the right */}
      {matchingPairs.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
          <h2>Matching [HCO₃⁻] and pCO₂ for selected pH</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc' }}>Bicarbonate (mEq/L)</th>
                <th style={{ borderBottom: '1px solid #ccc' }}>pCO₂ (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              {matchingPairs.map((pair, index) => (
                <tr key={index}>
                  <td style={{ padding: '4px 8px' }}>{pair.bicarb}</td>
                  <td style={{ padding: '4px 8px' }}>{pair.pco2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;