import dts from 'rollup-plugin-dts'
const config = [
  // your default rollup config for transpilation and bundling
  // ...
  {
    // path to your declaration files root
    input: './lib-types/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]
export default config