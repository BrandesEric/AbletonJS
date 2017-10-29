/// <reference types="node" />
import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";
export declare class CallFunctionCommand implements AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    functionName: string;
    functionArgs: any[];
    constructor(path: string, functionName: string, functionArgs?: any[]);
    toBuffer(): Buffer;
}
