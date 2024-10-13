import { Client, Connection } from '@temporalio/client';
import { getNameQuery } from './workflows';

async function run() {


  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
    namespace: "namespace-1"
  });

  const getWorkflowHandle = async (workflowId: string) => {
    return await client.workflow.getHandle(workflowId);
  }


  const getWorkflowName = async (workflowId:string) => {
    const handle = await getWorkflowHandle(workflowId);
    const name = await handle.query(getNameQuery);

    console.log({name});
  }

  await getWorkflowName('workflow_with_query-mQXPtEeM7PIn2WoZBkmfc')
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});