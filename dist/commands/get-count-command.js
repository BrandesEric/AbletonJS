"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
var osc = require("osc-min");
const command_type_1 = require("./command-type");
class GetCountCommand {
    constructor(path, property) {
        this.commandType = command_type_1.CommandType.Count;
        this.id = uuid.v4();
        this.path = path;
        this.property = property;
    }
    toBuffer() {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        });
    }
}
exports.GetCountCommand = GetCountCommand;
