#!/usr/bin/env python3
"""
StepMania System Tray Controller CLI & Automation Service
Allows controlling the rhythm server daemons, health querying,
and executing tray-style actions (start, stop, restart, pause, quit).
"""

import argparse
import json
import sys
import urllib.request
import urllib.error

DEFAULT_URL = "http://localhost:8080"

def get_status(url=DEFAULT_URL):
    try:
        req = urllib.request.Request(f"{url}/health")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            print(f"[TRAY] Daemon Status: {data.get('status')} | Fork: {data.get('active_fork')} | Uptime: {data.get('uptime_seconds')}s")
            return True
    except urllib.error.URLError:
        print("[TRAY] Daemon is offline or unreachable.")
        return False

def send_action(action, url=DEFAULT_URL):
    endpoint = f"{url}/api/control/{action}"
    try:
        req = urllib.request.Request(endpoint, data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            print(f"[TRAY ACTION {action.upper()}] Response: {data.get('message')}")
            return True
    except urllib.error.URLError as e:
        print(f"[TRAY ERROR] Failed to send {action}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="StepMania System Tray & Daemon Controller")
    parser.add_argument("command", choices=["status", "start", "restart", "pause", "quit", "reload_songs"], help="Action to dispatch")
    parser.add_argument("--url", default=DEFAULT_URL, help="Daemon endpoint base URL")
    args = parser.parse_args()

    if args.command == "status":
        success = get_status(args.url)
    else:
        success = send_action(args.command, args.url)

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
