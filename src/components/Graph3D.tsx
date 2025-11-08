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
  onPointClick?: (ph: number) => void;
}

const Graph3D: React.FC<Graph3DProps> = ({ data, points = [], onPointClick }) => {
  const handleClick = (event: any) => {
    const point = event.points?.[0];
    if (point && onPointClick) {
      const ph = point.z;
      onPointClick(ph);
    }
  };

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
            color: 'rgba(255, 0, 0, 1)',
            size: 10,
            symbol: 'circle',
            opacity: 1,
            line: {
              color: 'rgba(255, 100, 100, 0.6)',
              width: 10
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
      onClick={handleClick}
    />
  );
};

export default Graph3D;