
function processMessage(path, payload) {
    var commandTypeString = JSON.parse(payload);
    var commandType = CommandType[commandTypeString];
    log(commandType);
}

function setProperty(command: LiveAPICommand){
    log("setting property");
    var api = new LiveAPI(command.path);
    api.set(command.property, command.value);
}