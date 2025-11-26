import React from 'react';

interface SlidersProps {
  bicarbonate: number;
  setBicarbonate: (value: number) => void;
  pco2: number;
  setPco2: (value: number) => void;
}

const Sliders: React.FC<SlidersProps> = ({ bicarbonate, setBicarbonate, pco2, setPco2 }) => {
  return (
    <div>
      <label>Bicarbonate [HCO₃⁻]: {bicarbonate} mEq/L</label>
      <input
        type="range"
        min="22"
        max="28"
        value={bicarbonate}
        onChange={(e) => setBicarbonate(Number(e.target.value))}
      />
      <br />
      <label>pCO₂: {pco2} mmHg</label>
      <input
        type="range"
        min="35"
        max="45"
        value={pco2}
        onChange={(e) => setPco2(Number(e.target.value))}
      />
    </div>
  );
};

export default Sliders;