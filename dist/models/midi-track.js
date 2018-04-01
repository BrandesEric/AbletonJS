"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MidiTrack {
    constructor(path, name, isMidi) {
        this.path = path;
        this.name = name;
        this.isMidi = isMidi;
        this.isAudio = !this.isMidi;
    }
}
exports.MidiTrack = MidiTrack;
