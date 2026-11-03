# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-10-22

### Added
- **Unified Single-Page Operator & Player Dashboard** (`dashboard/`):
  - Consolidated single-page architecture eliminating fragmented navigation.
  - Prominent high-value Game Launcher & Active Player Profile card.
  - Interactive Song Pack Manager with drag-and-drop installer zone.
  - Hardware Diagnostics & 1000Hz USB Dance Pad Visualizer with debounce and audio sync calibration.
  - Multi-service daemon supervision table for bobmania, itgmania, and fcdm.
  - Interactive tooltips (`[data-tooltip]`) and contextual guidance badges across all controls.
- **System Tray Controller & Background Daemon**:
  - `dashboard/daemon.py`: Multi-threaded HTTP/REST server providing health checks, IPC engine launch endpoints, and graceful termination.
  - `dashboard/tray_service.py`: CLI and tray controller for daemon actions (`status`, `start`, `restart`, `pause`, `quit`).
  - Web System Tray interface with popup controls and live indicator dot.
- **Operational Scripts**:
  - `scripts/run_dashboard.sh`: Automated daemon startup and port orchestration.
  - `scripts/stop_dashboard.sh`: Graceful shutdown signal dispatch.

## [0.1.0] - 2026-10-22

### Added
- Standard project governance and architecture documentation:
  - `VERSION.md`, `VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`, `README.md`.
