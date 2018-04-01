import { MidiNote } from "./midi-note";

export class MidiClip {
    path: string = "";
    lengthInBeats: number = 0;
    notes: MidiNote[] = [];
    name: string = "";
}