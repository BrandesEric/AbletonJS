import * as uuid from "uuid";
var osc = require("osc-min");

import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";

export class GetPropertyCommand implements AbletonCommand {
    
    path: string;
    
    id: string;

    commandType: CommandType = CommandType.Get;

    property: string = "";

    constructor(path: string, propertyName: string) {
        this.id = uuid.v4();
        this.path = path;
        this.property = propertyName;
    }

    toBuffer(): Buffer {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        })
    }

}