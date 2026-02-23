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
  'claude-code': {
    name: 'Claude Code',
    installMethod: 'cli',
    cliCommands: [
      'claude add marketplace samdae/archflow',
      'claude install archflow'
    ],
    detectPaths: ['CLAUDE.md', '.claude']
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
  log('2) Claude Code\n');

  const choice = await askQuestion('Enter your choice (1-2): ');

  const mapping = {
    '1': 'cursor',
    '2': 'claude-code'
  };

  if (mapping[choice]) {
    return mapping[choice];
  }

  logError('Invalid choice. Please enter 1-2.');
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

    if (copyDirectory(rulesSrc, rulesDest)) {
      logSuccess(`Rules installed to ${tool.rulesPath}`);
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
