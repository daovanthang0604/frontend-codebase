#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "../..")

// Read catalog from pnpm-workspace.yaml
const workspaceYaml = readFileSync(
  join(rootDir, "pnpm-workspace.yaml"),
  "utf-8"
)
const catalog = {}

// Parse catalog section
const catalogMatch = workspaceYaml.match(/catalog:\s*([\s\S]*?)(?=\n\w|\n$)/)
if (catalogMatch) {
  const catalogSection = catalogMatch[1]
  const lines = catalogSection.split("\n")

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^["']?([^"':\s]+)["']?:\s*(.+)$/)
      if (match) {
        const [, name, version] = match
        catalog[name] = version.trim()
      }
    }
  }
}

// Read package.json
const packageJsonPath = join(__dirname, "package.json")
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))

// Resolve catalog: references in dependencies
function resolveCatalog(obj) {
  for (const key in obj) {
    if (obj[key] === "catalog:") {
      if (catalog[key]) {
        obj[key] = catalog[key]
      } else {
        console.warn(`Warning: No catalog entry found for ${key}`)
      }
    }
  }
}

if (packageJson.dependencies) {
  resolveCatalog(packageJson.dependencies)
}
if (packageJson.devDependencies) {
  resolveCatalog(packageJson.devDependencies)
}

// Write back
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
console.log("Catalog dependencies resolved successfully!")
