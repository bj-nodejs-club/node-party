import { ipcRenderer } from 'electron';
import { readFile, writeFile } from 'fs';

var editor = ace.edit("editor"),
    session = editor.getSession();
var title = document.querySelector('.title') as HTMLDivElement;
var close = document.querySelector('.close') as HTMLDivElement;
var filePath: string = null;

editor.setTheme("ace/theme/tomorrow_night_eighties");
session.setMode("ace/mode/javascript");

session.on('change', e => {
    updateTitle("●");
});

initIPC();
updateTitle();
initEvents();


function initEvents() { 
    window.addEventListener('keydown', e => { 
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) {
            openFile();
        }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
            saveFile();
        }
    });
    close.addEventListener('click', e => { 
        window.close();
    });
}

function openFile() {
    ipcRenderer.send('openFile');
}

function saveFile() {
    if (!filePath) {
        ipcRenderer.send('saveFile');
    }
    else {
        writeFile(filePath, session.getValue());
        updateTitle();
    }
}

function updateTitle(prefix: string = '') {
    title.innerText = prefix + ' ' + (filePath || 'Untitled');
}

function initIPC() {
    ipcRenderer.on('openFile', (e, path) => {
        readFile(path, 'utf-8', (err, context) => {
            filePath = path;
            session.setValue(context);
            updateTitle();
        });
    });
    ipcRenderer.on('saveFile', (e, path) => {
        filePath = path;
        saveFile();
    });
}