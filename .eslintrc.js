module.exports = {
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 8,
  },
  plugins: [
    'filenames'
  ],
  rules: {
    'consistent-return': 'error',
    'no-case-declarations': 'error',
    'max-len': ['error', 120, 4],
    'no-param-reassign': ['error', { props: false }],
    'filenames/match-regex': ['error', '^[a-z0-9-]+$'],
    'no-control-regex': 'off',
  }
};
