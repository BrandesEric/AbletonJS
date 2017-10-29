"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_type_1 = require("../commands/command-type");
class CallFunctionResult {
    constructor(id, returnValue) {
        this.commandType = command_type_1.CommandType.Call;
        this.id = id;
        this.returnValue = returnValue;
    }
}
exports.CallFunctionResult = CallFunctionResult;
