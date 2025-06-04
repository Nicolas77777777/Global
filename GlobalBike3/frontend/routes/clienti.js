import express from 'express';
import {
  showFormNuovo,
  salvaNuovoCliente,
  showFormRicerca,
  eseguiRicerca,
  mostraModifica,
  salvaModifica
} from '../controllers/clientiController.js';

const router = express.Router();

// Route per nuovo cliente
router.get('/nuovo', showFormNuovo);
router.post('/nuovo', salvaNuovoCliente);

// Route per ricerca clienti
router.get('/form', showFormRicerca);        // Mostra il form di ricerca
router.get('/ricerca', eseguiRicerca);       // ✅ AGGIUNTA: Esegue la ricerca
router.get('/risultati', eseguiRicerca);     // ✅ MANTENUTA: Per compatibilità

// Route per modifica cliente
router.get('/:id/modifica', mostraModifica);
router.post('/:id/modifica', salvaModifica);

export default router;
