import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetPropertyCommand } from "./commands/get-property-command";


export async function getBpm(): Promise<number> {
    var command = new GetPropertyCommand("live_set", "tempo");
    var result = await Command.sendCommand(command) as GetPropertyResult;

    return Promise.resolve(result.propertyValue[0]);
}

export async function setBpm(bpm: number): Promise<void> {
    var command = new SetPropertyCommand("live_set", "tempo", bpm);
    await Command.sendCommand(command);
    
    return Promise.resolve();
}