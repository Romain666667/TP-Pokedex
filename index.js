
const POKEDEX_SRC = "./DATA/pokedex.json";

const IMAGES_SRC = "./FILES/images";
// port
const PORT = 5001;

// Lancer un serveur express sur un port défini
const fs = require('fs');
const express = require('express');
const app = express();

// Servir les images statiques (ex: /images/001.png)
app.use('/images', express.static(IMAGES_SRC));


// Route renvoyer tous les pokemons
app.get('/', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        
        const pokedex = JSON.parse(data);
        res.json(pokedex);
    });
});

// Route renvoyer un pokemon au hasard
app.get('/hasard', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {

        const pokedex = JSON.parse(data);
        
        // Récupérer id minimum et maximum
        const idMin = pokedex[0].id;
        const idMax = pokedex[pokedex.length - 1].id;
        
        // Générer un nombre aléatoire entre idMin et idMax
        const randomId = Math.floor(Math.random() * (idMax - idMin + 1)) + idMin;
        
        // Trouver le pokemon avec cet id
        const pokemonHasard = pokedex.find(pokemon => pokemon.id === randomId);
        
        if (pokemonHasard) {
            res.json(pokemonHasard);
        } else {
            res.status(404).json({ error: 'Pokemon non trouvé' });
        }
    });
});

// Route renvoyer un pokemon par son identifiant
app.get('/pokemon/:id', (req, res) => {
    const pokemonId = parseInt(req.params.id);
    
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        
        const pokedex = JSON.parse(data);
        
        // rechercher le pokemon avec l'id correspondant
        const pokemon = pokedex.find(p => p.id === pokemonId);
        
   if (pokemon) {
            const imgFile = String(pokemonId).padStart(3, '0') + '.png';
            const imageUrl = `/images/${imgFile}`;

            const html = `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <title>${pokemon.name.french}</title>
                    <style>
                        body { font-family: monospace; background: #fafafa; text-align: center; }
                        img { width: 200px; margin-top: 20px; }
                        pre { text-align: left; display: inline-block; background: #fff; padding: 15px; border-radius: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.1); }
                    </style>
                </head>
                <body>
                    <img src="${imageUrl}" alt="${pokemon.name.french}">
                    <pre>${JSON.stringify(pokemon, null, 1)}</pre>
                </body>
                </html>
            `;

            res.send(html);
        } else {
            res.status(404).json({ error: `Pokemon avec l'id ${pokemonId} non trouvé` });
        }
    });
});

// Route renvoyer un pokemon par son nom
app.get('/pokemon/nom/:nom', (req, res) => {
    const pokemonNom = req.params.nom.toLowerCase();
    
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        
        const pokedex = JSON.parse(data);
        
        // Rechercher le pokemon par son nom on met tout en minuscule
        const pokemon = pokedex.find(p => 
            p.name.french.toLowerCase() === pokemonNom ||
            p.name.english.toLowerCase() === pokemonNom
        );
        
        if (pokemon) {
            const pokemonId = pokemon.id;
            // padStart permet d'avoir l'id plus des zéros devant pour faire les chiffres des images si on a le chiffre 3 
            // par exemple alors on aura 003.png / 51 alors 051.png
            const imgFile = String(pokemonId).padStart(3, '0') + '.png';
            const imageUrl = `/images/${imgFile}`;

            const html = `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <title>${pokemon.name.french}</title>
                    <style>
                        body { font-family: monospace; background: #fafafa; text-align: center; }
                        img { width: 200px; margin-top: 20px; }
                        pre { text-align: left; display: inline-block; background: #fff; padding: 15px; border-radius: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.1); }
                    </style>
                </head>
                <body>
                    <img src="${imageUrl}" alt="${pokemon.name.french}">
                    <pre>${JSON.stringify(pokemon,null,1)}</pre>
                </body>
                </html>
            `;
            res.send(html);
        } else {
            res.status(404).json({ error: `Pokemon "${req.params.nom}" non trouvé` });
        }
    });
});

// Lancement du serveur et attendre
app.listen(
    PORT,
    '172.16.191.1',  
    () => {
        console.log('Routes disponibles:');
        console.log('  - GET / (tous les pokemons)');
        console.log('  - GET /hasard (pokemon aléatoire)');
        console.log('  - GET /pokemon/:id (pokemon id)');
        console.log('  - GET /pokemon/nom/:nom (pokemon nom)');
    }
)