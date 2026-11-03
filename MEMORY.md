# MEMORY.md — Codebase Traits, System Architecture & Ecosystem Context

## 1. Repository Role & Structure
- **Namespace & Dashboard Hub**: This repository (`stepmania`) serves as the central control plane, operator dashboard, and namespace hub for Robert Pelloni's rhythm gaming suite.
- **Ecosystem Separation of Concerns**:
  - `stepmania`: Consolidated operator dashboard, system tray manager, and namespace hub.
  - `bobmania`: Engine fork with Robert Pelloni's custom modifications to StepMania 5.x.
  - `itgmania`: Fork of ITGmania (modern community standard for ITG / competitive play).
  - `fcdm`: Fitness Center Dance Machine application, shell, and service layer.
- **Git Topology**:
  - Default branch: `main`.
  - Origin remote: `https://github.com/robertpelloni/stepmania`.

## 2. Design Conventions & Architectural Patterns
- **Single Source of Truth**: All versions across project documentation reference `VERSION.md`.
- **Cross-Repo Cohesion**: Uniform documentation files (`VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`, `CHANGELOG.md`) maintained across all repositories.
- **Single-Page Dashboard Architecture**:
  - Located in `dashboard/` (`index.html`, `styles.css`, `app.js`).
  - Prioritizes highest-value features (Launcher & Player Profile) at the top, followed by Song Pack Manager and Hardware IO Diagnostics.
  - Background daemon: `dashboard/daemon.py` on port 8080.
  - System tray controller: `dashboard/tray_service.py` (`start`, `restart`, `pause`, `quit`).
  - Health & latency prober: `scripts/monitor_health.py`.

## 3. Operational Telemetry Baseline (v0.3.0)
- Multi-interval automated probe samples demonstrate rock-solid stability:
  - 100% endpoint pass rate (4/4 endpoints: `/health`, `/api/packs`, `/api/diagnostics/pad`, `/index.html`).
  - Average HTTP latency: 13.9ms – 17.7ms.
  - Sub-millisecond IO event stream jitter: ±0.18ms.
