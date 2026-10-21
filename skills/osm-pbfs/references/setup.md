# Set up the OSM PBF cache

One-time per machine. The skill looks in `$OSM_PBFS_DIR`, falling back to
`~/Development/_osm-pbfs`.

1. Ask the user where the cache should live. Default: `~/Development/_osm-pbfs`.
   Use a disk with room for the Germany extract (about 4.5 GB).
2. Another location: tell the user to add this to their shell profile
   (`~/.zshrc`) and open a new shell:

   ```bash
   export OSM_PBFS_DIR="/path/to/osm-pbfs"
   ```

   This session does not see the new export yet: use the chosen path directly
   until Claude Code is restarted.

3. Create the folder and fetch the small Berlin extract to start with:

   ```bash
   PBF_DIR="$HOME/Development/_osm-pbfs" # or the chosen path
   mkdir -p "$PBF_DIR"
   curl -L -o "$PBF_DIR/berlin-latest.osm.pbf" \
     "https://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf"
   ```

   Fetch Germany only when a task needs it; ask before a multi-GB download.

Extract URLs: <https://download.geofabrik.de/europe/germany.html>.
