import { safeResolvePath } from './source.js';
import path from 'node:path';
import assert from 'node:assert';

const base = path.resolve('/var/www/public');
const attack = '....//....//etc/passwd';
const resolved = safeResolvePath(base, attack);

assert.ok(
  resolved.startsWith(base + path.sep) || resolved === base,
  "解析出的路径必须严格包含在 base 根目录之下，实际逃逸为: " + resolved
);