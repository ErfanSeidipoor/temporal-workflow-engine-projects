import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
async function run() {
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
  });
  const worker = await Worker.create({
    connection,
    namespace: 'namespace-1',
    taskQueue: 'queue-1',
    workflowsPath: require.resolve('./workflows'),
    activities,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});