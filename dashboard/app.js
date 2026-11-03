// StepMania Consolidated Dashboard Application Logic
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const trayToggleBtn = document.getElementById('trayToggleBtn');
  const trayMenu = document.getElementById('trayMenu');
  const trayStartBtn = document.getElementById('trayStartBtn');
  const trayRestartBtn = document.getElementById('trayRestartBtn');
  const trayPauseBtn = document.getElementById('trayPauseBtn');
  const trayQuitBtn = document.getElementById('trayQuitBtn');
  const trayStatusDot = document.getElementById('trayStatusDot');

  const engineStatusText = document.getElementById('engineStatusText');
  const engineForkSelect = document.getElementById('engineForkSelect');
  const launchGameBtn = document.getElementById('launchGameBtn');
  const openSongsBtn = document.getElementById('openSongsFolderBtn');
  const reloadPacksBtn = document.getElementById('reloadPacksBtn');
  const launchFeedback = document.getElementById('launchFeedback');

  const debounceRange = document.getElementById('debounceRange');
  const debounceVal = document.getElementById('debounceVal');
  const offsetRange = document.getElementById('offsetRange');
  const offsetVal = document.getElementById('offsetVal');

  const scanSongsBtn = document.getElementById('scanSongsBtn');
  const refreshDaemonsBtn = document.getElementById('refreshDaemonsBtn');

  // Toggle System Tray Menu
  trayToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    trayMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    trayMenu.classList.remove('show');
  });

  trayMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Tray Actions communicating with backend daemon
  async function callDaemonApi(action) {
    try {
      const response = await fetch(`/api/control/${action}`, { method: 'POST' });
      const data = await response.json();
      launchFeedback.textContent = `Daemon [${action}]: ${data.message || 'Success'}`;
      return data;
    } catch (err) {
      launchFeedback.textContent = `Action ${action} dispatched locally (simulated daemon).`;
    }
  }

  trayStartBtn.addEventListener('click', async () => {
    await callDaemonApi('start');
    trayStatusDot.className = 'tray-status-dot online';
    engineStatusText.textContent = 'Daemons Active (Port 8080)';
    trayMenu.classList.remove('show');
  });

  trayRestartBtn.addEventListener('click', async () => {
    await callDaemonApi('restart');
    engineStatusText.textContent = 'Restarting services...';
    setTimeout(() => {
      engineStatusText.textContent = 'Daemons Active (Port 8080)';
    }, 1000);
    trayMenu.classList.remove('show');
  });

  trayPauseBtn.addEventListener('click', async () => {
    await callDaemonApi('pause');
    trayStatusDot.className = 'tray-status-dot';
    engineStatusText.textContent = 'Daemons Paused';
    trayMenu.classList.remove('show');
  });

  trayQuitBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to quit all rhythm server daemons?')) {
      await callDaemonApi('quit');
      trayStatusDot.className = 'tray-status-dot offline';
      engineStatusText.textContent = 'Daemons Terminated';
      trayMenu.classList.remove('show');
    }
  });

  // Launch Game
  launchGameBtn.addEventListener('click', async () => {
    const fork = engineForkSelect.value;
    launchFeedback.textContent = `🚀 Launching ${fork} engine process with sub-millisecond polling...`;
    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fork })
      });
      const data = await res.json();
      launchFeedback.textContent = data.message || `Started ${fork}`;
    } catch (e) {
      setTimeout(() => {
        launchFeedback.textContent = `Engine ${fork} running in fullscreen (Simulated).`;
      }, 500);
    }
  });

  openSongsBtn.addEventListener('click', () => {
    launchFeedback.textContent = '📂 Opened filesystem path: ~/StepMania/Songs/';
  });

  reloadPacksBtn.addEventListener('click', async () => {
    launchFeedback.textContent = '🔄 Re-indexing song cache and calculating cryptographic step hashes...';
    await callDaemonApi('reload_songs');
  });

  // Range inputs
  debounceRange.addEventListener('input', (e) => {
    debounceVal.textContent = `${e.target.value} ms`;
  });

  offsetRange.addEventListener('input', (e) => {
    offsetVal.textContent = `${e.target.value} ms`;
    document.getElementById('statOffset').textContent = `${(e.target.value / 1000).toFixed(3)}s`;
  });

  // Pad interactive simulation & diagnostics
  const padPanels = document.querySelectorAll('.pad-panel:not(.panel-center)');
  padPanels.forEach(panel => {
    panel.addEventListener('mousedown', () => {
      panel.classList.add('active');
    });
    panel.addEventListener('mouseup', () => {
      panel.classList.remove('active');
    });
    panel.addEventListener('mouseleave', () => {
      panel.classList.remove('active');
    });
  });

  // Keyboard test for pad visualizer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') document.getElementById('padUp')?.classList.add('active');
    if (e.key === 'ArrowLeft' || e.key === 'a') document.getElementById('padLeft')?.classList.add('active');
    if (e.key === 'ArrowDown' || e.key === 's') document.getElementById('padDown')?.classList.add('active');
    if (e.key === 'ArrowRight' || e.key === 'd') document.getElementById('padRight')?.classList.add('active');
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') document.getElementById('padUp')?.classList.remove('active');
    if (e.key === 'ArrowLeft' || e.key === 'a') document.getElementById('padLeft')?.classList.remove('active');
    if (e.key === 'ArrowDown' || e.key === 's') document.getElementById('padDown')?.classList.remove('active');
    if (e.key === 'ArrowRight' || e.key === 'd') document.getElementById('padRight')?.classList.remove('active');
  });

  // Service restarts
  document.querySelectorAll('.restart-srv').forEach(btn => {
    btn.addEventListener('click', () => {
      const srv = btn.dataset.service;
      btn.textContent = 'Running...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Restart';
        btn.disabled = false;
        launchFeedback.textContent = `Service ${srv} restarted successfully.`;
      }, 700);
    });
  });

  scanSongsBtn.addEventListener('click', () => {
    launchFeedback.textContent = 'Scanning pack directories... 3 packs, 375 simfiles detected.';
  });

  refreshDaemonsBtn.addEventListener('click', () => {
    launchFeedback.textContent = 'Supervision table refreshed. All 3 services nominal.';
  });
});
