autowatch = 1;
function log() {
    var any = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        any[_i] = arguments[_i];
    }
    for (var i = 0, len = arguments.length; i < len; i++) {
        var message = arguments[i];
        if (message && message.toString) {
            var s = message.toString();
            if (s.indexOf("[object ") >= 0) {
                s = JSON.stringify(message);
            }
            post(s);
        }
        else if (message === null) {
            post("<null>");
        }
        else {
            post(message);
        }
    }
    post("\n");
}
var LiveAPICommand = (function () {
    function LiveAPICommand(rawPayload) {
        this.path = "";
        this.action = CommandType.Unknown;
        this.args = [];
        this.property = "";
        this.value = "";
        this.id = "";
        var parsedPayload = JSON.parse(rawPayload);
        this.id = parsedPayload.id;
        this.property = parsedPayload.property;
        this.value = parsedPayload.value;
        this.path = parsedPayload.path;
        this.action = CommandType[parsedPayload.action];
        this.args = parsedPayload.args;
    }
    return LiveAPICommand;
}());
var CommandType;
(function (CommandType) {
    CommandType["Unknown"] = "Unknown";
    CommandType["Set"] = "Set";
    CommandType["Get"] = "Get";
    CommandType["Count"] = "Count";
    CommandType["Goto"] = "Goto";
    CommandType["Call"] = "Call";
})(CommandType || (CommandType = {}));
function processMessage(path, payload) {
    var command = new LiveAPICommand(payload);
    log(command);
    switch (command.action) {
        case CommandType.Set:
            setProperty(command);
            break;
    }
}
function setProperty(command) {
    log("setting property");
    var api = new LiveAPI(command.path);
    api.set(command.property, command.value);
}
