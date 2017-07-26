import * as udp from "dgram";
import { AbletonResult } from "./ableton-result";
import { AbletonCommand } from "./commands/ableton-command";

var osc = require("osc-min");

class CommandBus {
    port: number;

    private sendSocket: udp.Socket;

    private receiveSocket: udp.Socket;

    promises: { [key: string]: (abletonResult: AbletonResult) => void } = {}

    constructor(sendingPort: number, receivingPort: number) {
        this.port = sendingPort;
        this.sendSocket = udp.createSocket("udp4");
        this.receiveSocket = udp.createSocket('udp4');
        this.receiveSocket.bind(receivingPort);
        this.receiveSocket.on("message", this.receiveMessage);       
    }

    sendCommand(command: AbletonCommand): Promise<AbletonResult> {
        return new Promise((resolve) => {                            
            var buffer = command.toBuffer();
            this.promises[command.id] = resolve;
            this.sendSocket.send(buffer, 0, buffer.length, this.port, "localhost");    
        });
    }

    receiveMessage(message: Buffer, other: any) {
        console.log(message);
        console.log(other);
        var oscMessage = osc.fromBuffer(message);
    }
}

var sender = new CommandBus(9000, 9001);

export let Command = sender;
