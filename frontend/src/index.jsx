// frontend/src/index.jsx - CSS dosyalarının organize edilmiş hali
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Ana stil dosyaları
import './styles/index.css';       // Temel stil ayarları ve renk paleti
import './styles/additional.css';  // Ek stiller ve bileşen özellikleri
import './styles/facility-cards.css'; // Tesis/restoran kartları stilleri
import './styles/animations.css';  // Animasyonlar

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);