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

server.get('/ricerca_cliente', async (req, res) => {
  try {
    const { cognome_rag_soc, nome, cf_piva, email, cellulare } = req.query;

    const condizioni = [];
    const valori = [];

    if (cognome_rag_soc) {
      condizioni.push(`cognome_rag_soc ILIKE $${condizioni.length + 1}`);
      valori.push(`%${cognome_rag_soc}%`);
    }
    if (nome) {
      condizioni.push(`nome ILIKE $${condizioni.length + 1}`);
      valori.push(`%${nome}%`);
    }
    if (cf_piva) {
      condizioni.push(`cf_piva ILIKE $${condizioni.length + 1}`);
      valori.push(`%${cf_piva}%`);
    }
    if (email) {
      condizioni.push(`email ILIKE $${condizioni.length + 1}`);
      valori.push(`%${email}%`);
    }
    if (cellulare) {
      condizioni.push(`cellulare ILIKE $${condizioni.length + 1}`);
      valori.push(`%${cellulare}%`);
    }

    let query = 'SELECT * FROM cliente';
    if (condizioni.length > 0) {
      query += ' WHERE ' + condizioni.join(' AND ');
    }

    const result = await pool.query(query, valori);
    res.json(result.rows); // invia i risultati al frontend
  } catch (err) {
    console.error('Errore durante la ricerca cliente:', err);
    res.status(500).send('Errore nel server');
  }
});



// Avvio del server
server.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});


