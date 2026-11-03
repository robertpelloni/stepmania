# TODO.md — Action Items & Short-Term Tasks

## Dashboard & System Tray Implementation (v0.2.0)
- [x] Create single-page consolidated Operator & Player Dashboard in `dashboard/index.html`.
- [x] Design modern cyberpunk arcade dark theme in `dashboard/styles.css`.
- [x] Implement UI reactivity, pad simulation, and daemon controls in `dashboard/app.js`.
- [x] Build multi-threaded HTTP/REST daemon `dashboard/daemon.py` with `/health`, `/api/control/*`, and `/api/launch`.
- [x] Build system tray controller CLI `dashboard/tray_service.py`.
- [x] Add operational startup and shutdown scripts in `scripts/`.
- [x] Verify API endpoints and capture frontend screenshot verification.

## Future Milestones
- [ ] Implement native OS tray integration via `pystray` or QT for desktop daemon mode.
- [ ] Connect WebSocket feed to real-time StepMania 5 memory offsets / OutFox / ITGmania JSON output.
