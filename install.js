(() => {
  if (window.Capacitor?.isNativePlatform?.() || location.protocol==='capacitor:' || location.protocol==='file:') return;
  const button = document.getElementById('spill-install');
  const help = document.getElementById('spill-install-help');
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let prompt;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    prompt = event;
    if (!standalone()) button.hidden = false;
  });
  if (ios && !standalone()) button.hidden = false;
  button.addEventListener('click', async () => {
    if (prompt) {
      const pending = prompt;
      prompt = null;
      button.hidden = !ios;
      try { await pending.prompt(); } catch {}
      return;
    }
    if (ios) {
      help.textContent = 'In Safari, tap Share, then Add to Home Screen. If you don’t see it, tap More.';
      help.hidden = false;
    }
  });
  window.addEventListener('appinstalled', () => { prompt = null; button.hidden = true; help.hidden = true; });
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('SPILL offline setup failed:', error));
  }
})();
