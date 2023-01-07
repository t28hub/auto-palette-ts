module.exports = {
  root: true,
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'prettier'
  ],
  plugins: ['svelte3', '@typescript-eslint', 'tailwindcss', 'import', 'unused-imports'],
  ignorePatterns: ['*.cjs'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': ['off'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
};
// {
//   "globals": {},
//   "overrides": [
//     {
//       "files": ["**/*.svelte"],
//       "processor": "svelte3/svelte3"
//     }
//   ],
//   "settings": {
//     "import/resolver": {
//       "node": {
//         "extensions": [".js", ".ts"]
//       }
//     },
//     "svelte3/typescript": true
//   },
//   "rules": {
//     "import/extensions": [
//       "error",
//       "ignorePackages",
//       {
//         "js": "never",
//         "ts": "never",
//         "svelte": "never"
//       }
//     ],
//     "import/order": [
//       "error",
//       {
//         "newlines-between": "always",
//         "alphabetize": {
//           "order": "asc",
//           "caseInsensitive": true
//         }
//       }
//     ],
//     "import/no-extraneous-dependencies": [
//       "error",
//       {
//         "devDependencies": true
//       }
//     ],
//     "no-unused-vars": [
//       "error",
//       {
//         "argsIgnorePattern": "^_",
//         "varsIgnorePattern": "^_",
//         "destructuredArrayIgnorePattern": "^_"
//       }
//     ],
//     "unused-imports/no-unused-imports": ["error"]
//   }
// }
