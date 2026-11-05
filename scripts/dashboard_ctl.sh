#!/usr/bin/env bash
# scripts/dashboard_ctl.sh: Unified Orchestration & Lifecycle Manager for StepMania Dashboard
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PORT="${PORT:-8080}"
URL="http://localhost:${PORT}"

usage() {
  cat << EOF
StepMania Consolidated Dashboard Control Script
Usage: $0 [command] [options]

Commands:
  start        Start dashboard daemon in the background
  stop         Gracefully terminate dashboard daemon
  restart      Restart daemon services and reload state
  status       Check daemon status and version
  probe        Run comprehensive health check & latency report
  logs         Tail/display latest daemon activity logs
  test         Run full test suite (python unittest)
  help         Display this help message

Options:
  PORT=8080    Custom port environment variable
EOF
}

CMD="${1:-help}"

case "$CMD" in
  start)
    echo "[CTL] Launching StepMania unified dashboard..."
    "${SCRIPT_DIR}/run_dashboard.sh"
    ;;
  stop)
    echo "[CTL] Stopping StepMania unified dashboard..."
    "${SCRIPT_DIR}/stop_dashboard.sh"
    ;;
  restart)
    echo "[CTL] Restarting StepMania unified dashboard..."
    "${SCRIPT_DIR}/stop_dashboard.sh" || true
    sleep 1
    "${SCRIPT_DIR}/run_dashboard.sh"
    ;;
  status)
    echo "[CTL] Querying StepMania daemon status..."
    python3 "${ROOT_DIR}/dashboard/tray_service.py" status --url "${URL}"
    ;;
  probe)
    echo "[CTL] Running automated health and latency prober..."
    python3 "${SCRIPT_DIR}/monitor_health.py" --url "${URL}"
    ;;
  logs)
    echo "[CTL] Fetching daemon logs..."
    python3 "${ROOT_DIR}/dashboard/tray_service.py" logs --url "${URL}"
    ;;
  test)
    echo "[CTL] Running repository test suite..."
    python3 -m unittest discover "${ROOT_DIR}/tests"
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "[ERROR] Unknown command: $CMD"
    usage
    exit 1
    ;;
esac
