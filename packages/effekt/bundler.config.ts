import { defineConfig, resolvePaths } from '@hypernym/bundler'
import { version, homepage } from './package.json'

const banner = `/*! effekt v${version} | MIT License | Ivo Dolenc (c) 2025 | ${homepage} */\n`

export default defineConfig({
  entries: [
    // Shared
    {
      input: './src/shared/index.ts',
    },
    // Utils
    {
      input: './src/utils/index.ts',
      externals: [/^@\/shared/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../shared/index.mjs' },
      ]),
    },
    {
      dts: './src/types/utils.ts',
      output: './dist/utils/index.d.mts',
      externals: [/^@\/shared/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../index.mts' },
      ]),
    },
    // Animation
    {
      input: './src/animation/index.ts',
      externals: [/^@\/shared/, /^@\/utils/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../shared/index.mjs' },
        { find: /^@\/utils/, replacement: '../utils/index.mjs' },
      ]),
    },
    // Main
    {
      input: './src/index.ts',
      externals: [/^@\/shared/, /^@\/utils/, /^@\/animation/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: './shared/index.mjs' },
        { find: /^@\/utils/, replacement: './utils/index.mjs' },
        { find: /^@\/animation/, replacement: './animation/index.mjs' },
      ]),
      banner,
    },
    {
      dts: './src/types/index.ts',
      output: './dist/index.d.mts',
    },
    // Easing
    {
      input: './src/easing/index.ts',
      externals: [/^@\/shared/, /^@\/utils/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../shared/index.mjs' },
        { find: /^@\/utils/, replacement: '../utils/index.mjs' },
      ]),
    },
    {
      dts: './src/types/easing.ts',
      output: './dist/easing/index.d.mts',
      externals: [/^@\/shared/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../index.mts' },
      ]),
    },
    // Sequence
    {
      input: './src/sequence/index.ts',
      externals: [/^@\/shared/, /^@\/utils/, /^@\/animation/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../shared/index.mjs' },
        { find: /^@\/utils/, replacement: '../utils/index.mjs' },
        { find: /^@\/animation/, replacement: '../animation/index.mjs' },
      ]),
    },
    {
      dts: './src/types/sequence.ts',
      output: './dist/sequence/index.d.mts',
      externals: [/^@\/animation/],
      paths: resolvePaths([
        { find: /^@\/animation/, replacement: '../index.mts' },
      ]),
    },
    // Interaction
    {
      input: './src/interaction/index.ts',
      externals: [/^@\/shared/, /^@\/utils/],
      paths: resolvePaths([
        { find: /^@\/shared/, replacement: '../shared/index.mjs' },
        { find: /^@\/utils/, replacement: '../utils/index.mjs' },
      ]),
    },
    {
      dts: './src/types/interaction.ts',
      output: './dist/interaction/index.d.mts',
      externals: [/^@\/animation/],
      paths: resolvePaths([
        { find: /^@\/animation/, replacement: '../index.mts' },
      ]),
    },
  ],
})
