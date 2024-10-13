import { proxyActivities, sleep, continueAsNew, defineQuery, setHandler, defineSignal, condition } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet, bye, Hi, imSleep } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/* --------------------------------- simple --------------------------------- */

export async function workflow_simple(name: string): Promise<string> {
  await Hi(name);
  await greet(name);
  return  await bye(name);
}


/* ------------------------------- with sleep ------------------------------- */

export async function workflow_with_sleep(name: string): Promise<string> {
  await Hi(name);
  await greet(name);
  await sleep(1 * 60 * 1000);
  return await bye(name);
}

/* -------------------------- with continue as new -------------------------- */

export async function workflow_with_continueAsNew(name: string, counter:number): Promise<string> {
  await Hi(name);
  await greet(name);
  await sleep(0.25 * 60 * 1000);

  if (counter < 3) {
    await continueAsNew(name, counter + 1);
  }

  return await bye(name);
}


/* ------------------------------- with query ------------------------------- */


export const getNameQuery = defineQuery<string>('name');

export async function workflow_with_query(name: string): Promise<string> {
  
  setHandler(getNameQuery, () => name);

  await Hi(name);
  await greet(name);
  await sleep(2 * 60 * 1000);
  return await bye(name);
}



/* ------------------------------- with signal ------------------------------- */


export const completeWorkflowSignal = defineSignal<[string]>("completeWorkflowSignal");

export async function workflow_with_signal(name: string): Promise<string> {
  
  let returnValue = '';
  setHandler(completeWorkflowSignal, (returnValue_:string) => {
    returnValue= returnValue_
  });

  await Hi(name);
  await greet(name);

  while(true) {
    imSleep('1 minute');
    await sleep(1 * 60 * 1000);
    if(returnValue) {
      return returnValue;
    }
  }
}


/* ------------------------- workflow-with-condition ------------------------ */


export const deActiveSignal = defineSignal<[]>("deActiveSignal");

export async function workflow_with_condition(name: string): Promise<string> {
  
  let active = true;
  setHandler(deActiveSignal, () => {
    active = false
  });

  await Hi(name);
  
  if (await condition(()=>!active, 2 * 60 * 1000)) {
    return "goodbye" 
  }
  else {
    while(true) {
      imSleep('15 secs <else>');
      await sleep(0.25 * 60 * 1000);
    }
  }
}
