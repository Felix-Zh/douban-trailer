module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        useBuiltIns: 'usage'
      }
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime'
    ]
  ]
};
