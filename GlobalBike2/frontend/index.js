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

// ✅ Servi i file statici (img, css, js)
server.use(express.static(path.join(__dirname, 'public')));

// Route per mostrare la pagina di login
server.get('/', (req, res) => {
  res.render('login'); // cercherà views/login.ejs
});

// Route per ricevere il login (dati da form)
server.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const risposta = await fetch('http://localhost:8080/controllologin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (risposta.ok) {
      console.log("Login riuscito. Reindirizzo a /home.");
      res.redirect('/home'); // ✅ REDIRECT AUTOMATICO
    } else {
      console.log("Credenziali errate.");
      res.send('⚠️ Login fallito. Utente non trovato.');
    }
  } catch (err) {
    console.error("Errore nella richiesta al backend:", err);
    res.status(500).send('Errore nella comunicazione con il server backend.');
  }
});



// ✅ QUI AGGIUNGI LA ROTTA HOME
server.get('/home', (req, res) => {
  res.render('home'); // cercherà views/home.ejs
});

// Mostra la pagina di registrazione
server.get('/registrati', (req, res) => {
  res.render('registrati'); // cerca views/registrati.ejs
});

// Invia i dati di registrazione al backend
server.post('/registrati', async (req, res) => {
  const { username, password } = req.body;

  try {
    const risposta = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (risposta.ok) {
      console.log("Registrazione riuscita.");
      res.redirect('/home');
    } else {
      console.log("Errore nella registrazione.");
      res.send('⚠️ Registrazione fallita.');
    }
  } catch (err) {
    console.error("Errore comunicazione col backend:", err);
    res.status(500).send('Errore nel server.');
  }
});



server.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
