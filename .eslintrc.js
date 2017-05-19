module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
  },
  plugins: [
    'filenames'
  ],
  rules: {
    'comma-dangle': ['error', {
      'arrays': 'only-multiline',
      'objects': 'only-multiline',
      'imports': 'only-multiline',
      'exports': 'only-multiline',
      'functions': 'ignore',
    }],
    'prefer-template': 'off',
    'consistent-return': 'error',
    'no-case-declarations': 'error',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'arrow-body-style': 'off',
    'import/no-commonjs': 'error',
    'import/no-amd': 'error',
    'import/prefer-default-export': 'off',
    strict: ['error', 'never'],
    'max-len': ['error', 120, 4],
    'no-param-reassign': ['error', { props: false }],
    'filenames/match-regex': ['error', '^[a-z0-9-]+$']
  }
};
