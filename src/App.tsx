import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
// import Simulation from './components/Simulation';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {/* | <Link to="/simulation">Simulation</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/simulation" element={<Simulation />} /> */}
      </Routes>
    </Router>
  );
}

export default App;