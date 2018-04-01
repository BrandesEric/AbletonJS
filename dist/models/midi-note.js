"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MidiNote {
    constructor(pitch, time, duration, velocity = 127, muted = false) {
        this.pitch = pitch;
        this.time = time;
        this.duration = duration;
        this.velocity = velocity;
        this.muted = muted;
    }
    toNoteArgumentFormat() {
        return [
            this.pitch,
            '' + this.time.toFixed(2),
            '' + this.duration.toFixed(2),
            this.velocity,
            this.muted ? 1 : 0
        ];
    }
}
exports.MidiNote = MidiNote;
