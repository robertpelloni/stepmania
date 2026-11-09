#!/usr/bin/env bash
# run_dashboard.sh: Starts the StepMania consolidated dashboard and backend daemon
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PORT="${PORT:-8080}"

echo "[INFO] Starting StepMania Unified Dashboard & Daemon on port ${PORT}..."
# Kill any stale instance on PORT if running
kill $(lsof -t -i :${PORT}) 2>/dev/null || true

python3 "${ROOT_DIR}/dashboard/daemon.py" > "${ROOT_DIR}/dashboard.log" 2>&1 &
PID=$!
echo "[INFO] StepMania Daemon running in background with PID ${PID}."
echo "[INFO] Dashboard accessible at: http://localhost:${PORT}/"
