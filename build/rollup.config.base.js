import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    name: 'VueEditableCell',
    exports: 'named'
  },
  plugins: [
    resolve(),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['vue']
}
