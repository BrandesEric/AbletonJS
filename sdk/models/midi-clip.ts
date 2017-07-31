import { Note } from "./note";

export class MidiClip {
    path: string;
    lengthInBeats: number;
    notes: Note[] = [];
}