"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_type_1 = require("../commands/command-type");
class GetCountResult {
    constructor(id, count) {
        this.commandType = command_type_1.CommandType.Count;
        this.id = id;
        this.count = count;
    }
}
exports.GetCountResult = GetCountResult;
