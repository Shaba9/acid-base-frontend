// components/Simulation.tsx
import React, { useState } from 'react';
// @ts-ignore
import Plot from 'react-plotly.js';

const Simulation: React.FC = () => {
  const [ph, setPh] = useState(7.4);

  const getColor = (ph: number) => {
    if (ph < 7.35) return 'rgba(255, 0, 0, 0.6)'; // acidic
    if (ph > 7.45) return 'rgba(0, 0, 255, 0.6)'; // alkaline
    return 'rgba(0, 255, 0, 0.6)'; // normal
  };

  return (
    <div>
      <h1>Blood pH Simulation</h1>
      <input
        type="range"
        min="6.8"
        max="7.8"
        step="0.01"
        value={ph}
        onChange={(e) => setPh(parseFloat(e.target.value))}
      />
      <p>Current pH: {ph.toFixed(2)}</p>
      <Plot
        data={[
          {
            type: 'mesh3d',
            x: [0, 1, 0],
            y: [0, 0, 1],
            z: [0, 1, 1],
            color: getColor(ph),
            opacity: 0.8
          }
        ]}
        layout={{
          title: 'Blood pH Visualization',
          scene: {
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
            zaxis: { title: 'Z' }
          }
        }}
      />
    </div>
  );
};

export default Simulation;