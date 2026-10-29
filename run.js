const { spawn } = require('child_process');
const path = require('path');

console.log('==================================================');
console.log('   RETRO MEN\'S CLOTHING - Starting Full Stack App  ');
console.log('==================================================');

const rootDir = __dirname;
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('[1/2] Starting Backend Server (http://localhost:5000)...');
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  stdio: 'inherit',
  shell: true
});

console.log('[2/2] Starting Frontend Vite Dev Server (http://localhost:5173)...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => console.error('[Backend Error]:', err));
frontend.on('error', (err) => console.error('[Frontend Error]:', err));

const cleanup = () => {
  console.log('\nStopping servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
