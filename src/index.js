import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Force le rendu avec une nouvelle div
const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <App />
);
