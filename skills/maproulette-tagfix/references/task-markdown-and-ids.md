# task_markdown and type/id

## Same ID in three places

```ts
const osmId = `${osmType}/${osmNumericId}` // e.g. "way/12345678"

const feature = {
  type: 'Feature',
  id: osmId, // Feature-level (rebuild / external id)
  properties: {
    id: osmId, // Properties (visible + {{id}} Mustache)
    task_markdown: body.replaceAll('\n', ' \n'),
    task_updated_at: new Date().toISOString(),
  },
  geometry,
}

const cooperativeWork = {
  meta: { version: 2, type: 1 },
  operations: [
    {
      operationType: 'modifyElement',
      data: {
        id: osmId, // Tag Fix target — must match
        operations: [
          { operation: 'setTags', data: { 'cycleway:both': 'no' } },
          { operation: 'unsetTags', data: [] },
        ],
      },
    },
  ],
}
```

## Challenge instruction (Mustache)

Set on the challenge once (create/update):

```text
## Kontext {{id}}

{{task_markdown}}

(Last task update: {{task_updated_at}})
```

`{{id}}` at the top is the OSM `type/id` reference mappers see first.

## Why the newline replace

MapRoulette Markdown often collapses bare `\n`. Prefixing with a space (`' \n'`) preserves paragraph breaks in the rendered task body.

## Lookup by type/id

With `properties.id = "way/123"`, MapRoulette serves:

`GET /api/v2/challenge/{challengeId}/task/way%2F123`

## Rebuild

```bash
CHALLENGE_ID=12345
MAPROULETTE_API_KEY=your-api-key   # or ${{ secrets.MAPROULETTE_API_KEY }} in Actions

curl --fail -sS -X PUT \
  "https://maproulette.org/api/v2/challenge/${CHALLENGE_ID}/rebuild?removeUnmatched=true&skipSnapshot=true" \
  -H "apiKey: ${MAPROULETTE_API_KEY}" \
  -H "accept: */*"
```

Or UI: Challenge → Rebuild (optionally remove incomplete first). Stable `type/id` across rebuilds prevents duplicate tasks.
