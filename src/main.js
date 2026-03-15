// ═══════════════════════════════════════════════════════
// NeoBank — Main Entry Point
// ═══════════════════════════════════════════════════════

import { registerRoute, initRouter, navigate } from './components/router.js';
import { renderBottomNav } from './components/bottomNav.js';
import { isLoggedIn, api } from './backend/api.js';

export async function applyPreferences() {
  const res = await api('profile');
  if (res.ok && res.user) {
    const { theme, accentColor, accentGradient, fontSize } = res.user;
    const doc = document.documentElement;
    if (theme) doc.setAttribute('data-theme', theme);
    if (fontSize) doc.style.fontSize = fontSize + 'px';
    
    let activeColor = accentColor;
    let activeGradient = accentGradient;

    if (activeColor && !activeGradient) {
      activeGradient = `linear-gradient(135deg, ${activeColor}, ${activeColor})`;
    } else if (activeGradient && !activeColor) {
      const match = activeGradient.match(/#([a-f\d]{6}|[a-f\d]{3})|rgb\([^)]+\)/i);
      if (match) activeColor = match[0];
    }

    if (activeColor) {
      doc.style.setProperty('--accent', activeColor);
      doc.style.setProperty('--primary', activeColor);
      const rgb = hexToRgb(activeColor);
      if (rgb) {
        doc.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        doc.style.setProperty('--primary-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
      }
    }
    
    if (activeGradient) {
      doc.style.setProperty('--accent-gradient', activeGradient);
    }
  }
}

export function hexToRgb(color) {
  if (!color) return null;
  // Handle rgb(r, g, b) or rgba(r, g, b, a)
  if (color.startsWith('rgb')) {
    const parts = color.match(/\d+/g);
    if (parts && parts.length >= 3) {
      return { r: parseInt(parts[0]), g: parseInt(parts[1]), b: parseInt(parts[2]) };
    }
    return null;
  }
  // Handle #hex
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Screens
import { renderLogin } from './screens/login.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderTransfer } from './screens/transfer.js';
import { renderQrPay } from './screens/qrPay.js';
import { renderHistory } from './screens/history.js';
import { renderCards } from './screens/cards.js';
import { renderProfile } from './screens/profile.js';
import { renderPriority } from './screens/priority.js';
import { renderChangePin } from './screens/changePin.js';
import { renderMyQr } from './screens/myQr.js';
import { renderNotifications } from './screens/notifications.js';
import { renderPersonalization } from './screens/personalization.js';
import { renderAdmin } from './admin/admin.js';

// ── Register all routes ────────────────────────────────
registerRoute('login', renderLogin);
registerRoute('dashboard', renderDashboard);
registerRoute('transfer', renderTransfer);
registerRoute('qr', renderQrPay);
registerRoute('history', renderHistory);
registerRoute('cards', renderCards);
registerRoute('profile', renderProfile);
registerRoute('priority', renderPriority);
registerRoute('changePin', renderChangePin);
registerRoute('myQr', renderMyQr);
registerRoute('notifications', renderNotifications);
registerRoute('personalization', renderPersonalization);
registerRoute('admin', renderAdmin);

// ── Build app shell ────────────────────────────────────
async function init() {
  const app = document.getElementById('app');

  // Screen container
  const content = document.createElement('div');
  content.id = 'app-content';
  content.style.cssText = 'width:100%;';
  app.appendChild(content);

  // Bottom nav
  const nav = renderBottomNav();
  app.appendChild(nav);

  // Hide/show nav on login/admin
  function updateNavVisibility() {
    const hash = (window.location.hash || '').replace('#', '');
    nav.style.display = (hash === 'login' || hash === 'admin') ? 'none' : '';
  }
  window.addEventListener('hashchange', updateNavVisibility);
  updateNavVisibility();

  // Start router
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = isLoggedIn() ? '#dashboard' : '#login';
  }
  
  if (isLoggedIn()) {
    await applyPreferences();
  }

  initRouter();
  initMobileGestures();
}

function initMobileGestures() {
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Swipe Right (Back) - starts from left edge (within 50px)
    if (diffX > 100 && Math.abs(diffY) < 50 && touchStartX < 50) {
      window.history.back();
    }
  }, { passive: true });

  // Prevent context menu (optional for more native feel)
  window.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      // e.preventDefault(); 
    }
  });

  // ── Keyboard Visibility Detection ────────────────────
  // When an input is focused, the mobile keyboard usually appears.
  // This causes fixed elements to jump or be displaced.
  // We hide the bottom nav to maintain a "stable and locked" UI.
  window.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      document.body.classList.add('keyboard-visible');
    }
  });

  window.addEventListener('focusout', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      document.body.classList.remove('keyboard-visible');
    }
  });
}

// ── Boot ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
