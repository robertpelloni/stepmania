# IDEAS.md — Innovation Vectors, Refactoring & Future Concepts

## 1. Unified Rhythm Suite Dashboard
- **Consolidated Control Center**: Build a unified Electron or Web/Rust-based dashboard interface that connects to `bobmania`, `itgmania`, and `fcdm` instances over local IPC / WebSocket.
- **Single-Page View**:
  - Top bar: Engine Status indicator, Active Profile, Current Song / Pack count, Quick Launch button, System Tray controls.
  - Section 1 (High Value): Game Launcher & Profile Switcher with real-time stats (calories burned, songs cleared, accuracy %).
  - Section 2: Song Pack Manager (drag-and-drop `.sm`/`.ssc`/`.zip` pack installer with automatic hashing and metadata extraction).
  - Section 3: Hardware Diagnostics & Input Visualizer (real-time 1000Hz USB polling monitor for dance pads, debounce fine-tuner, pressure sensor graphs).
  - Section 4: System Daemons & Network Services (local high-score server, Groovestats sync, cloud profile backup).
- **System Tray Agent**:
  - Background daemon tray icon with right-click menu: "Start Game", "Open Operator Dashboard", "Pause/Resume Background Sync", "Restart Daemons", and "Quit All Servers".
  - Graceful shutdown signal handling (`SIGTERM`/`SIGINT`) to clean up IPC sockets and lockfiles.

## 2. Engine Modernization Vectors
- **Vulkan / Modern Rendering Backend**: Replace legacy fixed-function / OpenGL 2.x pipelines with modern SPIR-V / Vulkan or WebGPU pipelines for predictable frame pacing and zero micro-stutter.
- **Wayland Native & Direct Scanout**: Eliminate X11 compositor latency by implementing native Wayland protocol extensions with tearing/direct scanout support for arcade cabinets.
- **Rust IPC & Audio Engine Wrapper**: Encapsulate audio decoders and timing loops in a dedicated high-priority real-time thread with lock-free ring buffers.
