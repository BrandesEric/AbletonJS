"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const midi_track_1 = require("./models/midi-track");
const ableton_command_bus_1 = require("./ableton-command-bus");
const midi_clip_1 = require("./models/midi-clip");
const call_function_command_1 = require("./commands/call-function-command");
const midi_note_1 = require("./models/midi-note");
function getTempo() {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield ableton_command_bus_1.Ableton.getProperty("live_set", "tempo");
        return result.propertyValue[0];
    });
}
exports.getTempo = getTempo;
function setTempo(bpm) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ableton_command_bus_1.Ableton.setProperty("live_set", "tempo", bpm);
        return;
    });
}
exports.setTempo = setTempo;
function getTracks() {
    return __awaiter(this, void 0, void 0, function* () {
        var trackCount = yield ableton_command_bus_1.Ableton.getCount("live_set", "tracks");
        var tracks = [];
        for (var i = 0; i < trackCount.count; i++) {
            var track = yield getTrackByIndex(i);
            tracks.push(track);
        }
        return tracks;
    });
}
exports.getTracks = getTracks;
function getTrackByName(trackName) {
    return __awaiter(this, void 0, void 0, function* () {
        var tracks = yield getTracks();
        return tracks.find(x => new RegExp(trackName, "i").test(x.name));
    });
}
exports.getTrackByName = getTrackByName;
function createMidiTrack(trackName) {
    return __awaiter(this, void 0, void 0, function* () {
        var trackCount = (yield getTracks()).length;
        var result = yield ableton_command_bus_1.Ableton.callFunction("live_set", "create_midi_track", [trackCount]);
        return setTrackName(trackCount, trackName);
    });
}
exports.createMidiTrack = createMidiTrack;
function createMidiTrackIfNotExists(trackName) {
    return __awaiter(this, void 0, void 0, function* () {
        var tracks = yield getTracks();
        var indexOf = tracks.findIndex(x => x.name == trackName);
        if (indexOf >= 0) {
            return tracks[indexOf];
        }
        else {
            return createMidiTrack(trackName);
        }
    });
}
exports.createMidiTrackIfNotExists = createMidiTrackIfNotExists;
function getTrackByIndex(trackIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        var trackPath = `live_set tracks ${trackIndex}`;
        var trackName = (yield ableton_command_bus_1.Ableton.getProperty(trackPath, "name")).propertyValue[0];
        var isMidi = !!(yield ableton_command_bus_1.Ableton.getProperty(trackPath, "has_midi_input")).propertyValue[0];
        var track = new midi_track_1.MidiTrack(trackPath, trackName, isMidi);
        return track;
    });
}
exports.getTrackByIndex = getTrackByIndex;
function setTrackName(trackIndex, trackName) {
    return __awaiter(this, void 0, void 0, function* () {
        var trackPath = `live_set tracks ${trackIndex}`;
        yield ableton_command_bus_1.Ableton.setProperty(trackPath, "name", trackName);
        return getTrackByIndex(trackIndex);
    });
}
exports.setTrackName = setTrackName;
function getOpenClipSlotIndex(track) {
    return __awaiter(this, void 0, void 0, function* () {
        var maxClipIndex = (yield ableton_command_bus_1.Ableton.getCount(track.path, "clip_slots")).count;
        for (var i = 0; i < maxClipIndex; i++) {
            var hasClip = (yield ableton_command_bus_1.Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
            if (!hasClip) {
                return i;
            }
        }
        yield ableton_command_bus_1.Ableton.callFunction("live_set", "create_scene", [-1]);
        return i;
    });
}
exports.getOpenClipSlotIndex = getOpenClipSlotIndex;
function insertMidiClip(track, clip) {
    return __awaiter(this, void 0, void 0, function* () {
        clip = yield createClip(track, clip);
        var functions = [
            new call_function_command_1.CallFunctionCommand(clip.path, "set_notes"),
            new call_function_command_1.CallFunctionCommand(clip.path, "notes", [clip.notes.length])
        ];
        for (var i = 0; i < clip.notes.length; i++) {
            var note = clip.notes[i];
            functions.push(new call_function_command_1.CallFunctionCommand(clip.path, "note", note.toNoteArgumentFormat()));
        }
        functions.push(new call_function_command_1.CallFunctionCommand(clip.path, "done"));
        yield ableton_command_bus_1.Ableton.multiCall(clip.path, functions);
        return clip;
    });
}
exports.insertMidiClip = insertMidiClip;
function createClip(track, clip) {
    return __awaiter(this, void 0, void 0, function* () {
        var clipSlotIndex = yield getOpenClipSlotIndex(track);
        var clipSlotPath = `${track.path} clip_slots ${clipSlotIndex}`;
        clip.path = `${clipSlotPath} clip`;
        yield ableton_command_bus_1.Ableton.callFunction(clipSlotPath, "create_clip", ['' + clip.lengthInBeats]);
        if (clip.name) {
            yield ableton_command_bus_1.Ableton.setProperty(clip.path, "name", clip.name);
        }
        return clip;
    });
}
exports.createClip = createClip;
function deleteAllMidiClips(track) {
    return __awaiter(this, void 0, void 0, function* () {
        var maxClipIndex = (yield ableton_command_bus_1.Ableton.getCount(track.path, "clip_slots")).count;
        for (var i = 0; i < maxClipIndex; i++) {
            var hasClip = (yield ableton_command_bus_1.Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
            if (hasClip) {
                yield ableton_command_bus_1.Ableton.callFunction(`${track.path} clip_slots ${i}`, "delete_clip");
            }
        }
    });
}
exports.deleteAllMidiClips = deleteAllMidiClips;
function getMidiClips(track) {
    return __awaiter(this, void 0, void 0, function* () {
        var clips = [];
        var maxClipIndex = (yield ableton_command_bus_1.Ableton.getCount(track.path, "clip_slots")).count;
        for (var i = 0; i < maxClipIndex; i++) {
            var hasClip = (yield ableton_command_bus_1.Ableton.getProperty(`${track.path} clip_slots ${i}`, "has_clip")).propertyValue[0];
            if (hasClip) {
                var clip = yield getMidiClip(track, i);
                clips.push(clip);
            }
        }
        return clips;
    });
}
exports.getMidiClips = getMidiClips;
function getMidiClip(track, clipSlotIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        var path = `${track.path} clip_slots ${clipSlotIndex} clip`;
        var lengthInBeats = (yield ableton_command_bus_1.Ableton.getProperty(path, "length")).propertyValue[0];
        var name = (yield ableton_command_bus_1.Ableton.getProperty(path, "name")).propertyValue[0];
        var clip = new midi_clip_1.MidiClip();
        clip.path = path;
        clip.name = name;
        clip.lengthInBeats = lengthInBeats;
        return clip;
    });
}
exports.getMidiClip = getMidiClip;
function getSelectedMidiClip() {
    return __awaiter(this, void 0, void 0, function* () {
        var id = (yield ableton_command_bus_1.Ableton.getProperty("live_set view", "highlighted_clip_slot")).propertyValue[1];
        var clipSlotPath = (yield ableton_command_bus_1.Ableton.getLiveApiProperty(`id ${id}`, "path")).propertyValue;
        clipSlotPath = clipSlotPath.replace(/\"/gi, ''); // clean out extra quotes from Ableton. 
        var pathParts = clipSlotPath.split(" ");
        var track = yield getTrackByIndex(pathParts[2]);
        return yield getMidiClip(track, pathParts[4]);
    });
}
exports.getSelectedMidiClip = getSelectedMidiClip;
function getMidiClipNotes(clip) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = (yield ableton_command_bus_1.Ableton.callFunction(clip.path, "get_notes", [0, 0, clip.lengthInBeats, 128])).returnValue;
        var i = 0;
        var notes = [];
        while (i < result.length) {
            var val = result[i];
            if (val === "note") {
                var pitch = result[i + 1];
                var time = result[i + 2];
                var duration = result[i + 3];
                var velocity = result[i + 4];
                var muted = !!result[i + 5];
                var note = new midi_note_1.MidiNote(pitch, time, duration, velocity, muted);
                notes.push(note);
                i += 6;
            }
            else {
                i++;
            }
        }
        return notes;
    });
}
exports.getMidiClipNotes = getMidiClipNotes;
