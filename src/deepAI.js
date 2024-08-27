const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function generateImage(prompt) {
    try {
        const response = await axios.post('https://api.deepai.org/api/text2img', {
            text: prompt
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.DEEP_AI_KEY
            }
        });

        const imageUrl = response.data.output_url;

        if (imageUrl) {
            // Get the current date and time
            const now = new Date();
            const dateString = now.toISOString().replace(/[:.]/g, '-');

            // Set the file name with the date and time
            const fileName = `image_${dateString}.jpg`;

            // Download the image
            const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
            const filePath = path.join(__dirname, fileName);

            // Save the image to the file
            imageResponse.data.pipe(fs.createWriteStream(filePath));

            console.log(`Image saved as ${fileName}`);
        } else {
            console.error('Failed to generate image.');
        }
    } catch (error) {
        console.error(error);
    }
}


module.exports = {generateImage}
/*
// Example posting file picker input text (Browser only):
document.getElementById('yourFileInputId').addEventListener('change', async function() {
       const formData = new FormData();
       formData.append('text', this.files[0]);

       const resp = await fetch('https://api.deepai.org/api/text2img', {
           method: 'POST',
           headers: {
               'api-key': 'YOUR_API_KEY'
           },
           body: formData
       });

       const data = await resp.json();
       console.log(data);
});

// Example posting a local text file (Node.js only):
const fs = require('fs');
(async function() {
       const formData = new FormData();
       const txtFileStream = fs.createReadStream("/path/to/your/file.txt"),
       formData.append('text', txtFileStream);

       const resp = await fetch('https://api.deepai.org/api/text2img', {
           method: 'POST',
           headers: {
               'api-key': 'YOUR_API_KEY'
           },
           body: formData
       });

       const data = await resp.json();
       console.log(data);
});

// Example directly sending a text string:
(async function() {
    const resp = await fetch('https://api.deepai.org/api/text2img', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': 'YOUR_API_KEY'
        },
        body: JSON.stringify({
            text: "YOUR_TEXT_HERE",
        })
    });
    
    const data = await resp.json();
    console.log(data);
})()
    */