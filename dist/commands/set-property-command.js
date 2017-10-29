"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
var osc = require("osc-min");
const command_type_1 = require("./command-type");
class SetPropertyCommand {
    constructor(path, propertyName, value) {
        this.commandType = command_type_1.CommandType.Set;
        this.property = "";
        this.id = uuid.v4();
        this.path = path;
        this.property = propertyName;
        this.value = value;
    }
    toBuffer() {
        return osc.toBuffer({
            address: 'ableton-js',
            args: JSON.stringify(this)
        });
    }
}
exports.SetPropertyCommand = SetPropertyCommand;
