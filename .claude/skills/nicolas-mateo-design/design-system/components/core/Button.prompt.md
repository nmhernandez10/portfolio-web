One-line: the pill-shaped action; use primary once per screen and let secondary/ghost carry everything else.

```jsx
<Button icon="arrow-up-right">Read the case study</Button>
<Button variant="secondary" icon="download" iconPosition="left">Resume, PDF</Button>
<Button variant="ghost" size="sm">Skip</Button>
```

- Radius is always --radius-pill. Heights come from --control-height tokens (32 / 44 / 52).
- Hover lightens gold to --accent-hover; press shrinks by --press-scale. No shadows, ever.
- `variant="inverse"` is for placement on a gold or photographic panel.
