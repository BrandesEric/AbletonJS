
export interface AbletonCommand {
    path: string;
    id: string;
    commandType: CommandType;
    
    toBuffer(): Buffer;
}

export enum CommandType {
    Unknown = "Unknown",
    Set = "Set",
    Get = "Get",
    Count = "Count",
    Goto = "Goto",
    Call = "Call"
}