/// <reference types="node" />
import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";
export declare class LiveApiPropertyCommand implements AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    property: string;
    constructor(path: string, propertyName: string);
    toBuffer(): Buffer;
}
