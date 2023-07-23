import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv'; 
import { Data } from './data.js';
import { OpenAIService } from './open-ai.js';

config({ path:'.env' });

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



app.get('/recipes', (req, res) => {
     const recipes = Data.readFile();
     res.json(recipes);
}); 

app.post('/recipes', async (req, res) => {
    if (!req.body || !req.body.ingredients) {
        res.status(400).json({ error: true, message: 'No hay ingredientes.' });
        return;
    }
    const { ingredients } = req.body;
    console.log(ingredients);
    const openAI = new OpenAIService();
    const recipe = await openAI.getRecipe(ingredients);
    res.json({...recipe});
});

app.get('/image', async (req, res) => {
    const openAI = new OpenAIService();
    const images = await openAI.getImages('Pizza');
    res.send(images);
});




app.listen(port, () => {
    console.log(`El servidor esta en escucha en el puerto ${port}`)
})