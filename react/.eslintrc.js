module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended",
    "plugin:storybook/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint",
    "jest-dom",
    "jsx-a11y",
    "react",
    "testing-library"
  ],
  rules: {
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.test.*", "**/*.stories.*"] }],
    "react/jsx-filename-extension": "off",
    "react/require-default-props": "off", // Not needed with TS
    "react/react-in-jsx-scope": "off" // Esbuild injects this for us
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
