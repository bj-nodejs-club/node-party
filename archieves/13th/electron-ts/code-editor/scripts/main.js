"use strict";
var electron_1 = require('electron');
var fs_1 = require('fs');
var editor = ace.edit("editor"), session = editor.getSession();
var title = document.querySelector('.title');
var close = document.querySelector('.close');
var filePath = null;
editor.setTheme("ace/theme/tomorrow_night_eighties");
session.setMode("ace/mode/javascript");
session.on('change', function (e) {
    updateTitle("●");
});
initIPC();
updateTitle();
initEvents();
function initEvents() {
    window.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) {
            openFile();
        }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
            saveFile();
        }
    });
    close.addEventListener('click', function (e) {
        window.close();
    });
}
function openFile() {
    electron_1.ipcRenderer.send('openFile');
}
function saveFile() {
    if (!filePath) {
        electron_1.ipcRenderer.send('saveFile');
    }
    else {
        fs_1.writeFile(filePath, session.getValue());
        updateTitle();
    }
}
function updateTitle(prefix) {
    if (prefix === void 0) { prefix = ''; }
    title.innerText = prefix + ' ' + (filePath || 'Untitled');
}
function initIPC() {
    electron_1.ipcRenderer.on('openFile', function (e, path) {
        fs_1.readFile(path, 'utf-8', function (err, context) {
            filePath = path;
            session.setValue(context);
            updateTitle();
        });
    });
    electron_1.ipcRenderer.on('saveFile', function (e, path) {
        filePath = path;
        saveFile();
    });
}
//# sourceMappingURL=main.js.map