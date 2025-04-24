import React from 'react';
import './App.css';
import MoodBoosterGame from './components/MoodBoosterGame';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
        <MoodBoosterGame />
      </ErrorBoundary>
    </div>
  );
}

export default App;
