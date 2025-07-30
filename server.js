import cluster from 'cluster';
import { cpus } from 'os';
import { createServer } from 'http';
import next from 'next';

console.log('--- Script starting ---');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// --- Cluster Master Process ---
if (cluster.isPrimary) {
  const numCPUs = cpus().length;

  console.log(`[Master] Master process ${process.pid} is running.`);
  console.log(`[Master] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[Master] 'dev' mode is: ${dev}`);
  console.log(`[Master] Forking for ${numCPUs} CPUs...`);

  // Create a worker for each CPU core.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for when a worker process comes online.
  cluster.on('online', (worker) => {
    console.log(`[Master] Worker ${worker.process.pid} is online.`);
  });

  // Listen for when a worker process dies.
  cluster.on('exit', (worker, code, signal) => {
    // Log an error unless the worker exited cleanly.
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.error(`[Master] Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
      console.log('[Master] Starting a new worker...');
      cluster.fork();
    } else {
      console.log(`[Master] Worker ${worker.process.pid} exited cleanly.`);
    }
  });

  console.log('[Master] Master process setup complete. Waiting for workers.');
} else {
  // --- Cluster Worker Process ---
  console.log(`[Worker ${process.pid}] Worker process started.`);

  // Create a Next.js app instance.
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  console.log(`[Worker ${process.pid}] Preparing Next.js app...`);

  app.prepare().then(() => {
    console.log(`[Worker ${process.pid}] Next.js app prepared. Creating server...`);

    createServer(async (req, res) => {
      try {
        // Pass all incoming requests to the Next.js handler.
        await handle(req, res);
      } catch (err) {
        console.error(`[Worker ${process.pid}] Error handling request for ${req.url}`, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, (err) => {
      if (err) {
        console.error(`[Worker ${process.pid}] Failed to start server:`, err);
        // Exit the worker process if the server fails to start
        process.exit(1);
      }
      console.log(`[Worker ${process.pid}] Server ready on http://${hostname}:${port}`);
    });
  }).catch((err) => {
    // This catch is crucial! It will show errors during Next.js initialization.
    console.error(`[Worker ${process.pid}] Error during app.prepare():`, err);
    process.exit(1); // Exit the process with an error code
  });
}
