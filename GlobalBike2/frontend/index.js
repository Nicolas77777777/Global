import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const server = express();
const port = 8081;

// Imposta EJS come motore di visualizzazione
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views')); // nome della cartella da creare nella root principale

// Middleware ... funzione js ... che viene chiamata automaticamente tra la request e la response
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Route per mostrare la pagina di login
server.get('/', (req, res) => {
  res.render('login'); // cercherà views/login.ejs
});

// Route per ricevere il login (dati da form)
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Ricevuto: ${username}, ${password}`);
  // Qui potresti salvare nel database
  // ... devo chiamare il mio backend
  fetch('http://localhost:8080/controllologin', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        }).then( risultato => { console.log("Risultato" + risultato);
    });

    res.send(`Login ricevuto per ${username}`);
});


// ✅ QUI AGGIUNGI LA ROTTA HOME
server.get('/home', (req, res) => {
  res.render('home'); // cercherà views/home.ejs
});

server.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
