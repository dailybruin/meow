#!/usr/bin/env node

// Small wrapper to add --openssl-legacy-provider only on Node >= 17 (OpenSSL 3),
// so webpack 4 keeps working locally while older Node images (e.g., Node 14)
// still run without the flag.
const { spawnSync } = require("child_process");

const major = parseInt(process.versions.node.split(".")[0], 10);
const env = { ...process.env };
const legacyFlag = "--openssl-legacy-provider";

if (major >= 17) {
  env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${legacyFlag}` : legacyFlag;
}

const args = process.argv.slice(2);
const result = spawnSync("webpack", args, {
  stdio: "inherit",
  env
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(typeof result.status === "number" ? result.status : 1);
