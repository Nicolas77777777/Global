// src/controllers/loginController.js
import { pool } from '../db/db.js';
import bcrypt from 'bcrypt'; // Aggiungere per sicurezza password
import jwt from 'jsonwebtoken'; // Aggiungere per JWT tokens

// Registra un nuovo utente
export const registraUtente = async (req, res) => {
  const { username, password } = req.body;

  // Validazione input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password sono obbligatori' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La password deve essere di almeno 6 caratteri' });
  }

  try {
    // Verifica se l'utente esiste già
    const [existing] = await pool.query('SELECT username FROM login WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username già esistente' });
    }

    // Hash della password per sicurezza
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO login (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ 
      message: 'Utente registrato con successo', 
      id_login: result.insertId,
      username: username
    });
  } catch (error) {
    console.error('Errore inserimento login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Verifica login e autentica utente
export const autenticaUtente = async (req, res) => {
  const { username, password } = req.body;

  // Validazione input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password sono obbligatori' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id_login, username, password FROM login WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const user = rows[0];

    // Verifica password (assumendo che le password siano hashate)
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Genera JWT token (opzionale - richiede JWT_SECRET in environment)
    const token = jwt.sign(
      { 
        id_login: user.id_login, 
        username: user.username 
      },
      process.env.JWT_SECRET || 'default_secret', // Usare variabile ambiente in produzione
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login effettuato con successo',
      user: {
        id_login: user.id_login,
        username: user.username
      },
      token: token
    });

  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Verifica login semplice (backward compatibility)
export const controllaLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT id_login, username FROM login WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      res.status(200).json({
        message: 'Login valido',
        user: rows[0]
      });
    } else {
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error('Errore lettura login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Inserimento login semplice (backward compatibility)
export const inserisciLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO login (username, password) VALUES (?, ?)',
      [username, password]
    );
    res.status(201).json({ 
      message: 'Utente registrato con successo', 
      insertId: result.insertId 
    });
  } catch (error) {
    console.error('Errore inserimento login:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username già esistente' });
    }
    
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// Ottieni tutti gli utenti (solo per admin)
export const getUtenti = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_login, username FROM login ORDER BY username');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    res.status(500).json({ error: 'Errore nel recupero degli utenti' });
  }
};

// Elimina utente
export const eliminaUtente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM login WHERE id_login = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    res.status(200).json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
  }
};

// Cambia password
export const cambiaPassword = async (req, res) => {
  const { id } = req.params;
  const { vecchiaPassword, nuovaPassword } = req.body;

  if (!vecchiaPassword || !nuovaPassword) {
    return res.status(400).json({ error: 'Vecchia e nuova password sono obbligatorie' });
  }

  if (nuovaPassword.length < 6) {
    return res.status(400).json({ error: 'La nuova password deve essere di almeno 6 caratteri' });
  }

  try {
    // Recupera l'utente
    const [users] = await pool.query('SELECT password FROM login WHERE id_login = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Verifica vecchia password
    const isValidOldPassword = await bcrypt.compare(vecchiaPassword, users[0].password);
    if (!isValidOldPassword) {
      return res.status(401).json({ error: 'Vecchia password non corretta' });
    }

    // Hash nuova password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(nuovaPassword, saltRounds);

    // Aggiorna password
    await pool.query('UPDATE login SET password = ? WHERE id_login = ?', [hashedNewPassword, id]);

    res.status(200).json({ message: 'Password cambiata con successo' });
  } catch (error) {
    console.error('Errore durante il cambio password:', error);
    res.status(500).json({ error: 'Errore nel cambio password' });
  }
};