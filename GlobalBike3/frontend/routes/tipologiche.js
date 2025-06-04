// ✅ Importo express per creare il router
import express from 'express';

// ✅ Importo i controller delle tipologiche
import {
  mostraFormInserimento,
  salvaNuovaTipologica,
  mostraFormRicerca,
  eseguiRicercaTipologiche,
  mostraFormModifica,
  salvaModificaTipologica
} from '../controllers/tipologicheController.js';

const router = express.Router();

// 🔽 Mostra il form per inserire una nuova tipologica
router.get('/nuovo', mostraFormInserimento);

// 🔽 Salva una nuova tipologica (chiamata POST dal form)
router.post('/nuovo', salvaNuovaTipologica);

// 🔽 Mostra il form per la ricerca tipologiche
router.get('/ricerca', mostraFormRicerca);

// 🔽 Esegue la ricerca delle tipologiche
router.get('/risultati', eseguiRicercaTipologiche);

// 🔽 Mostra il form per modificare una tipologica
router.get('/:id/modifica', mostraFormModifica);

// 🔽 Salva la modifica della tipologica
router.post('/:id/modifica', salvaModificaTipologica);

export default router;
