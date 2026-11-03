# DEPLOY.md — Deployment & Ecosystem Navigation

## 1. Environment & Setup Instructions

### Ecosystem Repositories
Because active development occurs across specialized repositories, clone the relevant repository for your target workflow:

```bash
# To work with Robert Pelloni's StepMania fork:
git clone https://github.com/robertpelloni/bobmania.git

# To work with ITGmania fork:
git clone https://github.com/robertpelloni/itgmania.git

# To work with the Fitness Center Dance Machine platform:
git clone https://github.com/robertpelloni/fcdm.git

# To reference upstream StepMania:
git clone https://github.com/stepmania/stepmania.git
```

### Upstream Build Pre-requisites (StepMania / ITGmania)
When building the underlying StepMania/ITGmania engine on Linux:
- **Build System**: CMake (>= 3.16), Ninja or Make, GCC/Clang with C++17 support.
- **Dependencies**: SDL2, OpenGL / GLEW, ALSA / PulseAudio / JACK, libpng, libjpeg, zlib, libmad, libvorbis, libogg, FFMPEG / libavcodec.

## 2. Repository Maintenance & Synchronization
To verify repository health:
```bash
git status
git log --oneline -n 5
```
Ensure all cross-references across `bobmania`, `itgmania`, and `fcdm` remain synchronized.
