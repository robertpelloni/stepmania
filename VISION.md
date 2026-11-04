# VISION.md — Architectural Vision & Rhythm Game Ecosystem

## 1. Executive Summary & Purpose
This repository (`stepmania`) serves as the core organizational namespace and pointer repository within Robert Pelloni's rhythm gaming and arcade simulation ecosystem. While upstream [StepMania](https://github.com/stepmania/stepmania) represents the historical C++ open-source dance rhythm simulator engine, Robert Pelloni's specialized modifications and next-generation adaptations are modularly divided into targeted repositories:

- **[`bobmania`](https://github.com/robertpelloni/bobmania)**: Robert Pelloni's dedicated StepMania engine fork, containing custom engine optimizations, specialized input driver integration, arcade cabinet features, and engine-level innovations.
- **[`itgmania`](https://github.com/robertpelloni/itgmania)**: Robert Pelloni's fork of ITGmania (the modern competitive In The Groove engine branch with advanced timing, modern screen support, Groovestats integration, and polished Lua theming).
- **[`fcdm`](https://github.com/robertpelloni/fcdm)**: The Fitness Center Dance Machine — an all-in-one arcade dance machine platform and fitness-oriented commercial/home cabinet OS leveraging the underlying rhythm engine stack.

## 2. Core Foundational Concepts & Ultimate Goal
The ultimate goal of this ecosystem is to deliver an uncompromising, ultra-low-latency, modern arcade rhythm and fitness platform that bridges:
1. **Engine Precision & Robustness**: Sub-millisecond input polling, rock-solid audio-visual synchronization, and crash resilience for 24/7 public arcade or fitness club operation.
2. **Unified Dashboard & Control Plane**: A centralized management interface where arcade operators and players can manage songs, profiles, high scores, machine diagnostics, system tray controls, and network syncing without diving into complex raw config files.
3. **Fitness & Gamification Fusion**: Translating dance gaming mechanics into measurable caloric burn, aerobic endurance tracking, and personalized fitness milestones (anchored by `fcdm`).

## 3. User-Satisfaction Design Principles
- **Instant Clarity & Accessibility**: Whether an end-user runs a standalone executable or an operator configures multi-cab networking, workflows must be intuitive, tooltipped, and self-documenting.
- **Consolidated Controls**: Avoid scattered configuration utilities. Controls for audio latency offsets, pad debounce calibration, network endpoints, and system daemon lifecycles should converge into unified dashboard views.
- **Fail-Safe Operation**: If network connections drop or a peripheral disconnects, the engine must degrade gracefully, queue transactions locally, and auto-recover seamlessly.
