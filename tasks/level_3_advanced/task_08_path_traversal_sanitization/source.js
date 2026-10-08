import path from 'node:path';

export function safeResolvePath(baseDir, userInput) {
  // BUG: 简单单次黑名单过滤，攻击者输入 '....//' 会被清洗成 '../' 从而逃逸！
  const sanitized = userInput.replace(/\.\.\//g, '');
  return path.join(baseDir, sanitized);
}