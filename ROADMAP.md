# ROADMAP.md — Strategic & Long-Term Milestones

## Phase 1: Ecosystem Alignment & Governance (Completed)
- [x] Standardize repository structure and governance docs (`VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`, `CHANGELOG.md`, `VERSION.md`).
- [x] Establish clear mapping between `stepmania`, `bobmania`, `itgmania`, and `fcdm`.

## Phase 2: Centralized Rhythm Suite Dashboard Specification & Prototype (Completed)
- [x] Design single-page consolidated UI layout uniting game launching, pad calibration, profile stats, and daemon supervision.
- [x] Implement backend HTTP server daemon (`dashboard/daemon.py`) and system tray CLI/service (`dashboard/tray_service.py`).
- [x] Add interactive tooltips, badges, and inline explanations for operator settings.
- [x] Add automated orchestration scripts (`scripts/run_dashboard.sh`, `scripts/stop_dashboard.sh`).

## Phase 3: Hardware Diagnostics & Song Pack Management (Completed)
- [x] Live sensor pressure meters and multi-layout pad modes (Dance 4-panel vs. Pump 5-panel).
- [x] Real-time IO event stream log with microsecond timestamping and jitter estimation.
- [x] Client-side song pack search, style filtering, and backend `/api/packs` & `/api/diagnostics/pad` endpoints.

## Phase 4: Production Integration & Hardware Drivers (Next)
- [ ] Connect direct raw Linux `evdev` file descriptor polling (/dev/input/event*) to feed hardware pad pressure into daemon state.
- [ ] Add direct USB HID descriptor detection for arcade IO boards (GHX, PAC-Drive, Minimaid, Litewraith).
