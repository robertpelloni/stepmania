# stepmania (Unified Rhythm Suite & Operator Dashboard)

[![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)](VERSION.md)

This repository serves as the **centralized dashboard, control plane, and organizational hub** for Robert Pelloni's rhythm gaming and dance arcade ecosystem.

Robert Pelloni's active StepMania-related work lives in:

- [`bobmania`](https://github.com/robertpelloni/bobmania) — Robert Pelloni's StepMania fork
- [`itgmania`](https://github.com/robertpelloni/itgmania) — Robert Pelloni's ITGmania fork
- [`fcdm`](https://github.com/robertpelloni/fcdm) — the Fitness Center Dance Machine built on that stack

Upstream StepMania itself is maintained at [github.com/stepmania/stepmania](https://github.com/stepmania/stepmania).

## Quick Start: Unified Dashboard
To run the single-page operator dashboard and background server daemons via the unified control script:
```bash
./scripts/dashboard_ctl.sh start
```
Or use the individual launcher:
```bash
./scripts/run_dashboard.sh
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.

To stop the dashboard and server daemons:
```bash
./scripts/dashboard_ctl.sh stop
# or ./scripts/stop_dashboard.sh
```

To probe health, latency, or inspect system logs:
```bash
./scripts/dashboard_ctl.sh probe
./scripts/dashboard_ctl.sh logs
./scripts/dashboard_ctl.sh test
```

Or manage the system tray daemon from the command line:
```bash
python3 dashboard/tray_service.py status
python3 dashboard/tray_service.py restart
python3 dashboard/tray_service.py logs
python3 dashboard/tray_service.py quit
```

## Features
- **Consolidated Single-Page Control**: Highest-value Game Launcher & Active Player Profile prominently displayed at the top.
- **Song Pack & Simfile Manager**: Real-time pack search, style filtering (`ITG`, `DDR`, `Fitness`), drag-and-drop installer zone, and pack details drawer.
- **Hardware Diagnostics & Pad Visualizer**: 1000Hz USB polling, Dance Single (4-panel) / Pump Single (5-panel) layout toggle, live pressure meters, debounce & audio sync calibration, and interactive keyboard/pad keybind remapping table.
- **System Tray Controller & Logs**: Start, restart, pause, reload songs, view logs, and quit server daemons from the UI tray popup or CLI.
- **Single Source of Truth Versioning**: Dynamically sourced from `VERSION.md`.

## Repository Governance & Documentation
- [VERSION.md](VERSION.md) — Single source of truth for semantic versioning.
- [VISION.md](VISION.md) — Architectural vision, ecosystem role, and user-satisfaction design principles.
- [MEMORY.md](MEMORY.md) — System memory, design patterns, and codebase traits.
- [DEPLOY.md](DEPLOY.md) — Deployment instructions, environment setup, and ecosystem navigation.
- [IDEAS.md](IDEAS.md) — Innovation vectors, refactoring concepts, and unified dashboard ideas.
- [ROADMAP.md](ROADMAP.md) — Strategic long-term milestones and structural plans.
- [TODO.md](TODO.md) — Immediate tasks, checks, and action items.
- [CHANGELOG.md](CHANGELOG.md) — Chronological record of updates.
- [HANDOFF.md](HANDOFF.md) — Session state and handover documentation.
