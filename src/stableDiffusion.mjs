import { Client } from "@gradio/client";

export async function getParams(){
  const params = {
    prompt,
    seed: 0,
    negative_prompt: 'blurry, distorted, low quality, unrealistic, artifacts, noise, out of context, exaggerated proportions',
    randomize_seed: true,
    width: 1024,
    height: 1024,
    guidance_scale: 9,
    num_inference_steps: 100
  };
  return params;
}

export async function generateImage(prompt) {
  const client = await Client.connect("stabilityai/stable-diffusion-3-medium");
  const params = {
    prompt,
    seed: 0,
    negative_prompt: 'blurry, distorted, low quality, unrealistic, artifacts, noise, out of context, exaggerated proportions',
    randomize_seed: true,
    width: 1024,
    height: 1024,
    guidance_scale: 9,
    num_inference_steps: 100
  };

  try {
    const result = await client.predict("/infer", params);
    console.log("Image params:\n", params);
    console.log(result.data);

    // Retorna a URL da imagem gerada e os parâmetros
    return { returnImage: result.data,params};
  } catch (error) {
    console.error('Erro ao gerar a imagem:', error.message);
    return null; // Retorna null em caso de erro
  }
}
