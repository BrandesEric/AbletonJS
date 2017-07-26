import { CommandType } from "./commands/ableton-command";

export class AbletonResult {
    id: string;
    commandType: CommandType = CommandType.Unknown;
    value: any;

    constructor(commandType: CommandType, id: string, value: any = null) {
        this.commandType = commandType;
        this.id = id;
        this.value = value;
    }
}