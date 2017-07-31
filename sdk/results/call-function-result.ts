import { CommandType } from "../commands/command-type";
import { AbletonResult } from "./ableton-result";

export class CallFunctionResult implements AbletonResult {
    id: string;
    commandType = CommandType.Call;
    returnValue: any;

    constructor(id: string, returnValue: any) {
        this.id = id;
        this.returnValue = returnValue;
    }
}