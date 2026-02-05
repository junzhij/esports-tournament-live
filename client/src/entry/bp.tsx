import React from 'react';
import { createRoot } from 'react-dom/client';
import BpView from '../views/BpView';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const params = new URLSearchParams(window.location.search);
const transparent = params.get('transparent') === '1';
if (transparent) {
  document.body.classList.remove('bg-background-dark');
  document.body.classList.add('bg-transparent');
}

createRoot(root).render(
  <React.StrictMode>
    <BpView transparent={transparent} />
  </React.StrictMode>
);
