// Importações necessárias
import { runGemini } from './src/gemini.cjs';
import { generateImage} from './src/stableDiffusion.js';
import dotenv from 'dotenv/config';
import { insertRecord } from './src/database.cjs';
// Função principal para executar a geração e salvar o registro
async function main() {
    const prompt = await runGemini();
    const imageResult = await generateImage(prompt);
  
    if (imageResult && imageResult.returnImage) {
      // Dados do novo registro
      const newRecord = {
        prompt,
        url: imageResult.returnImage[0].url, // Supondo que o retorno é um array de imagens
        seed:0, 
        negative_prompt:imageResult.params.negative_prompt, 
        randomize_seed:imageResult.params.randomize_seed, 
        width:imageResult.params.width, 
        height:imageResult.params.height, 
        guidance_scale:imageResult.params.guidance_scale, 
        num_inference_steps:imageResult.params.num_inference_steps // Converte os parâmetros para JSON
      };
  
      // Insere o novo registro
      insertRecord(newRecord);
    } else {
      console.error("Erro: Não foi possível gerar a imagem ou obter dados válidos.");
    }
  }
main();