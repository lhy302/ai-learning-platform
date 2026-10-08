import { parseEnvPlaceholders } from './source.js';
import assert from 'node:assert';

const res = parseEnvPlaceholders("${FEATURE_FLAG:-active}", { FEATURE_FLAG: "" });
assert.strictEqual(res, "", "环境变量为空字符串时必须保留，不得回退至 active");