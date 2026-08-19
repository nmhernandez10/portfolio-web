One-line: light/dark switch that writes data-theme onto the root so the dark token scope takes over.

```jsx
<ThemeToggle onChange={(t) => localStorage.setItem("theme", t)} />
<ThemeToggle theme={theme} onChange={setTheme} target={frameRef.current} />
```

- Light is the default and the canonical theme; dark is a courtesy for late-night readers.
- Pass `target` when the themed area is an embedded frame rather than the page.
