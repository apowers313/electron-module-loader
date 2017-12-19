'use strict';
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

// this chunk of code handles sending messages
const {ipcMain} = require('electron');
var sendMsg = null;
ipcMain.on("send-msg", function(e, msg) {
	console.log ("ipcMain.on send-msg");
	// this is synchronous
	// asynchonous also exists: https://electronjs.org/docs/api/ipc-main
	var retMsg;
	if(sendMsg) {
		retMsg = sendMsg(msg);
	} else {
		console.log ("message handler not registered");
	}
	e.returnValue = retMsg;
});

// this chunk of code handles loading modules
var npm = require("npm");
global.sharedObj = {};
global.sharedObj.logger = console.log;
global.sharedObj.loader = function(path, cb) {
	console.log("loading module:", path);
	try {
		npm.load(function(err) {
			if (err) throw err;
			npm.commands.install([path], function(err, data) {
				if (err) throw err;
				console.log("successfully installed");
				console.log("package name:", data[0][0]);
				console.log("package path:", data[0][1]);
				var ret = require (data[0][1]);
				console.log("require done");
				console.log("require returned:", ret);
				if (typeof ret.init === "function") {
					console.log ("initializing npm package...");
					ret.init();
				}
				if (typeof ret.sendMsg === "function") {
					console.log ("registering sendMsg...");
					sendMsg = ret.sendMsg;
					return cb();
				}
			});

		})
	} catch (err) {
		console.log("couldn't load module");
		console.log("err:", err);
		return cb(err);
	}
};

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});