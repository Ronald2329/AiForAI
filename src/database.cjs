const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para inserir um novo registro na tabela "records"
async function insertRecord(record) {
    const { prompt, seed, negative_prompt, randomize_seed, width, height, guidance_scale, num_inference_steps, url } = record;

    const { data, error } = await supabase
        .from('records')
        .insert([
            {
                prompt,
                seed,
                negative_prompt,
                randomize_seed,
                width,
                height,
                guidance_scale,
                num_inference_steps,
                url
            }
        ]);

    if (error) {
        console.error('Erro ao inserir registro:', error.message);
        return false;
    } else {
        console.log('Registro inserido com sucesso:', data);
        return true;
    }
}

// Função para retornar todos os registros da tabela "records"
async function selectRecords() {
    const { data, error } = await supabase
        .from('records')
        .select('*');

    if (error) {
        console.error('Erro ao buscar registros:', error.message);
        return null;
    }

    console.log('Registros encontrados:', data);
    return data.length > 0 ? data : null;
}

module.exports = { insertRecord, selectRecords };

/*
selectRecords()
*/
