export class Track {
    path: string;
    name: string;
    isMidi: boolean;
    isAudio: boolean;

    constructor (path: string, name: string, isMidi: boolean) {
        this.path = path;
        this.name = name;
        this.isMidi = isMidi;
        this.isAudio = !this.isMidi;
    }
}