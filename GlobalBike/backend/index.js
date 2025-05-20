import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // carica variabili ambiente

const { Pool } = pkg;
const app = express();  // server
const port = 8080;

app.use(express.json()); // app.use ... "installazione" sul server ... automaticamente ... espongo un metodo json

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Inserimento utente
app.post('/login', async (req, res) => {

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

// Lettura utenti
app.post('/controllologin', async (req, res) => {

    const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM login where username = $1 and password = $2 ', [username, password]);
    console.log(result);
    
    if(result.rowCount > 0){
        console.log("TUTTO OK");
        
        res.json(result.rows);
    }else{
        console.log("UTENTE NON TROVATO");
        res.status(500).send('Utente non trovato');
    }
    
  } catch (err) {
    console.error('Errore lettura:', err);
    res.status(500).send('Errore nel server');
  }
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});