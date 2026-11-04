import json
import os
import sys
import threading
import time
import unittest
import urllib.request
import urllib.error

# Add repo root to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from dashboard.daemon import ThreadedHTTPServer, DashboardHandler, DAEMON_STATE
import dashboard.tray_service as tray_service
import scripts.monitor_health as monitor_health

TEST_PORT = 8089

class TestStepManiaDaemon(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadedHTTPServer(("127.0.0.1", TEST_PORT), DashboardHandler)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.2)
        cls.base_url = f"http://127.0.0.1:{TEST_PORT}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_health_endpoint(self):
        url = f"{self.base_url}/health"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertIn("status", data)
            self.assertIn("active_fork", data)
            self.assertIn("services", data)

    def test_packs_endpoint(self):
        url = f"{self.base_url}/api/packs"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertIn("packs", data)
            self.assertGreater(data["total_songs"], 0)

    def test_diagnostics_pad_endpoint(self):
        url = f"{self.base_url}/api/diagnostics/pad"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["polling_hz"], 1000)
            self.assertIn("sensors", data)

    def test_calibrate_endpoint(self):
        url = f"{self.base_url}/api/diagnostics/calibrate"
        payload = json.dumps({"debounce_ms": 15, "audio_offset_ms": -5, "mode": "pump-single"}).encode()
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=3) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["status"], "calibrated")
            self.assertEqual(data["calibration"]["debounce_ms"], 15)
            self.assertEqual(data["calibration"]["audio_offset_ms"], -5)
            self.assertEqual(data["calibration"]["mode"], "pump-single")

    def test_launch_endpoint(self):
        url = f"{self.base_url}/api/launch"
        payload = json.dumps({"fork": "bobmania"}).encode()
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=3) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["status"], "launched")
            self.assertEqual(data["fork"], "bobmania")

    def test_control_actions(self):
        for action in ["start", "restart", "pause", "reload_songs"]:
            url = f"{self.base_url}/api/control/{action}"
            req = urllib.request.Request(url, data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=3) as resp:
                self.assertEqual(resp.status, 200)
                data = json.loads(resp.read().decode())
                self.assertEqual(data["status"], "ok")
                self.assertEqual(data["action"], action)

    def test_static_asset_index(self):
        url = f"{self.base_url}/index.html"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            self.assertEqual(resp.status, 200)
            content = resp.read().decode()
            self.assertIn("StepMania", content)
            self.assertIn("Song Pack Manager", content)
            self.assertIn("Hardware Diagnostics", content)

    def test_tray_service_integration(self):
        status_ok = tray_service.get_status(self.base_url)
        self.assertTrue(status_ok)
        action_ok = tray_service.send_action("restart", self.base_url)
        self.assertTrue(action_ok)

    def test_monitor_health_check(self):
        # Override endpoints to point to test server
        health_ok = monitor_health.run_health_check(self.base_url, as_json=True)
        self.assertTrue(health_ok)

if __name__ == "__main__":
    unittest.main()
