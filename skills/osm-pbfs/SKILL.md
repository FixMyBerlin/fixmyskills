---
name: osm-pbfs
description: >-
  Find the machine-local shared OSM PBF cache and symlink extracts into a
  project instead of copying or re-downloading. Use when a task needs
  .osm.pbf files: Geofabrik extracts (berlin-latest, germany-latest), osmium,
  osm2pgsql, tilemaker, or OSM import fixtures.
---

# Shared OSM PBF extracts

PBFs are large (Germany is about 4.5 GB). Keep one copy in a shared cache and
symlink it into projects.

## First: find the cache

```bash
PBF_DIR="${OSM_PBFS_DIR:-$HOME/Development/_osm-pbfs}"; ls -lh "$PBF_DIR"
```

Folder missing → read [references/setup.md](references/setup.md) first.

## Rules

1. Symlink, never copy, a PBF from the cache into a repo.
2. Never download an extract that is already in the cache.
3. A missing extract goes into the cache, then gets symlinked.
4. Never commit `.osm.pbf` files; make sure `*.osm.pbf` is gitignored.

```bash
PBF_DIR="${OSM_PBFS_DIR:-$HOME/Development/_osm-pbfs}" # repeat in every Bash call; shell state does not persist
ln -s "$PBF_DIR/berlin-latest.osm.pbf" ./berlin-latest.osm.pbf # absolute target, works from worktrees
curl -L -o "$PBF_DIR/brandenburg-latest.osm.pbf" \
  "https://download.geofabrik.de/europe/germany/brandenburg-latest.osm.pbf"
```

## Ask the user first

- The project holds a real (not symlinked) copy: offer to replace it with a
  symlink; delete the duplicate only after they confirm, with `trash`, not `rm`.
- The user wants a private copy: follow that.
