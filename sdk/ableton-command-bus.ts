import * as udp from "dgram";
import { AbletonCommand } from "./commands/ableton-command";
import { CommandType } from "./commands/command-type";
import { AbletonResult } from "./results/ableton-result";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetCountResult } from "./results/get-count-result";
import { SetPropertyCommand } from "./commands/set-property-command";
import { GetPropertyCommand } from "./commands/get-property-command";
import { GetCountCommand } from "./commands/get-count-command";
import { CallFunctionCommand } from "./commands/call-function-command";
import { CallFunctionResult } from "./results/call-function-result";
import { MultiCallCommand } from "./commands/multi-call-command";

var osc = require("osc-min");
const RESPONSE_ADDRESS = "ableton-js-response";

class AbletonCommandBus {
    port: number;

    private sendSocket: udp.Socket;

    private receiveSocket: udp.Socket;

    promises: { [key: string]: (abletonResult: any) => void } = {}

    constructor(sendingPort: number, receivingPort: number) {
        this.port = sendingPort;
        this.sendSocket = udp.createSocket("udp4");
        this.receiveSocket = udp.createSocket('udp4');
        this.receiveSocket.bind(receivingPort);
        this.receiveSocket.on("message", this.receiveMessage);       
    }

    setProperty(path: string, propertyName: string, propertValue: any): Promise<SetPropertyResult> {
        var command = new SetPropertyCommand(path, propertyName, propertValue);
        return this.sendCommand<SetPropertyResult>(command);
    }

    getProperty(path: string, propertyName: string): Promise<GetPropertyResult> {
        var command = new GetPropertyCommand(path, propertyName);
        return this.sendCommand<GetPropertyResult>(command);
    }

    getCount(path: string, propertyName: string): Promise<GetCountResult> {
        var command = new GetCountCommand(path, propertyName);
        return this.sendCommand<GetCountResult>(command);
    }

    callFunction(path: string, functionName: string, functionArgs: any[] = []): Promise<CallFunctionResult> {
         var command = new CallFunctionCommand(path, functionName, functionArgs);
        return this.sendCommand<CallFunctionResult>(command);
    }

    multiCall(path: string, functions: CallFunctionCommand[]): Promise<CallFunctionResult> {
        var command = new MultiCallCommand(path, functions);
        return this.sendCommand<CallFunctionResult>(command);
    }

    private sendCommand<TResult extends AbletonResult>(command: AbletonCommand): Promise<TResult> {
        return new Promise<TResult>(resolve => {                            
            var buffer = command.toBuffer();
            this.promises[command.id] = resolve;
            this.sendSocket.send(buffer, 0, buffer.length, this.port, "localhost");    
        });
    }

    receiveMessage = (message: Buffer, other: any) => {
        var oscMessage = osc.fromBuffer(message);
        if(oscMessage.address != RESPONSE_ADDRESS){ return; }

        var response = JSON.parse(oscMessage.args[0].value);
        var commandType = <CommandType>CommandType[response.commandType];
        var result: AbletonResult;
        switch(commandType) {
            case CommandType.Get:
                result = new GetPropertyResult(response.id, response.propertyValue);
                break;
            case CommandType.Count:
                result = new GetCountResult(response.id, response.count);
                break;
            case CommandType.Call:
            case CommandType.MultiCall:
                result = new CallFunctionResult(response.id, response.returnValue);
                break;
            case CommandType.Set:
            default:
                result = new SetPropertyResult(response.id);
                break;
        }
        
        this.promises[response.id](result);
        delete this.promises[response.id];
    }
}

var sender = new AbletonCommandBus(9000, 9001);

export let Ableton = sender;
