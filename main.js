const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");

// include the Node.js 'path' module at the top of your file
const path = require("node:path");
let win;

// modify your existing createWindow() function
const createWindow = () => {
  const w = 600; // Largura
  const h = 80; // Altura

  win = new BrowserWindow({
    width: w,
    height: h,
    frame: false, // Remover bordas
    transparent: true, // Fundo transparente
    resizable: false, // Evitar redimensionamento
    alwaysOnTop: true, // Manter sempre no topo
    skipTaskbar: true,
    fullscreenable: false,
    // focusable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      // contextIsolation: false,
    },
  });

  // win.setIgnoreMouseEvents(true);

  // Posiciona a janela centralizada horizontalmente no rodapé
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;

  // Centraliza a janela horizontalmente e deixa uma margem de 10px do rodapé
  win.setPosition((width - w) / 2, height - h + 60);

  // Carrega o arquivo HTML da dash
  win.loadFile("index.html");

  win.show();
};

// app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Comunicação entre processo renderer e processo principal
ipcMain.handle("execute-app", (event, execPath) => {
  // Resolver o caminho absoluto
  const absoluteExecPath = path.resolve(__dirname, execPath);

  // Executa o aplicativo com o shell
  exec(`"${absoluteExecPath}"`, { shell: true }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o aplicativo: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erro na execução: ${stderr}`);
      return;
    }
    console.log(`Aplicativo executado com sucesso: ${stdout}`);
  });
});

ipcMain.handle("update-focus", (event, bool) => {
  const X = win.getPosition()[0];
  let Y = 1000;

  if (!bool) {
    Y = 1060;
    // console.log("off");
  }
  // else {
  //   console.log("on");
  // }
  win.setPosition(X, Y);
});
