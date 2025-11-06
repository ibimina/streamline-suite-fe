import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Code Quality Rules - disabled no-unused-vars for TypeScript compatibility
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Disabled for TypeScript - function type parameters are not "unused"

      // React/Next.js Best Practices
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off', // Using TypeScript
      'react/react-in-jsx-scope': 'off', // Next.js handles this
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',

      // General Code Style
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Additional ignores
    'coverage/**',
    '*.config.js',
    '*.config.mjs',
    'public/**',
    '.husky/**',
  ]),
])

export default eslintConfig
