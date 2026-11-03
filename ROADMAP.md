# ROADMAP.md — Strategic & Long-Term Milestones

## Phase 1: Ecosystem Alignment & Governance (Completed)
- [x] Standardize repository structure and governance docs (`VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`, `CHANGELOG.md`, `VERSION.md`).
- [x] Establish clear mapping between `stepmania`, `bobmania`, `itgmania`, and `fcdm`.

## Phase 2: Centralized Rhythm Suite Dashboard Specification & Prototype (Completed)
- [x] Design single-page consolidated UI layout uniting game launching, pad calibration, profile stats, and daemon supervision.
- [x] Implement backend HTTP server daemon (`dashboard/daemon.py`) and system tray CLI/service (`dashboard/tray_service.py`).
- [x] Add interactive tooltips, badges, and inline explanations for operator settings.
- [x] Add automated orchestration scripts (`scripts/run_dashboard.sh`, `scripts/stop_dashboard.sh`).

## Phase 3: Hardware Integration & Native IPC Bridges (Next)
- [ ] Connect live Linux `evdev` / HID raw sockets to feed physical dance pad sensor presses directly into the visualizer.
- [ ] Connect live Groovestats API key verification into the Operator Dashboard settings modal.
- [ ] Build Electron / Webview native wrapper package with OS desktop system tray icon integration.
