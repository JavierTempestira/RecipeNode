import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';
import { Data } from './data.js';

export class OpenAIService {


    openai;

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env['OPENAI_KEY'],
            organization: process.env['OPENAI_ORG']
        });
        this.openai = new OpenAIApi(configuration);
    }

    
    async generateRecipe(prompt) {
        const response = await this.openai.createChatCompletion({
            model: 'gpt-3.5-turbo-0301',
            messages: [
                { role: 'user', name: 'App', content: `
                    Instrucciones: Eres una inteligencia artificial
                    que genera recetas basado en los ingredientes
                    que te proporcionen.
                    - Siempre vas a contestar con una lista de Instrucciones
                    en JSON. Sin relleno, sin saludos, todo directo.
                    - Si no te pasan una lista de ingredientes, vas a contestar con
                    { "error": true }.
                    - Tus contestaciones van a ser las siguientes:
                    {
                        "title": "$nombre_receta",
                        "ingredients": ["$ingrediente1", "$ingrediente2", ...],
                        "instructions": ["$instruccion1", "$instruccion2", ...],
                        "category": "$categoria", // America, Mexicana, Italiana, etc.
                        "minutes": $minutos // Tiempo de preparación
                    }
                    - Si no entiendes lo que te pasen, o no son ingredientes, vas a contestar con { "error": true }
                    - No es necesario que se utilicen todos los ingredientes.
                    - Siempre incluye los condimentos básicos, como sal, pimienta, azúcar, agua.
                ` },
                { role: 'user', name: 'User', content: prompt }
            ],
            max_tokens: 1000
        });
        return response;
    }


    async getRecipe(ingredients) {

        const response = await this.generateRecipe(ingredients);
        const json = this.getJSONFromResponse(response.data.choices[0].message.content);

        if (Object.keys(json).includes('error')) {
            return json;
        }
        const recipe = json;


        const images = await this.getImages(recipe.title);
        const generateRecipe = {
            title: recipe.title,
            category: recipe.category,
            minutes: recipe.minutes,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prompt: ingredients,
            stars: 0,
            imageUrl: images[Math.floor(images.length * Math.random())]
        };

        Data.writeFile(generateRecipe);
        return generateRecipe;
    }

    getJSONFromResponse(contentResponse) {
        try {
            const json = JSON.parse(contentResponse);
            return json;
        } catch (error) {
            return {error: true};
        }
    }

    async getImages(keywords) {
        const query = axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: keywords.split(' ')[0]
            },
            headers: {
                Authorization: `Client-ID ${process.env['UNSPLASH_KEY']}`,
            }
        });
        const response = await query;
        const images = response.data.results.map((result) =>  result.urls.regular);
        return images;
    }

}