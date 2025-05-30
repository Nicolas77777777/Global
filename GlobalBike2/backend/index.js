// importo i moduli 
import express from 'express'; // serve per creare il server
import pool from './db.js';    // importo il DB
import dotenv from 'dotenv';   // per leggere le variabili dal file .env

dotenv.config(); // carica le variabili dal file .env

const server = express(); // crea il Server 
const port = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// POST /login → Inserisce un utente
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

// POST /cliente → Inserisce un cliente
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

// GET /ricerca_cliente → ricerca con parametri
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
    res.json(result.rows);
  } catch (err) {
    console.error('Errore durante la ricerca cliente:', err);
    res.status(500).send('Errore nel server');
  }
});

// POST /cliente/:id/modifica → aggiorna cliente
server.post('/cliente/:id/modifica', async (req, res) => {
  const id = req.params.id;

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
    const query = `
      UPDATE cliente
      SET cellulare = $1,
          nome = $2,
          cognome_rag_soc = $3,
          luogo_nascita = $4,
          data_nascita = $5,
          data_iscrizione = $6,
          data_scadenza = $7,
          indirizzo = $8,
          citta = $9,
          provincia = $10,
          cap = $11,
          cf_piva = $12,
          email = $13,
          note = $14
      WHERE id_cliente = $15
      RETURNING *;
    `;

    const valori = [
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
      note,
      id
    ];

    const result = await pool.query(query, valori);

    if (result.rowCount === 0) {
      return res.status(404).send('Cliente non trovato');
    }

    res.status(200).json({ messaggio: 'Cliente aggiornato con successo' });
  } catch (err) {
    console.error('Errore aggiornamento cliente:', err);
    res.status(500).send('Errore nel server');
  }
});

// ✅ GET /cliente/:id/modifica → restituisce i dati del cliente per modifica
server.get('/cliente/:id/modifica', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM cliente WHERE id_cliente = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('Cliente non trovato');
    }

    res.json(result.rows[0]); // importante: singolo oggetto
  } catch (err) {
    console.error('Errore nel recupero cliente:', err);
    res.status(500).send('Errore nel server');
  }
});

// Avvio del server
server.listen(port, () => {
  console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
