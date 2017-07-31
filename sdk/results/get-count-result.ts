import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";

export class GetCountResult implements AbletonResult {
    id: string;
    commandType = CommandType.Count;
    count: number;
    constructor(id: string, count: number) {
        this.id = id;
        this.count = count;
    }
}