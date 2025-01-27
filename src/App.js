import React from 'react';
import ScheduleSelection from './components/ScheduleSelection';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="test-banner">
        <h1>
          VERSION TEST 20:25 - SI VOUS VOYEZ CE MESSAGE EN ROUGE SUR FOND JAUNE, C'EST LA BONNE VERSION
        </h1>
      </div>
      <ScheduleSelection />
    </div>
  );
}

export default App;
