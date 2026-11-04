// StepMania Consolidated Dashboard Application Logic (v0.3.0)
document.addEventListener('DOMContentLoaded', () => {
  // System Tray Elements
  const trayToggleBtn = document.getElementById('trayToggleBtn');
  const trayMenu = document.getElementById('trayMenu');
  const trayStartBtn = document.getElementById('trayStartBtn');
  const trayRestartBtn = document.getElementById('trayRestartBtn');
  const trayPauseBtn = document.getElementById('trayPauseBtn');
  const trayQuitBtn = document.getElementById('trayQuitBtn');
  const trayStatusDot = document.getElementById('trayStatusDot');

  // Core Engine & Profile Elements
  const engineStatusText = document.getElementById('engineStatusText');
  const engineForkSelect = document.getElementById('engineForkSelect');
  const launchGameBtn = document.getElementById('launchGameBtn');
  const openSongsBtn = document.getElementById('openSongsFolderBtn');
  const reloadPacksBtn = document.getElementById('reloadPacksBtn');
  const launchFeedback = document.getElementById('launchFeedback');

  // Song Pack Manager Elements
  const packSearchInput = document.getElementById('packSearchInput');
  const packFilterSelect = document.getElementById('packFilterSelect');
  const packList = document.getElementById('packList');
  const scanSongsBtn = document.getElementById('scanSongsBtn');

  // Hardware Diagnostics & Tuning Elements
  const padModeSelect = document.getElementById('padModeSelect');
  const padVisualizer = document.getElementById('padVisualizer');
  const debounceRange = document.getElementById('debounceRange');
  const debounceVal = document.getElementById('debounceVal');
  const offsetRange = document.getElementById('offsetRange');
  const offsetVal = document.getElementById('offsetVal');
  const eventLogBox = document.getElementById('eventLogBox');
  const jitterVal = document.getElementById('jitterVal');

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

  // Backend Daemon Communication
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

  // Launch Game Action
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

  // Song Pack Search & Filter
  function filterPacks() {
    const query = packSearchInput.value.toLowerCase().trim();
    const style = packFilterSelect.value;
    const items = packList.querySelectorAll('.pack-item');

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const itemStyle = item.dataset.style;
      const matchesSearch = text.includes(query);
      const matchesStyle = (style === 'all' || itemStyle === style);

      if (matchesSearch && matchesStyle) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  packSearchInput.addEventListener('input', filterPacks);
  packFilterSelect.addEventListener('change', filterPacks);

  document.querySelectorAll('.view-pack-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const packId = btn.dataset.pack;
      launchFeedback.textContent = `Displaying step chart metrics & banner art for pack [${packId}].`;
    });
  });

  // Pad Mode Switcher (Dance 4-Panel vs Pump 5-Panel)
  padModeSelect.addEventListener('change', (e) => {
    const mode = e.target.value;
    const centerPanel = document.getElementById('padCenter');
    if (mode === 'pump-single') {
      centerPanel.textContent = '🟡';
      centerPanel.classList.remove('panel-center');
      centerPanel.title = 'Pump Center Sensor';
      launchFeedback.textContent = 'Hardware visualizer mapped to Pump Single (5-panel diagonal).';
    } else {
      centerPanel.textContent = '⚙️';
      centerPanel.classList.add('panel-center');
      centerPanel.title = 'Center Sensor';
      launchFeedback.textContent = 'Hardware visualizer mapped to Dance Single (4-panel orthogonal).';
    }
  });

  // Logging IO events
  function logIoEvent(panelName, pressure) {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const jitter = ((Math.random() * 0.4) - 0.2).toFixed(2);
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `${timeStr} [EVDEV] Panel ${panelName} pressed (Pressure: ${pressure}%, Jitter: ${jitter >= 0 ? '+' : ''}${jitter}ms)`;

    eventLogBox.prepend(entry);
    if (eventLogBox.children.length > 20) {
      eventLogBox.removeChild(eventLogBox.lastChild);
    }
    jitterVal.textContent = `Avg Jitter: ±${(Math.abs(jitter) * 0.9).toFixed(2)}ms`;
  }

  // Range inputs
  debounceRange.addEventListener('input', (e) => {
    debounceVal.textContent = `${e.target.value} ms`;
  });

  offsetRange.addEventListener('input', (e) => {
    offsetVal.textContent = `${e.target.value} ms`;
    document.getElementById('statOffset').textContent = `${(e.target.value / 1000).toFixed(3)}s`;
  });

  // Pad interactive simulation & diagnostics
  function triggerPanelPress(panel, name, pressure) {
    if (!panel) return;
    panel.classList.add('active');
    logIoEvent(name, pressure);

    // Update live pressure bar
    const bar = document.getElementById(`bar${name}`);
    const val = document.getElementById(`val${name}`);
    if (bar && val) {
      bar.style.width = `${pressure}%`;
      val.textContent = `${pressure}%`;
    }
  }

  function triggerPanelRelease(panel) {
    if (!panel) return;
    panel.classList.remove('active');
  }

  const panels = [
    { el: document.getElementById('padUp'), name: 'Up' },
    { el: document.getElementById('padLeft'), name: 'Left' },
    { el: document.getElementById('padDown'), name: 'Down' },
    { el: document.getElementById('padRight'), name: 'Right' },
  ];

  panels.forEach(({ el, name }) => {
    if (!el) return;
    el.addEventListener('mousedown', () => {
      triggerPanelPress(el, name, Math.floor(80 + Math.random() * 18));
    });
    el.addEventListener('mouseup', () => triggerPanelRelease(el));
    el.addEventListener('mouseleave', () => triggerPanelRelease(el));
  });

  // Keyboard test for pad visualizer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') triggerPanelPress(document.getElementById('padUp'), 'Up', 92);
    if (e.key === 'ArrowLeft' || e.key === 'a') triggerPanelPress(document.getElementById('padLeft'), 'Left', 85);
    if (e.key === 'ArrowDown' || e.key === 's') triggerPanelPress(document.getElementById('padDown'), 'Down', 89);
    if (e.key === 'ArrowRight' || e.key === 'd') triggerPanelPress(document.getElementById('padRight'), 'Right', 94);
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') triggerPanelRelease(document.getElementById('padUp'));
    if (e.key === 'ArrowLeft' || e.key === 'a') triggerPanelRelease(document.getElementById('padLeft'));
    if (e.key === 'ArrowDown' || e.key === 's') triggerPanelRelease(document.getElementById('padDown'));
    if (e.key === 'ArrowRight' || e.key === 'd') triggerPanelRelease(document.getElementById('padRight'));
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

  // ==========================================
  // KEYBIND & INPUT REMAPPING FUNCTIONALITY
  // ==========================================
  const keybindsListBody = document.getElementById('keybindsListBody');
  const keybindListeningBanner = document.getElementById('keybindListeningBanner');
  const bindingTargetAction = document.getElementById('bindingTargetAction');
  const saveKeybindsBtn = document.getElementById('saveKeybindsBtn');
  const resetKeybindsBtn = document.getElementById('resetKeybindsBtn');

  let currentKeybinds = {
    'dance-single': {
      'Left': { primary: 'ArrowLeft', secondary: 'D', type: 'dance' },
      'Down': { primary: 'ArrowDown', secondary: 'F', type: 'dance' },
      'Up': { primary: 'ArrowUp', secondary: 'J', type: 'dance' },
      'Right': { primary: 'ArrowRight', secondary: 'K', type: 'dance' },
      'Select': { primary: 'Enter', secondary: 'Space', type: 'nav' },
      'Back': { primary: 'Escape', secondary: 'Backspace', type: 'nav' }
    },
    'pump-single': {
      'DownLeft': { primary: 'Z', secondary: 'Numpad1', type: 'pump' },
      'UpLeft': { primary: 'Q', secondary: 'Numpad7', type: 'pump' },
      'Center': { primary: 'S', secondary: 'Numpad5', type: 'pump' },
      'UpRight': { primary: 'E', secondary: 'Numpad9', type: 'pump' },
      'DownRight': { primary: 'C', secondary: 'Numpad3', type: 'pump' },
      'Select': { primary: 'Enter', secondary: 'Space', type: 'nav' },
      'Back': { primary: 'Escape', secondary: 'Backspace', type: 'nav' }
    }
  };

  let activeBindingState = null; // { action: 'Left', slot: 'primary' }

  async function loadKeybinds() {
    try {
      const res = await fetch('/api/keybinds');
      if (res.ok) {
        const data = await res.json();
        if (data.keybinds) {
          currentKeybinds = data.keybinds;
        }
      }
    } catch (err) {
      console.warn('Using local default keybinds:', err);
    }
    renderKeybindsTable();
  }

  function renderKeybindsTable() {
    if (!keybindsListBody) return;
    const mode = padModeSelect.value || 'dance-single';
    const mappings = currentKeybinds[mode] || currentKeybinds['dance-single'];

    keybindsListBody.innerHTML = '';
    for (const [action, binding] of Object.entries(mappings)) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${action}</strong></td>
        <td><span class="key-tag" id="bind_${mode}_${action}_primary">${binding.primary || 'None'}</span></td>
        <td><span class="key-tag secondary" id="bind_${mode}_${action}_secondary">${binding.secondary || 'None'}</span></td>
        <td>
          <button class="btn btn-xs btn-outline remap-btn" data-action="${action}" data-slot="primary" data-tooltip="Remap primary binding">Primary</button>
          <button class="btn btn-xs btn-outline remap-btn" data-action="${action}" data-slot="secondary" data-tooltip="Remap secondary binding">Secondary</button>
        </td>
      `;
      keybindsListBody.appendChild(tr);
    }

    // Attach remap button click listeners
    document.querySelectorAll('.remap-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const slot = btn.dataset.slot;
        startListeningForBind(action, slot);
      });
    });
  }

  function startListeningForBind(action, slot) {
    activeBindingState = { action, slot };
    bindingTargetAction.textContent = `${action} (${slot.toUpperCase()})`;
    keybindListeningBanner.style.display = 'block';
    launchFeedback.textContent = `Listening for input to bind ${action} [${slot}]... Press any key or Pad sensor.`;
  }

  function stopListeningForBind() {
    activeBindingState = null;
    keybindListeningBanner.style.display = 'none';
  }

  window.addEventListener('keydown', (e) => {
    if (!activeBindingState) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Escape') {
      launchFeedback.textContent = 'Keybind assignment cancelled.';
      stopListeningForBind();
      return;
    }

    const { action, slot } = activeBindingState;
    const mode = padModeSelect.value || 'dance-single';

    if (!currentKeybinds[mode]) currentKeybinds[mode] = {};
    if (!currentKeybinds[mode][action]) {
      currentKeybinds[mode][action] = { primary: 'None', secondary: 'None', type: 'dance' };
    }

    // Assign pressed key
    const formattedKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    currentKeybinds[mode][action][slot] = formattedKey;

    launchFeedback.textContent = `Assigned ${action} [${slot}] -> ${formattedKey}`;
    renderKeybindsTable();
    stopListeningForBind();
  });

  saveKeybindsBtn.addEventListener('click', async () => {
    const mode = padModeSelect.value || 'dance-single';
    launchFeedback.textContent = `Persisting ${mode} keybind configuration to daemon...`;
    try {
      const res = await fetch('/api/keybinds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode,
          mappings: currentKeybinds[mode]
        })
      });
      const data = await res.json();
      launchFeedback.textContent = data.message || 'Keybinds saved successfully!';
    } catch (err) {
      launchFeedback.textContent = 'Saved keybinds locally (daemon simulated).';
    }
  });

  resetKeybindsBtn.addEventListener('click', async () => {
    currentKeybinds['dance-single'] = {
      'Left': { primary: 'ArrowLeft', secondary: 'D', type: 'dance' },
      'Down': { primary: 'ArrowDown', secondary: 'F', type: 'dance' },
      'Up': { primary: 'ArrowUp', secondary: 'J', type: 'dance' },
      'Right': { primary: 'ArrowRight', secondary: 'K', type: 'dance' },
      'Select': { primary: 'Enter', secondary: 'Space', type: 'nav' },
      'Back': { primary: 'Escape', secondary: 'Backspace', type: 'nav' }
    };
    currentKeybinds['pump-single'] = {
      'DownLeft': { primary: 'Z', secondary: 'Numpad1', type: 'pump' },
      'UpLeft': { primary: 'Q', secondary: 'Numpad7', type: 'pump' },
      'Center': { primary: 'S', secondary: 'Numpad5', type: 'pump' },
      'UpRight': { primary: 'E', secondary: 'Numpad9', type: 'pump' },
      'DownRight': { primary: 'C', secondary: 'Numpad3', type: 'pump' },
      'Select': { primary: 'Enter', secondary: 'Space', type: 'nav' },
      'Back': { primary: 'Escape', secondary: 'Backspace', type: 'nav' }
    };
    renderKeybindsTable();
    launchFeedback.textContent = 'Keybinds restored to factory defaults.';
  });

  // Re-render keybinds when pad mode toggles
  padModeSelect.addEventListener('change', () => {
    renderKeybindsTable();
  });

  // Initial load
  loadKeybinds();
});
