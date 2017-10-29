/// <reference types="node" />
import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";
import { CallFunctionCommand } from "./call-function-command";
export declare class MultiCallCommand implements AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    functions: CallFunctionCommand[];
    constructor(path: string, functions: CallFunctionCommand[]);
    toBuffer(): Buffer;
}
