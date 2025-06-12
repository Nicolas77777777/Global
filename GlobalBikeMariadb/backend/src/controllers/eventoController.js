// src/controllers/eventoController.js
import { pool } from '../db/db.js';

// Recupera tutti gli eventi con categoria
export const getEventi = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, t.descrizione as categoria_nome 
      FROM evento e 
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica 
      ORDER BY e.data_inizio DESC, e.orario_inizio ASC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

// Recupera eventi attivi
export const getEventiAttivi = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, t.descrizione as categoria_nome 
      FROM evento e 
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica 
      WHERE e.attivo = 1 AND e.data_fine >= CURDATE()
      ORDER BY e.data_inizio ASC, e.orario_inizio ASC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero degli eventi attivi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi attivi' });
  }
};

// Recupera un evento per ID
export const getEventoById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT e.*, t.descrizione as categoria_nome,
             COUNT(ce.id_cliente) as iscritti
      FROM evento e 
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica 
      LEFT JOIN cliente_evento ce ON e.id_evento = ce.id_evento
      WHERE e.id_evento = ?
      GROUP BY e.id_evento
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Errore nel recupero dell\'evento:', error);
    res.status(500).json({ error: 'Errore server' });
  }
};

// Ricerca eventi con filtri
export const ricercaEventi = async (req, res) => {
  const { q, categoria, data_da, data_a, attivo } = req.query;

  try {
    let query = `
      SELECT e.*, t.descrizione as categoria_nome 
      FROM evento e 
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica 
      WHERE 1=1
    `;
    let params = [];

    if (q) {
      query += ' AND (e.titolo LIKE ? OR e.luogo LIKE ? OR e.note LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (categoria) {
      query += ' AND e.categoria = ?';
      params.push(categoria);
    }

    if (data_da) {
      query += ' AND e.data_inizio >= ?';
      params.push(data_da);
    }

    if (data_a) {
      query += ' AND e.data_fine <= ?';
      params.push(data_a);
    }

    if (attivo !== undefined) {
      query += ' AND e.attivo = ?';
      params.push(attivo === 'true' ? 1 : 0);
    }

    query += ' ORDER BY e.data_inizio DESC, e.orario_inizio ASC';

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante la ricerca degli eventi:', error);
    res.status(500).json({ error: 'Errore nella ricerca degli eventi' });
  }
};

// Crea un nuovo evento
export const creaEvento = async (req, res) => {
  const {
    titolo, categoria, data_inizio, data_fine, orario_inizio,
    orario_fine, luogo, note, prezzo, attivo = 1
  } = req.body;

  // Validazione campi obbligatori
  if (!titolo || !categoria || !data_inizio || !data_fine) {
    return res.status(400).json({ 
      error: 'Campi obbligatori mancanti: titolo, categoria, data_inizio, data_fine' 
    });
  }

  // Validazione date
  if (new Date(data_inizio) > new Date(data_fine)) {
    return res.status(400).json({ error: 'La data di inizio deve essere precedente alla data di fine' });
  }

  try {
    // Verifica che la categoria esista
    const [categoriaExists] = await pool.query('SELECT id_tipologica FROM tipologiche WHERE id_tipologica = ?', [categoria]);
    if (categoriaExists.length === 0) {
      return res.status(400).json({ error: 'Categoria non valida' });
    }

    const [result] = await pool.query(
      `INSERT INTO evento (
        titolo, categoria, data_inizio, data_fine, orario_inizio,
        orario_fine, luogo, note, prezzo, attivo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titolo, categoria, data_inizio, data_fine, orario_inizio,
        orario_fine, luogo, note, prezzo, attivo
      ]
    );

    // Recupera l'evento appena creato con la categoria
    const [newEvento] = await pool.query(`
      SELECT e.*, t.descrizione as categoria_nome 
      FROM evento e 
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica 
      WHERE e.id_evento = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Evento creato con successo',
      evento: newEvento[0]
    });
  } catch (error) {
    console.error('Errore durante la creazione dell\'evento:', error);
    res.status(500).json({ error: 'Errore nella creazione dell\'evento' });
  }
};

// Modifica un evento esistente
export const modificaEvento = async (req, res) => {
  const { id } = req.params;
  const {
    titolo, categoria, data_inizio, data_fine, orario_inizio,
    orario_fine, luogo, note, prezzo, attivo
  } = req.body;

  // Validazione campi obbligatori
  if (!titolo || !categoria || !data_inizio || !data_fine) {
    return res.status(400).json({ 
      error: 'Campi obbligatori mancanti: titolo, categoria, data_inizio, data_fine' 
    });
  }

  // Validazione date
  if (new Date(data_inizio) > new Date(data_fine)) {
    return res.status(400).json({ error: 'La data di inizio deve essere precedente alla data di fine' });
  }

  try {
    // Verifica che l'evento esista
    const [existing] = await pool.query('SELECT id_evento FROM evento WHERE id_evento = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    // Verifica che la categoria esista
    const [categoriaExists] = await pool.query('SELECT id_tipologica FROM tipologiche WHERE id_tipologica = ?', [categoria]);
    if (categoriaExists.length === 0) {
      return res.status(400).json({ error: 'Categoria non valida' });
    }

    const [result] = await pool.query(
      `UPDATE evento SET
        titolo = ?, categoria = ?, data_inizio = ?, data_fine = ?, orario_inizio = ?,
        orario_fine = ?, luogo = ?, note = ?, prezzo = ?, attivo = ?
      WHERE id_evento = ?`,
      [
        titolo, categoria, data_inizio, data_fine, orario_inizio,
        orario_fine, luogo, note, prezzo, attivo, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    // Recupera l'evento aggiornato
    const [updatedEvento] = await pool.query(`
      SELECT e.*, t.descrizione as categoria_nome 
      FROM evento e 
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica 
      WHERE e.id_evento = ?
    `, [id]);

    res.status(200).json({
      message: 'Evento aggiornato con successo',
      evento: updatedEvento[0]
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'evento:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'evento' });
  }
};

// Elimina un evento
export const eliminaEvento = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica che l'evento esista
    const [existing] = await pool.query('SELECT id_evento FROM evento WHERE id_evento = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    // Verifica se ci sono iscrizioni all'evento
    const [iscrizioni] = await pool.query('SELECT COUNT(*) as count FROM cliente_evento WHERE id_evento = ?', [id]);
    if (iscrizioni[0].count > 0) {
      return res.status(409).json({ 
        error: 'Impossibile eliminare: evento con iscrizioni esistenti',
        iscrizioni_attive: iscrizioni[0].count
      });
    }

    await pool.query('DELETE FROM evento WHERE id_evento = ?', [id]);
    res.status(200).json({ message: 'Evento eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'evento:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione dell\'evento' });
  }
};

// Attiva/Disattiva evento
export const toggleEventoAttivo = async (req, res) => {
  const { id } = req.params;

  try {
    // Recupera lo stato attuale
    const [current] = await pool.query('SELECT attivo FROM evento WHERE id_evento = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    const nuovoStato = current[0].attivo ? 0 : 1;

    await pool.query('UPDATE evento SET attivo = ? WHERE id_evento = ?', [nuovoStato, id]);

    res.status(200).json({ 
      message: `Evento ${nuovoStato ? 'attivato' : 'disattivato'} con successo`,
      attivo: nuovoStato
    });
  } catch (error) {
    console.error('Errore durante il cambio stato evento:', error);
    res.status(500).json({ error: 'Errore nel cambio stato evento' });
  }
};