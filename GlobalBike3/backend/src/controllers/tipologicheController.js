import pool from '../db/db.js';

// Aggiungi nuova tipologica
export async function creaTipologica(req, res) {
  const { descrizione } = req.body;

  if (!descrizione || descrizione.trim() === "") {
    return res.status(400).send("Descrizione obbligatoria");
  }

  try {
    const query = 'INSERT INTO tipologiche (descrizione) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [descrizione]);

    res.status(201).json({
      messaggio: 'Tipologica creata con successo',
      tipologica: result.rows[0]
    });
  } catch (err) {
    console.error("Errore durante l'inserimento:", err);
    res.status(500).send("Errore del server");
  }
}

