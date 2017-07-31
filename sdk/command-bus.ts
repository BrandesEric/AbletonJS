import * as udp from "dgram";
import { AbletonCommand } from "./commands/ableton-command";
import { CommandType } from "./commands/command-type";
import { AbletonResult } from "./results/ableton-result";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetCountResult } from "./results/get-count-result";

var osc = require("osc-min");
const RESPONSE_ADDRESS = "ableton-js-response";

class CommandBus {
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

    sendCommand<TResult extends AbletonResult>(command: AbletonCommand): Promise<TResult> {
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
            case CommandType.Set:
            default:
                result = new SetPropertyResult(response.id);
                break;
        }
        
        this.promises[response.id](result);
        delete this.promises[response.id];
    }
}

var sender = new CommandBus(9000, 9001);

export let Command = sender;
