# TODO.md — Action Items & Short-Term Tasks

## Single-Page Dashboard Redesign & Unified Orchestration (v0.5.0)
- [x] Consolidate dashboard layout into strict single-page view prioritizing highest-value features (Hero Launcher + Player Profile).
- [x] Implement interactive Song Pack details drawer showing difficulty breakdown, chart formats, and storage path.
- [x] Dynamically load version from `VERSION.md` as single source of truth across `/api/version`, daemon header, and UI badge.
- [x] Add `/api/profile` for active player and operator metrics.
- [x] Add `/api/logs` endpoint and live activity log stream in UI and system tray.
- [x] Add unified CLI script `scripts/dashboard_ctl.sh` unifying start, stop, restart, probe, logs, and test workflows.
- [x] Expand `tests/test_daemon.py` to 13 integration tests.
- [x] Perform Playwright headless browser test and capture full-page screenshot `verification/dashboard_single_page.png`.

## Keybinds & Hardware Configuration (v0.4.0 - v0.5.0)
- [x] Design Keybind Manager HTML and CSS under Hardware Diagnostics.
- [x] Implement dynamic keybinds table rendering and mode switching.
- [x] Add live press-to-bind listener banner with ESC cancel.
- [x] Implement backend `GET /api/keybinds` and `POST /api/keybinds` in `dashboard/daemon.py`.
- [x] Add unit and integration tests for keybinds in `tests/test_daemon.py`.
- [x] Support reset to factory defaults and save confirmation.
- [x] Add arcade operator actions (`Coin`, `Service`, `OperatorMenu`) to keybind mappings.
- [x] Add category filters (`All`, `Gameplay`, `Navigation`, `Arcade Cabinet`) in keybind manager.
- [x] Add individual `Clear` action buttons per keybind row.

## Future Milestones
- [ ] Connect WebSocket feed to real-time StepMania 5 / OutFox / ITGmania memory state.
- [ ] Implement direct Linux `evdev` raw USB device binding for physical pads.
