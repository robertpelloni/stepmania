# HANDOFF.md — Session Continuity & System State

## Session Overview
- **Repository**: `robertpelloni/stepmania`
- **Current Version**: 0.2.0 (`VERSION.md`)
- **Nature of Repository**: Rhythm gaming hub and consolidated operator control plane for Robert Pelloni's rhythm suite (`bobmania`, `itgmania`, `fcdm`).

## System Architecture Summary
- **Single-Page Dashboard**: Lives in `dashboard/` (`index.html`, `styles.css`, `app.js`). Consolidates game launcher, player profile, song pack manager, pad visualizer, and daemon supervisor onto a single uncluttered page.
- **Backend Daemon**: `dashboard/daemon.py` runs on port 8080.
- **System Tray Agent**: Accessible via web UI system tray button and CLI controller `dashboard/tray_service.py` (`status`, `start`, `restart`, `pause`, `quit`).
- **Scripts**: `scripts/run_dashboard.sh` and `scripts/stop_dashboard.sh`.

## Verification Status
- Daemon health and control API validated via curl.
- Static dashboard assets delivered and verified.
