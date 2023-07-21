import express from 'express';
import bodyParser from 'body-parser';
import res from 'express/lib/response';
import { config } from 'dotenv';

config({ path:'.env' });

const app = express();
const port = 3000;

app.get('/recipes', (req, res) => {
    res.send('<h1>Recetas</h1>');
})


app.listen(port, () => {
    console.log(`El servidor esta en escucha en el puerto ${port}`)
})