export class Note {
    pitch: number; // the MIDI note of the number, C3 is 60
    time: number; // is the note start time in beats of absolute clip time
    duration: number; // the note length in beats
    velocity: number; // the note velocity, 1 to 127
    muted: boolean;

    constructor (pitch: number, time: number, duration: number, velocity = 127, muted = false) {
        this.pitch = pitch;
        this.time = time;
        this.duration = duration;
        this.velocity = velocity;
        this.muted = muted;
    }

    toNoteArgumentFormat(): any[] {
        return [
            this.pitch,
            '' + this.time,
            '' + this.duration,
            this.velocity,
            this.muted ? 1 : 0
        ]

    }
}