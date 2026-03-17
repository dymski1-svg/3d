# ARCHITECTURE.md

## Overview
This project is a static web application for viewing GLB models in the browser.

Primary deployment target:
- GitHub Pages

Primary rendering stack:
- Three.js
- GLTFLoader
- Local vendor modules

## Main modes

### Viewer mode
Purpose:
- inspect the whole GLB model in a normal browser view

Rules:
- gesture-driven navigation only
- no phone-motion navigation as a core viewer behavior
- stable, predictable camera behavior is preferred over experimental motion controls

### AR mode (future)
Purpose:
- use real device motion through WebXR / AR

Rules:
- separate from Viewer mode
- optional feature only
- not a replacement for normal viewer navigation

## File strategy
Current preference:
- keep implementation simple
- keep logic close to `index.html` unless splitting files clearly improves maintainability
- vendor all critical browser modules locally when external CDN adds fragility

## Dependency strategy
Preferred:
- local vendor modules for three.js-related files

Avoid:
- relying on CDN for core runtime modules when testing/debugging or Pages hosting becomes fragile

## Model handling
Input:
- `.glb`

Expected behavior:
- clear previous model before loading a new one
- center model
- compute bounds
- fit camera to model
- preserve a safe fallback object when no GLB is loaded

## Camera and controls
Current principle:
- optimize for stable viewing first
- avoid experimental sensor-driven controls in normal Viewer mode
- keep reset view available

## Debug and observability
The project should keep a visible debug surface during active development:
- startup status
- runtime errors
- loading state
- useful camera/model state when debugging

## Future architecture decisions
Deferred until later:
- section planes / clipping
- section box
- WebXR AR behavior
- advanced control schemes
- model optimization pipeline beyond basic loading

## Non-goals for the current stage
- full BIM semantics
- advanced scene editing
- production-grade asset pipeline UI
- replacing the browser viewer with native app behavior