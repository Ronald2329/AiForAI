CREATE TABLE records (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    prompt TEXT,
    seed INT,
    negative_prompt TEXT,
    randomize_seed BOOLEAN,
    width FLOAT,
    height FLOAT,
    guidance_scale INT,
    num_inference_steps INT,
    url TEXT,
    time_stamp TIMESTAMPTZ DEFAULT NOW()
);