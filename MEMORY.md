# MEMORY.md — Codebase Traits, System Architecture & Ecosystem Context

## 1. Repository Role & Structure
- **Namespace Placeholder**: This repository (`stepmania`) holds namespace presence on GitHub under `robertpelloni/stepmania`.
- **Ecosystem Separation of Concerns**:
  - `stepmania`: Name placeholder and ecosystem hub.
  - `bobmania`: Engine fork with Robert Pelloni's custom modifications to StepMania 5.x.
  - `itgmania`: Fork of ITGmania (modern community standard for ITG / competitive play).
  - `fcdm`: Fitness Center Dance Machine application, shell, and service layer.
- **Git Topology**:
  - Default branch: `main`.
  - Origin remote: `https://github.com/robertpelloni/stepmania`.
  - No submodules are currently checked into this placeholder repo.

## 2. Design Conventions & Architectural Patterns
- **Single Source of Truth**: All versions across project documentation reference `VERSION.md`.
- **Cross-Repo Cohesion**: Maintain uniform documentation files (`VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`, `CHANGELOG.md`) across the Robert Pelloni rhythm suite to facilitate frictionless agent handoffs and maintainer navigation.
- **Dashboard & Daemon Strategy**:
  - For rhythm projects with backend servers, daemons, or operator tools: consolidate into single-page unified dashboards with expandable/tabbed sections categorized by user impact, intuitive tooltips, and system tray management (daemon start/stop/restart/quit).
