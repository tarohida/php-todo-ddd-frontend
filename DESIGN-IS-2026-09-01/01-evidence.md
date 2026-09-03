# Evidence

## 1. Innovative

The screen uses conventional Bootstrap card, button, and table patterns (`src/main.js:3-4`, `src/components/TodoList.vue:4-154`) without a distinct interaction improvement. Peer products instead emphasize a calm list-first hierarchy.

## 2. Useful

Create, refresh, filters, completion, edit, and delete are available on one screen (`TodoList.vue:5-151`). The observed one-task state has 10 interactive elements; manual refresh is an additional affordance despite mutations already refreshing the list (`TodoList.vue:26-51,276-389`).

## 3. Aesthetic

The live 1280×720 screen occupies only the upper ~408px and leaves most of the viewport blank. Spacing mixes 1/4/6/8/12/16/32/38/70/160px; type mixes 14/16/24/28/32px; 14–15 rendered colors are present. Task columns produce irregular gaps (`TodoList.vue:73-151,404-476`).

## 4. Understandable

Most actions have direct Japanese labels and filters expose `aria-pressed` (`TodoList.vue:28-50,84-147`). However, `Product` labels the home link (`NavigationTitle.vue:2`), the Japanese page uses the English placeholder “What needs to be done?” (`TodoList.vue:12`), and `Todoタスク一覧` mixes languages (`TodoList.vue:75`).

## 5. Unobtrusive

The dark sticky header, manual refresh, three filters, and permanently visible row actions compete with a short task list (`Navigation.vue:6-18`, `TodoList.vue:26-51,77-112`).

## 6. Honest

No inflated claims, dark patterns, modal interception, or misleading success state were found. Action copy maps to resolved behavior (`TodoList.vue:276-385`). The generic `Product` link label is the single notable label/behavior clarity defect.

## 7. Long-lasting

The UI relies on default Bootstrap presentation plus fixed local CSS rather than a token system (`src/main.js:3-4`, `TodoList.vue:404-476`). The dark utility navbar, table layout, and tiny outline buttons date the presentation.

## 8. Thorough

Empty, loading, error, success, focus, and disabled states exist (`TodoList.vue:14-71,89-145`). Focus relies mostly on browser/Bootstrap defaults; no authored `:focus-visible` rule exists (`TodoList.vue:404-476`). Lowest visible text contrast is 4.50:1 on the Add button.

## 9. Environmentally Friendly

Production JS is 156,313 bytes raw / 51,969 bytes gzip; CSS is 232,222 bytes raw / 31.15KB gzip. The primary dev view made 23 requests and reached an interactivity proxy in ~928ms. There are no idle animations, badges, modals, or initial notifications. Dark mode and reduced-motion preferences are not implemented.

## 10. As Little Design as Possible

The one-task state contains 10 controls. Manual refresh, the decorative `>`, generic header branding, and three full filter buttons add chrome around a simple list (`NavigationTitle.vue:2`, `TodoList.vue:6,26-51`).

## Accessibility

Keyboard access exists for every primary action, and edit focus is moved programmatically (`TodoList.vue:345-356`). There are two landmarks (`header`, `nav`) but no `main` landmark or skip link (`Navigation.vue:31-35`, `ContentArea.vue:1-12`).
