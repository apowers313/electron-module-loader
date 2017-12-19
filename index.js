'use strict';
const electron = require('electron');
var npm = require("npm");

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

global.sharedObj = {};
global.sharedObj.logger = console.log;
global.sharedObj.loader = function(path) {
	console.log("loading module:", path);
	try {
		npm.load(function(err) {
			if (err) throw err;
			npm.commands.install([path], function(err, data) {
				if (err) throw err;
				console.log("successfully installed");
				console.log("package name:", data[0][0]);
				console.log("package path:", data[0][1]);
				require (data[0][1]);
			});

		})
	} catch (err) {
		console.log("couldn't load module");
		console.log("err:", err);
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