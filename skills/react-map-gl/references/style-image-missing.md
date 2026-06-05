# Missing style images (styleimagemissing)

Symbol layers reference icons in the style sprite. When an icon id is missing, MapLibre emits **`styleimagemissing`**. In React, subscribe on the **`MapRef`** from `useMap()` inside `useEffect`, not on a manual ref.

## Tilda: dev-only warning

```tsx
// tilda-geo: RegionMap.tsx
useEffect(
  function subscribeToMissingStyleImages() {
    if (!mainMap || !isDev) return

    const handleStyleImageMissing = (event: MapStyleImageMissingEvent) => {
      const imageId = event.id
      if (imageId === 'null') return // conditional "none" fallback can emit "null"

      console.warn('Missing image', imageId)
    }

    mainMap.on('styleimagemissing', handleStyleImageMissing)

    return function unsubscribeFromMissingStyleImages() {
      mainMap.off('styleimagemissing', handleStyleImageMissing)
    }
  },
  [mainMap],
)
```

Guard with **`mainMap`** from `useMap()` and wait until the map exists. Optional: also require `useMapLoaded()` so the style is fully applied before subscribing.

## Production: provide fallback images

Logging alone does not fix rendering — MapLibre will keep requesting missing ids. Options:

### 1. Add image in handler (common pattern)

```tsx
const handleStyleImageMissing = (event: MapStyleImageMissingEvent) => {
  const map = mainMap.getMap()
  const id = event.id
  if (map.hasImage(id)) return

  // 1x1 transparent PNG or placeholder sprite
  map.addImage(id, placeholderImageData, { pixelRatio: 1 })
}
```

Generate `placeholderImageData` via `map.loadImage(url)` once, or inline a minimal `ImageData` / `HTMLImageElement`.

### 2. Fix the style JSON

Ensure sprite sheet includes all icon names referenced in `icon-image` expressions. Tilda styles are built server-side — missing ids usually mean style build or conditional expression bug.

### 3. Ignore known sentinel ids

Tilda skips `'null'` from conditional icon expressions with a string fallback `"none"`. Maintain an allowlist of known benign ids if your style uses similar patterns.

## React lifecycle rules

```tsx
// ✅ Effect on MapRef from useMap()
useEffect(() => {
  if (!mainMap || !mapLoaded) return
  const handler = (e: MapStyleImageMissingEvent) => { … }
  mainMap.on('styleimagemissing', handler)
  return () => { mainMap.off('styleimagemissing', handler) }
}, [mainMap, mapLoaded])

// ❌ Subscribing in onLoad without cleanup
onLoad={(e) => e.target.on('styleimagemissing', …)}

// ❌ mapRef.current in render
```

Re-subscribe when `mapStyle` changes if the map instance is reused (`reuseMaps`) — dependency array should include style identity if handlers depend on it.

## Conditional / data-driven icons

When `icon-image` is a data expression:

- Missing property → missing image id → event fires.
- Use coalesce in the style: `['coalesce', ['get', 'icon'], 'default-marker']`.
- Register `default-marker` in sprite or add via `styleimagemissing`.

## Dev vs prod

| Env         | Strategy                                                          |
| ----------- | ----------------------------------------------------------------- |
| Development | `console.warn` with `imageId` to fix style/data                   |
| Production  | `addImage` fallback and/or style fix; avoid silent broken symbols |

## Checklist

- [ ] Subscribe in `useEffect` with cleanup on `MapRef`
- [ ] Guard `mainMap` + preferably `mapLoaded`
- [ ] Handle sentinel ids (`'null'`, empty string)
- [ ] Provide `addImage` fallback or fix sprite for prod
- [ ] Do not use manual ref — use `useMap()` (map-provider-wrapper.md)
