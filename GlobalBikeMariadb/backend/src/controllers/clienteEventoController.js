// src/controllers/clienteEventoController.js
import { pool } from '../db/db.js';

// Recupera tutte le iscrizioni con dettagli cliente ed evento
export const getIscrizioni = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ce.*, 
             c.nome, c.cognome_rag_soc, c.email, c.cellulare, c.numero_tessera,
             e.titolo, e.data_inizio, e.data_fine, e.luogo,
             t.descrizione as categoria_nome
      FROM cliente_evento ce
      JOIN cliente c ON ce.id_cliente = c.id_cliente
      JOIN evento e ON ce.id_evento = e.id_evento
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica
      ORDER BY ce.data_iscrizione DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero delle iscrizioni:', error);
    res.status(500).json({ error: 'Errore nel recupero delle iscrizioni' });
  }
};

// Recupera iscrizioni per un cliente specifico
export const getIscrizioniByCliente = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT ce.*, 
             e.titolo, e.data_inizio, e.data_fine, e.orario_inizio, e.orario_fine,
             e.luogo, e.prezzo,
             t.descrizione as categoria_nome
      FROM cliente_evento ce
      JOIN evento e ON ce.id_evento = e.id_evento
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica
      WHERE ce.id_cliente = ?
      ORDER BY e.data_inizio DESC
    `, [id_cliente]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero delle iscrizioni del cliente:', error);
    res.status(500).json({ error: 'Errore nel recupero delle iscrizioni del cliente' });
  }
};

// Recupera iscrizioni per un evento specifico
export const getIscrizioniByEvento = async (req, res) => {
  const { id_evento } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT ce.*, 
             c.nome, c.cognome_rag_soc, c.email, c.cellulare, c.numero_tessera,
             c.data_nascita, c.citta
      FROM cliente_evento ce
      JOIN cliente c ON ce.id_cliente = c.id_cliente
      WHERE ce.id_evento = ?
      ORDER BY c.cognome_rag_soc, c.nome
    `, [id_evento]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero delle iscrizioni dell\'evento:', error);
    res.status(500).json({ error: 'Errore nel recupero delle iscrizioni dell\'evento' });
  }
};

// Iscrive un cliente a un evento
export const iscriviCliente = async (req, res) => {
  const { id_cliente, id_evento } = req.body;

  if (!id_cliente || !id_evento) {
    return res.status(400).json({ error: 'ID cliente e ID evento sono obbligatori' });
  }

  try {
    // Verifica che il cliente esista
    const [cliente] = await pool.query('SELECT id_cliente FROM cliente WHERE id_cliente = ?', [id_cliente]);
    if (cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }

    // Verifica che l'evento esista e sia attivo
    const [evento] = await pool.query('SELECT id_evento, attivo, titolo FROM evento WHERE id_evento = ?', [id_evento]);
    if (evento.length === 0) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    if (evento[0].attivo === 0) {
      return res.status(400).json({ error: 'Evento non attivo' });
    }

    // Verifica che il cliente non sia già iscritto
    const [existing] = await pool.query(
      'SELECT id_cliente_evento FROM cliente_evento WHERE id_cliente = ? AND id_evento = ?', 
      [id_cliente, id_evento]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Cliente già iscritto a questo evento' });
    }

    const [result] = await pool.query(
      'INSERT INTO cliente_evento (id_cliente, id_evento) VALUES (?, ?)',
      [id_cliente, id_evento]
    );

    // Recupera l'iscrizione appena creata con tutti i dettagli
    const [newIscrizione] = await pool.query(`
      SELECT ce.*, 
             c.nome, c.cognome_rag_soc, c.email, c.numero_tessera,
             e.titolo, e.data_inizio, e.data_fine,
             t.descrizione as categoria_nome
      FROM cliente_evento ce
      JOIN cliente c ON ce.id_cliente = c.id_cliente
      JOIN evento e ON ce.id_evento = e.id_evento
      LEFT JOIN tipologiche t ON e.categoria = t.id_tipologica
      WHERE ce.id_cliente_evento = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Cliente iscritto con successo',
      iscrizione: newIscrizione[0]
    });
  } catch (error) {
    console.error('Errore durante l\'iscrizione del cliente:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Cliente già iscritto a questo evento' });
    }
    
    res.status(500).json({ error: 'Errore nell\'iscrizione del cliente' });
  }
};

// Rimuove l'iscrizione di un cliente da un evento
export const rimuoviIscrizione = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica che l'iscrizione esista
    const [existing] = await pool.query('SELECT id_cliente_evento FROM cliente_evento WHERE id_cliente_evento = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Iscrizione non trovata' });
    }

    await pool.query('DELETE FROM cliente_evento WHERE id_cliente_evento = ?', [id]);
    res.status(200).json({ message: 'Iscrizione rimossa con successo' });
  } catch (error) {
    console.error('Errore durante la rimozione dell\'iscrizione:', error);
    res.status(500).json({ error: 'Errore nella rimozione dell\'iscrizione' });
  }
};

// Rimuove iscrizione specificando cliente ed evento
export const rimuoviIscrizioneByClienteEvento = async (req, res) => {
  const { id_cliente, id_evento } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM cliente_evento WHERE id_cliente = ? AND id_evento = ?',
      [id_cliente, id_evento]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Iscrizione non trovata' });
    }

    res.status(200).json({ message: 'Iscrizione rimossa con successo' });
  } catch (error) {
    console.error('Errore durante la rimozione dell\'iscrizione:', error);
    res.status(500).json({ error: 'Errore nella rimozione dell\'iscrizione' });
  }
};

// Verifica se un cliente è iscritto a un evento
export const verificaIscrizione = async (req, res) => {
  const { id_cliente, id_evento } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT id_cliente_evento, data_iscrizione FROM cliente_evento WHERE id_cliente = ? AND id_evento = ?',
      [id_cliente, id_evento]
    );

    res.status(200).json({
      iscritto: rows.length > 0,
      iscrizione: rows.length > 0 ? rows[0] : null
    });
  } catch (error) {
    console.error('Errore durante la verifica dell\'iscrizione:', error);
    res.status(500).json({ error: 'Errore nella verifica dell\'iscrizione' });
  }
};

// Statistiche iscrizioni
export const getStatisticheIscrizioni = async (req, res) => {
  try {
    // Totale iscrizioni
    const [totaleIscrizioni] = await pool.query('SELECT COUNT(*) as totale FROM cliente_evento');
    
    // Iscrizioni per mese corrente
    const [iscrizioniMese] = await pool.query(`
      SELECT COUNT(*) as totale 
      FROM cliente_evento 
      WHERE YEAR(data_iscrizione) = YEAR(CURDATE()) 
      AND MONTH(data_iscrizione) = MONTH(CURDATE())
    `);

    // Eventi più popolari
    const [eventiPopolare] = await pool.query(`
      SELECT e.titolo, e.id_evento, COUNT(ce.id_cliente) as iscritti
      FROM evento e
      LEFT JOIN cliente_evento ce ON e.id_evento = ce.id_evento
      WHERE e.attivo = 1
      GROUP BY e.id_evento, e.titolo
      ORDER BY iscritti DESC
      LIMIT 5
    `);

    // Clienti più attivi
    const [clientiAttivi] = await pool.query(`
      SELECT c.nome, c.cognome_rag_soc, c.id_cliente, COUNT(ce.id_evento) as eventi_iscritti
      FROM cliente c
      LEFT JOIN cliente_evento ce ON c.id_cliente = ce.id_cliente
      GROUP BY c.id_cliente, c.nome, c.cognome_rag_soc
      ORDER BY eventi_iscritti DESC
      LIMIT 5
    `);

    res.status(200).json({
      totale_iscrizioni: totaleIscrizioni[0].totale,
      iscrizioni_mese_corrente: iscrizioniMese[0].totale,
      eventi_piu_popolari: eventiPopolare,
      clienti_piu_attivi: clientiAttivi
    });
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
};