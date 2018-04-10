"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MidiTrack {
    constructor(path, name, isMidi, index) {
        this.path = path;
        this.name = name;
        this.isMidi = isMidi;
        this.isAudio = !this.isMidi;
        this.index = index;
    }
}
exports.MidiTrack = MidiTrack;
