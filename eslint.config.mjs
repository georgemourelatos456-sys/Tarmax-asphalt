import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // Build output and generated files are not ours to fix. .open-next is the
  // compiled Cloudflare Worker — tens of thousands of lines of bundled vendor
  // code that would otherwise drown every real finding.
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "node_modules/**",
      "scripts/**",
      "next-env.d.ts",
      "src/components/ui/surfaces.generated.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
