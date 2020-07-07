const electron = require("electron");
const images = require("./images")

const {app, BrowserWindow, ipcMain: ipc} = electron;

let mainWindow = null;

app.on("ready", _=>{
    mainWindow = new BrowserWindow({
        width: 905,
        height: 725,
        resizable: false
    });

    images.mkdir(images.getPicturesDir(app));

    mainWindow.loadURL(`file://${__dirname}/capture.html`);

    mainWindow.on("closed", _=>{
        mainWindow = null;
    });
});

ipc.on("image-captured", (evt, contents) => {
    images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
        images.cache(imgPath);
    });
})

ipc.on("image-remove", (evt, index) => {
    images.rm(index, _ =>{
        evt.sender.send("image-removed", index);
    })
});