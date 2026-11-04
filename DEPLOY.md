# DEPLOY.md — Deployment & Execution Guide

## Quick Start: Unified Dashboard
The StepMania Unified Dashboard provides an arcade operator control plane, 1000Hz USB pad visualizer, keybind remapper, and background daemons.

### 1. Launching via Unified Orchestration Script
```bash
./scripts/dashboard_ctl.sh start
```
By default, the daemon binds to port `8080`. Access the interface at:
`http://localhost:8080`

To start on a custom port:
```bash
PORT=9090 ./scripts/dashboard_ctl.sh start
```

### 2. Status & System Logs
Check the running daemon status:
```bash
./scripts/dashboard_ctl.sh status
```

Inspect live activity logs:
```bash
./scripts/dashboard_ctl.sh logs
```

### 3. Automated Health & Latency Prober
Run a diagnostic health probe against all REST and static endpoints:
```bash
./scripts/dashboard_ctl.sh probe
# or:
python3 scripts/monitor_health.py --json
```

Continuous monitoring mode (e.g. every 5 seconds):
```bash
python3 scripts/monitor_health.py --watch 5
```

### 4. Running the Test Suite
```bash
./scripts/dashboard_ctl.sh test
# or:
python3 -m unittest discover tests
```

### 5. Stopping the Daemon
```bash
./scripts/dashboard_ctl.sh stop
# or:
python3 dashboard/tray_service.py quit
```
