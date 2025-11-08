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
    <div>
      <h1>Acid-Base Balance Visualizer</h1>
      <Sliders
        bicarbonate={bicarbonate}
        setBicarbonate={setBicarbonate}
        pco2={pco2}
        setPco2={setPco2}
      />
      <p>Calculated pH: {ph}</p>
      <Graph3D data={generateSurfaceData()} points={points} onPointClick={handlePointClick} />

      {matchingPairs.length > 0 && (
        <div>
          <h2>Matching [HCO₃⁻] and pCO₂ for selected pH</h2>
          <table>
            <thead>
              <tr>
                <th>Bicarbonate (mEq/L)</th>
                <th>pCO₂ (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              {matchingPairs.map((pair, index) => (
                <tr key={index}>
                  <td>{pair.bicarb}</td>
                  <td>{pair.pco2}</td>
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