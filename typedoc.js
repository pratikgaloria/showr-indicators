module.exports = {
  out: './docs',
  includes: './src',
  exclude: [
      '**/*.{test|spec}.ts',
      '**/**/*.json',
      '**/**/index.ts'
  ],
  mode: 'file',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
};