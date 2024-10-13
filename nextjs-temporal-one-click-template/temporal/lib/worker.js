"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("@temporalio/worker");
const activities = __importStar(require("./activities"));
const shared_1 = require("./shared");
run().catch((err) => console.log(err));
async function run() {
    const connection = await worker_1.NativeConnection.connect({
        address: 'localhost:7233',
        // In production, pass options to configure TLS and other settings.
    });
    try {
        const worker = await worker_1.Worker.create({
            connection,
            workflowsPath: require.resolve('./workflows'),
            activities,
            taskQueue: shared_1.TASK_QUEUE_NAME,
            namespace: shared_1.TEMPORAL_NAMESPACE,
        });
        await worker.run();
    }
    finally {
        connection.close();
    }
}
//# sourceMappingURL=worker.js.map