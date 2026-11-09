# stepmania (Unified Rhythm Suite & Operator Control Plane)

[![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)](VERSION.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-14%2F14%20passing-brightgreen.svg)](tests/)

This repository serves as the **centralized dashboard, control plane, and organizational hub** for Robert Pelloni's rhythm gaming and dance arcade ecosystem. Rather than duplicating existing game binaries, this project unifies launch supervision, stage hardware diagnostics, arcade cabinet keybinding remapping, song pack management, and live player metrics into a singular, consolidated operator interface.

---

## Ecosystem Architecture & Active Projects

Robert Pelloni's active rhythm game and fitness dance machine development is distributed across specialized repositories:

- **[`bobmania`](https://github.com/robertpelloni/bobmania)** — Robert Pelloni's primary StepMania fork featuring custom audiovisual pipelines, modernized engine enhancements, and arcade cabinet integrations.
- **[`itgmania`](https://github.com/robertpelloni/itgmania)** — Robert Pelloni's fork of ITGmania, prioritizing tournament-grade timing standards, Groovestats live integration, and precision competitive play.
- **[`fcdm`](https://github.com/robertpelloni/fcdm)** — The *Fitness Center Dance Machine*, an arcade-oriented aerobic fitness rhythm platform combining real-time caloric expenditure calculations with choreographed high-energy fitness routines.
- **Upstream StepMania** — Maintained by the community at [github.com/stepmania/stepmania](https://github.com/stepmania/stepmania), representing the historical foundation of 4-panel and 5-panel PC rhythm gaming.

```
                           +-------------------------------------------------+
                           |   robertpelloni/stepmania (Operator Control)    |
                           |   - Single-Page Cockpit Interface (port 8080)   |
                           |   - Hardware Diagnostics (1000Hz / evdev)       |
                           |   - Song Pack & Simfile Manager                 |
                           |   - System Tray Daemon Supervision              |
                           +-------------------------------------------------+
                                     /             |             \
                                    /              |              \
             +--------------------+   +--------------------+   +--------------------+
             |      bobmania      |   |      itgmania      |   |        fcdm        |
             | Custom SM Engine   |   | Tournament ITG &   |   | Fitness Center     |
             | & Modern FX        |   | Groovestats Sync   |   | Dance Machine      |
             +--------------------+   +--------------------+   +--------------------+
```

---

## Key Features & Capabilities

### 1. High-Value Single-Page Operator Cockpit
- **Instant Game Launcher**: Directly select and launch between target rhythm suites (`bobmania`, `itgmania`, `fcdm`, upstream `stepmania`) with sub-second parameter passing.
- **Active Player & Operator Profile**: Prominently displayed caloric burn counters, accuracy ratings, songs cleared, and live global audio sync offsets.

### 2. Hardware Diagnostics & 1000Hz Pad Visualizer
- **Raw Linux `evdev` Telemetry**: Direct detection of connected USB stage IO controllers (`/dev/input/...`), driver models, and low-latency firmware builds.
- **1000Hz Polling & Microsecond Jitter**: Sub-millisecond polling metrics and jitter tracking ($\pm 0.18\text{ ms}$).
- **Sensor Pressure Matrix**: Real-time per-sensor pressure gauges (LEFT, UP, DOWN, RIGHT) with dynamic threshold calibration.
- **Dual Stage Layouts**: Instant toggle between Dance Single (4-Panel) and Pump Single (5-Panel) arcade geometry.

### 3. Input Remapping & Arcade Cabinet Controls
- **Category-Filtered Keybinds**: Clean categorization into `All`, `Gameplay`, `Navigation`, and `Arcade Cabinet`.
- **Arcade Operator Keys**: Native remapping and daemon persistence for `Coin`, `Service`, and `OperatorMenu`.
- **Live Capture & Clear**: Interactive click-to-bind listening with Escape-cancellation and per-row `Clear` buttons.

### 4. Song Pack & Simfile Manager
- **Filter & Search**: Instant client-side search across mounted song directories with category styling (`ITG`, `DDR`, `Fitness`).
- **Interactive Details Drawer**: Slide-out chart inspection providing exact song counts, chart format breakdown (`.sm`, `.ssc`, `.dwi`), difficulty distributions, and disk path tracking.

### 5. Daemons Supervision & Live Activity Stream
- **Service Monitoring**: Status indicators and action triggers for background services (StepMania Daemon, Groovestats Sync, FCDM Fitness Metrics Engine).
- **Embedded Log Stream**: Live timestamped activity feed capturing system, controller, and daemon events.
- **System Tray Management**: Background tray controller with status queries, restarts, pause, reload songs, and clean daemon shutdown.

---

## Quick Start & Operator Workflows

### Unified Orchestration Script
The primary entrypoint for managing the StepMania operator environment is `scripts/dashboard_ctl.sh`:

```bash
# Start background server daemon and launch dashboard
./scripts/dashboard_ctl.sh start

# Probe health, endpoints, and latency
./scripts/dashboard_ctl.sh probe

# Inspect live activity logs
./scripts/dashboard_ctl.sh logs

# Run unit and integration test suite
./scripts/dashboard_ctl.sh test

# Stop background daemons cleanly
./scripts/dashboard_ctl.sh stop
```

Access the consolidated dashboard in any modern web browser at:
```
http://localhost:8080
```

### System Tray CLI
The system tray controller (`dashboard/tray_service.py`) can also be manipulated directly:

```bash
# Query daemon status and uptime
python3 dashboard/tray_service.py status

# Trigger hot-restart of services
python3 dashboard/tray_service.py restart

# Reload song packs into memory
python3 dashboard/tray_service.py reload_songs

# Stream current daemon activity logs
python3 dashboard/tray_service.py logs

# Gracefully terminate daemon processes
python3 dashboard/tray_service.py quit
```

---

## REST API Specification

The control plane exposes a high-performance, multi-threaded REST interface on port 8080:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Daemon status, version, uptime, and supervised services |
| `GET` | `/api/version` | Sourced directly from `VERSION.md` |
| `GET` | `/api/profile` | Active player/operator statistics, rank, and global offsets |
| `GET` | `/api/packs` | Mounted song packs, difficulty counts, and simfile health |
| `GET` | `/api/diagnostics/pad` | Active sensor pressure levels, polling rate, and calibration |
| `GET` | `/api/hardware` | USB hardware controller model, Linux evdev device path, and jitter |
| `POST` | `/api/diagnostics/calibrate` | Save debounce window (ms), audio offset (ms), and layout mode |
| `GET` | `/api/keybinds` | Fetch current input binding dictionary |
| `POST` | `/api/keybinds` | Persist modified keybindings to daemon storage |
| `GET` | `/api/logs` | Retrieve recent daemon and IO log entries |
| `POST` | `/api/launch` | Select and launch target game fork |
| `POST` | `/api/control/<action>` | Execute daemon action (`start`, `stop`, `restart`, `pause`, `reload_songs`) |

---

## Repository Governance & Documentation Standards

In accordance with autonomous governance standards, this repository maintains:

- [VERSION.md](VERSION.md) — Single source of truth for semantic versioning (`0.5.0`).
- [CHANGELOG.md](CHANGELOG.md) — Complete release history across all minor and patch versions.
- [VISION.md](VISION.md) — Architectural vision, design principles, and user-satisfaction guidelines.
- [MEMORY.md](MEMORY.md) — System memory, conventions, and codebase observations.
- [DEPLOY.md](DEPLOY.md) — Production deployment instructions and system service setup.
- [IDEAS.md](IDEAS.md) — Aggressive innovation backlog, hardware driver plans, and refactoring concepts.
- [ROADMAP.md](ROADMAP.md) — Multi-phase strategic milestones and execution plans.
- [TODO.md](TODO.md) — Action items and granular task tracking.
- [HANDOFF.md](HANDOFF.md) — Autonomous session handoff state for successor models.
