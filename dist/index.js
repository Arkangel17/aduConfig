"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var http = require("http");
var App_1 = require("./App");
debug("ts-express:server");
var port = normalizePort(process.env.PORT || 8081);
App_1.default.set("port", port);
// creates server
var server = http.createServer(App_1.default);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
console.log("app is listening on port " + port);
function normalizePort(val) {
    var port = (typeof val === "string") ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
}
// Error handler for server
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = (typeof port === "string") ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = (typeof addr === "string") ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
