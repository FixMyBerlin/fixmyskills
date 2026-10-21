# Text pass (Phase 10)

Scope: comments, JSDoc, markdown and user-facing strings that the branch adds or changes. Not the whole docs tree. No code restructuring.

## Facts survive the rewrite

Keep every version number, file path, script name, verdict and threshold. If a smoother sentence loses "only `dev:vite` passes `--bun`", the smoother sentence is wrong. Keep the anchors: file links, pinned permalinks or a line-range code block, so the reader can check the claim.

## Plans: one verdict per option

Open with where we are. Then one section per option, each with a visible verdict (`do now` / `try` / `later` / `don't`) and the reason.

## Report substance changes

A wording pass may reveal a wrong or overstated claim. Fix it, and list it separately in the phase summary instead of burying it in the rewrite. Keep the document's language; do not translate German into English.

## Code comments

Delete comments that restate the next line and JSDoc that only repeats the name. Keep a comment that states a constraint the code cannot show: a MapLibre/React quirk with a link, a legal or attribution note, a type the compiler cannot express. Keep intentional German UI copy.
