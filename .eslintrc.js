module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'no-console': 'off',
    'vue/html-self-closing': 'error',
    'vue/html-indent': 'error',
    'vue/html-closing-bracket-spacing': 'error'
  }
}
