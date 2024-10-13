import { Client, Connection } from '@temporalio/client';

async function run() {


  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
    namespace: "namespace-1"
  });

  const getWorkflowById = async (workflowId: string) => {
    return await client.workflow.getHandle(workflowId);
  }

  // console.log({getWorkflowById: await getWorkflowById('<WORKFLOW_ID>')});
  

  // return all the workflows inside the queue-1 task queue
  for await (const workflowExecutionInfo of client.workflow.list({ query: 'TaskQueue="queue-1"' })) {
    console.log({ workflowExecutionInfo });
  }

  // return all the workflows inside the queue-1 task queue that started after a certain time
  const twoHoursBefore = new Date(Date.now() - 2 * 60 * 60 * 1000);
  for await (const workflowExecutionInfo of client.workflow.list({ query: `TaskQueue="queue-1" and StartTime > "${twoHoursBefore.toISOString()}"` })) {
    console.log({ workflowExecutionInfo });
  }

  // return all the workflows inside the queue-1 task queue that are completed
  for await (const workflowExecutionInfo of client.workflow.list({ query: `TaskQueue="queue-1" and ExecutionStatus="COMPLETED"` })) {
    console.log({ workflowExecutionInfo });
  }


  const listClosedWorkflowExecutions =  await client.workflow.workflowService.listClosedWorkflowExecutions({
    namespace: "namespace-1"
  })
  console.log(JSON.stringify( listClosedWorkflowExecutions.executions, undefined, 2).replace(/\\n/g, ""));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});