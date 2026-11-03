# DEPLOY.md — Deployment, Operations & Monitoring

## 1. Environment & Setup Instructions

### Ecosystem Repositories
Because active development occurs across specialized repositories, clone the relevant repository for your target workflow:

```bash
# To work with Robert Pelloni's StepMania fork:
git clone https://github.com/robertpelloni/bobmania.git

# To work with ITGmania fork:
git clone https://github.com/robertpelloni/itgmania.git

# To work with the Fitness Center Dance Machine platform:
git clone https://github.com/robertpelloni/fcdm.git

# To reference upstream StepMania:
git clone https://github.com/stepmania/stepmania.git
```

## 2. Dashboard & Daemon Operations

### Starting the Dashboard & Daemon
```bash
./scripts/run_dashboard.sh
```
The server daemon will initialize in the background on port `8080`, and the unified operator dashboard is accessible at `http://localhost:8080`.

### Stopping the Dashboard & Daemon
```bash
./scripts/stop_dashboard.sh
```
Or gracefully stop through the CLI:
```bash
python3 dashboard/tray_service.py quit
```

## 3. Automated Health Checks & Performance Monitoring

To perform an immediate automated health and latency check across all system endpoints:
```bash
python3 scripts/monitor_health.py
```

To emit machine-readable JSON health metrics for CI/CD or logging pipelines:
```bash
python3 scripts/monitor_health.py --json
```

To start continuous performance monitoring (e.g., checking every 5 seconds):
```bash
python3 scripts/monitor_health.py --watch 5
```

Monitored target endpoints:
- `/health`: System uptime, active fork, and subsystem statuses.
- `/api/packs`: Simfile pack metadata and active mounts.
- `/api/diagnostics/pad`: Hardware debounce window, audio offset, and 1000Hz USB sensor pressures.
- `/index.html`: Web dashboard asset delivery integrity and latency.
