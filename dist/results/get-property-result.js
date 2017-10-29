"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_type_1 = require("../commands/command-type");
class GetPropertyResult {
    constructor(id, propertyValue) {
        this.commandType = command_type_1.CommandType.Get;
        this.id = id;
        this.propertyValue = propertyValue;
    }
}
exports.GetPropertyResult = GetPropertyResult;
