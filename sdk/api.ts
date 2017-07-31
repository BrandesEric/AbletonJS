import { SetPropertyCommand } from "./commands/set-property-command";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetPropertyCommand } from "./commands/get-property-command";
import { GetCountCommand } from "./commands/get-count-command";
import { GetCountResult } from "./results/get-count-result";
import { Track } from "./models/track";
import { Ableton } from "./ableton-command-bus";
import { MidiClip } from "./models/midi-clip";


export async function getBpm(): Promise<number> {
    var result = await Ableton.getProperty("live_set", "tempo");

    return result.propertyValue[0];
}

export async function setBpm(bpm: number): Promise<void> {
    await Ableton.setProperty("live_set", "tempo", bpm);
    
    return;
}

export async function getTracks(): Promise<Track[]> {
    var trackCount = await Ableton.getCount("live_set", "tracks");
    var tracks: Track[] = [];
    for(var i = 0; i < trackCount.count; i++) {
        var track = await getTrackByIndex(i);
        tracks.push(track);
    }
    return tracks;
}

export async function createMidiTrack(trackName: string): Promise<Track> {
    var trackCount = (await getTracks()).length;
    var result = await Ableton.callFunction("live_set", "create_midi_track", [trackCount]);

    return setTrackName(trackCount, trackName);
}

export async function getTrackByIndex(trackIndex: number): Promise<Track> {
        var trackPath = `live_set tracks ${trackIndex}`;
        var trackName = (await Ableton.getProperty(trackPath, "name")).propertyValue[0];
        var isMidi = !!(await Ableton.getProperty(trackPath, "has_midi_input")).propertyValue[0];
        var track = new Track(trackPath, trackName, isMidi);

        return track;
}

export async function setTrackName(trackIndex: number, trackName: string): Promise<Track>  {
    var trackPath = `live_set tracks ${trackIndex}`;
    await Ableton.setProperty(trackPath, "name", trackName);

    return getTrackByIndex(trackIndex);
}

export async function getOpenClipSlotIndex(track: Track): Promise<number> {
    var maxClipIndex = (await Ableton.getCount(track.path, "clip_slots")).count;
    for(var i = 0; i < maxClipIndex; i++){
        var hasClip = (await Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
        console.log(hasClip);

        if(!hasClip) {
            return i;
        }
    }

    return -1;
}

export async function insertMidiClip(track: Track, clip: MidiClip): Promise<MidiClip> {
    var clipSlotIndex = await getOpenClipSlotIndex(track);
    var clipSlotPath = `${track.path} clip_slots ${clipSlotIndex}`
    await Ableton.callFunction(clipSlotPath, "create_clip", [''+clip.lengthInBeats]);
    clip.path = `${clipSlotPath} clip`;
    await Ableton.callFunction(clip.path, "set_notes");
    await Ableton.callFunction(clip.path, "notes", [clip.notes.length]);
    for(var i = 0; i < clip.notes.length; i++) {
        var note = clip.notes[i];
        await Ableton.callFunction(clip.path, "note", note.toNoteArgumentFormat());
    }
    await Ableton.callFunction(clip.path, "done");

    return clip;
}