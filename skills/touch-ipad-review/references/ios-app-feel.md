# iOS app feel for React + Tailwind

How to make a phone web app feel native. Scope: **app shells** (fixed height, no page scroll, sheets, maps). Content websites are a separate topic.

Viewport lock and safe areas of full-screen pages: [tailwind-touch-checklist.md](tailwind-touch-checklist.md) section 4b. This page does not repeat them.

Researched 2026-11-01. **Fact** rests on a source we read. **Opinion** is a starting value or a judgment. **Test** means a real device has to confirm it; the iOS Simulator is not enough for keyboards.

## What gives a web app away

Check these first. Each is cheap and each is visible within seconds:

- Grey tap flash, text selection on controls, double-tap zoom
- Controls that react on release, or not at all
- Hover states that stick after a tap
- Blue focus rings after a tap (use `focus-visible:`)
- Input zoom on focus
- The page bouncing behind a sheet
- Content under the home indicator or notch
- Scroll position lost on back
- Hard cuts between screens, or animations over 300 ms
- Desktop dropdowns where a sheet belongs

## Baseline classes

| Where                   | Classes                                                                                                  | Basis                                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Every control           | `touch-manipulation select-none [-webkit-tap-highlight-color:transparent]`                               | Fact: [WebKit](https://webkit.org/blog/5610/more-responsive-tapping-on-ios/). Give a replacement for the tap highlight   |
| Press feedback          | `transition-transform duration-100 active:scale-[0.97]`                                                  | [Emil Kowalski](https://emilkowal.ski/ui/7-practical-animation-tips). Never start from `scale-0`; start at 0.9 or higher |
| Inputs                  | `text-base`, never `maximum-scale=1` or `user-scalable=no`                                               | Under 16px iOS zooms on focus. Disabling zoom fails WCAG 1.4.4                                                           |
| Targets                 | `min-h-11 min-w-11`, or a small control with `relative after:absolute after:-inset-2 after:content-['']` | [Vercel guidelines](https://vercel.com/design/guidelines): 44px on mobile                                                |
| Long-press items        | `[-webkit-touch-callout:none]`                                                                           | Non-standard                                                                                                             |
| Text people need        | no `select-none`                                                                                         | Copying an ID or a tag is a feature                                                                                      |
| Sheets, inner scrollers | `overscroll-contain`                                                                                     | Fact: Safari 16+ (iOS 16+). Stops chaining only                                                                          |
| Animated elements       | `transition-[transform,opacity]`, never `transition-all`; `motion-safe:` and `motion-reduce:`            | Vercel guidelines                                                                                                        |
| Primary actions         | at the bottom, `pb-[max(env(safe-area-inset-bottom),0.75rem)]`                                           | `env()` can be 0, so keep a floor                                                                                        |

`:active` on iOS: MDN compat data says it applies only when the element or body has a touchstart handler. If press states do nothing, add `document.addEventListener('touchstart', () => {}, { passive: true })` once. **Test**: not confirmed on a current iOS.

Tailwind v4 already wraps `hover:` in `@media (hover: hover)`, so sticky hover is solved there. In v3 set `future: { hoverOnlyWhenSupported: true }`. The stricter fine-pointer rule of the checklist stays for essential UI.

## Keyboard

iOS lays the keyboard over the page. The layout viewport keeps its size, the visual viewport shrinks and may pan, and only `visualViewport` fires events.

- **No API for this on iOS:** `interactive-widget` is unsupported ([WebKit bug 259770](https://bugs.webkit.org/show_bug.cgi?id=259770), open since 2023). The VirtualKeyboard API is Chromium only.
- **Keyboard height:** `innerHeight - visualViewport.height - visualViewport.offsetTop`, written to a CSS variable on `visualViewport` `resize` and `scroll`.
- **Keep the field visible:** `scroll-mb-…` on the input, plus `scrollIntoView({ block: 'center' })` on focus. Keep inputs out of `position: fixed` ancestors where possible.
- **Page stays shifted after closing:** an iOS 26 regression leaves `offsetTop` above 0 and `visualViewport.height` too small, in Safari and WKWebView ([Apple forum](https://developer.apple.com/forums/thread/800125)). No confirmed fix. Compare `visualViewport.height` with `innerHeight` yourself, and call `window.scrollTo(0, 0)` on a full-screen shell when the keyboard is gone.
- **Standalone PWA:** on iOS 17 and 18 one author saw the first keyboard shrink `innerHeight` and `100dvh` until force quit. Their fix: remember the largest `innerHeight` and force a reflow about 140 ms after blur ([write-up](https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d)).
- **In-app browsers (WKWebView):** undocumented, and reports conflict on whether `innerHeight` shrinks. Seen in OSMCha2: the app ended above an empty area while typing in an RSS reader's browser. Our approach, **Test**: do not publish a new `--app-height` while a text field has focus on a coarse pointer, and scroll back to 0 once it blurs. Do not trust `innerHeight` alone.

Avoid autofocus on touch. Set `inputMode`, `enterKeyHint`, `autoComplete`, `autoCapitalize` and `spellCheck={false}` where they fit.

## Bottom sheets

Default to [Vaul](https://vaul.emilkowal.ski/) or a tested library. Rules for anything custom, from [how Vaul was built](https://emilkowal.ski/ui/building-a-drawer-component):

- Ease with `cubic-bezier(0.32, 0.72, 0, 1)` at 500 ms; Emil says it closely matches the iOS sheet.
- Snap to the nearest point on release, and let a flick skip a point or dismiss. Vaul gives no velocity number; about 0.4 px/ms is **opinion**.
- Write `transform: translateY()` straight to the element during drag. A CSS variable lagged at about 20 list items, because it recalculates children.
- Start the drag only with content scrolled to the top, and wait 100 ms after reaching the top, so a fast scroll does not close the sheet. Ignore second touches.
- Damp upward drag past the top. A capped sigmoid works, see [`decay` in Build UI's elastic slider](https://buildui.com/recipes/elastic-slider).
- Every drag needs a tap alternative, such as a close button.
- Put `touch-none select-none` on what the finger drags, or the page scrolls under it.

## Motion

- Interaction under 200 ms, UI under 300 ms, only sheets longer. Ease out for enter and exit, never ease in. Skip animation on very frequent actions.
- Motion's `visualDuration` plus `bounce` maps to SwiftUI's model ([docs](https://motion.dev/docs/react-transitions)). **Opinion**: `{ type: 'spring', visualDuration: 0.35, bounce: 0 }` for sheets and navigation, `bounce: 0.15` for toggles.
- Physics springs (`stiffness`, `damping`) keep gesture velocity, so use them on drag release. Duration springs do not.
- `<MotionConfig reducedMotion="user">`, and crossfades instead of slides.
- Avoid large `blur()` and `backdrop-blur` over scrolling content.

From the paid [Framer Motion Recipes](https://buildui.com/courses/framer-motion-recipes) and [Advanced Radix UI](https://buildui.com/courses/advanced-radix-ui) lessons:

- `ease: [0.32, 0.72, 0, 1]` is the curve of Ionic's modal enter, which emulates iOS. It is the same curve Vaul uses, so use it wherever a tween should feel like iOS.
- Keep CSS and Motion apart: a Tailwind `transition` on a property Motion animates causes flicker. Remove the class, and use `whileHover` and `whileTap` for those states.
- Time properties separately: opacity faster than movement, so content fades before it travels. Nest the options per property in `transition`.
- Interruption: moving one strip of a fixed number of items with `x` is interruptible for free. Enter and exit with `AnimatePresence` is not; ignore input until `onExitComplete` fires.
- `initial={false}` stops animations on mount. Screens should appear settled.
- iOS controls grow on press to signal the start of an interaction. For the slider, the lesson slows this to 350 ms, and also needs `touch-none` and `select-none`.
- Libraries that focus elements from code can trigger `focus-visible:` on a pointer. If an outline shows on tap, track pointer use in state and hide the outline then.
- When mobile and desktop differ a lot, write two versions of that section (`md:hidden`, `hidden md:flex`) instead of scattering classes.

Build UI ([recipes](https://buildui.com/recipes)) is useful for components, not shells: [iOS switch](https://buildui.com/recipes/ios-animated-switch), [`layoutId` tabs](https://buildui.com/recipes/animated-tabs), [height animation for sheets whose content changes](https://buildui.com/recipes/resizable-panel), [collapsing header](https://buildui.com/recipes/fixed-header). Neither the recipes nor the 14 lessons we read cover sheets, safe areas, `dvh` or overscroll. Its "Mobile redesign" lesson is about visual design, not touch.

## Navigation

- **Back swipe cannot be disabled** ([WebKit bug 247084](https://bugs.webkit.org/show_bug.cgi?id=247084)). Keep horizontal swipes about 20 px off the left edge, use `touch-pan-y` on swipeable rows, and offer a back button.
- **Keep state on back:** keep tab screens mounted, hidden with React 19's `<Activity mode="hidden">`, or store scroll per route. Filters belong in search params.
- **Tab bar:** 3 to 5 items, fixed at the bottom, no animation on switch. Tapping the active tab goes to the top.
- **View Transitions:** Safari 18+ for same-document. Skip them on swipe back, as the system has already animated. That is **opinion**, and **Test**.

## Perceived speed

- Optimistic updates with `useOptimistic` or TanStack Query `onMutate`.
- Skeletons for content, spinners only for actions. Delay them 150 to 300 ms, and keep them for 300 to 500 ms once shown. They must match the final layout.
- `tabular-nums`, and explicit image sizes.
- Long lists: `content-visibility: auto` with `contain-intrinsic-size: auto 300px` ([web.dev](https://web.dev/articles/content-visibility)). Scrollbars can jump.

## PWA and shell

- `viewport-fit=cover` unlocks the insets.
- `apple-mobile-web-app-capable` plus a manifest with `display: standalone`. `black-translucent` puts content under the status bar, so it needs the top inset.
- From iOS 26, Home Screen sites open as web apps by default ([WebKit](https://webkit.org/?p=16993)).
- `overscroll-none` on the shell. Body `overflow: hidden` is unreliable on iOS ([bug 259568](https://bugs.webkit.org/show_bug.cgi?id=259568)), so scroll in one inner container. `overscroll-behavior: none` may not stop pull-to-refresh ([bug 275947](https://bugs.webkit.org/show_bug.cgi?id=275947)).
- Haptics: `navigator.vibrate` does not exist on iOS. The hidden `<input type="checkbox" switch>` trick is non-standard; skip it.

## Priorities

1. Baseline classes and input size: an hour, and the biggest gain.
2. Safe areas and a shell that does not move ([section 4b](tailwind-touch-checklist.md)).
3. Keyboard behaviour, on real devices, including one in-app browser.
4. Sheets instead of dropdowns.
5. State kept on back.
6. Springs and transitions, last.
