// ✅ Importiamo express per creare le rotte
import express from 'express';

// ✅ Importiamo le funzioni dal controller
import {
  creaTipologica,
  ricercaTipologiche,
  modificaTipologica,
  eliminaTipologica
} from '../controllers/tipologicheController.js';

// ✅ Creiamo il router (come un mini-server per gestire le rotte)
const router = express.Router();

// ✅ POST → Crea una nuova tipologica
// URL: POST /tipologiche/nuovo
router.post('/nuovo', creaTipologica);

// ✅ GET → Cerca tipologiche per descrizione
// URL: GET /tipologiche/ricerca?descrizione=qualcosa
router.get('/ricerca', ricercaTipologiche);

// ✅ PUT → Modifica una tipologica esistente
// URL: PUT /tipologiche/:id
router.put('/:id', modificaTipologica);

// ✅ DELETE → Elimina una tipologica
// URL: DELETE /tipologiche/:id
router.delete('/:id', eliminaTipologica);

// ✅ Esportiamo il router così possiamo usarlo in index.js
export default router;
