# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-10-22

### Added
- **Song Pack Manager Enhancements** (`dashboard/`):
  - Real-time client-side pack search bar and style/category dropdown filters (`All`, `ITG`, `DDR`, `Fitness`).
  - Pack details inspection trigger with difficulty ranges, song counts, and pack health metrics.
  - Backend REST API endpoint: `GET /api/packs` providing song counts and mount state.
- **Hardware Diagnostics & IO Stream Upgrades**:
  - Pad layout mode toggle: Dance Single (4-panel DDR/ITG) vs. Pump Single (5-panel diagonal).
  - Individual live sensor sensitivity and pressure meters for each panel (LEFT, UP, DOWN, RIGHT).
  - Live IO event stream and polling jitter monitor tracking timestamped input events and duration.
  - Backend calibration endpoints: `GET /api/diagnostics/pad` and `POST /api/diagnostics/calibrate`.
- **Automated Health & Telemetry Probing**:
  - `scripts/monitor_health.py` for automated health, latency, and performance monitoring.
- **Automated Integration Test Suite**:
  - `tests/test_daemon.py` covering 9 integration tests spanning REST APIs, tray CLI, calibration, and health checking.

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
