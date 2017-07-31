import * as uuid from "uuid";
var osc = require("osc-min");

import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";

export class GetCountCommand implements AbletonCommand {
    
    path: string;
    
    id: string;

    commandType: CommandType = CommandType.Count;

    property: string;

    constructor(path: string, property: string) {
        this.id = uuid.v4();
        this.path = path;
        this.property = property;
    }

    toBuffer(): Buffer {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        })
    }

}