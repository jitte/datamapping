/// <reference types="vitest" />
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// Split the vendor bundle so no single chunk trips Vite's 500 kB warning and
// browsers can cache the rarely-changing libraries independently. Each group
// must be closed over its own dependencies, otherwise Rollup reports a
// circular chunk (e.g. @xyflow -> d3-* -> @xyflow).
const vendorChunks: [chunk: string, match: RegExp][] = [
  ['vendor-react', /^(react|react-dom|scheduler|use-sync-external-store)$/],
  ['vendor-flow', /^(@xyflow\/.*|zustand|classcat|d3-.*)$/],
  ['vendor-ui', /^(@radix-ui\/.*|@tanstack\/.*|cmdk|lucide-react)$/],
  ['vendor-countries', /^(countries-list|react-country-flag)$/],
]

/** `.../node_modules/@scope/name/dist/x.js` -> `@scope/name` */
function packageName(id: string): string | undefined {
  const segments = id.split('node_modules/').pop()?.split('/')
  if (!segments?.length) return undefined
  return segments[0].startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
}

function manualChunks(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined
  const pkg = packageName(id)
  if (!pkg) return undefined
  return vendorChunks.find(([, match]) => match.test(pkg))?.[0] ?? 'vendor'
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: { manualChunks },
    },
  },
  test: {
    globals: false,
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
