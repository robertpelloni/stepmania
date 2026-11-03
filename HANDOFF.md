# HANDOFF.md — Session Continuity & System State

## Session Overview
- **Repository**: `robertpelloni/stepmania`
- **Current Version**: 0.3.0 (`VERSION.md`)
- **Nature of Repository**: Rhythm gaming hub, unified single-page dashboard, and operator control plane for Robert Pelloni's rhythm suite (`bobmania`, `itgmania`, `fcdm`).

## System Architecture Summary
- **Single-Page Dashboard**: Located in `dashboard/` (`index.html`, `styles.css`, `app.js`).
  - High-value launcher & fitness player profile.
  - Song Pack Manager with real-time text search and style filtering.
  - Hardware Diagnostics with 4-panel / 5-panel layout switcher, 4-panel sensor pressure bars, and live IO event log with jitter calculation.
  - Server daemon supervision table.
- **Backend Daemon**: `dashboard/daemon.py` on port 8080 with `/health`, `/api/packs`, `/api/diagnostics/pad`, `/api/control/*`, `/api/launch`.
- **System Tray Agent**: Web UI popup and CLI tool `dashboard/tray_service.py`.

## Verification Status
- Validated via Playwright screenshot in `/home/jules/verification/dashboard_v0.3.0.png`.
- Backend endpoints queried and verified.
