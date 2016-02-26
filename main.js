'use strict';

var electron = require('electron'),
    updater = require('electron-updater'),
    ipc = electron.ipcMain,
    app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    mainWindow = null,
    printWindow = null,
    path = require('path');

    console.log("hmm")

/*var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}*/

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
  //mainWindow.webContents.openDevTools();


  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', function(){
   updater.on('ready', function() {
        createWindow();
    });
});

app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {

    if (mainWindow === null) {
        createWindow();
    }
});

ipc.on('activate-print-window',function(){

    createPrintWindow();
    if(printWindow){

        printWindow.webContents.on('did-finish-load', function(){
            printWindow.webContents.print();
            setTimeout(function(){

                printWindow.close();
                console.log('print window closed');

            }, 1000);
        });

    }

});


function createPrintWindow(){
    printWindow = new BrowserWindow({width: 400, height: 750, show: false});

    // and load the index.html of the app.
    printWindow.loadURL('file://' + __dirname + '/app/print.html');
   //printWindow.hide();

    printWindow.on('closed', function() {
        printWindow = null;
    });
}

updater.on('update-required', function() {
    console.log("update required");
    app.quit();
});

updater.on('update-available', function() {
    if(mainWindow) {
        mainWindow.webContents.send('update-available');
    }

    console.log("update is available");
});

updater.start();

updater.on('error', function (err) {
    console.log(err);
});
