import React from 'react';
import Plot from 'react-plotly.js';

function Graph3D({ data }) {
  return (
    <Plot
      data={[{
        type: 'surface',
        z: data.z,
        x: data.x,
        y: data.y,
        colorscale: 'RdBu',
        reversescale: true,
      }]}
      layout={{
        title: 'pH Surface Plot',
        autosize: true,
        scene: {
          xaxis: { title: '[HCO₃⁻] (mEq/L)' },
          yaxis: { title: 'pCO₂ (mmHg)' },
          zaxis: { title: 'pH' }
        }
      }}
    />
  );
}

export default Graph3D;
