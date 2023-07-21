import { writeFileSync, existsSync, readFileSync, write } from 'fs';
const filePath = 'data.json';

export class Data {
    constructor(){}

    static createFile(){

        try {
          if (!existsSync(filePath)){
            writeFileSync(filePath, '()');
          }
        } catch (error){
            console.error('Error al crear el archivo');
            console.error(error);
        }
    }

    static readFile(){

        Data.createFile();

        try {
            
            const data = readFileSync(filePath, 'utf-8');
            return JSON.parse(data);

        } catch (error) {
            console.error('Error al leer el archivo');
            console.error(error);
        }
    }

    static writeFile(data){

        let recipes = Date.readFile();
        try {
            recipes.push(data);
            writeFileSync(filePath, JSON.stringify(recipes)); 
        } catch (error) {
            console.error('Error al escribir el archivo');
            console.error(error);
        }
    }
}