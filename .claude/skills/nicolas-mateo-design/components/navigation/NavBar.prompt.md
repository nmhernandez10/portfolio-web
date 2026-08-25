NavBar — one per page, sticky.

```jsx
<NavBar items={[{id:'work',label:'Work'},{id:'about',label:'About'}]} active="work" action={<Button size="sm" variant="secondary">Résumé</Button>} />
```
Four links maximum. The active link is marked with a clay underline, never a filled pill.
