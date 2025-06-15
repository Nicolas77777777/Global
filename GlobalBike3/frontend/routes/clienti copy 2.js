import express from 'express';
import {
  showFormNuovo,
  salvaNuovoCliente,
  showFormRicerca,
  eseguiRicerca,
  mostraModifica,
  salvaModifica,
  eliminaCliente

} from '../controllers/clientiController.js';

const router = express.Router();

// Route per nuovo cliente
router.get('/nuovo', showFormNuovo);
router.post('/nuovo', salvaNuovoCliente);

// Route per ricerca clienti
router.get('/form', showFormRicerca);        // Mostra il form di ricerca (ora gestisce anche modalità eliminazione)
router.get('/ricerca', eseguiRicerca);       // ✅ AGGIORNATA: Esegue la ricerca (ora gestisce anche modalità eliminazione)
router.get('/risultati', eseguiRicerca);     // ✅ MANTENUTA: Per compatibilità

// Route per modifica cliente
router.get('/:id/modifica', mostraModifica);
router.post('/:id/modifica', salvaModifica);

// ✅ CORRETTO: Route per eliminazione con parametro ID obbligatorio
router.get('/elimina/:id', eliminaCliente);

export default router;