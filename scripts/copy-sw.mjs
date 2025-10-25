
import { copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const src = "public/sw.js";
const dst = ".next/static/sw.js";

if (existsSync(".next") && existsSync(src)) {
  await copyFile(src, dst).catch(() => {});
}
