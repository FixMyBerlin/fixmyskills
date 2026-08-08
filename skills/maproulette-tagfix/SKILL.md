---
name: maproulette-tagfix
description: >-
  Write MapRoulette Tag Fix (cooperative) challenges: line-by-line GeoJSON with
  cooperativeWork, stable OSM type/id external IDs, task_markdown + Mustache
  instructions, and rebuild/update triggers. Use when creating or updating
  MapRoulette tag-fix challenges, cooperativeWork GeoJSON, task_markdown,
  remoteGeoJson, or challenge rebuilds.
---

# MapRoulette Tag Fix challenges

Example task: [examples/tag-fix-task.ndjson](examples/tag-fix-task.ndjson). Docs: [Tag Fix](https://learn.maproulette.org/en-US/documentation/creating-cooperative-challenges/#creating-tag-fix-challenges), [external IDs](https://learn.maproulette.org/en-US/documentation/setting-external-task-identifiers/), [rebuild](https://learn.maproulette.org/en-US/documentation/rebuilding-challenge-tasks/), [line-by-line GeoJSON](https://learn.maproulette.org/en-US/documentation/line-by-line-geojson/).

## 1. Emit line-by-line GeoJSON (because Tag Fix needs it)

**Do:** one task = one line = one `FeatureCollection`, each line prefixed with RFC 7464 RS (`\x1E`).

**Because:** Tag Fix `cooperativeWork` is ignored on traditional multi-feature GeoJSON; you get normal tasks instead.

```ts
const rs = String.fromCharCode(0x1e)
stream.write(`${rs}${JSON.stringify(taskFeatureCollection)}\n`)
```

## 2. Use one stable OSM `type/id` everywhere (because rebuild + editors need it)

**Do:** build `osmId = "${type}/${id}"` as a **string** (`way/123`, `node/456`, `relation/789`). Put the **same** value in:

| Place                                  | Why                                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `features[0].properties.id`            | External task ID; visible in task props; Mustache `{{id}}`; API lookup `…/challenge/{id}/task/{type%2Fid}` |
| `features[0].id`                       | Same ID on the feature (rebuild matching)                                                                  |
| `cooperativeWork.operations[].data.id` | Tag Fix target element                                                                                     |

**Because:** MapRoulette matches rebuilds and editor preselect on that external ID. Wrong or mismatched IDs → duplicates or broken Tag Fixes.

**Do not:** use a bare numeric OSM id, or a different string in `cooperativeWork` than on the feature.

## 3. Build Tag Fix `cooperativeWork` (because that is the proposed change)

**Do:**

```json
"cooperativeWork": {
  "meta": { "version": 2, "type": 1 },
  "operations": [{
    "operationType": "modifyElement",
    "data": {
      "id": "way/123",
      "operations": [
        { "operation": "setTags", "data": { "cycleway:both": "no" } },
        { "operation": "unsetTags", "data": ["old_tag"] }
      ]
    }
  }]
}
```

- `meta.type: 1` = Tag Fix (approve/reject in MR; MapRoulette writes to OSM). `type: 2` = OSC cooperative (JOSM).
- Only encode the **delta** tags, not a full element snapshot.
- Geometry/features are for the map pin only — they are **not** sent as the edit; only `cooperativeWork` is.

## 4. Wire `task_markdown` + challenge instruction (because body text is Mustache-templated)

**Do — per task properties:**

```ts
properties: {
  id: osmId, // also used as {{id}} in the challenge instruction
  task_markdown: markdownBody.replaceAll('\n', ' \n'), // space before \\n keeps MR markdown line breaks
  task_updated_at: new Date().toISOString(),
}
```

**Do — challenge `instruction` template** (set once on create/update):

```text
## Kontext {{id}}

{{task_markdown}}

(Letzte Aktualisierung der Aufgabe: {{task_updated_at}})
```

**Because:** Mustache in the challenge instruction pulls feature properties. Putting `{{id}}` at the **start** gives mappers an immediate OSM reference. Keep long per-task copy in `task_markdown`; keep shared framing (title, update stamps) in the challenge instruction.

## 5. Point the challenge at remote GeoJSON, then rebuild to update

**Do — create/update challenge:** set `remoteGeoJson` to your data URL (or upload line-by-line GeoJSON).

**Do — refresh tasks after source data changes** (shell / GitHub Actions step):

```bash
CHALLENGE_ID=12345
MAPROULETTE_API_KEY=your-api-key   # or ${{ secrets.MAPROULETTE_API_KEY }} in Actions

curl --fail -sS -X PUT \
  "https://maproulette.org/api/v2/challenge/${CHALLENGE_ID}/rebuild?removeUnmatched=true&skipSnapshot=true" \
  -H "apiKey: ${MAPROULETTE_API_KEY}" \
  -H "accept: */*"
```

Or UI: Challenge → Rebuild (optionally “remove incomplete first”).

**Because:** create/update only changes challenge metadata; tasks are (re)built from the GeoJSON source. Stable `type/id` IDs let MapRoulette match existing tasks instead of duplicating. `removeUnmatched=true` drops incomplete tasks no longer in the feed.

## Checklist

- [ ] Line-by-line FeatureCollections with `\x1E` prefix
- [ ] Same string `type/id` on `properties.id`, `cooperativeWork…data.id`, and ideally `feature.id`
- [ ] `cooperativeWork.meta` = `{ version: 2, type: 1 }`
- [ ] Challenge instruction starts with `## Kontext {{id}}` then `{{task_markdown}}`
- [ ] Newlines in `task_markdown` normalized with `.replaceAll('\n', ' \n')`
- [ ] After data change: rebuild (API or UI), not only challenge PUT

## Reference

- Minimal task line: [examples/tag-fix-task.ndjson](examples/tag-fix-task.ndjson)
- Property / Mustache notes: [references/task-markdown-and-ids.md](references/task-markdown-and-ids.md)
