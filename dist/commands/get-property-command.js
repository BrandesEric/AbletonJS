"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
var osc = require("osc-min");
const command_type_1 = require("./command-type");
class GetPropertyCommand {
    constructor(path, propertyName) {
        this.commandType = command_type_1.CommandType.Get;
        this.property = "";
        this.id = uuid.v4();
        this.path = path;
        this.property = propertyName;
    }
    toBuffer() {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        });
    }
}
exports.GetPropertyCommand = GetPropertyCommand;
