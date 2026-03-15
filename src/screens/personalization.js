// ═══════════════════════════════════════════════════════
// NeoBank — Personalization Screen (Functional)
// ═══════════════════════════════════════════════════════

import { api } from '../backend/api.js';
import { navigate } from '../components/router.js';
import { showToast } from '../components/toast.js';
import { hexToRgb } from '../main.js';

export function renderPersonalization(container) {
  let userPrefs = {
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    accentColor: '#0db9f2', // Safe default
    accentGradient: 'linear-gradient(135deg, #0db9f2, #10b981)',
    fontSize: 14
  };

  async function load() {
    const res = await api('profile');
    if (res.ok && res.user) {
      if (res.user.theme) userPrefs.theme = res.user.theme;
      if (res.user.fontSize) userPrefs.fontSize = res.user.fontSize;
      if (res.user.accentColor) userPrefs.accentColor = res.user.accentColor;
      if (res.user.accentGradient) userPrefs.accentGradient = res.user.accentGradient;
    } else {
      // Fallback to current document state if API fails or No data
      const docStyle = getComputedStyle(document.documentElement);
      userPrefs.accentColor = docStyle.getPropertyValue('--accent').trim() || userPrefs.accentColor;
      userPrefs.accentGradient = docStyle.getPropertyValue('--accent-gradient').trim() || userPrefs.accentGradient;
    }
    render();
  }

  function render() {
    container.className = 'screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col';
    
    // Calculate font size range value (1=12px, 2=14px, 3=16px)
    const fontSizeValue = userPrefs.fontSize <= 12 ? 1 : (userPrefs.fontSize >= 16 ? 3 : 2);

    container.innerHTML = `
<!-- Header -->
<header class="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
<div class="flex items-center p-4 justify-between max-w-md mx-auto w-full notch-safe-top">
<div class="flex items-center gap-3">
<button id="btn-back" class="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back</span>
</button>
<h1 class="text-xl font-bold leading-tight tracking-tight">Cá nhân hóa Neo</h1>
</div>
<button id="btn-save" class="text-primary font-semibold text-sm">Lưu</button>
</div>
</header>
<main class="flex-1 overflow-y-auto custom-scrollbar max-w-md mx-auto w-full px-4 py-6 space-y-8 pb-24 stagger">
<!-- UI Preview Card Section -->
<section>
<h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-1">Xem trước</h3>
<div id="preview-card" class="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl border border-white/5 transition-all duration-500" style="background: var(--accent-gradient)">
<div class="flex justify-between items-start mb-8">
<div class="space-y-1">
<p class="text-xs text-white/70 uppercase tracking-widest">Số dư khả dụng</p>
<p class="text-2xl font-bold text-white">12,450,000 VND</p>
</div>
<div class="w-12 h-8 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm">
<div id="preview-chip" class="w-6 h-4 bg-white/40 rounded-sm"></div>
</div>
</div>
<div class="flex justify-between items-end">
<div class="space-y-2">
<p class="text-sm font-mono tracking-widest text-white/80">**** **** **** 8842</p>
<p class="text-xs font-medium text-white/70">ALEX NEUMANN</p>
</div>
<div class="flex -space-x-2">
<div class="w-8 h-8 rounded-full bg-white/30 border border-white/20 shadow-lg backdrop-blur-md"></div>
<div class="w-8 h-8 rounded-full bg-amber-400/80 border border-white/20"></div>
</div>
</div>
<!-- Abstract Decorative Element -->
<div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
<div class="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-3xl"></div>
</div>
</section>

<!-- Theme Mode Section -->
<section>
<h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-1">Chủ đề giao diện</h3>
<div class="grid grid-cols-2 gap-3">
<label class="relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${userPrefs.theme === 'light' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-primary/50'}">
<input class="hidden" name="theme" type="radio" value="light" ${userPrefs.theme === 'light' ? 'checked' : ''}/>
<span class="material-symbols-outlined text-2xl ${userPrefs.theme === 'light' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}">light_mode</span>
<span class="text-xs font-medium">Sáng</span>
</label>
<label class="relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${userPrefs.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-primary/50'}">
<input class="hidden" name="theme" type="radio" value="dark" ${userPrefs.theme === 'dark' ? 'checked' : ''}/>
<span class="material-symbols-outlined text-2xl ${userPrefs.theme === 'dark' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}">dark_mode</span>
<span class="text-xs font-medium">Tối</span>
</label>
</div>
</section>

<!-- Accent Color Section -->
<section>
<div class="flex justify-between items-end mb-4 px-1">
<h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Màu nhấn</h3>
</div>
<div id="accent-colors" class="flex flex-wrap gap-4 justify-between p-4 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
<button data-color="#0db9f2" class="accent-btn w-10 h-10 rounded-full bg-[#0db9f2] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#0db9f2' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<button data-color="#FFD700" class="accent-btn w-10 h-10 rounded-full bg-[#FFD700] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#FFD700' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<button data-color="#10b981" class="accent-btn w-10 h-10 rounded-full bg-[#10b981] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#10b981' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<button data-color="#8b5cf6" class="accent-btn w-10 h-10 rounded-full bg-[#8b5cf6] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#8b5cf6' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<button data-color="#f43f5e" class="accent-btn w-10 h-10 rounded-full bg-[#f43f5e] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#f43f5e' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<button data-color="#f59e0b" class="accent-btn w-10 h-10 rounded-full bg-[#f59e0b] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#f59e0b' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<button data-color="#6366f1" class="accent-btn w-10 h-10 rounded-full bg-[#6366f1] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentColor === '#6366f1' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>

<!-- Custom Color Picker -->
<div class="relative w-10 h-10">
  <input type="color" id="custom-color-input" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" value="${userPrefs.accentColor && userPrefs.accentColor.startsWith('#') ? userPrefs.accentColor : '#0db9f2'}">
  <button id="btn-custom-color" class="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all overflow-hidden" style="${userPrefs.accentColor && !['#0db9f2','#FFD700','#10b981','#8b5cf6','#f43f5e','#f59e0b','#6366f1'].includes(userPrefs.accentColor) ? `background:${userPrefs.accentColor}; color:white; border-style:solid; border-color:white/20` : ''}">
    ${userPrefs.accentColor && !['#0db9f2','#FFD700','#10b981','#8b5cf6','#f43f5e','#f59e0b','#6366f1'].includes(userPrefs.accentColor) ? '<span class="material-symbols-outlined text-sm">check</span>' : '<span class="material-symbols-outlined">add</span>'}
  </button>
</div>
</div>
</section>

<!-- Gradient Accents Section -->
<section>
<div class="flex justify-between items-end mb-4 px-1">
<h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hiệu ứng thẻ</h3>
</div>
<div id="gradient-accents" class="flex flex-wrap gap-4 justify-between p-4 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
<!-- Aurora -->
<button data-gradient="linear-gradient(135deg, #0db9f2, #10b981)" class="grad-btn w-10 h-10 rounded-full bg-gradient-to-br from-[#0db9f2] to-[#10b981] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentGradient === 'linear-gradient(135deg, #0db9f2, #10b981)' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<!-- Sunset -->
<button data-gradient="linear-gradient(135deg, #f97316, #ec4899)" class="grad-btn w-10 h-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#ec4899] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentGradient === 'linear-gradient(135deg, #f97316, #ec4899)' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<!-- Royal (Enhanced Purple) -->
<button data-gradient="linear-gradient(135deg, #a855f7, #6b21a8)" class="grad-btn w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#6b21a8] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentGradient === 'linear-gradient(135deg, #a855f7, #6b21a8)' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<!-- Gold -->
<button data-gradient="linear-gradient(135deg, #FFD700, #b45309)" class="grad-btn w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#b45309] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentGradient === 'linear-gradient(135deg, #FFD700, #b45309)' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
<!-- Midnight -->
<button data-gradient="linear-gradient(135deg, #1e293b, #0f172a)" class="grad-btn w-10 h-10 rounded-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] transition-transform hover:scale-110 flex items-center justify-center">
${userPrefs.accentGradient === 'linear-gradient(135deg, #1e293b, #0f172a)' ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
</button>
</div>
</section>

<!-- Typography Section -->
<section>
<h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-1">Kiểu chữ</h3>
<div class="space-y-6 p-5 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
<div class="space-y-4">
<div class="flex justify-between text-xs text-slate-500">
<span>Nhỏ</span>
<span class="text-primary font-medium">Mặc định</span>
<span>Lớn</span>
</div>
<input id="font-size-slider" class="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" max="3" min="1" step="1" type="range" value="${fontSizeValue}"/>
</div>
<div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
<div>
<p class="text-sm font-medium">Văn bản độ tương phản cao</p>
<p class="text-xs text-slate-500">Tối ưu hóa khả năng đọc</p>
</div>
<button class="w-11 h-6 bg-primary rounded-full relative flex items-center px-1">
<div class="w-4 h-4 bg-white rounded-full translate-x-5"></div>
</button>
</div>
</div>
</section>
</main>
    `;

    attachEvents();
  }

  function applyPreview() {
    const doc = document.documentElement;
    doc.setAttribute('data-theme', userPrefs.theme);
    doc.style.fontSize = userPrefs.fontSize + 'px';
    
    let activeColor = userPrefs.accentColor;
    let activeGradient = userPrefs.accentGradient;

    // Handle mutual exclusion/fallback
    if (activeColor && !activeGradient) {
      activeGradient = `linear-gradient(135deg, ${activeColor}, ${activeColor})`;
    } else if (activeGradient && !activeColor) {
      // Extract first hex/rgb color from gradient string
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

  function attachEvents() {
    container.querySelector('#btn-back').addEventListener('click', () => history.back());
    container.querySelector('#btn-save').addEventListener('click', async () => {
      // Send both to ensure overriding on server
      const res = await api('update-preferences', {
        ...userPrefs,
        accentColor: userPrefs.accentColor || null,
        accentGradient: userPrefs.accentGradient || null
      });
      if (res.ok) {
        showToast('Đã lưu cài đặt cá nhân hóa', 'success');
        history.back();
      }
    });

    container.querySelectorAll('input[name="theme"]').forEach(input => {
      input.addEventListener('change', (e) => {
        userPrefs.theme = e.target.value;
        applyPreview();
        render(); 
      });
    });

    container.querySelectorAll('.accent-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        userPrefs.accentColor = btn.dataset.color;
        userPrefs.accentGradient = null; // Mutual exclusion
        applyPreview();
        render();
      });
    });

    container.querySelectorAll('.grad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        userPrefs.accentGradient = btn.dataset.gradient;
        userPrefs.accentColor = null; // Mutual exclusion
        applyPreview();
        render();
      });
    });

    // Custom Color Picker Logic
    const customInp = container.querySelector('#custom-color-input');
    const customBtn = container.querySelector('#btn-custom-color');
    if (customInp && customBtn) {
      customInp.addEventListener('input', (e) => {
        userPrefs.accentColor = e.target.value;
        userPrefs.accentGradient = null; // Mutual exclusion
        applyPreview();
        // We don't render() on every input to avoid losing focus on the color picker
      });
      // But we render on change (when picker closes) to update the checkmark/background
      customInp.addEventListener('change', () => {
        render();
      });
    }

    container.querySelector('#font-size-slider').addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      userPrefs.fontSize = val === 1 ? 12 : (val === 3 ? 16 : 14);
      applyPreview();
    });
  }

  load();
}
