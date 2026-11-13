import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');

const RULES = [
  {
    id: 'XSS_DANGEROUS_HTML',
    severity: 'HIGH',
    pattern: /dangerouslySetInnerHTML/,
    message: 'Avoid dangerouslySetInnerHTML to prevent DOM-based XSS.'
  },
  {
    id: 'XSS_INNER_HTML',
    severity: 'HIGH',
    pattern: /\.(innerHTML|outerHTML)\s*=|document\.write\s*\(/,
    message: 'Direct DOM HTML sink detected; use React JSX escaping.'
  },
  {
    id: 'CODE_INJECTION_EVAL',
    severity: 'CRITICAL',
    pattern: /\beval\s*\(|new\s+Function\s*\(/,
    message: 'Dynamic code execution (eval / new Function) is prohibited.'
  },
  {
    id: 'UNSAFE_WINDOW_OPEN',
    severity: 'MEDIUM',
    pattern: /window\.open\s*\(/,
    message: 'Avoid window.open (reverse tabnabbing / popup risk).'
  },
  {
    id: 'JAVASCRIPT_URI',
    severity: 'HIGH',
    pattern: /href\s*=\s*["']javascript:/i,
    message: 'javascript: URI scheme detected.'
  },
  {
    id: 'UNSAFE_JSON_PARSE',
    severity: 'MEDIUM',
    pattern: /\bJSON\.parse\s*\(/,
    allowFiles: ['src/utils/security.ts'],
    message: 'Use safeJsonParse() from src/utils/security.ts to guard against prototype pollution.'
  },
  {
    id: 'HARDCODED_SECRET',
    severity: 'CRITICAL',
    pattern: /(AIza[0-9A-Za-z-_]{35}|sk-[0-9A-Za-z]{20,}|ghp_[0-9A-Za-z]{36})/,
    message: 'Potential hardcoded API key or token detected.'
  }
];

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (/\.(ts|tsx|js|jsx|html)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = [path.join(ROOT, 'index.html'), ...walkFiles(SRC_DIR)];
const findings = [];

for (const filePath of files) {
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (const rule of RULES) {
    if (rule.allowFiles && rule.allowFiles.includes(relPath)) continue;
    lines.forEach((line, idx) => {
      if (rule.pattern.test(line)) {
        findings.push({
          file: relPath,
          line: idx + 1,
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.message
        });
      }
    });
  }
}

// Check security headers in index.html and vite.config.ts
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const viteConfig = fs.readFileSync(path.join(ROOT, 'vite.config.ts'), 'utf8');

if (!indexHtml.includes('Content-Security-Policy')) {
  findings.push({
    file: 'index.html',
    line: 1,
    ruleId: 'MISSING_CSP',
    severity: 'HIGH',
    message: 'Content-Security-Policy meta tag is missing from index.html.'
  });
}

if (!viteConfig.includes('X-Content-Type-Options')) {
  findings.push({
    file: 'vite.config.ts',
    line: 1,
    ruleId: 'MISSING_SEC_HEADERS',
    severity: 'MEDIUM',
    message: 'Security response headers (X-Content-Type-Options) missing in vite.config.ts.'
  });
}

console.log(`[Security Audit] Scanned ${files.length} files.`);
if (findings.length > 0) {
  console.error(`[Security Audit] Found ${findings.length} issue(s):`);
  for (const f of findings) {
    console.error(`  - [${f.severity}] ${f.file}:${f.line} (${f.ruleId}) ${f.message}`);
  }
  process.exit(1);
}

console.log('[Security Audit] PASSED: 0 security issues detected.');
