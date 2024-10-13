import { Client, Connection } from '@temporalio/client';
async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({
    connection,
    namespace: "namespace-1"
  });

  const WORKFLOW_ID = 'workflow-73vvpcsFwh4Mi6OKvI5Vt'

  const workflow = await await client.workflow.getHandle(WORKFLOW_ID)
  console.log( workflow.describe())

  await workflow.terminate('terminate reason')
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});