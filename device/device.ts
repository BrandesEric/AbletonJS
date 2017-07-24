
function processMessage(path, payload) {
    var command = new LiveAPICommand(payload);
    log(command);
    switch(command.action){
        case CommandType.Set:
            setProperty(command);
            break;
    }
}

function setProperty(command: LiveAPICommand){
    log("setting property");
    var api = new LiveAPI(command.path);
    api.set(command.property, command.value);
}