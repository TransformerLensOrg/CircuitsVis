module.exports = {
  env: { browser: true, es6: true, node: true, jest: true },
  extends: [
    // Airbnb Typescript eslint from https://www.npmjs.com/package/eslint-config-airbnb-typescript
    "airbnb-base",
    "airbnb-typescript",
    // Prettier added using default settings from https://github.com/prettier/eslint-plugin-prettier
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaVersion: 2018,
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "jest-dom",
    "jsx-a11y",
    "react",
    "svelte3",
    "testing-library",
  ],
  rules: {
    "import/prefer-default-export": "off",
    "import/extensions": "off", // Conflicts with lit
    "react/jsx-filename-extension": "off",
    "react/require-default-props": "off", // Not needed as we have TypeScript for type checking
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  settings: { 
    react: { version: "detect" },
    'svelte3/typescript': true,
   },
};
