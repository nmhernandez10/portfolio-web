Pill button — use for the few real actions on a page (download résumé, send message, open a repo).

```jsx
<Button variant="accent" size="lg" trailing="→" href="/resume.pdf">Download résumé</Button>
```

- `primary` = solid ink; the default. `accent` = clay fill, at most once per screen.
- `secondary` = hairline outline, for the second action beside a primary.
- `ghost` = text-only, for tertiary/nav-adjacent actions.
- Buttons are always fully rounded (`--radius-pill`); never square them off.
