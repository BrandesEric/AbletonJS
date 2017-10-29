import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";
export declare class GetPropertyResult implements AbletonResult {
    id: string;
    commandType: CommandType;
    propertyValue: any;
    constructor(id: string, propertyValue: any);
}
