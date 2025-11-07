import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{js,jsx}'],
		extends: [js.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		rules: {
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
		},
	},

	// ADD THIS BLOCK BELOW
	{
		files: ['server/**/*.js'], // all JS files in your backend folder
		languageOptions: {
			globals: globals.node, // allow Node globals like exports, require, module
			sourceType: 'script', // allow CommonJS (not ESM)
		},
		rules: {
			// optional: if you want backend to have slightly different rules
		},
	},
]);
