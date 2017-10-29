/// <reference types="node" />
import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";
export declare class GetCountCommand implements AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    property: string;
    constructor(path: string, property: string);
    toBuffer(): Buffer;
}
