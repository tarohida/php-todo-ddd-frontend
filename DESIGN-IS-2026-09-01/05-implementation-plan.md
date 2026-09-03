# Modern Todo UI Implementation Plan

## Phase 0 — Allowed APIs and patterns

- Keep Vue 3 Options API and existing `todoApi.list/create/delete/updateCompleted/updateTitle` contracts. Copy the current lifecycle, non-optimistic mutation, generation guard, and `$nextTick()` focus patterns from `src/components/TodoList.vue:209-399`.
- Use documented Vue `v-if`/`v-else-if`, object `:class`, dynamic refs, and `$nextTick()`; do not combine `v-if` and `v-for` on one element or use timer-based focus.
- Use CSS custom properties, `:focus-visible`, `prefers-color-scheme`, and `prefers-reduced-motion`. Do not hide focus, rely on hover alone, or animate without a reduced-motion fallback.
- Preserve existing test IDs, ARIA state, controlled checkbox rollback, and explicit GET refresh after successful mutations (`src/components/TodoList.test.js:36-413`).
- Avoid new UI/icon dependencies. Use semantic HTML and small inline SVGs with `aria-hidden="true"` only where text alternatives already exist.

## Phase 1 — Information architecture and tokens

Implement:

- Replace generic navbar/table framing with a quiet app shell, compact Todo identity, `<main>`, page heading, task summary, quick-capture card, segmented filters, and semantic task list.
- Add consolidated global tokens/reset in `src/assets/base.css`; replace Bootstrap imports in `src/main.js`.
- Convert `Navigation.vue`, `NavigationTitle.vue`, `ContentArea.vue`, `TodoList.vue`, and offline fallback so no production Bootstrap class remains; then remove Bootstrap from dependencies.
- Preserve all behavioral bindings and handlers rather than rewriting state logic.

References: `Navigation.vue:1-46`, `ContentArea.vue:1-38`, `TodoList.vue:1-159`, `TodoListWithOutBackend.vue:38-81`, Vue scoped CSS documentation and MDN media-query documentation captured in Phase 0.

Verification:

- Structural tests assert `main`, heading, semantic list, filter `aria-pressed`, stable test IDs, and contextual action labels.
- `rg` finds no Bootstrap imports/classes, external Font Awesome CDN, clickable divs, or `v-html`.
- Existing API/order/unmount tests remain green.

## Phase 2 — Responsive and interaction states

Implement:

- Desktop workspace max width with intentional vertical rhythm; mobile single-column layout at 390px without horizontal overflow.
- Quiet row actions that remain visible/reachable on keyboard and touch; completion remains visually distinguishable beyond color.
- Designed loading, error/retry, success, global/filtered empty, editing, disabled, hover, and focus-visible states.
- Dark palette under `prefers-color-scheme: dark`; all transitions disabled/reduced under `prefers-reduced-motion: reduce`.
- Japanese-only user-facing copy: `Todoホーム`, `やることを入力`, `タスク一覧`, and clear count/filter wording.

Verification:

- Unit tests cover copy, semantics, classes, editing, completion, filters, failure, and retry without weakening existing assertions.
- Browser at 1440×900 and 390×844: create, complete, filter, edit via Enter, cancel via Escape, delete, retry/error, focus ring, no overflow.
- Measure representative light/dark contrast at WCAG AA and verify every primary action is keyboard reachable.

## Phase 3 — Final quality gate

- Run clean Docker build, full Vitest, ESLint, Vite production build, `npm audit --audit-level=high`, and `git diff --check`.
- Compare desktop/mobile screenshots to the audit baseline; confirm tasks dominate and no unsupported sidebar/dashboard feature was added.
- Anti-pattern grep: Bootstrap/Font Awesome imports, table layout, hover-only controls, missing focus-visible/reduced-motion/dark-mode rules, optimistic task mutation.
- Independent verification, anti-pattern review, and code-quality review must all pass before `Refs #14` commit and push.
