import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Auto-register PWA service worker for full offline functionality
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Vitralis için yeni bir güncelleme mevcut. Yenilensin mi?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Vitralis is ready for offline stained glass studio calculations.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
