import * as uuid from "uuid";
var osc = require("osc-min");

export class AbletonCommand {
    path: string = "";
    id: string = "";
    action: CommandType = CommandType.Unknown
    property: string = "";
    value: number | string = "";
    args: any[] = [];

    constructor(){
        this.id = uuid.v4();
    }

    toBuffer(): Buffer {
        return osc.toBuffer({
            address: "ableton-js",
            args: JSON.stringify({
                path: this.path,
                id: this.id,
                action: <string>this.action,
                property: this.property,
                value: this.value,
                args: this.args
            })
        })
    }

    static makeSetter(path: string, property: string, value: string | number): AbletonCommand {
        var command = new AbletonCommand();
        command.action = CommandType.Set;
        command.property = property;
        command.path = path;
        command.value = value;

        return command;
    }
}

export enum CommandType {
    Unknown = "Unknown",
    Set = "Set",
    Get = "Get",
    Count = "Count",
    Goto = "Goto",
    Call = "Call"
}