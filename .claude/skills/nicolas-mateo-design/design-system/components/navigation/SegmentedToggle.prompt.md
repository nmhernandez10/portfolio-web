One-line: pill-track switch for 2-3 mutually exclusive views; the portfolio uses it to retarget the whole page between Backend and Full stack.

```jsx
<SegmentedToggle options={[{value:"be",label:"Backend"},{value:"fs",label:"Full stack"}]} value={lens} onChange={setLens} />
```

- Labels are mono uppercase and short — two words maximum.
- The selected pill is white with --shadow-1; unselected labels sit at --text-muted.
