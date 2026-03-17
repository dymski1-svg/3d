# KNOWN_ISSUES.md

## Current known issues
- Vendor module paths can break easily if three.js files are copied from a different release without keeping versions aligned.
- GitHub Pages caching can make fresh fixes appear missing.
- Mobile navigation behavior is not yet finalized.
- Viewer mode and AR mode are not yet separated in final production form.
- Large GLB models may need optimization later.

## Historical problem classes
- CDN-based imports failed or were hard to verify reliably.
- Dynamic imports on GitHub Pages failed when required vendor files were missing.
- three.js release changes introduced extra module dependencies.
- Phone motion experiments caused the model to leave the frame.

## Current policy in response
- Prefer local vendor modules.
- Keep fallback rendering available during active iteration.
- Keep visible debug output.
- Treat Viewer mode as gesture-first.
- Delay sections and AR until base loading/navigation are stable.

## Things to re-check after major changes
- relative module paths
- GitHub Pages deployment path behavior
- fit-to-view still works
- reset view still works
- GLB loading still replaces previous model cleanly