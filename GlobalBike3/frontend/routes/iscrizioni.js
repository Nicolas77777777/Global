// frontend/routes/iscrizioni.js
import express from 'express';
import {
  mostraFormIscrizione,
  selezionaEvento,
  ricercaClienti,
  salvaIscrizione
} from '../controllers/iscrizioniController.js';

const router = express.Router();

// ✅ Mostra pagina principale con selezione evento e ricerca cliente
router.get('/', mostraFormIscrizione);

// ✅ Salva selezione evento (menu a tendina)
router.post('/seleziona-evento', selezionaEvento);

// ✅ Ricerca clienti in base ai campi del form
router.get('/ricerca-cliente', ricercaClienti);

// ✅ Salva l'iscrizione (cliente → evento)
router.post('/', salvaIscrizione);

export default router;
