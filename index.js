
// l'emplacement des fichiers bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";
// l'emplacement des images
const IMAGES_SRC = "./FILES/images";
// port
const PORT = 5001;

// ************************************************
// Lancer un serveur express sur un port défini
const fs = require('fs');
const express = require('express');
const app = express();


// Route / - Renvoyer tous les pokemons
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

// Route /hasard - Renvoyer un pokemon au hasard
app.get('/hasard', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        
        const pokedex = JSON.parse(data);
        
        // Récupérer l'id minimum et maximum
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

// Route /pokemon/:id - Renvoyer un pokemon par son identifiant (nombre)
app.get('/pokemon/:id', (req, res) => {
    const pokemonId = parseInt(req.params.id);
    
    // Vérifier si le paramètre est bien un nombre
    if (isNaN(pokemonId)) {
        res.status(400).json({ error: 'identifiant doit être un nombre' });
        return;
    }
    
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        
        const pokedex = JSON.parse(data);
        
        // rechercher le pokemon avec l'id correspondant
        const pokemon = pokedex.find(p => p.id === pokemonId);
        
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ error: `Pokemon avec l'id ${pokemonId} non trouvé` });
        }
    });
});

// Route /pokemon/nom/:nom - Renvoyer un pokemon par son nom
app.get('/pokemon/nom/:nom', (req, res) => {
    const pokemonNom = req.params.nom.toLowerCase();
    
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        
        const pokedex = JSON.parse(data);
        
        // Rechercher le pokemon par son nom (en minuscule pour éviter les problèmes de casse)
        const pokemon = pokedex.find(p => 
            p.name.french.toLowerCase() === pokemonNom ||
            p.name.english.toLowerCase() === pokemonNom
        );
        
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ error: `Pokemon "${req.params.nom}" non trouvé` });
        }
    });
});

// ************************************************
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