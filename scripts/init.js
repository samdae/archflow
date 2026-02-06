#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec, execSync } = require('child_process');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Logging helpers
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}✗ ${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

// Supported tools configuration
const TOOLS = {
  cursor: {
    name: 'Cursor',
    skillsPath: '.cursor/skills',
    rulesPath: '.cursor/rules',
    agentsPath: '.cursor/agents',
    rulesFormat: 'folder',
    detectPaths: ['.cursor']
  },
  windsurf: {
    name: 'Windsurf',
    skillsPath: '.windsurf/skills',
    rulesPath: '.windsurfrules',
    agentsPath: null, // uses AGENTS.md
    rulesFormat: 'single-file',
    detectPaths: ['.windsurf', '.codeium']
  },
  antigravity: {
    name: 'Antigravity',
    skillsPath: 'skills',
    rulesPath: 'rules',
    agentsPath: 'agents',
    rulesFormat: 'folder',
    detectPaths: ['skills', '.gemini/antigravity']
  },
  'claude-code': {
    name: 'Claude Code',
    installMethod: 'cli',
    cliCommands: [
      'claude add marketplace samdae/archflow',
      'claude install archflow'
    ],
    detectPaths: ['CLAUDE.md', '.claude']
  },
  'gpt-codex': {
    name: 'GPT-Codex',
    skillsPath: '.codex/skills',
    rulesPath: '.codex/rules',
    agentsPath: null, // uses AGENTS.md
    rulesFormat: 'folder',
    detectPaths: ['.codex']
  },
  'gemini-cli': {
    name: 'Gemini CLI',
    skillsPath: '.gemini/skills',
    rulesPath: '.gemini/settings.json',
    agentsPath: null, // uses GEMINI.md
    rulesFormat: 'json',
    detectPaths: ['.gemini', 'GEMINI.md']
  }
};

// Detect platform
function detectPlatform() {
  const cwd = process.cwd();

  for (const [key, config] of Object.entries(TOOLS)) {
    for (const detectPath of config.detectPaths) {
      if (fs.existsSync(path.join(cwd, detectPath))) {
        return key;
      }
    }
  }

  return null;
}

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Copy file
function copyFile(src, dest) {
  try {
    const destDir = path.dirname(dest);
    ensureDir(destDir);
    fs.copyFileSync(src, dest);
    return true;
  } catch (error) {
    logError(`Failed to copy ${src} to ${dest}: ${error.message}`);
    return false;
  }
}

// Copy directory recursively
function copyDirectory(srcDir, destDir, options = {}) {
  const { exclude = ['.gitkeep', '.git'] } = options;

  if (!fs.existsSync(srcDir)) {
    logError(`Source directory does not exist: ${srcDir}`);
    return false;
  }

  ensureDir(destDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let successCount = 0;

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (copyDirectory(srcPath, destPath, options)) {
        successCount++;
      }
    } else {
      if (copyFile(srcPath, destPath)) {
        successCount++;
      }
    }
  }

  return successCount > 0;
}

// Read user input
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Merge rules into single file (for Windsurf)
function mergeRulesToFile(rulesDir, destFile) {
  if (!fs.existsSync(rulesDir)) {
    logError(`Rules directory does not exist: ${rulesDir}`);
    return false;
  }

  let content = '# Archflow Rules\n\n';
  const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(rulesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    content += `\n---\n\n${fileContent}\n`;
  }

  try {
    fs.writeFileSync(destFile, content, 'utf8');
    return true;
  } catch (error) {
    logError(`Failed to write rules file: ${error.message}`);
    return false;
  }
}

// Convert rules to JSON format (for Gemini CLI)
function convertRulesToJson(rulesDir, destFile) {
  if (!fs.existsSync(rulesDir)) {
    logError(`Rules directory does not exist: ${rulesDir}`);
    return false;
  }

  // Read existing settings.json if exists
  let settings = {};
  if (fs.existsSync(destFile)) {
    try {
      settings = JSON.parse(fs.readFileSync(destFile, 'utf8'));
    } catch (e) {
      settings = {};
    }
  }

  // Add archflow rules reference
  settings.archflow = {
    enabled: true,
    rulesPath: 'rules/archflow-rules.md',
    version: require('../package.json').version || '1.0.0'
  };

  try {
    ensureDir(path.dirname(destFile));
    fs.writeFileSync(destFile, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (error) {
    logError(`Failed to write settings.json: ${error.message}`);
    return false;
  }
}

// Create AGENTS.md or GEMINI.md context file
function createContextFile(cwd, filename, content) {
  const filePath = path.join(cwd, filename);

  // Don't overwrite if exists
  if (fs.existsSync(filePath)) {
    logInfo(`${filename} already exists, skipping`);
    return true;
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    logError(`Failed to create ${filename}: ${error.message}`);
    return false;
  }
}

// Execute CLI commands (for Claude Code)
async function executeCliCommands(commands) {
  for (const cmd of commands) {
    log(`\n⚡ Executing: ${cmd}`, 'blue');
    try {
      execSync(cmd, { stdio: 'inherit' });
      logSuccess(`Command completed: ${cmd}`);
    } catch (error) {
      logError(`Command failed: ${cmd}`);
      logInfo('You may need to run this command manually after installation.');
      return false;
    }
  }
  return true;
}

// Check if CLI tool is available
function isCliAvailable(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Choose platform
async function choosePlatform() {
  log('\n📦 Archflow Installation', 'bright');
  log('========================\n', 'bright');

  const detected = detectPlatform();

  if (detected) {
    const toolName = TOOLS[detected].name;
    logInfo(`Detected platform: ${toolName}`);
    const confirm = await askQuestion(`Continue with ${toolName}? (Y/n): `);

    if (confirm.toLowerCase() !== 'n' && confirm.toLowerCase() !== 'no') {
      return detected;
    }
  }

  return await promptPlatformChoice();
}

// Platform selection prompt
async function promptPlatformChoice() {
  log('\nSelect your AI coding tool:', 'yellow');
  log('1) Cursor');
  log('2) Windsurf');
  log('3) Antigravity');
  log('4) Claude Code');
  log('5) GPT-Codex (OpenAI)');
  log('6) Gemini CLI (Google)\n');

  const choice = await askQuestion('Enter your choice (1-6): ');

  const mapping = {
    '1': 'cursor',
    '2': 'windsurf',
    '3': 'antigravity',
    '4': 'claude-code',
    '5': 'gpt-codex',
    '6': 'gemini-cli'
  };

  if (mapping[choice]) {
    return mapping[choice];
  }

  logError('Invalid choice. Please enter 1-6.');
  return await promptPlatformChoice();
}

// Main installation function
async function installForTool(toolKey) {
  const cwd = process.cwd();
  const tool = TOOLS[toolKey];
  const archflowRoot = path.dirname(__dirname);

  log(`\n🔧 Installing for ${tool.name}...`, 'bright');

  // Handle CLI-based installation (Claude Code)
  if (tool.installMethod === 'cli') {
    const cliTool = tool.cliCommands[0].split(' ')[0]; // e.g., 'claude'

    if (!isCliAvailable(cliTool)) {
      logError(`${cliTool} CLI is not installed or not in PATH.`);
      log('\nPlease install it first, then run these commands manually:', 'yellow');
      tool.cliCommands.forEach(cmd => log(`  ${cmd}`));
      return false;
    }

    return await executeCliCommands(tool.cliCommands);
  }

  // Copy skills
  if (tool.skillsPath) {
    log('\n📋 Installing skills...', 'blue');
    const skillsSrc = path.join(archflowRoot, 'skills');
    const skillsDest = path.join(cwd, tool.skillsPath);

    if (copyDirectory(skillsSrc, skillsDest)) {
      logSuccess(`Skills installed to ${tool.skillsPath}`);
    } else {
      throw new Error('Failed to install skills');
    }
  }

  // Copy/convert rules
  if (tool.rulesPath) {
    log('\n📏 Installing rules...', 'blue');
    const rulesSrc = path.join(archflowRoot, 'rules');
    const rulesDest = path.join(cwd, tool.rulesPath);

    if (tool.rulesFormat === 'folder') {
      if (copyDirectory(rulesSrc, rulesDest)) {
        logSuccess(`Rules installed to ${tool.rulesPath}`);
      }
    } else if (tool.rulesFormat === 'single-file') {
      if (mergeRulesToFile(rulesSrc, rulesDest)) {
        logSuccess(`Rules merged to ${tool.rulesPath}`);
      }
    } else if (tool.rulesFormat === 'json') {
      // Copy rules folder and create settings.json reference
      const rulesFolder = path.join(cwd, '.gemini', 'rules');
      copyDirectory(rulesSrc, rulesFolder);
      if (convertRulesToJson(rulesSrc, rulesDest)) {
        logSuccess(`Rules configured in ${tool.rulesPath}`);
      }
    }
  }

  // Copy agents
  if (tool.agentsPath) {
    log('\n👥 Installing agents...', 'blue');
    const agentsSrc = path.join(archflowRoot, 'agents');
    const agentsDest = path.join(cwd, tool.agentsPath);

    if (copyDirectory(agentsSrc, agentsDest)) {
      logSuccess(`Agents installed to ${tool.agentsPath}`);
    }
  }

  // Create context files for tools that use them
  if (!tool.agentsPath && toolKey !== 'claude-code') {
    log('\n📝 Creating context file...', 'blue');

    const contextContent = `# Archflow Agent Context

> This project uses Archflow for document-driven development.
> See the skills folder for available workflows.

## Available Skills

- /spec - Transform requirements into spec.md
- /arch - Design with Multi-Agent Debate  
- /ui - Generate UI specification
- /check - Verify design completeness
- /build - Implement from design docs
- /test - Run tests
- /debug - Debug with document context
- /trace - Record changes
- /sync - Sync documentation

## Documentation

docs/{serviceName}/spec.md - Requirements
docs/{serviceName}/arch-be.md - Backend design
docs/{serviceName}/arch-fe.md - Frontend design
docs/{serviceName}/trace.md - Change log

## Rules

See rules/archflow-rules.md for workflow and coding standards.
`;

    if (toolKey === 'gemini-cli') {
      createContextFile(cwd, 'GEMINI.md', contextContent);
      logSuccess('Created GEMINI.md');
    } else {
      createContextFile(cwd, 'AGENTS.md', contextContent);
      logSuccess('Created AGENTS.md');
    }
  }

  return true;
}

// Main function
async function main() {
  try {
    const toolKey = await choosePlatform();
    const tool = TOOLS[toolKey];

    log(`\n✓ Selected: ${tool.name}`, 'green');

    const success = await installForTool(toolKey);

    if (success) {
      log('\n' + '='.repeat(50), 'green');
      log('✨ Archflow installed successfully!', 'green');
      log('='.repeat(50) + '\n', 'green');

      log('Available skills:', 'cyan');
      log('  /spec     - Requirements refinement');
      log('  /arch     - Design with Multi-Agent Debate');
      log('  /build    - Implementation from design');
      log('  /test     - Test generation and execution');
      log('  /debug    - Debug with document context\n');

      log('📖 Documentation: https://github.com/samdae/archflow\n', 'cyan');
    }

    process.exit(success ? 0 : 1);
  } catch (error) {
    log('\n' + '='.repeat(50), 'red');
    logError(`Installation failed: ${error.message}`);
    log('='.repeat(50) + '\n', 'red');

    log('Please report the issue at:', 'yellow');
    log('https://github.com/samdae/archflow/issues\n', 'yellow');

    process.exit(1);
  }
}

// Run
main();
