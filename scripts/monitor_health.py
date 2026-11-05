#!/usr/bin/env python3
"""
StepMania Dashboard & Ecosystem Automated Health & Performance Monitor
Continuously or one-shot probes the daemon endpoints, validates response
correctness, measures latency, and reports diagnostic health metrics.
"""

import argparse
import json
import sys
import time
import urllib.request
import urllib.error

DEFAULT_BASE_URL = "http://localhost:8080"

ENDPOINTS = [
    ("/health", "Daemon System Health"),
    ("/api/packs", "Song Pack Index & State"),
    ("/api/diagnostics/pad", "Pad Diagnostics & Sensors"),
    ("/index.html", "Single-Page Dashboard Asset"),
]

def check_endpoint(base_url, path):
    url = f"{base_url}{path}"
    start = time.perf_counter()
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "SM-Monitor/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            content = resp.read()
            latency_ms = round((time.perf_counter() - start) * 1000, 2)
            code = resp.status
            return {
                "endpoint": path,
                "url": url,
                "status": "PASS",
                "status_code": code,
                "latency_ms": latency_ms,
                "bytes": len(content),
                "error": None
            }
    except Exception as e:
        latency_ms = round((time.perf_counter() - start) * 1000, 2)
        return {
            "endpoint": path,
            "url": url,
            "status": "FAIL",
            "status_code": getattr(e, 'code', None),
            "latency_ms": latency_ms,
            "bytes": 0,
            "error": str(e)
        }

def run_health_check(base_url=DEFAULT_BASE_URL, as_json=False):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    results = []
    total_latency = 0.0
    passed = 0

    for path, description in ENDPOINTS:
        res = check_endpoint(base_url, path)
        res["description"] = description
        results.append(res)
        total_latency += res["latency_ms"]
        if res["status"] == "PASS":
            passed += 1

    all_passed = (passed == len(ENDPOINTS))
    avg_latency = round(total_latency / len(ENDPOINTS), 2) if ENDPOINTS else 0.0

    report = {
        "timestamp": timestamp,
        "base_url": base_url,
        "overall_health": "HEALTHY" if all_passed else "DEGRADED",
        "endpoints_checked": len(ENDPOINTS),
        "endpoints_passed": passed,
        "average_latency_ms": avg_latency,
        "checks": results
    }

    if as_json:
        print(json.dumps(report, indent=2))
    else:
        print(f"============================================================")
        print(f" StepMania Ecosystem Health Monitor — {timestamp}")
        print(f" Target: {base_url} | Overall: {report['overall_health']}")
        print(f" Passed: {passed}/{len(ENDPOINTS)} | Avg Latency: {avg_latency} ms")
        print(f"============================================================")
        for c in results:
            status_icon = "✅" if c["status"] == "PASS" else "❌"
            print(f" {status_icon} [{c['status']}] {c['endpoint']:<22} {c['description']:<26} {c['latency_ms']:>6} ms ({c['bytes']} bytes)")
            if c["error"]:
                print(f"    └── Error: {c['error']}")
        print(f"============================================================")

    return all_passed

def main():
    parser = argparse.ArgumentParser(description="Automated Health & Performance Prober for StepMania Dashboard")
    parser.add_argument("--url", default=DEFAULT_BASE_URL, help="Base URL of daemon (default: http://localhost:8080)")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    parser.add_argument("--watch", type=int, default=0, help="Continuous monitoring interval in seconds (0 = single run)")
    args = parser.parse_args()

    if args.watch > 0:
        print(f"[MONITOR] Starting continuous monitor every {args.watch}s (Ctrl+C to stop)...")
        try:
            while True:
                run_health_check(args.url, args.json)
                time.sleep(args.watch)
        except KeyboardInterrupt:
            print("\n[MONITOR] Stopped.")
            sys.exit(0)
    else:
        success = run_health_check(args.url, args.json)
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
