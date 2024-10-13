import { Connection, Client } from '@temporalio/client';
import { workflow_with_sleep, workflow_with_continueAsNew, workflow_with_query, workflow_with_signal, workflow_with_condition } from './workflows';
import { nanoid } from 'nanoid';

async function run() {

  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({
    connection,
    namespace: "namespace-1"
  });

  // const handle = await client.workflow.start(workflow_simple, {
  //   taskQueue: 'queue-1',
  //   args: ['Temporal1'],
  //   workflowId: 'workflow_simple-' + nanoid(),
  // });

  // const handle = await client.workflow.start(workflow_with_sleep, {
  //   taskQueue: 'queue-1',
  //   args: ['Temporal1'],
  //   workflowId: 'workflow_with_sleep-' + nanoid(),
  // });

  // const handle = await client.workflow.start(workflow_with_query, {
  //   taskQueue: 'queue-1',
  //   args: ['workflow_with_query'],
  //   workflowId: 'workflow_with_query-' + nanoid(),
  // });

  // const handle = await client.workflow.start(workflow_with_signal, {
  //     taskQueue: 'queue-1',
  //     args: ['workflow_with_signal'],
  //     workflowId: 'workflow_with_signal-' + nanoid(),
  //   });

  const handle = await client.workflow.start(workflow_with_condition, {
    taskQueue: 'queue-1',
    args: ['workflow_with_condition'],
    workflowId: 'workflow_with_condition-' + nanoid(),
  });

  
  console.log(`Started workflow ${handle.workflowId}`);
  console.log(await handle.result());
}

run().catch((err) => { 
  console.error(err);
  process.exit(1);
});