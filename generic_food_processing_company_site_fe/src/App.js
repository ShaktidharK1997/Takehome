import React from 'react';
import logo from './logo.svg'; // Make sure this is used or remove it if unused
import './App.css';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter> {/* Include BrowserRouter around Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
