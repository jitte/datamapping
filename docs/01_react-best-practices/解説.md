# React ベストプラクティス 解説

`plan.md` の英語プランに対応する日本語解説です。

---

## Priority 1 — 再レンダリング修正

### 1. `useCallback` の stale closure 修正
**ルール:** `rerender-functional-setstate`
**ファイル:** `src/App.tsx:96–123`

ホットキー (`ctrl+x`, `ctrl+c`, `ctrl+v`) のコールバックが `nodes` を依存配列に含めていたため、ノードが変わるたびにコールバックが再登録されていた。また、クロージャでキャプチャした古い `nodes` を参照する stale closure バグの危険もあった。

**修正方針:**
```tsx
// nodes/edges を常に最新値で参照できるよう ref に同期する
const nodesRef = useRef(nodes)
nodesRef.current = nodes  // レンダリングのたびに更新

// 依存配列から nodes を除去できる
useHotkeys('ctrl+c', () => {
  copyNodes(nodesRef.current, edgesRef.current)
}, [])
```

**効果:** コールバックの不要な再生成を防止し、stale closure バグを解消する。

---

### 2. `offset` を `useState` から `useRef` へ
**ルール:** `rerender-use-ref-transient-values`
**ファイル:** `src/App.tsx:63`

`offset` はペースト時のずらし量で、UIの表示に一切影響しない。`useState` で管理するとペーストのたびに再レンダリングが発生していた。

```tsx
// Before
const [offset, setOffset] = useState({ x: 12, y: 12 })

// After — 再レンダリングをトリガーしない
const offsetRef = useRef({ x: 12, y: 12 })
```

---

### 3. `FindMenu` 内のインラインコンポーネントを `memo()` で切り出す
**ルール:** `rerender-memo`
**ファイル:** `src/components/menu/find.tsx:51–97`

`NodeMenubarItem`、`NodeMenubarItems`、`ProjectMenubarSub` が `FindMenu` の関数スコープ内で定義されていたため、`FindMenu` が再レンダリングされるたびに新しい関数として再生成されていた。

```tsx
// Before — FindMenu 内で定義 → 毎レンダリングで新しい関数
const NodeMenubarItem = ({ node }) => { ... }

// After — モジュールレベルで memo 化
const NodeMenubarItem = memo(function NodeMenubarItem({ node }) { ... })
```

また `handleClick` を `useCallback` で安定化し、`preference` を prop として渡すことで子コンポーネントの不要な再レンダリングを防ぐ。

---

## Priority 2 — パフォーマンス最適化

### 4. `prepareMaps()` のO(n×m)をO(n+m)に改善
**ルール:** `js-index-maps`
**ファイル:** `src/lib/layout/index.tsx:176–192`

各 vnode に対して全エッジを走査する二重ループになっていた。`vedgeMap` が既に構築済みであるため、それを活用して1パスで解決できる。

```tsx
// Before — O(nodes × edges)
this.vnodes.map((vnode) => {
  this.edges.forEach((edge) => { ... })  // 全エッジを毎回走査
})

// After — O(edges) で1パス
this.vedges.forEach((vedge) => {
  vnodeMap[vedge.original.source].sourceMap[...] = vedge
  vnodeMap[vedge.original.target].targetMap[...] = vedge
})
```

---

### 5. 静的JSX要素をコンポーネント外に巻き上げ
**ルール:** `rendering-hoist-jsx`
**ファイル:** `src/App.tsx:292–300`

`<Controls />`、`<MiniMap />`、`<Background />` は props が変わらない静的要素。`DataFlowView` 内に書くと再レンダリングのたびに再生成される。

```tsx
// After — モジュールレベルで一度だけ生成
const flowControls = <Controls />
const flowMiniMap = <MiniMap />
const flowBackground = <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} />
```

---

## Priority 3 — コード品質

### 6. 無意味な `useEffect` の削除
**ファイル:** `src/App.tsx:67`

```tsx
// Before — 何もしないエフェクト（コメントも迷っている）
useEffect(() => {}, [vpX, vpY, vpZ]) // somehow need this to get update
```

`useViewport()` を呼ぶだけでビューポート変化時の再レンダリングはすでにトリガーされる。空の `useEffect` は不要なため、`useViewport` ごと削除した。

---

### 7. localStorage スキーマ検証の追加
**ファイル:** `src/lib/store.tsx`

Zustand の `persist` は `localStorage` から読んだ生のJSONをそのまま使う。スキーマが変わったり、データが壊れていた場合にアプリがサイレントに壊れる。

```tsx
// onRehydrateStorage で読み込み後にバリデーション
{
  name: 'data mapping',
  onRehydrateStorage: () => (state) => {
    if (!state) return
    // preference の欠損フィールドをデフォルト値でマージ
    state.preference = { ...initialPreference, ...state.preference }
    if (!Array.isArray(state.projects)) state.projects = []
  },
}
```

---

## 実装状況

| # | 内容 | 状態 |
|---|------|------|
| 1 | stale closure 修正 | ✅ 完了 |
| 2 | offset を useRef へ | ✅ 完了 |
| 3 | FindMenu コンポーネント切り出し | 🔲 未実装 |
| 4 | prepareMaps O(n²)→O(n+m) | 🔲 未実装 |
| 5 | 静的JSXの巻き上げ | ✅ 完了 |
| 6 | 無意味なuseEffect削除 | ✅ 完了 |
| 7 | localStorageスキーマ検証 | 🔲 未実装 |
