const fs = require('fs');
const axios = require('axios');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '1IUyUhvobJEBYfm58PXtkMPpq16nMt236'; // ID da pasta no Google Drive
const TEMP_IMAGE_PATH = './temp_image.jpg'; // Caminho temporário para salvar a imagem localmente

// Função para baixar a imagem de uma URL temporária
async function downloadImage(url, path) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);

        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Função para fazer o upload de um arquivo para o Google Drive
async function uploadFile() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './GoogleDrive.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const fileMetaData = {
            'name': 'snowplace.jpg', // Nome do arquivo no Google Drive
            'parents': [GOOGLE_API_FOLDER_ID] // ID da pasta de destino no Google Drive
        };

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(TEMP_IMAGE_PATH) // Usa o caminho do arquivo baixado temporariamente
        };

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        console.log(`Upload concluído com sucesso: ID do arquivo: ${response.data.id}`);
        return response.data.id;

    } catch (err) {
        console.log('Erro ao fazer upload do arquivo', err);
    }
}

// Função principal para executar o fluxo de download e upload
async function processImage(url) {
    try {
        console.log('Baixando imagem...');
        await downloadImage(url, TEMP_IMAGE_PATH); // Baixa a imagem da URL para um caminho temporário
        console.log('Imagem baixada com sucesso.');

        console.log('Enviando imagem para o Google Drive...');
        const fileId = await uploadFile(); // Faz upload da imagem para o Google Drive
        console.log(`Imagem enviada com sucesso. ID do arquivo no Google Drive: ${fileId}`);

        // Remover o arquivo temporário após o upload
        fs.unlinkSync(TEMP_IMAGE_PATH);
        console.log('Arquivo temporário removido.');

    } catch (error) {
        console.error('Erro no processo de download e upload:', error);
    }
}


processImage(imageUrl);
