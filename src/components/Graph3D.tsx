import React from 'react';
// @ts-ignore
import Plot from 'react-plotly.js';

interface Graph3DProps {
  data: {
    x: number[];
    y: number[];
    z: number[][];
  };
  points?: { x: number; y: number; z: number }[];
}

const Graph3D: React.FC<Graph3DProps> = ({ data, points = [] }) => {
  return (
    <Plot
      data={[
        {
          z: data.z,
          x: data.x,
          y: data.y,
          type: 'surface' as const,
          name: 'pH Surface'
        },
        {
          x: points.map(p => p.x),
          y: points.map(p => p.y),
          z: points.map(p => p.z),
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            color: 'red',
            size: 8,
            symbol: 'circle',
            opacity: 0.9,
            line: {
              color: 'darkred',
              width: 1
            }
          },
          name: 'Latest Point'
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