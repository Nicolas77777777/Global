import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

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
    // Chiamo backend per verificare credenziali
    const response = await fetch('http://localhost:3000/controllologin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      // Backend ha risposto con errore, mostro login con errore
      return res.render('login', { errore: 'Credenziali errate' });
    }

    // Login corretto: mostro la home (render)
    const datiUtente = await response.json();
    res.render('home', { utente: datiUtente[0] }); // Passa dati al template home.ejs
  } catch (error) {
    console.error(error);
    res.render('login', { errore: 'Errore interno del server' });
  }
});

// Route per mostrare la home page dopo login
server.get('/home', (req, res) => {
  res.render('home');
});

// GET: mostra form nuovo cliente
server.get('/clienti/nuovo', (req, res) => {
  res.render('clienti_nuovo', { errore: null, successo: null });
});

// ✅ CORRETTA: mostra solo il form per la ricerca cliente (usata da link/menu)
server.get('/clienti/form', (req, res) => {
  res.render('cliente_ricerca', { errore: null, successo: null });
});

// ✅ CORRETTA: riceve la GET del form e inoltra la query al backend
server.get('/clienti/ricerca', async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();

    // Invia la richiesta al backend
    const response = await fetch(`http://localhost:3000/ricerca_cliente?${queryString}`);
    const clienti = await response.json();

    // Renderizza la pagina risultati con i dati ricevuti
    res.render('risultati_ricerca', { clienti });
  } catch (err) {
    console.error("Errore nella ricerca cliente:", err);
    res.render('risultati_ricerca', { clienti: [] });
  }
});

// Route per ricevere i dati dalla form del cliente
server.post('/clienti/nuovo', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      res.render('clienti_nuovo', { errore: null, successo: 'Cliente salvato con successo!' });
    } else {
      res.render('clienti_nuovo', { errore: 'Errore nel salvataggio del cliente.', successo: null });
    }

  } catch (err) {
    console.error('Errore nella richiesta fetch:', err);
    res.render('clienti_nuovo', { errore: 'Errore durante il salvataggio', successo: null });
  }
});


//root per modificare il cliente 
server.post('/clienti/:id/modifica', async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(`http://localhost:3000/cliente/${id}/modifica`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error("Errore nella risposta dal backend");
    }

    // Dopo il salvataggio, torna all'elenco o conferma salvataggio
    res.redirect('/clienti');
  } catch (err) {
    console.error("Errore durante il salvataggio delle modifiche:", err);
    res.status(500).send("Errore nel salvataggio delle modifiche");
  }
});

server.listen(port, () => {
  console.log(`✅ Server frontend avviato su http://localhost:${port}`);
});
