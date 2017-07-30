import * as udp from "dgram";
import { AbletonCommand } from "./commands/ableton-command";
import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
import { AbletonResult } from "./results/ableton-result";
var port = 9000;

console.log("here i am");

var i = 120;
function setBpm(bpm: number): Promise<AbletonResult> {
    var command = new SetPropertyCommand("live_set", "tempo", bpm);
    return Command.sendCommand(command);
}

setInterval(async () => {
    var result = await setBpm(i++);
    console.log(result);
}, 2000);


