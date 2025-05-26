// importo i moduli 
import express from 'express'; // serve per creare il server
import pool from './db.js';    // importo il DB
import dotenv from 'dotenv'; // file env serve per leggere le informazioni 
                                // segrete da un file .env (es: password del database)

dotenv.config(); // carica le variabili del file .env e le rende disponiobili al sistema

const server = express(); // crea il Server 
const port = process.env.PORT || 3000;
server.use(express.json()); // Caro server, quando ricevi dei dati (come nome utente e password),
//                               aspettati che siano in formato JSON e capiscili".

server.use(express.urlencoded({ extended: true }));

// POST /login → Inserisce un utente // funzione asincronica 
server.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'INSERT INTO login (username, password) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [username, password]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Errore inserimento:', err);
    res.status(500).send('Errore nel server');
  }
});

// POST /controllologin → Controlla se l’utente esiste
server.post('/controllologin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM login WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rowCount > 0) {
      console.log("TUTTO OK");
      res.json(result.rows);
    } else {
      console.log("UTENTE NON TROVATO");
      res.status(401).send('Utente non trovato');
    }
  } catch (err) {
    console.error('Errore lettura:', err);
    res.status(500).send('Errore nel server');
  }
});

server.post('/cliente', async (req, res) => {
  const {
    cellulare,
    nome,
    cognome_rag_soc,
    luogo_nascita,
    data_nascita,
    data_iscrizione,
    data_scadenza,
    indirizzo,
    citta,
    provincia,
    cap,
    cf_piva,
    email,
    note
  } = req.body;

  try {
    const values = [
      cellulare || null,
      nome || null,
      cognome_rag_soc || null,
      luogo_nascita || null,
      data_nascita || null,
      data_iscrizione || null,
      data_scadenza || null,
      indirizzo || null,
      citta || null,
      provincia || null,
      cap || null,
      cf_piva || null,
      email || null,
      note || null
    ];

    const query = `
      INSERT INTO cliente (
        cellulare,
        nome,
        cognome_rag_soc,
        luogo_nascita,
        data_nascita,
        data_iscrizione,
        data_scadenza,
        indirizzo,
        citta,
        provincia,
        cap,
        cf_piva,
        email,
        note
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14
      )
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Errore inserimento cliente:', err);
    res.status(500).send('Errore nel server');
  }
});



// Avvio del server
server.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});


