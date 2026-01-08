import { execSync } from "node:child_process";
import { existsSync, chmodSync } from "node:fs";

const sh = (cmd) => execSync(cmd, { stdio: "pipe" }).toString().trim();

try {
  // verify we're in a git repo
  sh("git rev-parse --git-dir");

  // set hooks path in git config
  execSync("git config --local core.hooksPath .husky", { stdio: "inherit" });

  // chmod via Node to make pre-commit hook executable
  if (existsSync(".husky/pre-commit")) {
    chmodSync(".husky/pre-commit", 0o755);
  }

  // Can use "git config --show-origin core.hooksPath" to verify that hook path is set
  console.log("✓ Set core.hooksPath to .husky");

} catch (e) {
  console.error("✗ setup failed:", e?.stderr?.toString() || e.message);
  process.exit(1);
}
