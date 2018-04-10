import { MidiTrack } from "./models/midi-track";
import { MidiClip } from "./models/midi-clip";
import { MidiNote } from "./models/midi-note";
export declare function getTempo(): Promise<number>;
export declare function setTempo(bpm: number): Promise<void>;
export declare function getTracks(): Promise<MidiTrack[]>;
export declare function getTrackByName(trackName: string): Promise<MidiTrack | undefined>;
export declare function createMidiTrack(trackName: string): Promise<MidiTrack>;
export declare function createMidiTrackIfNotExists(trackName: string): Promise<MidiTrack>;
export declare function getTrackByIndex(trackIndex: number): Promise<MidiTrack>;
export declare function setTrackName(trackIndex: number, trackName: string): Promise<MidiTrack>;
export declare function deleteTrackByName(trackName: string): Promise<any>;
export declare function getOpenClipSlotIndex(track: MidiTrack): Promise<number>;
export declare function insertMidiClip(track: MidiTrack, clip: MidiClip): Promise<MidiClip>;
export declare function createClip(track: MidiTrack, clip: MidiClip): Promise<MidiClip>;
export declare function deleteAllMidiClips(track: MidiTrack): Promise<void>;
export declare function getMidiClips(track: MidiTrack): Promise<MidiClip[]>;
export declare function getMidiClip(track: MidiTrack, clipSlotIndex: number): Promise<MidiClip>;
export declare function getSelectedMidiClip(): Promise<MidiClip>;
export declare function getMidiClipNotes(clip: MidiClip): Promise<MidiNote[]>;
