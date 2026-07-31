---
name: close-worktree
description: >-
  Close a git worktree session: ensure a clean tree (via finish-work if dirty),
  review branch-related stashes, preserve keepable untracked files onto develop,
  rebase the feature branch onto develop and fast-forward develop, then remove
  the worktree and local branch. Use when closing a worktree, landing a feature
  branch into develop, cleaning up after a worktree session, or finishing a
  parallel worktree.
disable-model-invocation: true
---

# Close worktree

Land the current worktree's feature branch onto `develop`, then delete the
worktree and local branch. Run this from the worktree you want to close.

Default integration branch: **`develop`**. If the user names another base
(`main`, etc.), use that instead.

This is not [finish-work](../finish-work/SKILL.md). Finish-work only checks and
commits in the current tree. Close-worktree owns the worktree lifecycle and
**calls finish-work** when the tree is dirty.

Never `cd` between worktrees — use `git -C <path>` so each command clearly
targets one worktree.

## Checklist

```
- [ ] Step 1: Resolve context (linked worktree, feature branch, develop checkout)
- [ ] Step 2: Clean working tree (finish-work if dirty → abort for review)
- [ ] Step 3: Review stashes related to this branch (stop if any)
- [ ] Step 4: Preserve keepable untracked files onto develop
- [ ] Step 5: Rebase onto develop, fast-forward develop
- [ ] Step 6: Remove worktree + delete local feature branch
- [ ] Step 7: Summarize and point user at the develop checkout
```

Abort on any stop condition below. Do not push unless the user explicitly asks.

## Step 1: Resolve context

In parallel:

```bash
git rev-parse --show-toplevel --git-dir --git-common-dir
git branch --show-current
git status -sb
git worktree list
git stash list
```

| Item             | How                                                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Linked worktree? | `--git-dir` differs from `--git-common-dir`. If they are equal you are in the primary checkout — **stop**, there is no worktree to close |
| Worktree path    | `git rev-parse --show-toplevel`                                                                                                          |
| Feature branch   | `git branch --show-current` (detached HEAD → stop and ask)                                                                               |
| Develop checkout | Path from `git worktree list` whose branch is `develop` (or the named base)                                                              |
| Commits to land  | `git rev-list --count develop..<feature-branch>` — zero means nothing to land, ask before cleanup                                        |

Stop conditions: current branch **is** the base branch; base branch not checked
out in any worktree; `git status` reports an in-progress rebase, merge, or
cherry-pick.

**Upstream / PR guard:** if the feature branch has an upstream
(`git rev-parse --abbrev-ref <feature>@{upstream}`) or an open PR
(`gh pr list --head <feature-branch>`), stop and ask. Landing locally would
bypass review — the user may want the PR merged instead (see babysit).

## Step 2: Clean working tree

If there are staged, unstaged, or other tracked dirty changes:

1. Run [finish-work](../finish-work/SKILL.md) (check + commit).
2. **Abort** after finish-work so the user can review the new commit(s).
3. Resume close-worktree only when the user asks again.

Untracked files alone do not force finish-work — handle them in Step 4.

## Step 3: Review stashes

Stashes are **repo-global**, not per-worktree: `git stash list` in this worktree
also shows develop's and other worktrees' stashes. Never drop one you have not
attributed.

Attribute each entry to this feature branch via the `WIP on <branch>:` message
and `git stash show --stat stash@{n}`.

If any related stash exists:

1. **Stop.** Show each candidate (index, message, changed files).
2. Ask whether to **commit the contents**, **drop**, or **keep and abort**.
3. Do not continue until the user decides.

Deleting the branch first makes a related stash hard to apply later — that is
why this step blocks.

Unrelated stashes: leave them alone; mention in the summary only if they were
temporarily used around the land.

## Step 4: Preserve keepable untracked files

Inventory local-only files in the worktree:

```bash
git status --porcelain -u            # untracked
git status --porcelain -u --ignored  # plus ignored (env, caches)
```

**Usually keep** (copy into the develop checkout, same relative path when
sensible):

- Cursor / agent plan `.md` files that live only in this worktree
- Other session notes the user still wants on develop

**Usually leave / discard** (do not copy):

- Worktree-specific env (`.env.local`, Docker stack overrides)
- `node_modules`, build artifacts, caches
- Secrets

Plans already under `~/.cursor/plans/` need no move — note that in the summary.

Copy keepable files into the develop checkout before deleting this worktree, and
ask when ownership is unclear. If Step 5's fast-forward then refuses because an
untracked file would be overwritten, move the copy aside and re-land it after.

## Step 5: Rebase onto develop and move commits

Rebase onto the **local** `develop` ref — that is the ref being fast-forwarded
next, so the two stay consistent:

```bash
git rebase develop
```

Only when the user wants remote commits included: fetch, fast-forward develop in
its own worktree first, then rebase.

```bash
git fetch origin develop
git -C <develop-checkout> merge --ff-only origin/develop
git rebase develop
```

Resolve conflicts; do not skip hooks.

Then fast-forward develop **in its own worktree** — `git checkout develop` here
would fail, since develop is checked out elsewhere:

```bash
git -C <develop-checkout> branch --show-current   # expect: develop
git -C <develop-checkout> merge --ff-only <feature-branch>
```

If fast-forward is not possible, stop and report — do not create a merge commit
unless the user asks.

Do not push `develop` unless asked.

If develop has unrelated local edits, stash them there around the FF and restore
after; report them as still uncommitted:

```bash
git -C <develop-checkout> stash push -m "close-worktree: pre-land WIP"
git -C <develop-checkout> stash pop
```

If the pop conflicts, stop and hand it to the user.

## Step 6: Cleanup

Only after develop contains the feature commits:

```bash
git worktree remove <worktree-path>
git -C <develop-checkout> branch -d <feature-branch>
```

- `git worktree remove` refuses while modified or untracked files remain. Only
  add `--force` once Step 4 confirmed nothing there is worth keeping.
- Run `branch -d` from the develop checkout: the worktree it targets is gone,
  and `-d`'s merged check should run against develop. Use `-D` only if the user
  explicitly allows deleting an unmerged branch.
- If the folder was already deleted by hand, `git worktree prune` clears the
  stale registration.

Confirm with `git worktree list` and `git branch` that both are gone.

## Step 7: Summary

Use this shape (adapt facts; keep terse):

```markdown
Done. Summary:

**Rebased into develop** — fast-forwarded `develop` (`<repo>`) to include all
N `<feature>` commits. `develop` is now at `<short-sha>` (ahead of
`origin/develop` by M, if applicable).

**Local files to preserve** — …

- …
- What was correctly not copied (e.g. `.env.local`)

**Cleanup**

- Removed worktree `<worktree-name>`
- Deleted local branch `<feature>`

**Note:** … (stashes restored, unrelated develop dirt, etc.)

Continue in `<develop-checkout-path>` on `develop`.
```

## Safety

- No push unless asked.
- No `--force` push, hard reset, or `git stash drop` / `clear` without explicit
  confirmation.
- No deleting remote branches unless asked.
- Do not copy secrets or worktree-only stack config onto develop.
- Stop for human review on dirty trees (after finish-work), related stashes, an
  upstream/open PR, or non-FF lands.

## Related

[finish-work](../finish-work/SKILL.md)
