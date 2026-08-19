One-line: masks an SVG from assets/icons so the glyph inherits currentColor — the only way icons are drawn in this system.

```jsx
<Icon name="arrow-up-right" size={16} />
<Icon name="postgresql" set="tech" size={20} base="../../assets/icons" />
```

- `set="ui"` — Lucide, 24x24 grid, 2px stroke. Navigation, actions, meta rows.
- `set="tech"` — Simple Icons solid brand marks. Stack lists only, always at --text-muted or currentColor.
- Never inline a hand-drawn SVG path in product code; add the file to assets/icons/ui instead.
- Because it is a mask, color comes from the parent's `color`. Wrap in a span with a color if you need something other than the inherited ink.
