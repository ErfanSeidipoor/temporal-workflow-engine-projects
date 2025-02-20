import { Connection, Client } from "@temporalio/client";
import { cancelSubscription, subscriptionWorkflow, customerIdNameQuery } from "../workflows";
import { TASK_QUEUE_NAME, Customer, TEMPORAL_NAMESPACE } from "../shared";

async function run() {
  const connection = await Connection.connect({ address: "localhost:7233" });
  const client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE,
  });
  const subscriptionWorkflowExecution = await client.workflow.start(
    subscriptionWorkflow,
    {
      args: [customer],
      taskQueue: TASK_QUEUE_NAME,
      workflowId: `subscription-${customer.id}`,
      
    }
  );
  const handle = await client.workflow.getHandle(`subscription-${customer.id}`);

  await handle.signal(cancelSubscription);

  await handle.query(customerIdNameQuery)
  ;
  console.log(await subscriptionWorkflowExecution.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

const customer: Customer = {
  firstName: "Grant",
  lastName: "Fleming",
  email: "email-1@customer.com",
  subscription: {
    trialPeriod: 2000,
    billingPeriod: 2000,
    maxBillingPeriods: 12,
    initialBillingPeriodCharge: 100,
  },
  id: "ABC123",
};