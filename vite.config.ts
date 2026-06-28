import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// base must match your repo name for GitHub Pages: username.github.io/strata/
// if you deploy to a custom domain or user-page, set base: '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/strata/',
  resolve: {
    alias: [
      { find: '@/components', replacement: r('./src/shared/ui') },
      { find: '@/lib', replacement: r('./src/shared/lib') },
      { find: '@/hooks', replacement: r('./src/shared/hooks') },
      { find: '@/app', replacement: r('./src/app') },
      { find: '@/shared', replacement: r('./src/shared') },
      { find: '@/entities', replacement: r('./src/entities') },
      { find: '@/features', replacement: r('./src/features') },
      { find: '@/widgets', replacement: r('./src/widgets') },
      { find: '@', replacement: r('./src') },
    ],
  },
  server: {
    port: 3000,
  },
})
