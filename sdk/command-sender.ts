import { AbletonCommand } from "./ableton-command";
import * as udp from "dgram";

var osc = require("osc-min");

export class CommandSender {
    port: number;

    private socket: udp.Socket;

    constructor(port: number) {
        this.port = port;
        this.socket = udp.createSocket("udp4");
    }

    sendCommand(command: AbletonCommand) {
        var buffer = command.toBuffer();
        this.socket.send(buffer, 0, buffer.length, this.port, "localhost");
    }
}