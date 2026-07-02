import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "apps/web/next-env.d.ts",
      "apps/web/.next/**",
      "apps/mobile/.expo/**",
      "apps/mobile/dist/**",
      "apps/mobile/babel.config.js",
      "apps/mobile/metro.config.js",
      "packages/core/dist/**",
      "packages/api-client/dist/**",
      "apps/mcp/dist/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    settings: {
      next: {
        rootDir: "apps/web/",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];

export default eslintConfig;
