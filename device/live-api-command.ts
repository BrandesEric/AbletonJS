class LiveAPICommand {
    path: string = "";
    action: CommandType = CommandType.Unknown
    args: any[] = [];
    property: string = "";
    value: number | string = "";
    id: string = "";
    constructor(rawPayload) {
        var parsedPayload = JSON.parse(rawPayload);
        this.id = parsedPayload.id;
        this.property = parsedPayload.property;
        this.value = parsedPayload.value;
        this.path = parsedPayload.path;
        this.action = <CommandType>CommandType[parsedPayload.action];
        this.args = parsedPayload.args;
    }
}

enum CommandType {
    Unknown = "Unknown",
    Set = "Set",
    Get = "Get",
    Count = "Count",
    Goto = "Goto",
    Call = "Call"
}