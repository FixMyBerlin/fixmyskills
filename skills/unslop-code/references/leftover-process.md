# Leftover process artifacts (unslop-code)

Phase 9. Scratch docs, one-off SQL, and helper scripts pile up while a PR is still in progress. **Do not clean those mid-stream.** This phase runs only when the user wants the PR **production-ready to merge**.

This is a different question from Phase 4b (“was it deployed?”). 4b is schema/compat. This phase is scratch process residue.

## Gate: merge-ready? (orchestrator asks first)

Ask before any explore/delete. The question must stand alone:

- We are about to look for leftover process files (scratch `.md`, one-off `.sql`, helper `.ts` scripts) that are not part of everyday/critical tooling
- **Make this PR production-ready to merge:** we will list candidates, then delete what is unused
- **Still deep in the work:** skip this phase entirely; keep the helpers

If the answer is skip or there is no reply, do not touch these files. Record “Phase 9 skipped — not merge-ready” in the end summary. Spawn workers only on “merge-ready”.

## What to look for (only after merge-ready)

Added or leftover on the branch, and **not** used all the time and critical:

- Helper / debug / one-shot scripts (`.ts`, `.js`, `.sh`) that `package.json` / CI / the app never call
- One-off `.sql` (investigation, backfill that already ran, copy-paste queries)
- Process or investigation `.md` (notes, checklists, “how I did X”, WIP writeups) that are not product docs
- Scratch data, dumps, `.http` files, ad-hoc notebooks

**Keep:** scripts wired into `package.json` / CI / everyday `bun run`; Prisma migrations Phase 4b already kept; `README` / `AGENTS.md` / user-changelog / skill docs that are the real handbook.

If a file might be critical, AskQuestion with path + who calls it. Do not delete `user-changelog` or legal/attribution text.

## What to do

Before deleting any candidate, prove it is unreferenced: grep the repo for its basename and for its path (imports, `package.json` scripts, CI workflows, Dockerfiles, README, other docs). A file with zero hits outside itself is safe. Anything else is a question, not a delete.

- Unused and obvious: `git rm` in this phase, then let finish-work run the checks
- Referenced from README but not from code/CI: AskQuestion (drop file and mention, or keep)
- Unclear: follow-up; do not guess
- Never delete a file the branch did not add. Untracked scratch files are the user's, not yours — list them, do not remove them.

Then Phase 10 (unslop-text) runs on what remains.

## Search (give to `explore`)

```bash
git diff --name-status <base>...HEAD -- '*.md' '*.sql' 'scripts/' '*.http'
```

Check `package.json` and CI for callers. Flag `*.ts` helpers that are not under `components/`, `routes/`, `server/`, or `shared/`. For each candidate, report the reference count outside the file itself:

```bash
rg -n --fixed-strings '<basename-without-extension>' -g '!<the-file-itself>'
```
