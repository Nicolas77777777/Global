// src/routes/loginRoutes.js
import express from 'express';
import { 
  registraUtente, 
  autenticaUtente, 
  controllaLogin, 
  inserisciLogin,
  getUtenti,
  eliminaUtente,
  cambiaPassword
} from '../controllers/loginController.js';

const router = express.Router();

// Route per registrazione utente (con hash password)
router.post('/registra', registraUtente);

// Route per autenticazione utente (con JWT)
router.post('/autentica', autenticaUtente);

// Route per login semplice (backward compatibility)
router.post('/controllologin', controllaLogin);

// Route per inserimento login semplice (backward compatibility)
router.post('/login', inserisciLogin);

// Route per ottenere tutti gli utenti (admin only)
router.get('/utenti', getUtenti);

// Route per eliminare un utente
router.delete('/utenti/:id', eliminaUtente);

// Route per cambiare password
router.put('/utenti/:id/password', cambiaPassword);

export default router;