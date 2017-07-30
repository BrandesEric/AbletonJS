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
autowatch = 1;
var RESPONSE_ADDRESS = "ableton-js-response";
function processMessage(path, payload) {
    if (path !== "ableton-js") {
        post("Bailing out since we found a non-ableton-js message");
        return;
    }
    var command = JSON.parse(payload);
    log(command.commandType);
    switch (command.commandType) {
        case "Set":
            setProperty(command);
            break;
    }
}
function setProperty(command) {
    log("setting property");
    var api = new LiveAPI(command.path);
    api.set(command.property, command.value);
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType
    }));
}
