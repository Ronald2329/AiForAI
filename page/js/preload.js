// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponha métodos para o contexto de renderização
contextBridge.exposeInMainWorld('api', {
  getRecords: () => ipcRenderer.invoke('get-records'),
  insertRecord: (prompt) => ipcRenderer.invoke('insert-records', prompt)

});
