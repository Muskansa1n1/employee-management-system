const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the renderer process
    },
  });

  win.loadFile('./dist/index.html'); // Assuming your Vue.js app is built into a "dist" folder

  win.webContents.openDevTools(); // Open DevTools (remove this in production)
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
