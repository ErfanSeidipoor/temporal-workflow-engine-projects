import { Client, Connection } from '@temporalio/client';
import { TEMPORAL_NAMESPACE } from './shared';

const client: Client = makeClient();

function makeClient(): Client {
  const connection = Connection.lazy({
    address: 'localhost:7233',
});
  return new Client({ connection, namespace:TEMPORAL_NAMESPACE });
}

export function getTemporalClient(): Client {
  return client;
}