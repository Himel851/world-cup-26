import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The new `react-hooks/set-state-in-effect` rule (React 19) flags legitimate
  // patterns we rely on here — hydrating state from `localStorage` after mount,
  // and resetting a countdown when its key changes. Both must run on the client
  // post-mount with `setState`, so we relax the rule to a warning. The build
  // and `react-hooks/exhaustive-deps` remain enforced.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
