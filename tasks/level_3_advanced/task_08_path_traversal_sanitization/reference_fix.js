import path from 'node:path';

export function safeResolvePath(baseDir, userInput) {
  const safeBase = path.resolve(baseDir);
  const target = path.resolve(safeBase, userInput);
  const allowedPrefix = safeBase.endsWith(path.sep) ? safeBase : safeBase + path.sep;
  if (target !== safeBase && !target.startsWith(allowedPrefix)) {
    throw new Error("Path traversal forbidden");
  }
  return target;
}