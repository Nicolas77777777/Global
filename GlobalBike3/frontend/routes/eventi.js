import express from 'express';
import {
  mostraFormNuovoEvento,
  salvaNuovoEvento,
  mostraFormRicercaEvento,
  eseguiRicercaEvento,
  mostraFormModificaEvento,
  salvaModificaEvento
} from '../controllers/eventiController.js';

const router = express.Router();

// ✅ Form nuovo evento
router.get('/nuovo', mostraFormNuovoEvento);
router.post('/nuovo', salvaNuovoEvento);

// ✅ Ricerca eventi
router.get('/ricerca', mostraFormRicercaEvento);
router.get('/risultati', eseguiRicercaEvento);

// ✅ CORREZIONE: la ricerca dovrebbe essere gestita dalla stessa route
// Combina ricerca form e risultati
router.get('/ricerca', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    // Se ci sono parametri di query, esegui la ricerca
    eseguiRicercaEvento(req, res);
  } else {
    // Altrimenti mostra il form
    mostraFormRicercaEvento(req, res);
  }
});

// ✅ Modifica evento
router.get('/:id/modifica', mostraFormModificaEvento);
router.post('/:id/modifica', salvaModificaEvento);

export default router;