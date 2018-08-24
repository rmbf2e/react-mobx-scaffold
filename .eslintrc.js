module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'plugin:import/react',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'prettier'],
  rules: {
    semi: [0, 'never'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-param-reassign': 0,
    'arrow-parens': [2, 'as-needed'],
    'no-debugger': 0,
    // 禁用下面两条规则是因为babel-eslint的bug
    indent: 0,
    'template-curly-spacing': 0,
    // 该规则与prettier的规则冲突，缩进交给prettier即可
    'react/jsx-closing-tag-location': 0,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.babel.js',
      },
    },
  },
}
