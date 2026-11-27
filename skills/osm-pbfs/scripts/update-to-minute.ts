// Brings a Geofabrik extract in the PBF cache up to the latest minute with the
// OSM minute diffs of openstreetmap.fr (Germany feed).
import { homedir } from 'node:os'
import { join } from 'node:path'
import { $ } from 'bun'

const name = process.argv[2]
if (!name) {
  console.error('usage: bun update-to-minute.ts <extract, e.g. berlin or germany>')
  process.exit(1)
}
const dir = process.env.OSM_PBFS_DIR || join(homedir(), 'Development/_osm-pbfs')
const pbf = join(dir, `${name}-latest.osm.pbf`)
const updating = join(dir, `${name}.updating.osm.pbf`)
const clipped = join(dir, `${name}.clipped.osm.pbf`)
const server = 'https://download.openstreetmap.fr/replication/europe/germany/minute/'

const header = async (option: string, file: string) =>
  (await $`osmium fileinfo --no-progress -g header.option.osmosis_replication_${option} ${file}`.text()).trim()

if (!(await Bun.file(pbf).exists())) {
  console.error(`${pbf} is missing`)
  process.exit(1)
}
console.log(`${pbf}: data until ${await header('timestamp', pbf)}`)
await $`rm -f ${updating} ${clipped}`

// Start from the newest object in the file: a Geofabrik header names the Geofabrik feed.
// Exit code 1 means changes are left (size limit), so continue a few passes.
let { exitCode } =
  await $`uvx --from osmium pyosmium-up-to-date --ignore-osmosis-headers --server ${server} -o ${updating} ${pbf}`.nothrow()
for (let pass = 0; pass < 5 && exitCode === 1; pass++) {
  ;({ exitCode } = await $`uvx --from osmium pyosmium-up-to-date --server ${server} ${updating}`.nothrow())
}
if (exitCode > 1) {
  await $`rm -f ${updating}`
  console.error(`pyosmium-up-to-date failed with exit code ${exitCode}`)
  process.exit(1)
}
if (exitCode === 1) console.warn('Warning: changes left after 6 passes, run the script again')

// The Germany diffs also add objects from outside a regional extract: clip back to its Geofabrik polygon.
if (name !== 'germany') {
  const poly = join(dir, `${name}.poly`)
  if (!(await Bun.file(poly).exists())) {
    await $`curl -sfL -o ${poly} https://download.geofabrik.de/europe/germany/${name}.poly`
  }
  const keep: string[] = []
  for (const option of ['timestamp', 'base_url', 'sequence_number']) {
    keep.push('--output-header', `osmosis_replication_${option}=${await header(option, updating)}`)
  }
  await $`osmium extract --no-progress -p ${poly} --set-bounds ${keep} -O -o ${clipped} ${updating}`
  await $`mv ${clipped} ${updating}`
}

await $`mv ${updating} ${pbf}`
console.log(`${pbf}: data until ${await header('timestamp', pbf)}`)
