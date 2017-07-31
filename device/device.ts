declare var autowatch: any;
declare var post: any;
declare var outlet: any;
declare var LiveAPI: any;
autowatch = 1;

var RESPONSE_ADDRESS = "ableton-js-response"

function processMessage(path, payload) { 
    if(path !== "ableton-js"){
        post("Bailing out since we found a non-ableton-js message")
        return;
    }

    var command = JSON.parse(payload);
    log(command.commandType);
    switch(command.commandType) {
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
    }
}

function setProperty(command){
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