import * as udp from "dgram";
import { AbletonCommand } from "./commands/ableton-command";
import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
var port = 9000;

console.log("here i am");

var i = 120;
function setBpm(bpm: number) {
    var command = new SetPropertyCommand("live_set", "tempo", bpm);
    Command.sendCommand(command);
}

setInterval(() =>setBpm(i++), 2000);


