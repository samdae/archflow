#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// 로깅 헬퍼
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

// 플랫폼 감지
function detectPlatform() {
  const cwd = process.cwd();
  
  // .cursor 폴더 확인
  if (fs.existsSync(path.join(cwd, '.cursor'))) {
    return 'cursor';
  }
  
  // CLAUDE.md 또는 .claude 폴더 확인
  if (fs.existsSync(path.join(cwd, 'CLAUDE.md')) || 
      fs.existsSync(path.join(cwd, '.claude'))) {
    return 'claude-code';
  }
  
  return null;
}

// 디렉토리 생성 (재귀적)
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 파일 복사
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

// 디렉토리 내 파일 복사
function copyDirectory(srcDir, destDir, options = {}) {
  const { exclude = ['.gitkeep'] } = options;
  
  if (!fs.existsSync(srcDir)) {
    logError(`Source directory does not exist: ${srcDir}`);
    return false;
  }
  
  ensureDir(destDir);
  
  const files = fs.readdirSync(srcDir);
  let successCount = 0;
  
  for (const file of files) {
    if (exclude.includes(file)) {
      continue;
    }
    
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath, options);
    } else {
      if (copyFile(srcPath, destPath)) {
        successCount++;
      }
    }
  }
  
  return successCount > 0;
}

// 사용자 입력 받기
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

// 플랫폼 선택
async function choosePlatform() {
  log('\n📦 Archflow Initialization', 'bright');
  log('==========================\n', 'bright');
  
  const detected = detectPlatform();
  
  if (detected) {
    logInfo(`Detected platform: ${detected === 'cursor' ? 'Cursor' : 'Claude Code'}`);
    const confirm = await askQuestion(`Continue with ${detected}? (Y/n): `);
    
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
      // 사용자가 거부하면 다시 선택
      return await promptPlatformChoice();
    }
    
    return detected;
  }
  
  return await promptPlatformChoice();
}

// 플랫폼 선택 프롬프트
async function promptPlatformChoice() {
  log('\nSelect your platform:', 'yellow');
  log('1) Cursor');
  log('2) Claude Code\n');
  
  const choice = await askQuestion('Enter your choice (1 or 2): ');
  
  if (choice === '1') {
    return 'cursor';
  } else if (choice === '2') {
    return 'claude-code';
  } else {
    logError('Invalid choice. Please enter 1 or 2.');
    return await promptPlatformChoice();
  }
}

// 타겟 경로 결정
function getTargetPaths(platform) {
  const cwd = process.cwd();
  
  if (platform === 'cursor') {
    return {
      skills: path.join(cwd, '.cursor', 'skills'),
      agents: path.join(cwd, '.cursor', 'agents'),
      config: path.join(cwd, '.cursor', 'archflow.config.yaml')
    };
  } else {
    // Claude Code
    return {
      skills: path.join(cwd, '.claude', 'skills'),
      agents: path.join(cwd, '.claude', 'agents'),
      config: path.join(cwd, '.claude', 'archflow.config.yaml')
    };
  }
}

// Config 파일 생성/업데이트
function createConfigFile(configPath, platform) {
  try {
    const configContent = `# Archflow Configuration
# This file configures the document-driven development workflow

# Platform settings
platform:
  # Target platform: "cursor" or "claude-code"
  target: "${platform}"
  
  # Skills installation path (relative to project root)
  skills_path: "${platform === 'cursor' ? '.cursor/skills' : '.claude/skills'}"
  
  # Agents installation path (relative to project root)
  agents_path: "${platform === 'cursor' ? '.cursor/agents' : '.claude/agents'}"

# Workflow settings
workflow:
  # Enable Multi-Agent Debate for design phase
  enable_debate: true
  
  # Default agents for debate (can be overridden per skill)
  debate_agents:
    - "domain-architect"
    - "best-practice-advisor"
  
  # Auto-sync architect documents after changes
  auto_sync_architect: true
  
  # Auto-generate changelog after bugfix
  auto_changelog: true

# Documentation settings
documentation:
  # Root directory for architect documents
  architect_root: "docs"
  
  # Root directory for requirement documents
  requirements_root: "docs/requirements"
  
  # Root directory for changelog
  changelog_root: "docs/changelog"
  
  # Template for document structure
  template_style: "standard"  # "standard" or "minimal"

# Language settings
language:
  # Primary language for documents and prompts
  primary: "ko"  # "ko" or "en"
  
  # Enable multi-language support
  multi_language: false

# Skill configuration
skills:
  # Skills to enable (empty array = all skills enabled)
  enabled: []
  
  # Skills to disable
  disabled: []

# Advanced settings
advanced:
  # Validation strictness: "strict", "normal", or "lenient"
  validation_mode: "normal"
  
  # Auto-fix linter errors after implementation
  auto_fix_lints: true
  
  # Generate tests during implementation
  generate_tests: true
  
  # Commit strategy: "manual", "auto", or "prompt"
  commit_strategy: "manual"
`;
    
    fs.writeFileSync(configPath, configContent, 'utf8');
    return true;
  } catch (error) {
    logError(`Failed to create config file: ${error.message}`);
    return false;
  }
}

// 메인 실행
async function main() {
  try {
    // 1. 플랫폼 선택
    const platform = await choosePlatform();
    log(`\n✓ Selected platform: ${platform === 'cursor' ? 'Cursor' : 'Claude Code'}`, 'green');
    
    // 2. 타겟 경로 결정
    const targets = getTargetPaths(platform);
    
    // 3. archflow 패키지 경로 찾기
    const scriptDir = __dirname;
    const archflowRoot = path.dirname(scriptDir);
    
    // 4. 파일 복사
    log('\n📋 Installing skills...', 'blue');
    const skillsSrc = path.join(archflowRoot, 'skills');
    if (copyDirectory(skillsSrc, targets.skills)) {
      logSuccess(`Skills installed to ${targets.skills}`);
    } else {
      throw new Error('Failed to install skills');
    }
    
    log('\n👥 Installing agents...', 'blue');
    const agentsSrc = path.join(archflowRoot, 'agents');
    if (copyDirectory(agentsSrc, targets.agents)) {
      logSuccess(`Agents installed to ${targets.agents}`);
    } else {
      throw new Error('Failed to install agents');
    }
    
    // 5. Config 파일 생성
    log('\n⚙️  Creating configuration file...', 'blue');
    if (createConfigFile(targets.config, platform)) {
      logSuccess(`Configuration file created at ${targets.config}`);
    } else {
      throw new Error('Failed to create configuration file');
    }
    
    // 6. templates 폴더도 복사
    log('\n📝 Installing templates...', 'blue');
    const templatesSrc = path.join(archflowRoot, 'templates');
    const templatesTarget = path.join(path.dirname(targets.config), 'templates');
    if (copyDirectory(templatesSrc, templatesTarget)) {
      logSuccess(`Templates installed to ${templatesTarget}`);
    } else {
      logInfo('Templates installation skipped (optional)');
    }
    
    // 7. 완료 메시지
    log('\n' + '='.repeat(50), 'green');
    log('✨ Archflow initialized successfully!', 'green');
    log('='.repeat(50) + '\n', 'green');
    
    log('Next steps:', 'cyan');
    log('1. Review the configuration file:', 'cyan');
    log(`   ${targets.config}\n`);
    log('2. Start using Archflow skills in your AI assistant:', 'cyan');
    log('   - require-refine: Refine requirements');
    log('   - architect: Design with multi-agent debate');
    log('   - implement: Implement from design documents');
    log('   - bugfix: Debug with document context');
    log('   - changelogging: Generate changelogs\n');
    
    log('📖 Documentation:', 'cyan');
    log('   https://github.com/samdae/archflow\n');
    
    process.exit(0);
  } catch (error) {
    log('\n' + '='.repeat(50), 'red');
    logError(`Initialization failed: ${error.message}`);
    log('='.repeat(50) + '\n', 'red');
    
    log('Please try again or report the issue at:', 'yellow');
    log('https://github.com/samdae/archflow/issues\n', 'yellow');
    
    process.exit(1);
  }
}

// 실행
main();
