# TODO.md — Action Items & Short-Term Tasks

## Dashboard Enhancements (v0.3.0)
- [x] Implement live song pack search bar and style/genre category filter.
- [x] Add pack details inspector and simfile health stats.
- [x] Implement pad mode switcher (Dance Single 4-panel vs. Pump Single 5-panel).
- [x] Add individual sensor sensitivity/pressure meter bars (LEFT, UP, DOWN, RIGHT).
- [x] Add live IO event stream log with polling jitter monitor.
- [x] Implement `/api/packs` and `/api/diagnostics/pad` endpoints in `dashboard/daemon.py`.
- [x] Verify UI functionality with Playwright automated screenshot.

## Future Milestones
- [ ] Implement physical USB input polling via Linux `evdev` driver binding.
- [ ] Connect WebSocket feed to real-time StepMania 5 / OutFox / ITGmania memory state.
