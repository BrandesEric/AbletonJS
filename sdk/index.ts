// https://docs.cycling74.com/max7/vignettes/jsliveapi
// https://docs.cycling74.com/max7/vignettes/live_object_model
// https://docs.cycling74.com/max7/vignettes/jsglobal
import * as API from "./api";
import { Track } from "./models/track";
import { MidiClip } from "./models/midi-clip";
import { Note } from "./models/note";

async function init() {
    var tracks = await API.getTracks();
    var trackIndex = tracks.findIndex(x => x.name === "Ableton JS Drums");
    var track: Track;
    if(trackIndex >= 0) {
        track = tracks[trackIndex];
    }
    else {
        track = await API.createMidiTrack("Ableton JS Drums");
    }

    var clip = new MidiClip();
    clip.lengthInBeats = 8;
    clip.notes = [];
    clip.notes.push(new Note(60, 0, 1))
    clip.notes.push(new Note(61, 1, 1))
    clip.notes.push(new Note(62, 2, 1))
    clip.notes.push(new Note(63, 3, 1))
    
    await API.insertMidiClip(track, clip);
    
    


}

init();

