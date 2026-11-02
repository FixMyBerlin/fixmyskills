# Map props: attribution, locale, RTLTextPlugin

## attributionControl={false}

Disable the default control on `<Map>` and mount your own child; this prevents duplicate controls. Tilda `RegionMap`:

```tsx
<MapGl attributionControl={false} …>
  <AttributionControl compact={true} position="bottom-left" />
</MapGl>
```

Static dataset sources can pass `attribution={attributionHtml}` on `<Source>`.

### compact starts expanded

`compact` is **not** “start as the ⓘ button”. In MapLibre 6 (checked against 6.13.0, the version in tilda-geo) it means: use the compact `<details>` toggle, and collapse when the user pans. When the compact classes are applied, MapLibre sets `open` plus `.maplibregl-compact-show`, so the text is expanded. There is no `closedOnLoad` option ([maplibre-gl-js#7426](https://github.com/maplibre/maplibre-gl-js/issues/7426)).

**Option: start collapsed, for apps that are 100% about OSM.** In OSMCha or MAID all data is OSM and the whole app says so, so the map does not need to repeat it. Example: osmcha-frontend-v2 `views/map.tsx`. This is not an FMC default. tilda-geo and Trassenscout show more than OSM data, so they keep the attribution open.

Wrap the control in one `Attribution` component that returns `<AttributionControl compact>` and removes `.maplibregl-compact-show` in its own `useEffect`. `useControl` adds the control in a child effect, and child effects run before parent effects, so the control exists by then. Do not collapse in `onLoad`: `useControl` often mounts the control after `onLoad`. Later `sourcedata` will not re-add that class once `.maplibregl-compact` is present. Click still expands; pan still collapses.

With a style **URL** the attribution is still empty when the control is added (`.maplibregl-attrib-empty`). MapLibre adds `.maplibregl-compact` + `.maplibregl-compact-show` only once the first attribution text arrives, after the mount effect ran. So the effect collapses right away if `.maplibregl-compact` is already there, and otherwise watches the class with a `MutationObserver`:

```tsx
export const Attribution = () => {
  const { mainMap } = useMap() // keyed by <Map id="mainMap">

  useEffect(
    function collapseCompactAttribution() {
      const attribution = mainMap?.getMap().getContainer().querySelector('.maplibregl-ctrl-attrib')
      if (!attribution) return

      const collapse = () => {
        if (!attribution.classList.contains('maplibregl-compact')) return false
        attribution.classList.remove('maplibregl-compact-show')
        return true
      }
      if (collapse()) return

      const observer = new MutationObserver(() => {
        if (collapse()) observer.disconnect()
      })
      observer.observe(attribution, { attributeFilter: ['class'] })
      return () => observer.disconnect()
    },
    [mainMap],
  )

  return <AttributionControl compact position="bottom-left" />
}
```

## locale

`<Map locale={{ 'NavigationControl.ZoomIn': 'Hineinzoomen', … }}>` patches control UI strings only (`Record<string, string>`, MapLibre namespaced keys, [example](https://maplibre.org/maplibre-gl-js/docs/examples/locale-switching/)). It does not change tile label language (tiles/style `text-field`). Not used in tilda today; add when product needs German control tooltips.

## RTLTextPlugin

FMC default: `<Map RTLTextPlugin={false} … />` on every Map. Never omit it: the default loads a third-party script from the Mapbox CDN at runtime (privacy/CSP risk), and FMC apps use Latin/German labels only. If RTL labels are needed, self-host the file (`RTLTextPlugin={{ pluginUrl: '/mapbox-gl-rtl-text.min.js', lazy: true }}`) and audit CSP and consent.

## Recommended FMC defaults

```tsx
<Map
  attributionControl={false}
  dragRotate={false}
  RTLTextPlugin={false}
  // locale={{ … }}   // optional: German control strings
>
  <AttributionControl compact position="bottom-left" />
</Map>
```
