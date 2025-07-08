import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(import.meta.url), "../../..");

export const resolvePath = (...segments: string[]) =>
  resolve(rootDir, ...segments);
