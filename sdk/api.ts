import { SetPropertyCommand } from "./commands/set-property-command";
import { SetPropertyResult } from "./results/set-property-result";
import { GetPropertyResult } from "./results/get-property-result";
import { GetPropertyCommand } from "./commands/get-property-command";
import { GetCountCommand } from "./commands/get-count-command";
import { GetCountResult } from "./results/get-count-result";
import { MidiTrack } from "./models/midi-track";
import { Ableton } from "./ableton-command-bus";
import { MidiClip } from "./models/midi-clip";
import { CallFunctionCommand } from "./commands/call-function-command";
import { MidiNote } from "./models/midi-note";


export async function getTempo(): Promise<number> {
    var result = await Ableton.getProperty("live_set", "tempo");

    return result.propertyValue[0];
}

export async function setTempo(bpm: number): Promise<void> {
    await Ableton.setProperty("live_set", "tempo", bpm);
    
    return;
}

export async function getTracks(): Promise<MidiTrack[]> {
    var trackCount = await Ableton.getCount("live_set", "tracks");
    var tracks: MidiTrack[] = [];
    for(var i = 0; i < trackCount.count; i++) {
        var track = await getTrackByIndex(i);
        tracks.push(track);
    }
    return tracks;
}

export async function getTrackByName(trackName: string): Promise<MidiTrack|undefined> {
    var tracks = await getTracks();
    return tracks.find(x => new RegExp(trackName, "i").test(x.name));
}

export async function createMidiTrack(trackName: string): Promise<MidiTrack> {
    var trackCount = (await getTracks()).length;
    var result = await Ableton.callFunction("live_set", "create_midi_track", [trackCount]);

    return setTrackName(trackCount, trackName);
}

export async function createMidiTrackIfNotExists(trackName: string): Promise<MidiTrack> {
    var tracks = await getTracks();
    var indexOf = tracks.findIndex(x => x.name == trackName);
    if(indexOf >= 0) {
        return tracks[indexOf];
    }
    else {
        return createMidiTrack(trackName);
    }
}

export async function getTrackByIndex(trackIndex: number): Promise<MidiTrack> {
        var trackPath = `live_set tracks ${trackIndex}`;
        var trackName = (await Ableton.getProperty(trackPath, "name")).propertyValue[0];
        var isMidi = !!(await Ableton.getProperty(trackPath, "has_midi_input")).propertyValue[0];
        var track = new MidiTrack(trackPath, trackName, isMidi);

        return track;
}

export async function setTrackName(trackIndex: number, trackName: string): Promise<MidiTrack>  {
    var trackPath = `live_set tracks ${trackIndex}`;
    await Ableton.setProperty(trackPath, "name", trackName);

    return getTrackByIndex(trackIndex);
}

export async function getOpenClipSlotIndex(track: MidiTrack): Promise<number> {
    var maxClipIndex = (await Ableton.getCount(track.path, "clip_slots")).count;
    for(var i = 0; i < maxClipIndex; i++){
        var hasClip = (await Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
        if(!hasClip) {
            return i;
        }
    }

    await Ableton.callFunction("live_set", "create_scene", [-1]);

    return i;
}

export async function insertMidiClip(track: MidiTrack, clip: MidiClip): Promise<MidiClip> {
    clip = await createClip(track, clip);
    var functions = [
        new CallFunctionCommand(clip.path, "set_notes"),
        new CallFunctionCommand(clip.path, "notes", [clip.notes.length]) 
    ];
    for(var i = 0; i < clip.notes.length; i++) {
        var note = clip.notes[i];
        functions.push(new CallFunctionCommand(clip.path, "note", note.toNoteArgumentFormat()))
    }
    functions.push(new CallFunctionCommand(clip.path, "done"));
    await Ableton.multiCall(clip.path, functions);
    return clip;
}

export async function createClip(track: MidiTrack, clip: MidiClip): Promise<MidiClip> {
    var clipSlotIndex = await getOpenClipSlotIndex(track);
    var clipSlotPath = `${track.path} clip_slots ${clipSlotIndex}`
    clip.path = `${clipSlotPath} clip`;
    await Ableton.callFunction(clipSlotPath, "create_clip", [''+clip.lengthInBeats]);
    if(clip.name){
        await Ableton.setProperty(clip.path, "name", clip.name);
    }

    return clip;
}

export async function deleteAllMidiClips(track: MidiTrack): Promise<void> {
    var maxClipIndex = (await Ableton.getCount(track.path, "clip_slots")).count;
    for(var i = 0; i < maxClipIndex; i++){
        var hasClip = (await Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
        if(hasClip) {
           await Ableton.callFunction(`${track.path} clip_slots ${i}`, "delete_clip");
        }
    }
}

export async function getMidiClips(track: MidiTrack): Promise<MidiClip[]> {
    var clips: MidiClip[] = [];
    var maxClipIndex = (await Ableton.getCount(track.path, "clip_slots")).count;
    for(var i = 0; i < maxClipIndex; i++){
        var hasClip = (await Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
        if(hasClip) {
            var path = `${track.path} clip_slots ${i} clip`;
            var lengthInBeats = (await Ableton.getProperty(path, "length")).propertyValue[0];
            var name = (await Ableton.getProperty(path, "name")).propertyValue[0];
            var clip = new MidiClip();
            clip.path = path;
            clip.name = name;
            clip.lengthInBeats = lengthInBeats;
            clips.push(clip);
        }
    }

    return clips;
}

export async function getMidiClipNotes(clip: MidiClip): Promise<MidiNote[]> {
   var result = (await Ableton.callFunction(clip.path, "get_notes", [0, 0, clip.lengthInBeats, 128])).returnValue as any[];
   var i = 0;
   var notes: MidiNote[] = [];
   while(i < result.length) {
       var val = result[i];
       if(val === "note"){
           var pitch = result[i+1];
           var time = result[i+2];
           var duration = result[i+3];
           var velocity = result[i+4];
           var muted = !!result[i+5];
           var note = new MidiNote(pitch, time, duration, velocity, muted)
           notes.push(note);
           i += 6;
       }
       else {
           i++;
       }
   }
   return notes;
}