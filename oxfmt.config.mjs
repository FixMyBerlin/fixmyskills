import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 120,
  semi: false,
  singleQuote: true,
  proseWrap: 'preserve',
  insertFinalNewline: true,
  sortPackageJson: {
    sortScripts: true,
  },
})
