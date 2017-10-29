import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";
export declare class SetPropertyResult implements AbletonResult {
    id: string;
    commandType: CommandType;
    constructor(id: string);
}
