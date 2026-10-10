#!/usr/bin/env node
// tools/verify-tasks.mjs
// 题库自检脚本：结构完整性 + 字段合规 + 行为有效性（失败测试在缺陷上必失败，在修复上必通过）
//
// 用法：node tools/verify-tasks.mjs
// 退出码：0 = 全部通过；1 = 存在问题
//
// 该脚本自包含（不依赖 dsh-plugin-teaching-agent），可在 CI 中直接运行。

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TASKS_DIR = path.join(ROOT, 'tasks');

const TIER_ORDER = ['level_1_novice', 'level_2_intermediate', 'level_3_advanced', 'level_4_master'];
const REQUIRED_FILES = ['meta.json', 'spec.json', 'hints.json', 'source.js', 'failing_test.js', 'reference_fix.js'];
const REQUIRED_META = ['id', 'tier', 'difficulty', 'level_num', 'title', 'category', 'domain', 'language', 'source_type', 'ground_truth_defect', 'review_checkpoints', 'capabilities'];
const REQUIRED_HINTS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];

let passCount = 0;
let failCount = 0;
const failures = [];

function ok(msg) { passCount++; console.log('  \u2713 ' + msg); }
function fail(msg, detail) {
  failCount++;
  failures.push({ msg, detail });
  console.log('  \u2717 ' + msg + (detail ? ' => ' + detail : ''));
}

// ---------- 沙箱执行（与插件 test-sandbox 逻辑对齐）----------
async function runInSandbox(targetCode, testCode, timeoutMs = 8000) {
  const liveTimers = new Set();
  const track = (setFn) => (fn, ms, ...rest) => { const h = setFn(fn, ms, ...rest); liveTimers.add(h); return h; };
  const untrack = (clearFn) => (h) => { liveTimers.delete(h); return clearFn(h); };
  const cleanup = () => {
    for (const h of liveTimers) {
      try { clearInterval(h); } catch {}
      try { clearTimeout(h); } catch {}
      try { clearImmediate(h); } catch {}
    }
    liveTimers.clear();
  };

  const stripImports = (code) => code.replace(/^[ \t]*import\s+.*?from\s+['"][^'"]+['"];?[ \t]*$/gm, '');
  const cleanTarget = stripImports(targetCode).replace(/export\s+(default\s+)?/g, '');
  const cleanTest = stripImports(testCode);
  const body = cleanTarget + '\n' + cleanTest;

  const sandbox = {
    assert,
    console: { log: () => {}, error: () => {}, warn: () => {} },
    setTimeout: track(setTimeout),
    clearTimeout: untrack(clearTimeout),
    setInterval: track(setInterval),
    clearInterval: untrack(clearInterval),
    setImmediate: track(setImmediate),
    clearImmediate: untrack(clearImmediate),
    path,
    Promise, Date, Math, JSON, RegExp, Map, Set, Array, Object, String, Number, Boolean, Error, TypeError, RangeError
  };
  const context = vm.createContext(sandbox);
  try {
    const wrapped = '(async () => {\n' + body + '\n})();';
    const s = new vm.Script(wrapped, { timeout: timeoutMs });
    await s.runInContext(context, { timeout: timeoutMs });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.name + ': ' + e.message };
  } finally {
    cleanup();
  }
}

// ---------- 单题校验 ----------
async function verifyTask(tier, taskId) {
  const dir = path.join(TASKS_DIR, tier, taskId);
  const prefix = tier + '/' + taskId;

  // 1. 文件完整性
  for (const f of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(dir, f))) fail(prefix + ' 缺少文件 ' + f);
  }
  if (!REQUIRED_FILES.every(f => fs.existsSync(path.join(dir, f)))) return;

  // 2. 字段合规
  let meta, spec, hints;
  try {
    meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
    spec = JSON.parse(fs.readFileSync(path.join(dir, 'spec.json'), 'utf8'));
    hints = JSON.parse(fs.readFileSync(path.join(dir, 'hints.json'), 'utf8'));
  } catch (e) {
    fail(prefix + ' JSON 解析失败', e.message);
    return;
  }
  const missMeta = REQUIRED_META.filter(k => meta[k] === undefined || meta[k] === null || (Array.isArray(meta[k]) && meta[k].length === 0));
  if (missMeta.length) fail(prefix + ' meta 缺字段', missMeta.join(','));
  const missHints = REQUIRED_HINTS.filter(k => !hints[k]);
  if (missHints.length) fail(prefix + ' hints 缺层级', missHints.join(','));
  if (!spec.description) fail(prefix + ' spec.description 缺失');
  if (!Array.isArray(spec.boundary_conditions) || spec.boundary_conditions.length === 0) fail(prefix + ' spec.boundary_conditions 缺失');
  if (meta.id !== taskId) fail(prefix + ' meta.id 与目录名不一致');
  if (meta.tier !== tier) fail(prefix + ' meta.tier 与目录不一致');

  // 3. 行为有效性
  const src = fs.readFileSync(path.join(dir, 'source.js'), 'utf8');
  const fix = fs.readFileSync(path.join(dir, 'reference_fix.js'), 'utf8');
  const test = fs.readFileSync(path.join(dir, 'failing_test.js'), 'utf8');

  const onBug = await runInSandbox(src, test);
  if (onBug.ok) {
    fail(prefix + ' 行为无效：失败测试在缺陷代码上竟然通过');
    return;
  }
  const onFix = await runInSandbox(fix, test);
  if (!onFix.ok) {
    fail(prefix + ' 行为无效：失败测试在参考修复上仍失败', onFix.error);
    return;
  }
  ok(prefix + ' [结构+字段+行为] 全部通过');
}

// ---------- 主流程 ----------
(async () => {
  console.log('=== 题库自检 (verify-tasks) ===\n');
  if (!fs.existsSync(TASKS_DIR)) {
    console.error('未找到 tasks 目录: ' + TASKS_DIR);
    process.exit(1);
  }

  // curriculum_index 与目录一致性
  const indexFile = path.join(TASKS_DIR, 'curriculum_index.json');
  if (fs.existsSync(indexFile)) {
    const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    const listedIds = new Set((index.tasks || []).map(t => t.id));
    for (const tier of TIER_ORDER) {
      const tierDir = path.join(TASKS_DIR, tier);
      if (!fs.existsSync(tierDir)) continue;
      for (const t of fs.readdirSync(tierDir)) {
        if (!fs.statSync(path.join(tierDir, t)).isDirectory()) continue;
        if (!listedIds.has(t)) fail('curriculum_index 未收录 ' + tier + '/' + t);
      }
    }
    for (const t of (index.tasks || [])) {
      if (!fs.existsSync(path.join(TASKS_DIR, t.tier, t.id))) fail('curriculum_index 指向不存在的题 ' + t.id);
    }
    ok('curriculum_index 与目录一致（' + (index.tasks || []).length + ' 题）');
  } else {
    fail('缺少 tasks/curriculum_index.json');
  }

  console.log('');
  for (const tier of TIER_ORDER) {
    const tierDir = path.join(TASKS_DIR, tier);
    if (!fs.existsSync(tierDir)) continue;
    console.log('--- ' + tier + ' ---');
    const ids = fs.readdirSync(tierDir).filter(t => fs.statSync(path.join(tierDir, t)).isDirectory()).sort();
    for (const id of ids) {
      await verifyTask(tier, id);
    }
  }

  console.log('\n============================================');
  console.log('通过: ' + passCount + ' 项 | 失败: ' + failCount + ' 项');
  if (failCount > 0) {
    console.log('\n失败明细:');
    for (const f of failures) console.log('  - ' + f.msg + (f.detail ? ' | ' + f.detail : ''));
    process.exit(1);
  }
  console.log('\u2713 题库全部校验通过');
  process.exit(0);
})();
