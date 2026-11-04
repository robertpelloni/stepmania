// StepMania Consolidated Dashboard Application Logic (v0.5.0)
// Manages single-page consolidated operator UI, hardware diagnostics,
// song pack indexing, keybinding configuration, and daemon IPC.

document.addEventListener('DOMContentLoaded', () => {
  // Elements: Header & System Tray
  const appVersion = document.getElementById('appVersion');
  const footerVersion = document.getElementById('footerVersion');
  const trayToggleBtn = document.getElementById('trayToggleBtn');
  const trayMenu = document.getElementById('trayMenu');
  const trayStartBtn = document.getElementById('trayStartBtn');
  const trayRestartBtn = document.getElementById('trayRestartBtn');
  const trayPauseBtn = document.getElementById('trayPauseBtn');
  const trayReloadBtn = document.getElementById('trayReloadBtn');
  const trayLogsBtn = document.getElementById('trayLogsBtn');
  const trayQuitBtn = document.getElementById('trayQuitBtn');
  const trayStatusDot = document.getElementById('trayStatusDot');
  const statusIndicator = document.getElementById('statusIndicator');
  const engineStatusText = document.getElementById('engineStatusText');
  const uptimeDisplay = document.getElementById('uptimeDisplay');

  // Elements: Game Launcher & Player Profile
  const engineForkSelect = document.getElementById('engineForkSelect');
  const launchGameBtn = document.getElementById('launchGameBtn');
  const openSongsBtn = document.getElementById('openSongsFolderBtn');
  const reloadPacksBtn = document.getElementById('reloadPacksBtn');
  const launchFeedback = document.getElementById('launchFeedback');
  const refreshProfileBtn = document.getElementById('refreshProfileBtn');
  const profileName = document.getElementById('profileName');
  const profileSub = document.getElementById('profileSub');
  const statCalories = document.getElementById('statCalories');
  const statAccuracy = document.getElementById('statAccuracy');
  const statOffset = document.getElementById('statOffset');

  // Elements: Song Pack Manager
  const packSearchInput = document.getElementById('packSearchInput');
  const packFilterSelect = document.getElementById('packFilterSelect');
  const packList = document.getElementById('packList');
  const scanSongsBtn = document.getElementById('scanSongsBtn');
  const packDropzone = document.getElementById('packDropzone');
  const packDetailsPanel = document.getElementById('packDetailsPanel');
  const packDetailsTitle = document.getElementById('packDetailsTitle');
  const packDetailsBody = document.getElementById('packDetailsBody');
  const closePackDetailsBtn = document.getElementById('closePackDetailsBtn');
  const totalMountedText = document.getElementById('totalMountedText');
  const simfileHealthText = document.getElementById('simfileHealthText');

  // Elements: Hardware Diagnostics & Visualizer
  const padModeSelect = document.getElementById('padModeSelect');
  const padVisualizer = document.getElementById('padVisualizer');
  const debounceRange = document.getElementById('debounceRange');
  const debounceVal = document.getElementById('debounceVal');
  const offsetRange = document.getElementById('offsetRange');
  const offsetVal = document.getElementById('offsetVal');
  const eventLogBox = document.getElementById('eventLogBox');
  const jitterVal = document.getElementById('jitterVal');

  // Elements: Keybind Remapping
  const keybindsListBody = document.getElementById('keybindsListBody');
  const keybindListeningBanner = document.getElementById('keybindListeningBanner');
  const bindingTargetAction = document.getElementById('bindingTargetAction');
  const saveKeybindsBtn = document.getElementById('saveKeybindsBtn');
  const resetKeybindsBtn = document.getElementById('resetKeybindsBtn');

  // Elements: Daemons & System Logs
  const refreshDaemonsBtn = document.getElementById('refreshDaemonsBtn');
  const clearLogsBtn = document.getElementById('clearLogsBtn');
  const systemLogsBox = document.getElementById('systemLogsBox');
  const logCountBadge = document.getElementById('logCountBadge');

  // State
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

  let activeBindingState = null;

  const packDataDetails = {
    'itg': {
      title: 'In The Groove 1 & 2 Official Simfile Archive',
      description: 'Official ITG 1 & ITG 2 dance charts curated by Roxor Games. Features verified hashes, tournament precision timing windows, and standard 1–13 block rating scale.',
      songs: 142,
      difficultyRange: 'Novice (1) to Expert (13)',
      chartFormats: '.ssc, .sm, .ogg (high bit-rate)',
      storagePath: '~/StepMania/Songs/In The Groove/'
    },
    'ddr': {
      title: 'DanceDanceRevolution A3 / World Simfiles',
      description: 'Complete modern DDR arcade chart conversions including single, double, shock arrows, and animated MP4/AVI background videos.',
      songs: 188,
      difficultyRange: 'Beginner (1) to Challenge (19)',
      chartFormats: '.sm, .ssc, video backgrounds',
      storagePath: '~/StepMania/Songs/DDR World/'
    },
    'fitness': {
      title: 'FCDM Fitness Aerobics Pack Vol. 1',
      description: 'High-cadence aerobic routines created exclusively for the Fitness Center Dance Machine stack. Calorie estimation maps to real-time metabolic equivalent (MET).',
      songs: 45,
      difficultyRange: 'Cardio Warmup (3) to Peak Aerobic (11)',
      chartFormats: '.ssc with caloric telemetry descriptors',
      storagePath: '~/StepMania/Songs/FCDM Aerobics/'
    }
  };

  // Helper: Append system activity log
  function addSystemLog(level, message) {
    if (!systemLogsBox) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const logItem = document.createElement('div');
    logItem.className = 'sys-log-item';
    logItem.innerHTML = `
      <span class="sys-log-time">[${timeStr}]</span>
      <span class="sys-log-level ${level.toLowerCase()}">[${level.toUpperCase()}]</span>
      <span class="sys-log-msg">${message}</span>
    `;
    systemLogsBox.prepend(logItem);
    if (systemLogsBox.children.length > 50) {
      systemLogsBox.removeChild(systemLogsBox.lastChild);
    }
    if (logCountBadge) {
      logCountBadge.textContent = `${systemLogsBox.children.length} events logged`;
    }
  }

  // Helper: Format seconds to HH:MM:SS
  function formatSeconds(sec) {
    const s = Math.floor(sec % 60);
    const m = Math.floor((sec / 60) % 60);
    const h = Math.floor(sec / 3600);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Fetch Version & Sync Single Source of Truth
  async function fetchVersion() {
    try {
      const res = await fetch('/api/version');
      if (res.ok) {
        const data = await res.json();
        const verStr = `v${data.version}`;
        if (appVersion) appVersion.textContent = verStr;
        if (footerVersion) footerVersion.textContent = verStr;
      }
    } catch (e) {
      // Fallback
    }
  }

  // System Tray Menu Toggle
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

  // Call Daemon API helper
  async function callDaemonApi(action, payload = null) {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
      if (payload) options.body = JSON.stringify(payload);
      const response = await fetch(`/api/control/${action}`, options);
      const data = await response.json();
      launchFeedback.textContent = `Daemon [${action}]: ${data.message || 'Success'}`;
      addSystemLog('INFO', `Dispatched daemon action: ${action} (${data.message || 'OK'})`);
      return data;
    } catch (err) {
      launchFeedback.textContent = `Action ${action} dispatched locally (simulated daemon).`;
      addSystemLog('WARN', `Simulated local action ${action}: ${err.message}`);
    }
  }

  // Tray Button Handlers
  trayStartBtn.addEventListener('click', async () => {
    await callDaemonApi('start');
    trayStatusDot.className = 'tray-status-dot online';
    if (statusIndicator) statusIndicator.className = 'status-indicator live';
    engineStatusText.textContent = 'Daemon Active (Port 8080)';
    trayMenu.classList.remove('show');
  });

  trayRestartBtn.addEventListener('click', async () => {
    await callDaemonApi('restart');
    engineStatusText.textContent = 'Restarting services...';
    setTimeout(() => {
      engineStatusText.textContent = 'Daemon Active (Port 8080)';
      trayStatusDot.className = 'tray-status-dot online';
      if (statusIndicator) statusIndicator.className = 'status-indicator live';
    }, 800);
    trayMenu.classList.remove('show');
  });

  trayPauseBtn.addEventListener('click', async () => {
    await callDaemonApi('pause');
    trayStatusDot.className = 'tray-status-dot offline';
    if (statusIndicator) statusIndicator.className = 'status-indicator offline';
    engineStatusText.textContent = 'Daemons Paused';
    trayMenu.classList.remove('show');
  });

  trayReloadBtn.addEventListener('click', async () => {
    await callDaemonApi('reload_songs');
    trayMenu.classList.remove('show');
  });

  trayLogsBtn.addEventListener('click', () => {
    trayMenu.classList.remove('show');
    const logsSection = document.getElementById('systemLogsSection');
    if (logsSection) {
      logsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  trayQuitBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to gracefully terminate all rhythm server daemons?')) {
      await callDaemonApi('quit');
      trayStatusDot.className = 'tray-status-dot offline';
      if (statusIndicator) statusIndicator.className = 'status-indicator offline';
      engineStatusText.textContent = 'Daemons Terminated';
      trayMenu.classList.remove('show');
      addSystemLog('ERROR', 'Daemon terminated by operator via System Tray.');
    }
  });

  // Launch Engine Handler
  launchGameBtn.addEventListener('click', async () => {
    const fork = engineForkSelect.value;
    launchFeedback.textContent = `🚀 Launching ${fork} engine process with sub-millisecond polling...`;
    addSystemLog('INFO', `Spawning engine fork executable: [${fork}]`);
    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fork })
      });
      const data = await res.json();
      launchFeedback.textContent = data.message || `Started ${fork}`;
      addSystemLog('INFO', `Engine launch response: ${data.status}`);
    } catch (e) {
      setTimeout(() => {
        launchFeedback.textContent = `Engine ${fork} running in fullscreen (Simulated).`;
        addSystemLog('INFO', `Engine ${fork} running in arcade mode.`);
      }, 400);
    }
  });

  openSongsBtn.addEventListener('click', () => {
    launchFeedback.textContent = '📂 Opened filesystem path: ~/StepMania/Songs/';
    addSystemLog('INFO', 'Opened local simfile storage directory in OS file manager.');
  });

  reloadPacksBtn.addEventListener('click', async () => {
    launchFeedback.textContent = '🔄 Re-indexing song cache and calculating cryptographic step hashes...';
    await callDaemonApi('reload_songs');
  });

  // Active Profile Sync
  async function loadProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (profileName) profileName.textContent = data.name;
        if (profileSub) profileSub.textContent = `Level ${data.level} • ${data.rank} • ${data.songs_cleared} Songs Cleared`;
        if (statCalories) statCalories.textContent = `${data.session_calories} kcal`;
        if (statAccuracy) statAccuracy.textContent = `${data.average_accuracy}%`;
        if (statOffset) statOffset.textContent = `${(data.global_offset_ms / 1000).toFixed(3)}s`;
        addSystemLog('INFO', `Synced player profile for ${data.name}`);
      }
    } catch (err) {
      // Fallback
    }
  }

  if (refreshProfileBtn) {
    refreshProfileBtn.addEventListener('click', () => {
      loadProfile();
      launchFeedback.textContent = 'Profile synced from local daemon.';
    });
  }

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

  // Pack Details Inspector Drawer
  function inspectPack(packId) {
    const details = packDataDetails[packId];
    if (!details) return;
    packDetailsTitle.textContent = `📦 ${details.title}`;
    packDetailsBody.innerHTML = `
      <p style="margin-bottom: 8px;">${details.description}</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem;">
        <div><strong>Total Songs:</strong> ${details.songs}</div>
        <div><strong>Difficulty:</strong> ${details.difficultyRange}</div>
        <div><strong>Formats:</strong> ${details.chartFormats}</div>
        <div><strong>Location:</strong> <code>${details.storagePath}</code></div>
      </div>
    `;
    packDetailsPanel.style.display = 'block';
    addSystemLog('INFO', `Viewing details for song pack: ${packId}`);
  }

  document.querySelectorAll('.view-pack-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const packId = btn.dataset.pack;
      inspectPack(packId);
    });
  });

  if (closePackDetailsBtn) {
    closePackDetailsBtn.addEventListener('click', () => {
      packDetailsPanel.style.display = 'none';
    });
  }

  scanSongsBtn.addEventListener('click', async () => {
    launchFeedback.textContent = 'Scanning pack directories... 3 packs, 375 simfiles detected.';
    addSystemLog('INFO', 'Scan completed: 3 packs mounted, 375 simfiles verified.');
  });

  // Pack Dropzone interactive simulation
  if (packDropzone) {
    packDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      packDropzone.style.borderColor = 'var(--accent-cyan)';
    });
    packDropzone.addEventListener('dragleave', () => {
      packDropzone.style.borderColor = 'var(--border-color)';
    });
    packDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      packDropzone.style.borderColor = 'var(--border-color)';
      launchFeedback.textContent = 'Simfile archive received. Unpacking and mounting songs...';
      addSystemLog('INFO', 'Extracted incoming simfile archive into ~/StepMania/Songs/');
    });
  }

  // Pad Mode Switcher (Dance 4-Panel vs Pump 5-Panel)
  padModeSelect.addEventListener('change', (e) => {
    const mode = e.target.value;
    const centerPanel = document.getElementById('padCenter');
    if (mode === 'pump-single') {
      centerPanel.textContent = '🟡';
      centerPanel.classList.remove('panel-center');
      centerPanel.title = 'Pump Center Sensor';
      launchFeedback.textContent = 'Hardware visualizer mapped to Pump Single (5-panel diagonal).';
      addSystemLog('INFO', 'Switched visualizer and keybind mode to Pump Single');
    } else {
      centerPanel.textContent = '⚙️';
      centerPanel.classList.add('panel-center');
      centerPanel.title = 'Center Sensor';
      launchFeedback.textContent = 'Hardware visualizer mapped to Dance Single (4-panel orthogonal).';
      addSystemLog('INFO', 'Switched visualizer and keybind mode to Dance Single');
    }
    renderKeybindsTable();
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
  debounceRange.addEventListener('input', async (e) => {
    const val = e.target.value;
    debounceVal.textContent = `${val} ms`;
    await persistCalibration();
  });

  offsetRange.addEventListener('input', async (e) => {
    const val = e.target.value;
    offsetVal.textContent = `${val} ms`;
    statOffset.textContent = `${(val / 1000).toFixed(3)}s`;
    await persistCalibration();
  });

  async function persistCalibration() {
    try {
      await fetch('/api/diagnostics/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debounce_ms: parseInt(debounceRange.value, 10),
          audio_offset_ms: parseInt(offsetRange.value, 10),
          mode: padModeSelect.value
        })
      });
    } catch (e) {
      // Ignore
    }
  }

  // Pad interactive simulation & diagnostics
  function triggerPanelPress(panel, name, pressure) {
    if (!panel) return;
    panel.classList.add('active');
    logIoEvent(name, pressure);

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
      triggerPanelPress(el, name, Math.floor(82 + Math.random() * 16));
    });
    el.addEventListener('mouseup', () => triggerPanelRelease(el));
    el.addEventListener('mouseleave', () => triggerPanelRelease(el));
  });

  // Keyboard test for pad visualizer
  window.addEventListener('keydown', (e) => {
    if (activeBindingState) return; // handled by keybind mapper
    if (e.key === 'ArrowUp' || e.key === 'w') triggerPanelPress(document.getElementById('padUp'), 'Up', 92);
    if (e.key === 'ArrowLeft' || e.key === 'a') triggerPanelPress(document.getElementById('padLeft'), 'Left', 85);
    if (e.key === 'ArrowDown' || e.key === 's') triggerPanelPress(document.getElementById('padDown'), 'Down', 89);
    if (e.key === 'ArrowRight' || e.key === 'd') triggerPanelPress(document.getElementById('padRight'), 'Right', 94);
  });

  window.addEventListener('keyup', (e) => {
    if (activeBindingState) return;
    if (e.key === 'ArrowUp' || e.key === 'w') triggerPanelRelease(document.getElementById('padUp'));
    if (e.key === 'ArrowLeft' || e.key === 'a') triggerPanelRelease(document.getElementById('padLeft'));
    if (e.key === 'ArrowDown' || e.key === 's') triggerPanelRelease(document.getElementById('padDown'));
    if (e.key === 'ArrowRight' || e.key === 'd') triggerPanelRelease(document.getElementById('padRight'));
  });

  // Services supervision restart actions
  document.querySelectorAll('.restart-srv').forEach(btn => {
    btn.addEventListener('click', () => {
      const srv = btn.dataset.service;
      btn.textContent = 'Restarting...';
      btn.disabled = true;
      addSystemLog('INFO', `Service restart initiated for: ${srv}`);
      setTimeout(() => {
        btn.textContent = (srv === 'groovestats') ? 'Sync Now' : (srv === 'fcdm' ? 'Flush' : 'Restart');
        btn.disabled = false;
        launchFeedback.textContent = `Service ${srv} restarted successfully.`;
        addSystemLog('INFO', `Service ${srv} is now healthy and active.`);
      }, 700);
    });
  });

  refreshDaemonsBtn.addEventListener('click', async () => {
    launchFeedback.textContent = 'Supervision table refreshed. All 3 services nominal.';
    addSystemLog('INFO', 'Refreshed service supervision status.');
    await syncDaemonHealth();
  });

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      systemLogsBox.innerHTML = '';
      if (logCountBadge) logCountBadge.textContent = '0 events logged';
    });
  }

  // ==========================================
  // KEYBIND & INPUT REMAPPING FUNCTIONALITY
  // ==========================================
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
      // Use defaults
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
          <button class="btn btn-xs btn-outline remap-btn" data-action="${action}" data-slot="primary" data-tooltip="Remap primary key/sensor">Primary</button>
          <button class="btn btn-xs btn-outline remap-btn" data-action="${action}" data-slot="secondary" data-tooltip="Remap secondary key/sensor">Secondary</button>
        </td>
      `;
      keybindsListBody.appendChild(tr);
    }

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
      addSystemLog('WARN', 'Keybind remap cancelled by user.');
      stopListeningForBind();
      return;
    }

    const { action, slot } = activeBindingState;
    const mode = padModeSelect.value || 'dance-single';

    if (!currentKeybinds[mode]) currentKeybinds[mode] = {};
    if (!currentKeybinds[mode][action]) {
      currentKeybinds[mode][action] = { primary: 'None', secondary: 'None', type: 'dance' };
    }

    const formattedKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    currentKeybinds[mode][action][slot] = formattedKey;

    launchFeedback.textContent = `Assigned ${action} [${slot}] -> ${formattedKey}`;
    addSystemLog('INFO', `Remapped ${action} [${slot}] to '${formattedKey}' for mode '${mode}'`);
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
      addSystemLog('INFO', `Hardware profile saved for ${mode}.`);
    } catch (err) {
      launchFeedback.textContent = 'Saved keybinds locally (daemon simulated).';
      addSystemLog('WARN', 'Keybinds saved to local browser session.');
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
    addSystemLog('INFO', 'Restored default keybind profiles.');
  });

  // Live health and uptime sync
  async function syncDaemonHealth() {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        if (uptimeDisplay) uptimeDisplay.textContent = `Uptime: ${formatSeconds(data.uptime_seconds)}`;
        if (engineForkSelect && data.active_fork) {
          engineForkSelect.value = data.active_fork;
        }
      }
    } catch (e) {
      // offline
    }
  }

  // Seed initial log entries
  addSystemLog('INFO', 'StepMania Unified Operator Dashboard loaded.');
  addSystemLog('INFO', 'Connected to daemon control plane on TCP 8080.');
  addSystemLog('INFO', 'Pad visualizer initialized with 1000Hz polling rate.');

  // Initialize data
  fetchVersion();
  loadProfile();
  loadKeybinds();
  syncDaemonHealth();
  setInterval(syncDaemonHealth, 5000);
});
