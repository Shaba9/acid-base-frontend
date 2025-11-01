import React from 'react';

function Sliders({ bicarbonate, setBicarbonate, pco2, setPco2 }) {
  return (
    <div>
      <label>Bicarbonate [HCO₃⁻]: {bicarbonate} mEq/L</label>
      <input type="range" min="10" max="40" value={bicarbonate} onChange={e => setBicarbonate(e.target.value)} />
      <br />
      <label>pCO₂: {pco2} mmHg</label>
      <input type="range" min="20" max="80" value={pco2} onChange={e => setPco2(e.target.value)} />
    </div>
  );
}

export default Sliders;
