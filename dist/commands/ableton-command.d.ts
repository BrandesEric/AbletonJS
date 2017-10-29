/// <reference types="node" />
import { CommandType } from "./command-type";
export interface AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    toBuffer(): Buffer;
}
