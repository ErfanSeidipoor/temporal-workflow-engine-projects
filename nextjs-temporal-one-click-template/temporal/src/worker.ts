import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import { TASK_QUEUE_NAME, TEMPORAL_NAMESPACE } from './shared';

run().catch((err) => console.log(err));

async function run() {
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
    // In production, pass options to configure TLS and other settings.
});
try {
    const worker = await Worker.create({
        connection,
        workflowsPath: require.resolve('./workflows'),
        activities,
        taskQueue: TASK_QUEUE_NAME,
        namespace: TEMPORAL_NAMESPACE,
    });
    await worker.run();
  } finally {
    connection.close();
  }
}