# TESTING.md

## Minimum manual checks
After viewer changes, check:

1. App starts without crashing
2. Debug overlay appears
3. Fallback object appears when no GLB is loaded
4. Load GLB works from file input
5. Drag-and-drop GLB works
6. Reset view works
7. Camera fit-to-view works
8. GitHub Pages relative paths still work

## Mobile checks
- basic navigation works
- model stays visible
- reset view recovers from bad camera state
- no obvious startup failure on phone browser

## Pages checks
- hard refresh with cache-bust query works
- vendor modules load from expected paths
- no broken dynamic imports