"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const udp = require("dgram");
const command_type_1 = require("./commands/command-type");
const set_property_result_1 = require("./results/set-property-result");
const get_property_result_1 = require("./results/get-property-result");
const get_count_result_1 = require("./results/get-count-result");
const set_property_command_1 = require("./commands/set-property-command");
const get_property_command_1 = require("./commands/get-property-command");
const get_count_command_1 = require("./commands/get-count-command");
const call_function_command_1 = require("./commands/call-function-command");
const call_function_result_1 = require("./results/call-function-result");
const multi_call_command_1 = require("./commands/multi-call-command");
var osc = require("osc-min");
const RESPONSE_ADDRESS = "ableton-js-response";
class AbletonCommandBus {
    constructor(sendingPort, receivingPort) {
        this.promises = {};
        this.receiveMessage = (message, other) => {
            var oscMessage = osc.fromBuffer(message);
            if (oscMessage.address != RESPONSE_ADDRESS) {
                return;
            }
            var response = JSON.parse(oscMessage.args[0].value);
            var commandType = command_type_1.CommandType[response.commandType];
            var result;
            switch (commandType) {
                case command_type_1.CommandType.Get:
                    result = new get_property_result_1.GetPropertyResult(response.id, response.propertyValue);
                    break;
                case command_type_1.CommandType.Count:
                    result = new get_count_result_1.GetCountResult(response.id, response.count);
                    break;
                case command_type_1.CommandType.Call:
                case command_type_1.CommandType.MultiCall:
                    result = new call_function_result_1.CallFunctionResult(response.id, response.returnValue);
                    break;
                case command_type_1.CommandType.Set:
                default:
                    result = new set_property_result_1.SetPropertyResult(response.id);
                    break;
            }
            this.promises[response.id](result);
            delete this.promises[response.id];
        };
        this.port = sendingPort;
        this.sendSocket = udp.createSocket("udp4");
        this.receiveSocket = udp.createSocket('udp4');
        this.receiveSocket.bind(receivingPort);
        this.receiveSocket.on("message", this.receiveMessage);
    }
    setProperty(path, propertyName, propertValue) {
        var command = new set_property_command_1.SetPropertyCommand(path, propertyName, propertValue);
        return this.sendCommand(command);
    }
    getProperty(path, propertyName) {
        var command = new get_property_command_1.GetPropertyCommand(path, propertyName);
        return this.sendCommand(command);
    }
    getCount(path, propertyName) {
        var command = new get_count_command_1.GetCountCommand(path, propertyName);
        return this.sendCommand(command);
    }
    callFunction(path, functionName, functionArgs = []) {
        var command = new call_function_command_1.CallFunctionCommand(path, functionName, functionArgs);
        return this.sendCommand(command);
    }
    multiCall(path, functions) {
        var command = new multi_call_command_1.MultiCallCommand(path, functions);
        return this.sendCommand(command);
    }
    sendCommand(command) {
        return new Promise(resolve => {
            var buffer = command.toBuffer();
            this.promises[command.id] = resolve;
            this.sendSocket.send(buffer, 0, buffer.length, this.port, "localhost");
        });
    }
}
exports.AbletonCommandBus = AbletonCommandBus;
var sender = new AbletonCommandBus(9000, 9001);
exports.Ableton = sender;
