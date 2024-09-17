const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeApp: (execPath) => ipcRenderer.invoke("execute-app", execPath),
  updateFocus: (bool) => ipcRenderer.invoke("update-focus", bool),
});
