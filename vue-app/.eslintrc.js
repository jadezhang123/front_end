// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'one-var': [0, {uninitialized: 'always', initialized: 'never'}],

    'no-extend-native': 0,

    'no-return-assign': 0,

    'no-multi-spaces': 0,

    'no-cond-assign': 0,

    'padded-blocks': 0,

    'brace-style': 0,

    'indent': 0,

    'no-new': 0,

    'eqeqeq': 0
  }
}
