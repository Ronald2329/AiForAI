require('dotenv').config()
const runGemini = require('./gemini.js')
const deepAi = require('./deepAI.js')

async function main(){
    const promptGeneratedGemini = await runGemini()
    const image = await deepAi.generateImage(promptGeneratedGemini)
}

main()
module.exports = {main}