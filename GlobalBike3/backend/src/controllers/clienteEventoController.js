import pool from '../db/db.js';

// ✅ Aggiungi un cliente a un evento
export async function iscriviCliente(req, res) {
  const { id_cliente, id_evento } = req.body;

  if (!id_cliente || !id_evento) {
    return res.status(400).json({ errore: 'id_cliente e id_evento sono obbligatori' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO cliente_evento (id_cliente, id_evento)
       VALUES ($1, $2)
       ON CONFLICT (id_cliente, id_evento) DO NOTHING
       RETURNING *`,
      [id_cliente, id_evento]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ messaggio: 'Cliente già iscritto a questo evento' });
    }

    res.status(201).json({ messaggio: 'Iscrizione avvenuta con successo', iscrizione: result.rows[0] });
  } catch (err) {
    console.error('Errore iscrizione:', err);
    res.status(500).json({ errore: 'Errore nel server' });
  }
}

// ✅ Ottieni tutti i clienti iscritti a un evento
export async function clientiPerEvento(req, res) {
  const { id_evento } = req.params;

  try {
    const result = await pool.query(`
      SELECT c.*
      FROM cliente_evento ce
      JOIN cliente c ON ce.id_cliente = c.id_cliente
      WHERE ce.id_evento = $1
    `, [id_evento]);

    res.json(result.rows);
  } catch (err) {
    console.error('Errore clienti per evento:', err);
    res.status(500).json({ errore: 'Errore nel server' });
  }
}

// ✅ Ottieni tutti gli eventi a cui un cliente è iscritto
export async function eventiPerCliente(req, res) {
  const { id_cliente } = req.params;

  try {
    const result = await pool.query(`
      SELECT e.*
      FROM cliente_evento ce
      JOIN evento e ON ce.id_evento = e.id_evento
      WHERE ce.id_cliente = $1
    `, [id_cliente]);

    res.json(result.rows);
  } catch (err) {
    console.error('Errore eventi per cliente:', err);
    res.status(500).json({ errore: 'Errore nel server' });
  }
}

// ✅ Rimuovi l'iscrizione di un cliente da un evento
export async function rimuoviIscrizione(req, res) {
  const { id_cliente, id_evento } = req.body;

  try {
    const result = await pool.query(`
      DELETE FROM cliente_evento
      WHERE id_cliente = $1 AND id_evento = $2
      RETURNING *
    `, [id_cliente, id_evento]);

    if (result.rowCount === 0) {
      return res.status(404).json({ messaggio: 'Nessuna iscrizione trovata' });
    }

    res.json({ messaggio: 'Iscrizione rimossa con successo' });
  } catch (err) {
    console.error('Errore eliminazione iscrizione:', err);
    res.status(500).json({ errore: 'Errore nel server' });
  }
}
