"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_type_1 = require("../commands/command-type");
class SetPropertyResult {
    constructor(id) {
        this.commandType = command_type_1.CommandType.Set;
        this.id = id;
    }
}
exports.SetPropertyResult = SetPropertyResult;
