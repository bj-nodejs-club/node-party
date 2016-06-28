import { ipcRenderer } from 'electron';
import { readFile, writeFile } from 'fs';
import { Player } from './player';
import { VisualBox } from './visualBox';

var title = document.querySelector('.title') as HTMLDivElement;
var close = document.querySelector('.close') as HTMLDivElement;
var filePath: string = null;
var player = new Player();
var vbox = new VisualBox(player);

initIPC();
updateTitle();
initEvents();


function initEvents() { 
    window.addEventListener('keydown', e => { 
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) {
            openFile();
        }
    });
    close.addEventListener('click', e => { 
        window.close();
    });
    
    window.addEventListener('click',()=>{
        vbox.toggleMode();
    });
}

function openFile() {
    ipcRenderer.send('openFile');
}



function updateTitle(prefix: string = '') {
    title.innerText = prefix + ' ' + (filePath || 'Untitled');
}

function initIPC() {
    ipcRenderer.on('openFile', (e, path) => {
        readFile(path, 'utf-8', (err, context) => {
            filePath = path;
            updateTitle();
            player.setSource(path,url=>{
                vbox.source = url;
            });
        });
    });
}