import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";

export class SetPropertyResult implements AbletonResult {
    id: string;
    commandType = CommandType.Set;
    constructor(id: string) {
        this.id = id;
    }
}