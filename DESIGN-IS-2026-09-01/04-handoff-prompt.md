# Make-plan Handoff

```text
/make-plan Redesign the Todo web application's primary list screen. Current design failed audit at 15/30 with critical gaps in principles #3 aesthetic, #4 understandable, #7 long-lasting, and #10 as little design as possible.

Verdict paragraph (quoted from 03-verdict.md):
> At 15/30, the screen needs a focused redesign: its behavior is solid, but weak hierarchy, inconsistent presentation, and unclear copy prevent the task list from feeling current or self-explanatory.

Why redesign and not refine: The total is below 20 and the load-bearing understandability principle scored 1, so restyling the existing table/navbar structure would preserve the core hierarchy problem.

Preserve from current design:
- Complete create/filter/complete/edit/delete behavior and accessible action labels (`src/components/TodoList.vue:5-151`).
- Loading, error, success, empty, disabled, and programmatic edit-focus behavior (`src/components/TodoList.vue:52-71,345-356`).

Discard:
- Bootstrap-style table and permanently exposed action columns (`src/components/TodoList.vue:73-151`). Caused failures on principles #3 and #10.
- Generic sticky navbar, decorative arrow, and manual-refresh-first chrome (`src/components/Navigation.vue:6-18`, `src/components/TodoList.vue:6,26-51`). Caused failures on principles #4, #5, and #10.

Top moves from the audit:
1. Principle #2 — Useful: make quick capture and the task list the two dominant regions; demote manual refresh and secondary actions. Evidence: §2.
2. Principle #3 — Aesthetic: introduce one tokenized spacing/type/color system and a centered, responsive workspace that uses the viewport deliberately. Evidence: §3.
3. Principle #4 — Understandable: replace generic/mixed-language copy and present counts/filter state as one clear list header. Evidence: §4.
4. Principle #8 — Thorough: design intentional focus, hover, loading, empty, error, success, disabled, and reduced-motion states. Evidence: §8.
5. Principle #10 — Minimal: remove the decorative arrow and generic navbar; reveal edit/delete as quiet secondary actions without hiding keyboard access. Evidence: §10.

Redesign principles in priority order:
1. Principle #2 — Useful — capture and complete a task in one obvious flow.
2. Principle #4 — Understandable — every Japanese label and state is immediately clear.
3. Principle #10 — As little design as possible — tasks dominate; chrome recedes.

Deliverables for the plan:
- New information architecture rather than a restyled table
- New low-fidelity primary flow compared with the current screen
- Consolidated responsive tokens for type, spacing, color, radius, elevation, and motion
- Empty, loading, error, success, focus, hover, disabled, mobile, dark-mode, and reduced-motion states
- Migration that preserves all existing API behavior and automated tests
- Cutover criteria based on keyboard access, WCAG AA, desktop/mobile screenshots, and full test/lint/build/audit results

Anti-patterns:
- Porting the old table structure under new colors
- Adding a decorative dashboard/sidebar for features that do not exist
- Copying Todoist, Linear, or Microsoft To Do wholesale
- Hiding edit/delete from keyboard or touch users
- Replacing honest state feedback with motion or decorative imagery
```
