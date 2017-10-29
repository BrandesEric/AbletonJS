/// <reference types="node" />
import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";
export declare class SetPropertyCommand implements AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    property: string;
    value: any;
    constructor(path: string, propertyName: string, value: any);
    toBuffer(): Buffer;
}
