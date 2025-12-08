import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

if (Bun.env.DEVELOPMENT_ENV == 'production' && cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (_workers) => {
    process.exit(1);
  });
} else {
  await import ("./server")
}
