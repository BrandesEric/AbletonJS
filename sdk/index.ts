import * as udp from "dgram";
import { AbletonCommand, CommandType } from "./commands/ableton-command";
import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
var port = 9000;

console.log("here i am");


function setBpm(bpm: number) {
    var command = new SetPropertyCommand("live_set", "tempo", bpm);
    Command.sendCommand(command);
}

setInterval(() =>setBpm(180), 2000);


