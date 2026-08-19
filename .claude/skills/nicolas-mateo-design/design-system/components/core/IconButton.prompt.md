One-line: circular icon-only control for theme switching, social links and dismiss actions.

```jsx
<IconButton icon="moon" label="Switch to dark" variant="outline" />
<IconButton icon="github" set="tech" label="GitHub" as="a" href="https://github.com/nmhernandez10" />
```

- Always pass `label`; it is the accessible name and the tooltip.
- `quiet` for dense toolbars, `outline` in headers, `filled` only when the action is the point.
