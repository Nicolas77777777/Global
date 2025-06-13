// src/controllers/clienteController.js
import { pool } from '../db/db.js';

// Recupera tutti i clienti
export const getClienti = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cliente ORDER BY cognome_rag_soc, nome');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero dei clienti:', error);
    res.status(500).json({ error: 'Errore nel recupero dei clienti' });
  }
};

// Recupera un cliente per ID
export const getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Errore nel recupero del cliente:', error);
    res.status(500).json({ error: 'Errore server' });
  }
};

// Ricerca clienti con filtri
export const ricercaCliente = async (req, res) => {
  const { q, numero_tessera, email, cellulare } = req.query;

  try {
    let query = 'SELECT * FROM cliente WHERE 1=1';
    let params = [];

    if (q) {
      query += ' AND (nome LIKE ? OR cognome_rag_soc LIKE ? OR email LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (numero_tessera) {
      query += ' AND numero_tessera = ?';
      params.push(numero_tessera);
    }

    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }

    if (cellulare) {
      query += ' AND cellulare LIKE ?';
      params.push(`%${cellulare}%`);
    }

    query += ' ORDER BY cognome_rag_soc, nome';

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante la ricerca dei clienti:', error);
    res.status(500).json({ error: 'Errore nella ricerca dei clienti' });
  }
};

// Crea un nuovo cliente
export const creaCliente = async (req, res) => {
  const {
    numero_tessera, cellulare, nome, cognome_rag_soc, luogo_nascita,
    data_nascita, data_iscrizione, data_scadenza, indirizzo, citta,
    provincia, cap, cf_piva, email, note
  } = req.body;

  // Validazione campi obbligatori
  if (!cognome_rag_soc || !data_nascita || !data_iscrizione || !data_scadenza || !email) {
    return res.status(400).json({ 
      error: 'Campi obbligatori mancanti: cognome_rag_soc, data_nascita, data_iscrizione, data_scadenza, email' 
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO cliente (
        numero_tessera, cellulare, nome, cognome_rag_soc, luogo_nascita,
        data_nascita, data_iscrizione, data_scadenza, indirizzo, citta,
        provincia, cap, cf_piva, email, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numero_tessera, cellulare, nome, cognome_rag_soc, luogo_nascita,
        data_nascita, data_iscrizione, data_scadenza, indirizzo, citta,
        provincia, cap, cf_piva, email, note
      ]
    );
    
    // Recupera il cliente appena creato per restituire i dati completi
    const [newClient] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [result.insertId]);
    
    res.status(201).json({ 
      message: 'Cliente creato con successo', 
      cliente: newClient[0]
    });
  } catch (error) {
    console.error('Errore durante la creazione del cliente:', error);
    
    // Gestione errori specifici
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('numero_tessera')) {
        return res.status(409).json({ error: 'Numero tessera già esistente' });
      }
    }
    
    res.status(500).json({ error: 'Errore nella creazione del cliente' });
  }
};

// Modifica un cliente esistente
export const modificaCliente = async (req, res) => {
  const { id } = req.params;
  const {
    numero_tessera, cellulare, nome, cognome_rag_soc, luogo_nascita,
    data_nascita, data_iscrizione, data_scadenza, indirizzo, citta,
    provincia, cap, cf_piva, email, note
  } = req.body;

  // Validazione campi obbligatori
  if (!cognome_rag_soc || !data_nascita || !data_iscrizione || !data_scadenza || !email) {
    return res.status(400).json({ 
      error: 'Campi obbligatori mancanti: cognome_rag_soc, data_nascita, data_iscrizione, data_scadenza, email' 
    });
  }

  try {
    // Verifica che il cliente esista
    const [existing] = await pool.query('SELECT id_cliente FROM cliente WHERE id_cliente = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }

    const [result] = await pool.query(
      `UPDATE cliente SET
        numero_tessera = ?, cellulare = ?, nome = ?, cognome_rag_soc = ?, luogo_nascita = ?,
        data_nascita = ?, data_iscrizione = ?, data_scadenza = ?, indirizzo = ?, citta = ?,
        provincia = ?, cap = ?, cf_piva = ?, email = ?, note = ?
      WHERE id_cliente = ?`,
      [
        numero_tessera, cellulare, nome, cognome_rag_soc, luogo_nascita,
        data_nascita, data_iscrizione, data_scadenza, indirizzo, citta,
        provincia, cap, cf_piva, email, note, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }

    // Recupera il cliente aggiornato
    const [updatedClient] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
    
    res.status(200).json({ 
      message: 'Cliente aggiornato con successo',
      cliente: updatedClient[0]
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del cliente:', error);
    
    // Gestione errori specifici
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('numero_tessera')) {
        return res.status(409).json({ error: 'Numero tessera già esistente' });
      }
    }
    
    res.status(500).json({ error: 'Errore nell\'aggiornamento del cliente' });
  }
};

// Elimina un cliente
export const eliminaCliente = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica che il cliente esista
    const [existing] = await pool.query('SELECT id_cliente FROM cliente WHERE id_cliente = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }

    // Verifica se il cliente ha eventi associati
    const [eventi] = await pool.query('SELECT COUNT(*) as count FROM cliente_evento WHERE id_cliente = ?', [id]);
    if (eventi[0].count > 0) {
      return res.status(409).json({ 
        error: 'Impossibile eliminare il cliente: ha eventi associati',
        eventi_associati: eventi[0].count
      });
    }

    await pool.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
    res.status(200).json({ message: 'Cliente eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del cliente:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione del cliente' });
  }
};

// Funzione per aggiornare solo la data di scadenza
export const aggiornaScadenza = async (req, res) => {
  const { id } = req.params;
  const { data_scadenza } = req.body;

  if (!data_scadenza) {
    return res.status(400).json({ error: 'Data scadenza richiesta' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE cliente SET data_scadenza = ? WHERE id_cliente = ?',
      [data_scadenza, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }

    res.status(200).json({ message: 'Data scadenza aggiornata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della scadenza:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento della scadenza' });
  }
};

// Funzione per ottenere clienti con tessera in scadenza
export const getClientiInScadenza = async (req, res) => {
  const { giorni = 30 } = req.query; // Default 30 giorni

  try {
    const [rows] = await pool.query(
      `SELECT * FROM cliente 
       WHERE data_scadenza BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY data_scadenza ASC`,
      [parseInt(giorni)]
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero dei clienti in scadenza:', error);
    res.status(500).json({ error: 'Errore nel recupero dei clienti in scadenza' });
  }
};