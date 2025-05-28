import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js'; // Connessione al DB PostgreSQL

// Per risolvere __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 8081;

// Imposta EJS come motore di visualizzazione
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views')); // nome della cartella da creare nella root principale

// Middleware ... funzione js ... che viene chiamata automaticamente tra la request e la response
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// ✅ Servi i file statici (img, css, js)
server.use(express.static(path.join(__dirname, 'public')));

// Route per mostrare la pagina di login
server.get('/', (req, res) => {
  res.render('login', { errore: null });
});

// Route per ricevere il login (dati da form)
server.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query per controllare username e password
    const result = await pool.query(
      'SELECT * FROM login WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rowCount > 0) {
      // Login corretto: redirect alla home page
      res.redirect('/home');
    } else {
      // Login errato: rimanda a login con messaggio errore
      res.render('login', { errore: 'Credenziali errate' });
    }
  } catch (error) {
    console.error('Errore nella verifica login:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per mostrare la home page dopo login
server.get('/home', (req, res) => {
  res.render('home');
});

server.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
