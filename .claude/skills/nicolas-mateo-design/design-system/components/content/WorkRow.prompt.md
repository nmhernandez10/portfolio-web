One-line: work as an editorial list row — hairline separated, no card, no imagery; the densest way to show four to eight projects.

```jsx
<div>
  <WorkRow index="01" title="Keel Mind" role="Feature Architect" period="2022 — now" summary="…" stack={["NestJS","PostgreSQL"]} />
  <WorkRow index="02" title="Event pipeline" role="Design & delivery" period="2023 — 2025" summary="…" />
</div>
```

- Hover slides the row 20px right behind a 3px gold edge; nothing else moves.
- Rows carry their own top hairline — the container needs no dividers.
