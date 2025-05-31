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

router.get('/nuovo', showFormNuovo);
router.post('/nuovo', salvaNuovoCliente);
router.get('/form', showFormRicerca);
router.get('/ricerca', eseguiRicerca);
router.get('/:id/modifica', mostraModifica);
router.post('/:id/modifica', salvaModifica);

export default router;
