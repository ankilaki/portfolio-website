import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return {};
  const values = {};
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    values[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return values;
}

const fileEnv = loadEnvFile();
const missing = required.filter((key) => {
  const value = process.env[key] ?? fileEnv[key];
  return !value || value.includes("your_") || value === "your_api_key_here";
});

if (missing.length > 0) {
  console.error(
    "Missing or placeholder Firebase environment variables:\n" +
      missing.map((key) => `  - ${key}`).join("\n") +
      "\n\nProduction builds require Firebase config or the site cannot load projects/resumes.",
  );
  process.exit(1);
}

console.log("Firebase environment variables OK.");
