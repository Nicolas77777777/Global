import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const port = 8081;

// Imposta EJS come motore di visualizzazione
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // nome della cartella da creare nella root principale

// Middleware ... funzione js ... che viene chiamata automaticamente tra la request e la response
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route per mostrare la pagina di login
app.get('/', (req, res) => {
  res.render('login'); // cercherà views/login.ejs
});

// Route per ricevere il login (dati da form)
app.post('/login', (req, res) => {
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

app.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
