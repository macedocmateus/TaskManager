import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  outDir: 'build',
  clean: true,
  sourcemap: true,
  async onSuccess() {
    cpSync(resolve('src/docs'), resolve('build/docs'), { recursive: true })
  },
})
