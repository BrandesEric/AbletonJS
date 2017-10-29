"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// https://docs.cycling74.com/max7/vignettes/jsliveapi
// https://docs.cycling74.com/max7/vignettes/live_object_model
// https://docs.cycling74.com/max7/vignettes/jsglobal
const API = require("./api");
const midi_clip_1 = require("./models/midi-clip");
const note_1 = require("./models/note");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        var tracks = yield API.getTracks();
        var trackIndex = tracks.findIndex(x => x.name === "Ableton JS Drums");
        var track;
        if (trackIndex >= 0) {
            track = tracks[trackIndex];
        }
        else {
            track = yield API.createMidiTrack("Ableton JS Drums");
        }
        var clip = new midi_clip_1.MidiClip();
        clip.lengthInBeats = 8;
        clip.notes = [];
        clip.notes.push(new note_1.Note(60, 0, 1));
        clip.notes.push(new note_1.Note(61, 1.1, 0.5));
        clip.notes.push(new note_1.Note(62, 2, 1));
        clip.notes.push(new note_1.Note(63, 3, 1));
        yield API.insertMidiClip(track, clip);
    });
}
//init();
__export(require("./api"));
__export(require("./models/track"));
__export(require("./models/midi-clip"));
__export(require("./models/note"));
