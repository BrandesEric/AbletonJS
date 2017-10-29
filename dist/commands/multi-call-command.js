"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
var osc = require("osc-min");
const command_type_1 = require("./command-type");
class MultiCallCommand {
    constructor(path, functions) {
        this.commandType = command_type_1.CommandType.MultiCall;
        this.functions = [];
        this.id = uuid.v4();
        this.path = path;
        this.functions = functions;
    }
    toBuffer() {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        });
    }
}
exports.MultiCallCommand = MultiCallCommand;
