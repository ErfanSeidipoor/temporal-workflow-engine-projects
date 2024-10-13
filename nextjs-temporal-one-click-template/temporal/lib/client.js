"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemporalClient = getTemporalClient;
const client_1 = require("@temporalio/client");
const shared_1 = require("./shared");
const client = makeClient();
function makeClient() {
    const connection = client_1.Connection.lazy({
        address: 'localhost:7233',
    });
    return new client_1.Client({ connection, namespace: shared_1.TEMPORAL_NAMESPACE });
}
function getTemporalClient() {
    return client;
}
//# sourceMappingURL=client.js.map