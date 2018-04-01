// https://docs.cycling74.com/max7/vignettes/jsliveapi
// https://docs.cycling74.com/max7/vignettes/live_object_model
// https://docs.cycling74.com/max7/vignettes/jsglobal
import * as API from "./api";
import { MidiTrack } from "./models/midi-track";
import { MidiClip } from "./models/midi-clip";
import { MidiNote } from "./models/midi-note";

async function init() {
    var tracks = await API.getTracks();
    var trackIndex = tracks.findIndex(x => x.name === "Ableton JS Drums");
    var track: MidiTrack;
    if(trackIndex >= 0) {
        track = tracks[trackIndex];
    }
    else {
        track = await API.createMidiTrack("Ableton JS Drums");
    }

    var clip = new MidiClip();
    clip.lengthInBeats = 8;
    clip.notes = [];
    clip.notes.push(new MidiNote(60, 0, 1))
    clip.notes.push(new MidiNote(61, 1.1, 0.5))
    clip.notes.push(new MidiNote(62, 2, 1))
    clip.notes.push(new MidiNote(63, 3, 1))
    
    await API.insertMidiClip(track, clip);

}

//init();

async function doSomething(){
    var tracks = await API.getTracks();
    var track = tracks[1];
    var clips = await API.getMidiClips(track);
    var notes = await API.getMidiClipNotes(clips[0]);
    console.log(notes);
}
doSomething();

export * from "./api";
export * from "./models/midi-track";
export * from "./models/midi-clip";
export * from "./models/midi-note";