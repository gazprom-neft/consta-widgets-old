module.exports = {
  extends: [require.resolve('@consta/widgets-configs/eslintrc')],
  overrides: [
    {
      files: ['./src/**/index.stories.tsx'],
      rules: {
        'import/no-default-export': ['off'],
      },
    },
  ],
  plugins: ['todo-plz'],
  rules: {
    'todo-plz/ticket-ref': [
      'error',
      {
        pattern: '(GDC-|UI-Kit#)[0-9]+',
        terms: ['TODO', 'todo'],
      },
    ],
  },
}
