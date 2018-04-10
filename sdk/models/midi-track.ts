export class MidiTrack {
    path: string;
    name: string;
    isMidi: boolean;
    isAudio: boolean;
    index: number;

    constructor (path: string, name: string, isMidi: boolean, index: number) {
        this.path = path;
        this.name = name;
        this.isMidi = isMidi;
        this.isAudio = !this.isMidi;
        this.index = index;
    }
}