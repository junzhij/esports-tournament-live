import React from 'react';
import { createRoot } from 'react-dom/client';
import OverlayView from '../views/OverlayView';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const params = new URLSearchParams(window.location.search);
const transparent = params.get('transparent') !== '0';
if (transparent) {
  document.body.classList.add('bg-transparent');
}

createRoot(root).render(
  <React.StrictMode>
    <OverlayView transparent={transparent} />
  </React.StrictMode>
);
