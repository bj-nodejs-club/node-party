"use strict";
var electron_1 = require('electron');
var fs_1 = require('fs');
var player_1 = require('./player');
var visualBox_1 = require('./visualBox');
var title = document.querySelector('.title');
var close = document.querySelector('.close');
var filePath = null;
var player = new player_1.Player();
var vbox = new visualBox_1.VisualBox(player);
initIPC();
updateTitle();
initEvents();
function initEvents() {
    window.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) {
            openFile();
        }
    });
    close.addEventListener('click', function (e) {
        window.close();
    });
    window.addEventListener('click', function () {
        vbox.toggleMode();
    });
}
function openFile() {
    electron_1.ipcRenderer.send('openFile');
}
function updateTitle(prefix) {
    if (prefix === void 0) { prefix = ''; }
    title.innerText = prefix + ' ' + (filePath || 'Untitled');
}
function initIPC() {
    electron_1.ipcRenderer.on('openFile', function (e, path) {
        fs_1.readFile(path, 'utf-8', function (err, context) {
            filePath = path;
            updateTitle();
            player.setSource(path, function (url) {
                vbox.source = url;
            });
        });
    });
}
//# sourceMappingURL=main.js.map