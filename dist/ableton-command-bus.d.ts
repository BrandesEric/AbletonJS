/// <reference types="node" />
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetCountResult } from "./results/get-count-result";
import { CallFunctionCommand } from "./commands/call-function-command";
import { CallFunctionResult } from "./results/call-function-result";
export declare class AbletonCommandBus {
    port: number;
    private sendSocket;
    private receiveSocket;
    private commandTimeoutInMs;
    promises: {
        [key: string]: (abletonResult: any) => void;
    };
    constructor(sendingPort: number, receivingPort: number, commandTimeoutInMs?: number);
    setProperty(path: string, propertyName: string, propertValue: any): Promise<SetPropertyResult>;
    getProperty(path: string, propertyName: string): Promise<GetPropertyResult>;
    getCount(path: string, propertyName: string): Promise<GetCountResult>;
    callFunction(path: string, functionName: string, functionArgs?: any[]): Promise<CallFunctionResult>;
    multiCall(path: string, functions: CallFunctionCommand[]): Promise<CallFunctionResult>;
    private sendCommand<TResult>(command, timeoutInMs?);
    receiveMessage: (message: Buffer, other: any) => void;
}
export declare let Ableton: AbletonCommandBus;
