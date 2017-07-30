import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";

export class GetPropertyResult implements AbletonResult {
    id: string;
    commandType = CommandType.Get;
    propertyValue: any;
    constructor(id: string, propertyValue: any) {
        this.id = id;
        this.propertyValue = propertyValue;
    }
}