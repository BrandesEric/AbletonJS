import * as uuid from "uuid";
var osc = require("osc-min");

import { AbletonCommand, CommandType } from "./ableton-command";

export class SetPropertyCommand implements AbletonCommand {
    
    path: string;
    
    id: string;

    commandType: CommandType = CommandType.Set;

    property: string = "";

    value: any;

    constructor(path: string, propertyName: string, value: any) {
        this.id = uuid.v4();
        this.path = path;
        this.property = propertyName;
        this.value = value;
    }

    toBuffer(): Buffer {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify({
                path: this.path,
                id: this.id,
                action: <string>this.commandType,
                property: this.property,
                value: this.value
            })
        })
    }

}