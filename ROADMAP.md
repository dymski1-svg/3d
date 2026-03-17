# ROADMAP.md

## Stage 1 — Stable GLB Viewer
Goal:
Deliver a reliable GLB viewer for GitHub Pages.

Scope:
- Load GLB from file picker
- Load GLB from drag-and-drop
- Render model correctly
- Fit camera to model
- Reset view
- Debug overlay
- Safe fallback when no GLB is loaded

Exit criteria:
- A user can load a GLB and inspect the whole model without crashes
- The viewer works on desktop and phone browser
- GitHub Pages deployment is stable

---

## Stage 2 — Navigation Quality
Goal:
Make viewer navigation feel good and predictable.

Scope:
- Tune orbit behavior
- Tune dolly/zoom limits
- Tune damping/smoothing
- Decide final controls behavior
- Improve mobile ergonomics
- Keep Viewer mode gesture-only

Exit criteria:
- Navigation feels stable on phone and desktop
- Model does not get lost easily
- Reset view is reliable

---

## Stage 3 — Stability and Cleanup
Goal:
Reduce technical friction and improve reliability.

Scope:
- Improve import path robustness
- Reduce fragile fallback logic
- Improve error messages
- Document known edge cases
- Verify vendor module chain

Exit criteria:
- Fewer loading/path issues
- Cleaner debug flow
- Easier maintenance

---

## Stage 4 — Sections / Clipping
Goal:
Add model sectioning after navigation is stable.

Scope:
- Single clipping plane first
- Then section box
- Basic UI to control clipping
- Keep whole-model mode as default

Exit criteria:
- User can inspect model interior reliably
- Section controls do not break normal viewing

---

## Stage 5 — WebXR / AR
Goal:
Add optional AR mode for true motion-based viewing.

Scope:
- Separate AR mode from Viewer mode
- WebXR availability checks
- Basic model placement
- AR session start/stop flow
- Later: AR-specific gestures if needed

Exit criteria:
- AR works as an optional mode
- Viewer mode remains stable and independent