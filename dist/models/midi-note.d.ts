export declare class MidiNote {
    pitch: number;
    time: number;
    duration: number;
    velocity: number;
    muted: boolean;
    constructor(pitch: number, time: number, duration: number, velocity?: number, muted?: boolean);
    toNoteArgumentFormat(): any[];
}
