import React from 'react';
// @ts-ignore
import Plot from 'react-plotly.js';

interface Graph3DProps {
  data: {
    x: number[];
    y: number[];
    z: number[][];
  };
}

const Graph3D: React.FC<Graph3DProps> = ({ data }) => {
  return (
    <Plot
      data={[
        {
          z: data.z,
          x: data.x,
          y: data.y,
          type: 'surface' as const
        }
      ]}
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
};

export default Graph3D;