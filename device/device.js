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
        case "Get":
            getProperty(command);
            break;
        case "Count":
            getCount(command);
            break;
        case "Call":
            callFunction(command);
            break;
        case "MultiCall":
            multiCallFunction(command);
            break;
        case "LiveApiProperty":
            liveApiProperty(command);
            break;
    }
}
function setProperty(command) {
    var api = new LiveAPI(command.path);
    api.set(command.property, command.value);
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType
    }));
}
function getProperty(command) {
    var api = new LiveAPI(command.path);
    var value = api.get(command.property);
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType,
        propertyValue: value
    }));
}
function getCount(command) {
    var api = new LiveAPI(command.path);
    var count = api.getcount(command.property);
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType,
        count: count
    }));
}
function callFunction(command) {
    var api = new LiveAPI(command.path);
    var args = [command.functionName];
    args = args.concat(command.functionArgs);
    var result = api.call.apply(api, args);
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType,
        returnValue: result
    }));
}
function multiCallFunction(command) {
    log(command.path);
    var api = new LiveAPI(command.path);
    var result;
    for (var i = 0; i < command.functions.length; i++) {
        var func = command.functions[i];
        log(func);
        var args = [func.functionName];
        log(args);
        args = args.concat(func.functionArgs);
        result = api.call.apply(api, args);
    }
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType,
        returnValue: result
    }));
}
function liveApiProperty(command) {
    var api = new LiveAPI(command.path);
    var value = api[command.property];
    outlet(0, RESPONSE_ADDRESS, JSON.stringify({
        ok: true,
        id: command.id,
        commandType: command.commandType,
        propertyValue: value
    }));
}
