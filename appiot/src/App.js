// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './MainApp';
import Bienvenido from './components/Bienvenido';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenido />} />
        <Route path="/main" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;