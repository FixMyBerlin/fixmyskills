---
name: osm-pbfs
description: >-
  Find the machine-local shared OSM PBF cache and symlink extracts into a
  project instead of copying or re-downloading. Use when a task needs
  .osm.pbf files: Geofabrik extracts (berlin-latest, germany-latest), osmium,
  osm2pgsql, tilemaker, or OSM import fixtures.
---

# Shared OSM PBF extracts

OSM PBF files are large (Germany is about 4.5 GB). Keep one copy on disk in the
cache and symlink it into projects.

## Cache

```bash
ls -lh "$HOME/Development/_osm-pbfs"
```

Look there first. Typical files: `berlin-latest.osm.pbf` (small),
`germany-latest.osm.pbf` (large).

## Rules

1. Never copy a PBF from the cache into a repo.
2. Never download an extract that is already in the cache.
3. If an extract is missing, download it into the cache, then symlink.
4. Never commit `.osm.pbf` files. Make sure `*.osm.pbf` is gitignored.

## Symlink into the project

Use an absolute target so the link also resolves from worktrees:

```bash
ln -s "$HOME/Development/_osm-pbfs/berlin-latest.osm.pbf" ./berlin-latest.osm.pbf
ls -l ./berlin-latest.osm.pbf # starts with `l` and points at the cache
```

## Download a missing extract

Into the cache, never into the project:

```bash
mkdir -p "$HOME/Development/_osm-pbfs"
curl -L -o "$HOME/Development/_osm-pbfs/berlin-latest.osm.pbf" \
  "https://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf"
```

## Ask the user first

- The project already holds a real (not symlinked) copy of an extract: stop and
  offer to replace it with a symlink. Delete the duplicate only after they
  confirm, with `trash`, not `rm`.
- The user asks for a private copy: follow that.
