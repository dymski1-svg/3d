# DECISIONS.md

## D-001
Viewer mode uses gestures only.
Reason:
Motion-based viewing in normal browser mode is less stable than gesture-based navigation.

## D-002
AR/WebXR is a future separate mode.
Reason:
True motion-based viewing belongs in tracked AR, not in normal Viewer mode.

## D-003
Local vendor modules are preferred over CDN for core runtime files.
Reason:
This improves reliability for testing, debugging, and GitHub Pages deployment.

## D-004
Sections/clipping are postponed until navigation is stable.
Reason:
The base viewer must be predictable before adding more interaction complexity.