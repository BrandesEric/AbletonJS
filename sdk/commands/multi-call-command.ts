import * as uuid from "uuid";
var osc = require("osc-min");

import { AbletonCommand } from "./ableton-command";
import { CommandType } from "./command-type";
import { CallFunctionCommand } from "./call-function-command";

export class MultiCallCommand implements AbletonCommand {
    
    path: string;
    
    id: string;

    commandType: CommandType = CommandType.MultiCall;

    functions: CallFunctionCommand[] = [];

    constructor(path: string, functions: CallFunctionCommand[]) {
        this.id = uuid.v4();
        this.path = path;
        this.functions = functions;
    }

    toBuffer(): Buffer {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        })
    }

}