// assets/js/main.js
import { loadView } from './views.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM listo — inicializando nav');
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const view = el.getAttribute('data-view');
      console.log('Navegar a vista:', view);
      loadView(view);
    });
  });
  loadView('landing');
});
