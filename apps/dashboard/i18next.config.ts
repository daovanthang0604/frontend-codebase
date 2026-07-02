import { LANGUAGES } from "@/constants/languages"
import { defineConfig } from "i18next-cli"

export default defineConfig({
  locales: LANGUAGES.map((language) => language.value),
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json",
    primaryLanguage: "en",
    preservePatterns: ["global:*"],
  },
})
