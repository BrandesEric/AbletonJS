declare var autowatch: any;
declare var post: any;
declare var outlet: any;
declare var LiveAPI: any;
autowatch = 1;

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
    }
}

function setProperty(command){
    log("setting property");
    var api = new LiveAPI(command.path);
    api.set(command.property, command.value);
}