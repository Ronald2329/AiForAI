// Importando o módulo CommonJS de maneira correta
import pkg from './electron.cjs';
const { runElectron } = pkg; // Desestruturando a exportação para pegar a função runElectron

// Executa o Electron
runElectron();