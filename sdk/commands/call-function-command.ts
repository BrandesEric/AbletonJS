import * as uuid from "uuid";
var osc = require("osc-min");

import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";

export class CallFunctionCommand implements AbletonCommand {
    
    path: string;
    
    id: string;

    commandType: CommandType = CommandType.Call;

    functionName: string = "";

    functionArgs: any[];

    constructor(path: string, functionName: string, functionArgs: any[]) {
        this.id = uuid.v4();
        this.path = path;
        this.functionName = functionName;
        this.functionArgs = functionArgs;
    }

    toBuffer(): Buffer {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        })
    }

}