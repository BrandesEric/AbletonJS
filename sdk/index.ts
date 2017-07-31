import * as udp from "dgram";
import { AbletonCommand } from "./commands/ableton-command";
import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
import { AbletonResult } from "./results/ableton-result";
import { SetPropertyResult } from "./results/set-property-result";
import * as API from "./api";
var port = 9000;

console.log("here i am");

var i = 120;

setInterval(async () => {
    await API.setBpm(i++);
    var result = await API.getBpm();
    console.log(result, i);
    var trackCount = await API.getTracks();
    console.log(trackCount);

    console.log(await API.createMiditrack("eric is the best"));
    
}, 2000);


