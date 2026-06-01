import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pluginPath = path.join(root, 'plugins', 'genesis-minds', 'plugin.json');
const plugin = readJson(pluginPath);

if (!Array.isArray(plugin.skills)) {
  throw new Error('plugins/genesis-minds/plugin.json must define skills[]');
}

for (const skill of plugin.skills) {
  requireString(skill, 'id');
  requireString(skill, 'displayName');
  requireString(skill, 'description');
  requireString(skill, 'root');
  requireStringArray(skill, 'requiredFiles');
  requireStringArray(skill, 'capabilities');

  if (!isSafeRelativePath(skill.root)) {
    throw new Error(`Skill ${skill.id} has unsafe root: ${skill.root}`);
  }

  const skillRoot = path.join(path.dirname(pluginPath), ...skill.root.split('/'));
  const skillMdPath = path.join(skillRoot, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    throw new Error(`Skill ${skill.id} is missing SKILL.md`);
  }

  for (const requiredFile of skill.requiredFiles) {
    if (!isSafeRelativePath(requiredFile)) {
      throw new Error(`Skill ${skill.id} has unsafe required file: ${requiredFile}`);
    }
    const requiredPath = path.join(skillRoot, ...requiredFile.split('/'));
    if (!fs.existsSync(requiredPath)) {
      throw new Error(`Skill ${skill.id} missing required file: ${requiredFile}`);
    }
  }

  const frontmatter = parseFrontmatter(fs.readFileSync(skillMdPath, 'utf8'));
  if (frontmatter.name !== skill.id) {
    throw new Error(`Skill ${skill.id} SKILL.md name must match the plugin id`);
  }
  if (!frontmatter.version) {
    throw new Error(`Skill ${skill.id} SKILL.md must declare a version`);
  }
}

console.log(`Validated ${plugin.skills.length} marketplace skills.`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function requireString(record, field) {
  if (typeof record?.[field] !== 'string' || !record[field].trim()) {
    throw new Error(`Skill entry must define string field: ${field}`);
  }
}

function requireStringArray(record, field) {
  if (!Array.isArray(record?.[field]) || record[field].some((value) => typeof value !== 'string' || !value.trim())) {
    throw new Error(`Skill entry must define string array field: ${field}`);
  }
}

function isSafeRelativePath(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || path.posix.isAbsolute(value)) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && normalized !== '..' && !normalized.startsWith('../');
}

function parseFrontmatter(markdown) {
  const normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return {};
  const end = normalized.indexOf('\n---', 4);
  if (end < 0) return {};

  const values = {};
  for (const line of normalized.slice(4, end).split('\n')) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  }
  return values;
}
