# code_review.md

## Review goal
Review changes for correctness, stability, and project-fit.

## Check these first
1. Does the change preserve GitHub Pages compatibility?
2. Does it keep GLB loading stable?
3. Does it keep fallback behavior reasonable?
4. Does it avoid unnecessary refactors?
5. Does it preserve or improve debug visibility?

## Flag as risky if
- it introduces new dependencies without strong reason,
- it changes file structure substantially without need,
- it weakens fallback/debug behavior,
- it mixes Viewer mode behavior with future AR behavior,
- it makes navigation more complex before it is stable.

## Review output format
- Root cause
- What changed
- What may still break
- Suggested next step
- Suggested commit message