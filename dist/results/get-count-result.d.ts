import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";
export declare class GetCountResult implements AbletonResult {
    id: string;
    commandType: CommandType;
    count: number;
    constructor(id: string, count: number);
}
