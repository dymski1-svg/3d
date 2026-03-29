# AGENTS.md

## Project mission
Build a stable web viewer for GLB models hosted on GitHub Pages.

Current priority:
1. Stable GLB loading
2. Good viewer navigation
3. Robust debug/error reporting
4. Later: sections/clipping
5. Later: WebXR AR

## Working rules
- Prefer the smallest change that moves the project forward.
- Do not introduce unnecessary refactors.
- Keep the app working on GitHub Pages.
- Prefer local vendor modules over CDN when CDN hurts reliability or debugging.
- Keep debug output visible while the viewer is still under active development.
- If a feature is unstable, keep a safe fallback path.

## Architecture defaults
- Static frontend only
- Three.js as renderer
- GLTFLoader for GLB
- Local vendor files for three.js modules
- GitHub Pages as MVP hosting target

## Current product decisions
- Viewer mode uses gestures only.
- Do not rely on phone motion in Viewer mode.
- If AR/WebXR is added later, motion-based viewing belongs there, not in normal Viewer mode.
- Sections/clipping are postponed until navigation is stable.

## Definition of done for the current stage
A task is only "done" if:
- a GLB can be loaded through file input or drag-and-drop,
- the model renders correctly,
- camera fit-to-view works,
- reset view works,
- basic mobile navigation works,
- debug/error output is still useful,
- GitHub Pages compatibility is preserved.

## File change policy
When changing viewer logic:
- prefer editing `index.html` only unless modularization is clearly useful,
- avoid changing unrelated files,
- preserve existing UI labels unless there is a good reason.

## Debug policy
Always keep or improve:
- visible "JS OK" / startup status,
- visible runtime error reporting,
- useful state in debug overlay when working on loading, controls, or XR.

## Testing expectations
After meaningful changes:
- check that the app still loads without crashing,
- check that fallback behavior still works when a GLB is not loaded,
- check that GLB loading path still works,
- check that GitHub Pages relative paths still make sense.

## Commit message policy
For every task that changes files:
- always propose a commit message at the end,
- keep it short and concrete,
- use imperative mood.

Format:
Suggested commit message: <message>

## Review policy
When reviewing or summarizing changes:
- mention root cause,
- mention what changed,
- mention remaining risk,
- mention next recommended step.

### Debug header timestamp
- The debug header in `index.html` must use a static string in the format: `Debug: MM.DD HH:MM`.
- This timestamp is a static string in `index.html`, not a runtime-generated value.
- Codex must update it in every file-editing session.
- If multiple patches happen in one session, update it once at the end, using the final save time of that session.
- It must match the final date and time when `index.html` is saved in that session.
- Do not use `Date`, `new Date()`, startup time, or browser time for this header.
- Do not re-add a `Last update` runtime line to the debug output.

If a separate review file exists, follow `code_review.md`.
