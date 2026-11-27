---
name: osm-pbfs
description: >-
  Find the machine-local shared OSM PBF cache and symlink extracts into a
  project instead of copying or re-downloading. Use when a task needs
  .osm.pbf files: Geofabrik extracts (berlin-latest, germany-latest), osmium,
  osm2pgsql, tilemaker, or OSM import fixtures; or when a task needs current
  OSM data: check an extract's age, update it to the latest minute (minute
  diffs, pyosmium-up-to-date).
---

# Shared OSM PBF extracts

PBFs are large (Germany is about 5 GB). Keep one copy in a shared cache and
symlink it into projects.

## First: find the cache

```bash
PBF_DIR="${OSM_PBFS_DIR:-$HOME/Development/_osm-pbfs}"; ls -lh "$PBF_DIR"
```

Folder missing → read [references/setup.md](references/setup.md) first.

## Rules

1. Symlink, never copy, a PBF from the cache into a repo.
2. Never download an extract that is already in the cache, unless it is too
   old for the task (see below).
3. A missing extract goes into the cache, then gets symlinked.
4. Never commit `.osm.pbf` files; make sure `*.osm.pbf` is gitignored.

```bash
PBF_DIR="${OSM_PBFS_DIR:-$HOME/Development/_osm-pbfs}" # repeat in every Bash call; shell state does not persist
ln -s "$PBF_DIR/berlin-latest.osm.pbf" ./berlin-latest.osm.pbf # absolute target, works from worktrees
curl -L -o "$PBF_DIR/brandenburg-latest.osm.pbf" \
  "https://download.geofabrik.de/europe/germany/brandenburg-latest.osm.pbf"
```

## Data age and minute updates

A cached extract is as old as its download. Check it before a task that needs
current data:

```bash
osmium fileinfo --no-progress -g header.option.osmosis_replication_timestamp "$PBF_DIR/berlin-latest.osm.pbf"
```

- Up to about a week old, extract inside Germany: update it in place to the
  latest minute (needs `osmium` and `uv`; Berlin, 2.5 days old: about 2 minutes):
  `bun <this skill's folder>/scripts/update-to-minute.ts berlin` (or
  `brandenburg`, `germany`, …).
- Older, or outside Germany: download the Geofabrik file again over the cached
  one (at most a day old; ask before multi-GB downloads), then update if needed.

How it works, failures and limits:
[references/minute-updates.md](references/minute-updates.md).

## Ask the user first

- The project holds a real (not symlinked) copy: offer to replace it with a
  symlink; delete the duplicate only after they confirm, with `trash`, not `rm`.
- The user wants a private copy: follow that.
