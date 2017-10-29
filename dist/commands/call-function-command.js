"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
var osc = require("osc-min");
const command_type_1 = require("./command-type");
class CallFunctionCommand {
    constructor(path, functionName, functionArgs = []) {
        this.commandType = command_type_1.CommandType.Call;
        this.functionName = "";
        this.id = uuid.v4();
        this.path = path;
        this.functionName = functionName;
        this.functionArgs = functionArgs;
    }
    toBuffer() {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        });
    }
}
exports.CallFunctionCommand = CallFunctionCommand;
