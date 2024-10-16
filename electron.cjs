const { app, BrowserWindow, ipcMain, Menu, Notification } = require('electron');
const path = require('node:path');
const { insertRecord, selectRecords } = require('./src/database.cjs');
const {runGemini} = require('./src/gemini.cjs')

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
      label: 'Help',
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
      ],
      label: 'Documentation'
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

ipcMain.handle('insert-records', async (event, prompt) => {
  try {
    const promptGemini = await runGemini(prompt)
    const {generateImage} = await import('./src/stableDiffusion.mjs') //Importando o arquivo do tipo modulo em tempo de execução para eliminar o erro!

    // Gera a imagem com o stable diffusion utilizando o prompt fornecido
    const { returnImage, params } = await generateImage(promptGemini);
    
    if (!returnImage) {
      throw new Error('Erro ao gerar a imagem');
    }

    // Cria um objeto contendo os dados para inserção
    const record = {
      prompt: params.prompt,
      seed: params.seed,
      negative_prompt: params.negative_prompt,
      randomize_seed: params.randomize_seed,
      width: params.width,
      height: params.height,
      guidance_scale: params.guidance_scale,
      num_inference_steps: params.num_inference_steps,
      url: returnImage,  // URL da imagem gerada
    };

    // Insere o registro no banco de dados
    const result = await insertRecord(record);

    // Notificação de sucesso ou erro
    if (result) {
      new Notification({
        title: 'Sucesso',
        body: 'Registro inserido com sucesso!',
      }).show();
    } else {
      new Notification({
        title: 'Erro',
        body: 'Erro ao inserir registro no banco de dados.',
      }).show();
    }

    return result;
  } catch (error) {
    new Notification({
      title: 'Erro',
      body: 'Erro ao inserir registro: ' + error.message,
    }).show();
    console.error('Erro ao inserir registro:', error);
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
