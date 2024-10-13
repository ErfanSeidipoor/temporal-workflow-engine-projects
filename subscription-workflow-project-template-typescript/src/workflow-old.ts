import {
    proxyActivities,
    log,
    workflowInfo,
    sleep,
    defineQuery,
    setHandler,
    defineSignal,
    condition,
  } from "@temporalio/workflow";
  import type * as activities from "./activities";
  import { Customer } from "./shared";
  
  const {
    sendWelcomeEmail,
    sendSubscriptionFinishedEmail,
    chargeCustomerForBillingPeriod,
    sendCancellationEmailDuringTrialPeriod,
    sendSubscriptionOverEmail,
  } = proxyActivities<typeof activities>({
    startToCloseTimeout: "5 seconds",
  });
  

export async function subscriptionWorkflow(
    customer: Customer
  ): Promise<string> {
    let subscriptionCancelled = false;
    let totalCharged = 0;
    let billingPeriodNumber = 1;
    let billingPeriodChargeAmount =
      customer.subscription.initialBillingPeriodCharge;
  
    // Send welcome email to customer
    await sendWelcomeEmail(customer);
  
    // Check if the subscription was cancelled during the trial period
    if (subscriptionCancelled) {
      await sendCancellationEmailDuringTrialPeriod(customer);
      return `Subscription finished for: ${customer.id}`;
    } else {
      // Trial period is over, start billing until we reach the max billing periods or subscription is cancelled
      while (true) {
        if (billingPeriodNumber > customer.subscription.maxBillingPeriods) break;
  
        if (subscriptionCancelled) {
          await sendSubscriptionFinishedEmail(customer);
          return `Subscription finished for: ${customer.id}, Total Charged: ${totalCharged}`;
        }
  
        log.info(`Charging ${customer.id} amount ${billingPeriodChargeAmount}`);
  
        await chargeCustomerForBillingPeriod(customer, billingPeriodChargeAmount);
        totalCharged += billingPeriodChargeAmount;
        billingPeriodNumber++;
  
        // Wait for the next billing period or until the subscription is cancelled
        await sleep(customer.subscription.billingPeriod);
      }
  
      // If the subscription period is over and not cancelled, notify the customer to buy a new subscription
      await sendSubscriptionOverEmail(customer);
      return `Completed ${
        workflowInfo().workflowId
      }, Total Charged: ${totalCharged}`;
    }
  }