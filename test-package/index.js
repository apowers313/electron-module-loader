function init() {
    console.log ("initializing test package");
}

function shutdown() {
    console.log ("initializing test package");
}

function sendMsg(msg) {
    console.log ("test package sending message:");
    console.log ("===========================");
    console.log (msg);
    console.log ("===========================");
    console.log ("test package done sending message. open browser console to see return message.");
    return {
        pong: "package sez hey!"
    };
}

module.exports = {
    init: init,
    shutdown: shutdown,
    sendMsg: sendMsg
};