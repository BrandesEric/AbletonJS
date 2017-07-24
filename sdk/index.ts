import * as udp from "dgram";
import { CommandSender } from "./command-sender";
import { AbletonCommand, CommandType } from "./ableton-command";
var port = 9000;

var sender = new CommandSender(port);


function setBpm(bpm: number) {
    var command = AbletonCommand.makeSetter("live_set", "tempo", bpm);
    sender.sendCommand(command);
}

setInterval(() =>setBpm(180), 2000);


