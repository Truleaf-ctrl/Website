import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Remember how the person is navigating: after a mouse or touch interaction the
// focus ring on buttons and links is hidden; any key press brings it back.
const root = document.documentElement;
root.dataset.input = 'keyboard';
window.addEventListener('pointerdown', () => { root.dataset.input = 'pointer'; }, true);
window.addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === 'Enter' || e.key === ' ') root.dataset.input = 'keyboard'; }, true);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
