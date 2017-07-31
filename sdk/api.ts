import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetPropertyCommand } from "./commands/get-property-command";
import { GetCountCommand } from "./commands/get-count-command";
import { GetCountResult } from "./results/get-count-result";
import { Track } from "./models/track";


export async function getBpm(): Promise<number> {
    var command = new GetPropertyCommand("live_set", "tempo");
    var result = await Command.sendCommand<GetPropertyResult>(command);

    return Promise.resolve(result.propertyValue[0]);
}

export async function setBpm(bpm: number): Promise<void> {
    var command = new SetPropertyCommand("live_set", "tempo", bpm);
    await Command.sendCommand<SetPropertyResult>(command);
    
    return Promise.resolve();
}

export async function getTracks(): Promise<Track[]> {
    var trackCountCommand = new GetCountCommand("live_set", "tracks");
    var trackCount = await Command.sendCommand<GetCountResult>(trackCountCommand);
    var tracks: Track[] = [];
    for(var i = 0; i < trackCount.count; i++) {
        var trackPath = `live_set tracks ${i}`;
        var trackName = (await Command.sendCommand<GetPropertyResult>(new GetPropertyCommand(trackPath, "name"))).propertyValue[0];
        var isMidi = !!(await Command.sendCommand<GetPropertyResult>(new GetPropertyCommand(trackPath, "has_midi_input"))).propertyValue[0];
        var track = new Track(trackPath, trackName, isMidi);
        tracks.push(track);
    }
    return Promise.resolve(tracks);
}