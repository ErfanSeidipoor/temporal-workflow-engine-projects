import { Client, Connection } from '@temporalio/client';
import { completeWorkflowSignal, deActiveSignal } from './workflows';

async function run() {


  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
    namespace: "namespace-1"
  });

  const getWorkflowHandle = async (workflowId: string) => {
    return await client.workflow.getHandle(workflowId);
  }


  const completeWorkflow = async (workflowId:string) => {
    const handle = await getWorkflowHandle(workflowId);
    const name = await handle.signal(completeWorkflowSignal,"goodbye");
    console.log({name});
  }
  // await completeWorkflow('workflow_with_signal--vF6vQRyaULv7Y7RY-1bS')


  const deActiveWorkflow = async (workflowId:string) => {
    const handle = await getWorkflowHandle(workflowId);
    const name = await handle.signal(deActiveSignal);
    console.log({name});
  }
  deActiveWorkflow('workflow_with_condition-GP12dLWyuzfsWhoO_Ya_j')
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});