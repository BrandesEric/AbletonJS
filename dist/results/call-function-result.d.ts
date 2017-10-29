import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";
export declare class CallFunctionResult implements AbletonResult {
    id: string;
    commandType: CommandType;
    returnValue: any;
    constructor(id: string, returnValue: any);
}
