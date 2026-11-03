#!/usr/bin/env bash
# stop_dashboard.sh: Gracefully stops the StepMania dashboard and server daemons
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PORT="${PORT:-8080}"

echo "[INFO] Stopping StepMania Unified Dashboard & Daemons on port ${PORT}..."
if command -v python3 >/dev/null 2>&1; then
  python3 "${ROOT_DIR}/dashboard/tray_service.py" quit || true
fi

# Fallback kill if port remains occupied
PID=$(lsof -t -i :${PORT} 2>/dev/null || true)
if [ -n "${PID}" ]; then
  kill "${PID}" 2>/dev/null || true
  echo "[INFO] Terminated daemon PID ${PID}."
fi
echo "[INFO] StepMania daemons stopped."
