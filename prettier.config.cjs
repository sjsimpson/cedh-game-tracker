/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
module.exports = {
  singleQuote: false,
  semi: true,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^[~/]",
    "",
    "^[./]",
  ],
};
