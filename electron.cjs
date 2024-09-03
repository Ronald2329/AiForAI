const { app, BrowserWindow, ipcMain, Menu, Notification } = require('electron');
const path = require('path');
const {exec} = require('child_process')
const { insertRecord, selectRecords } = require('./src/database.cjs');

// Função para criar a janela principal
function createWindow() {
  const mainWindow = new BrowserWindow({
    center: true,
    icon: 'IA-FOR-IA.png',
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'page/js/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // Carrega o arquivo index.html da pasta 'page'
  mainWindow.loadFile(path.join(__dirname, 'page/index.html'));

  // Cria o menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'Options',
      submenu: [
        {
          label: 'Modify System Info',
          click: async () => {
            mainWindow.webContents.send('modify-system-info');
          }
        },
        {
          label: 'Modify Prompt',
          click: async () => {
            mainWindow.webContents.send('modify-prompt');
          }
        }
      ]
    }
  ]);

  // Define o menu do aplicativo
  Menu.setApplicationMenu(menu);
}

// Manipulador IPC para retornar registros
ipcMain.handle('get-records', async () => {
  try {
    const records = await selectRecords(); // A função que busca registros do Supabase
    
    // Notificação de sucesso
    if (records && records.length > 0) {
      new Notification({
        title: 'Sucesso',
        body: `${records.length} registros encontrados!`
      }).show();
    } else {
      new Notification({
        title: 'Aviso',
        body: 'Nenhum registro encontrado.'
      }).show();
    }

    return records;
  } catch (error) {
    // Notificação de erro
    new Notification({
      title: 'Erro',
      body: 'Erro ao buscar registros: ' + error.message
    }).show();
    console.error('Erro ao buscar registros:', error);
    return null;
  }
});

function runElectron() {
  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

module.exports = { runElectron };
