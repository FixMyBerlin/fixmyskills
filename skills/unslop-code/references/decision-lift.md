# Decision lift (unslop-code)

Phase 7. Central question: **where are we doing unnecessary work, and which decisions can we take higher up so the code below gets simpler?**

This is not a second Zod or legacy pass. Phases 1, 4, and 4b already cover over-validation, code shims, and undeployed migration files. This phase looks at the **remaining tree**: a parent already knows the answer, but children still branch, re-narrow, re-fetch, or re-decide.

Skip when the repo has no app tree (scripts-only, no components/routes).

## What to look for

- The same variant / region / mode / auth / empty-state check repeated in several leaves
- Props that exist only to thread a decision the route or parent already made
- Optional-chaining forests or extra `if` because the type was not narrowed above
- Derived values recomputed in children instead of once at the source
- Dual render paths for one visual family
- Work that cannot change the result (dead branches after a parent guard)

## What to do with each finding

- **Very obvious** (parent already has the value; leaf only repeats it): fix in this phase
- **Needs design** (API change, which layer owns the decision): do **not** guess — add a **follow-up plan item**
- **User/product choice** would change the split: **AskQuestion**

Follow-up plan items are more than Secondary. Each one must be something someone can pick up and plan: location, what is duplicated or decided too low, what would get simpler above/below, and why it is not a clear fix now.

Secondary stays for style / optional / “maybe” that is not a decision-hierarchy issue.

## AskQuestion (propose; orchestrator asks)

Every proposed question must:

- Be understandable without reading the worker transcript
- Name the file/route and what the code does today
- State the options and what each option simplifies or costs
- Say why the answer is needed now (what we will do with it)

No vague “should we refactor X?”

## Search (give to `explore`)

Walk the branch (and obvious call sites) for repeated decisions and wasted work. Group by “could move to route / layout / parent”. Do not edit.
