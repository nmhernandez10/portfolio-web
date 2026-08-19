One-line: one role on the experience rail; render inside a plain <ol> with no padding.

```jsx
<ol style={{margin:0,padding:0}}>
  <TimelineItem current company="Keel Mind" role="Feature Architect" period="March 2024 — present" location="Remote, Canada" bullets={["Lead technical design across backend, web, mobile and QA."]} />
  <TimelineItem last company="Meniu" role="Full Stack Developer" period="2019 — 2020" location="Bogotá" />
</ol>
```

- Bullets are em-dash led, gold dash, sentence case, one idea each.
- Mark exactly one item `current`.
