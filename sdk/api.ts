import { SetPropertyCommand } from "./commands/set-property-command";
import { Command } from "./command-bus";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetPropertyCommand } from "./commands/get-property-command";
import { GetCountCommand } from "./commands/get-count-command";
import { GetCountResult } from "./results/get-count-result";
import { Track } from "./models/track";


export async function getBpm(): Promise<number> {
    var result = await Command.getProperty("live_set", "tempo");

    return Promise.resolve(result.propertyValue[0]);
}

export async function setBpm(bpm: number): Promise<void> {
    await Command.setProperty("live_set", "tempo", bpm);
    
    return Promise.resolve();
}

export async function getTracks(): Promise<Track[]> {
    var trackCount = await Command.getCount("live_set", "tracks");
    var tracks: Track[] = [];
    for(var i = 0; i < trackCount.count; i++) {
        var track = await getTrackByIndex(i);
        tracks.push(track);
    }
    return Promise.resolve(tracks);
}

export async function createMiditrack(trackName: string): Promise<Track> {
    var trackCount = (await getTracks()).length;
    var result = await Command.callFunction("live_set", "create_midi_track", [trackCount]);

    return setTrackName(trackCount, trackName);
}

export async function getTrackByIndex(trackIndex: number): Promise<Track> {
        var trackPath = `live_set tracks ${trackIndex}`;
        var trackName = (await Command.getProperty(trackPath, "name")).propertyValue[0];
        var isMidi = !!(await Command.getProperty(trackPath, "has_midi_input")).propertyValue[0];
        var track = new Track(trackPath, trackName, isMidi);

        return track;
}

export async function setTrackName(trackIndex: number, trackName: string): Promise<Track>  {
    var trackPath = `live_set tracks ${trackIndex}`;
    await Command.setProperty(trackPath, "name", trackName);

    return getTrackByIndex(trackIndex);
}