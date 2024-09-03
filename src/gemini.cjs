/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
async function runGemini(
  systemInstruction="Você será uma IA de geração de prompt para criar imagens, para que posteriormente essas imagens virem vídeos animados",
  prompt="Gere somente um prompt para criar somente alguma imagem relacionada ao ambiente acadêmico de uma faculdade de ciências da Computação"
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction
  });

    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
    console.log("Prompt gerado:\n",response)
    return response
  }

  module.exports = {runGemini}
  