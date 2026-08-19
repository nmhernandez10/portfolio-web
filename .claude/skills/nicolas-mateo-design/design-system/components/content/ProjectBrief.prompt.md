One-line: the screenshot-free work card — use it instead of ProjectCard whenever there is no product imagery.

```jsx
<ProjectBrief index="01" title="Keel Mind" role="Feature Architect" period="2022 — now"
  summary="Session domain, API surface and the reporting queries behind it."
  metrics={["200k+ sessions", "85k+ clients"]} stack={["NestJS", "PostgreSQL", "AWS"]} />
```

- No media band, no placeholder: the index number and metrics rule carry the weight.
- 32px padding (one step up from ProjectCard) so the type has room to breathe.
- Pick ProjectCard only once real screenshots exist.
