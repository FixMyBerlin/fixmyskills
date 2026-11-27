# Minute updates from openstreetmap.fr

`scripts/update-to-minute.ts` brings a cached extract to the latest minute.

## What it does

1. `pyosmium-up-to-date` applies the
   [Germany minute diffs of openstreetmap.fr](https://download.openstreetmap.fr/replication/europe/germany/minute/)
   to `<extract>-latest.osm.pbf`.
2. For a regional extract (anything but `germany`) the diffs also add objects
   from the rest of Germany. `osmium extract` clips the file back to the
   Geofabrik polygon (`<extract>.poly`, downloaded once into the cache) and keeps
   the replication header.
3. The result replaces the cached file under the same name, so symlinks in
   projects stay valid.

Objects changed after the Geofabrik export carry user and changeset metadata;
the rest of a public Geofabrik file has none.

## Requirements

- `bun`, `osmium` (`brew install osmium-tool`) and `uv` (`brew install uv`); the script
  runs `pyosmium-up-to-date` via `uvx`, nothing else to install.
- Free disk space for a second copy of the file while it updates (Germany: about
  5 GB).

## Limits

- The diffs cover Germany only. Extracts outside Germany need another feed.
- Works for Germany and its states only; sub-regions (for example `oberbayern`)
  have another polygon path.
- Time grows with the age of the file: Berlin, 2.5 days old, takes about 2
  minutes; an already updated file takes seconds. Every Germany diff is
  downloaded, even for Berlin.
- openstreetmap.fr and Geofabrik cut Germany with slightly different polygons,
  so objects right at the border may stay outdated until the next Geofabrik
  download.
