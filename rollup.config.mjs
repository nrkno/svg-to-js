import buble from '@rollup/plugin-buble'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const external = ['fs', 'path']
const plugins = [
  resolve(),
  commonjs(),
  buble({ transforms: { dangerousForOf: true } })
]

export default [
  {
    input: 'lib/index.js', // CJS module
    output: { file: 'lib/svg-to-js.cjs.js', format: 'cjs', exports: 'default' },
    external,
    plugins
  },
  {
    input: 'lib/index.js', // ES6 module
    output: { file: 'lib/svg-to-js.mjs', format: 'esm' },
    external,
    plugins
  }
]
