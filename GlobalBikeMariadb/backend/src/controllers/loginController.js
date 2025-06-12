// src/controllers/tipologicheController.js
import { pool } from '../db/db.js';

// Recupera tutte le tipologiche
export const getTipologiche = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipologiche ORDER BY descrizione');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero delle tipologiche:', error);
    res.status(500).json({ error: 'Errore nel recupero delle tipologiche' });
  }
};

// Recupera una tipologica per ID
export const getTipologicaById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM tipologiche WHERE id_tipologica = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tipologica non trovata' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Errore nel recupero della tipologica:', error);
    res.status(500).json({ error: 'Errore server' });
  }
};

// Crea una nuova tipologica
export const creaTipologica = async (req, res) => {
  const { descrizione } = req.body;

  if (!descrizione) {
    return res.status(400).json({ error: 'Descrizione obbligatoria' });
  }

  try {
    // Verifica se la descrizione esiste già
    const [existing] = await pool.query('SELECT id_tipologica FROM tipologiche WHERE descrizione = ?', [descrizione]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Tipologica già esistente' });
    }

    const [result] = await pool.query(
      'INSERT INTO tipologiche (descrizione) VALUES (?)',
      [descrizione]
    );

    // Recupera la tipologica appena creata
    const [newTipologica] = await pool.query('SELECT * FROM tipologiche WHERE id_tipologica = ?', [result.insertId]);

    res.status(201).json({
      message: 'Tipologica creata con successo',
      tipologica: newTipologica[0]
    });
  } catch (error) {
    console.error('Errore durante la creazione della tipologica:', error);
    res.status(500).json({ error: 'Errore nella creazione della tipologica' });
  }
};

// Modifica una tipologica esistente
export const modificaTipologica = async (req, res) => {
  const { id } = req.params;
  const { descrizione } = req.body;

  if (!descrizione) {
    return res.status(400).json({ error: 'Descrizione obbligatoria' });
  }

  try {
    // Verifica che la tipologica esista
    const [existing] = await pool.query('SELECT id_tipologica FROM tipologiche WHERE id_tipologica = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tipologica non trovata' });
    }

    // Verifica se la nuova descrizione esiste già (escludendo quella corrente)
    const [duplicate] = await pool.query(
      'SELECT id_tipologica FROM tipologiche WHERE descrizione = ? AND id_tipologica != ?', 
      [descrizione, id]
    );
    if (duplicate.length > 0) {
      return res.status(409).json({ error: 'Descrizione già esistente' });
    }

    const [result] = await pool.query(
      'UPDATE tipologiche SET descrizione = ? WHERE id_tipologica = ?',
      [descrizione, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tipologica non trovata' });
    }

    // Recupera la tipologica aggiornata
    const [updatedTipologica] = await pool.query('SELECT * FROM tipologiche WHERE id_tipologica = ?', [id]);

    res.status(200).json({
      message: 'Tipologica aggiornata con successo',
      tipologica: updatedTipologica[0]
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della tipologica:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento della tipologica' });
  }
};

// Elimina una tipologica
export const eliminaTipologica = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica che la tipologica esista
    const [existing] = await pool.query('SELECT id_tipologica FROM tipologiche WHERE id_tipologica = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tipologica non trovata' });
    }

    // Verifica se ci sono eventi che usano questa tipologica
    const [eventi] = await pool.query('SELECT COUNT(*) as count FROM evento WHERE categoria = ?', [id]);
    if (eventi[0].count > 0) {
      return res.status(409).json({ 
        error: 'Impossibile eliminare: tipologica utilizzata in eventi esistenti',
        eventi_associati: eventi[0].count
      });
    }

    await pool.query('DELETE FROM tipologiche WHERE id_tipologica = ?', [id]);
    res.status(200).json({ message: 'Tipologica eliminata con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della tipologica:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione della tipologica' });
  }
};