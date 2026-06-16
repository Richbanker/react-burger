import { spawn } from 'node:child_process';
import { createServer } from 'vite';

const server = await createServer({
  mode: 'test',
  server: {
    host: '127.0.0.1',
    open: false,
    port: 5173,
    strictPort: true,
  },
});

const runPlaywright = () =>
  new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)],
      {
        stdio: 'inherit',
      }
    );

    child.on('exit', (code) => {
      resolve(code ?? 1);
    });
  });

await server.listen();

try {
  const exitCode = await runPlaywright();
  process.exitCode = exitCode;
} finally {
  await server.close();
}
