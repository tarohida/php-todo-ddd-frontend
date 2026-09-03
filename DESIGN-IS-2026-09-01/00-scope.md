# Design Audit Scope

- Audited surface: the running Todo list at `http://127.0.0.1:18080/`, centered on `src/components/TodoList.vue`, `Navigation.vue`, and `ContentArea.vue`.
- Primary user: an individual quickly capturing, completing, filtering, renaming, and deleting short tasks.
- Primary task: add a task and understand its state without navigating away from the list.
- Constraints: Vue 3, existing API behavior and tests, responsive desktop/mobile layout, WCAG AA keyboard support, no decorative image dependency.
- References: Todoist's list-first hierarchy, Linear's reduced visual noise/alignment, and Microsoft To Do's reduced headers and list focus.
