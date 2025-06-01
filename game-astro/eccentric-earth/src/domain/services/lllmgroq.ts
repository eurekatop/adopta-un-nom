import { Groq } from 'groq-sdk';


export async function getDistractors(word: string,  definition: string, language: string): Promise<string[]>{
    const groq = new Groq();

    const _word = JSON.stringify(word.toLowerCase());
    const _definition = JSON.stringify(definition);
    const _lang = JSON.stringify(language);

    const chatCompletion = await groq.chat.completions.create({
    "messages": [
        {
        "role": "user",
        "content": `System: Devuelve un Json Array. [ var1, var2, var3]\nTarea: Generar un distractor para una pregunta de opción múltiple.\nPalabra: ${_word}\nDefinición: ${_definition}.\nFuente: Wikipedia (usando estructura ontológica)\nIdioma de salida: ${_lang}\nInstrucción: Escribe tres palabras distractores alternativas que sean verosímiles pero incorrectas. Devuelve solamente las palabras.\nSalida: Devuelve un array de strings en JSON.`
        },
        {
        "role": "assistant",
        "content": ""
        },
        {
        "role": "user",
        "content": ""
        }
    ],
    "model": "gemma2-9b-it",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
    });

    const contents = [];
    for await (const chunk of chatCompletion) {
        if (chunk.choices[0]?.delta?.content !== undefined){
            contents.push(chunk.choices[0]?.delta?.content);
        }
    }

    
    try {
        const content = contents.join('');
        console.log(content);
        const result = JSON.parse(content);
        return result;
    }
    catch(err){
        console.error(err);
        return [''];
    }

}


