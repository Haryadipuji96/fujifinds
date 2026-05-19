// .eslintrc.js
module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/immutability": "off",
    "import/no-anonymous-default-export": "off",
    "@next/next/no-img-element": "off"
  },
  ignorePatterns: ["**/*.js", "**/*.ts", "**/*.tsx", ".next", "node_modules"]
}