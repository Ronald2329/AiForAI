/*const { contextBridge, ipcRenderer } = require('electron');

// Exponha métodos para o contexto de renderização
contextBridge.exposeInMainWorld('api', {
  getRecords: () => ipcRenderer.invoke('get-records'),
});
*/

document.addEventListener('DOMContentLoaded', discover());

async function discover() {
  try {
    // Use a função exposta pelo preload.js para obter registros
    const records = await window.api.getRecords();
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = ''; // Limpa o carrossel antes de adicionar novos registros

    if (records === null || records.length === 0) {
      const emptySlide = document.createElement('div');
      emptySlide.className = 'carousel-item active';
      emptySlide.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
          <h5>Nenhum registro encontrado.</h5>
        </div>
      `;
      carouselInner.appendChild(emptySlide);
    } else {
      records.forEach((record, index) => {
        const isActive = index === 0 ? 'active' : '';
        const slide = document.createElement('div');
        slide.className = `carousel-item ${isActive}`;
        slide.innerHTML = `
          <img src="${record.url}" class="d-block w-100" alt="Imagem">
          <div class="carousel-caption d-none d-md-block">
            <h5>${record.prompt}</h5>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#recordModal" data-record='${JSON.stringify(record)}'>Ver detalhes</button>
          </div>
        `;
        carouselInner.appendChild(slide);
      });

      // Configuração do modal
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        button.addEventListener('click', event => {
          const record = JSON.parse(event.target.getAttribute('data-record'));
          const modalBody = document.getElementById('modalBody');
          modalBody.innerHTML = `
            <p><strong>ID:</strong> ${record.id}</p>
            <p><strong>Prompt:</strong> ${record.prompt}</p>
            <p><strong>URL:</strong> <a href="${record.url}" target="_blank">${record.url}</a></p>
            <p><strong>Seed:</strong> ${record.seed}</p>
            <p><strong>Negative Prompt:</strong> ${record.negative_prompt || 'N/A'}</p>
            <p><strong>Randomize Seed:</strong> ${record.randomize_seed}</p>
            <p><strong>Width:</strong> ${record.width}</p>
            <p><strong>Height:</strong> ${record.height}</p>
            <p><strong>Guidance Scale:</strong> ${record.guidance_scale}</p>
            <p><strong>Number of Inference Steps:</strong> ${record.num_inference_steps}</p>
            <p><strong>Data Criada:</strong> ${formateDate(record.created_at)}</p>
          `;
        });
      });
    }
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
  }
}

function formateDate(originalDate) {
  // Criar um objeto Date
  const date = new Date(originalDate);

  // Opções de formatação para o horário de Brasília
  const options = {
    timeZone: 'America/Sao_Paulo', // Fuso horário de Brasília
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  // Converter para o formato desejado
  const brazilianDate = date.toLocaleString('pt-BR', options);

  console.log(brazilianDate);
  return brazilianDate;
}