// src/routes/tipologicheRoutes.js
import express from 'express';
import {
  getTipologiche,
  getTipologicaById,
  creaTipologica,
  modificaTipologica,
  eliminaTipologica
} from '../controllers/tipologicheController.js';

const router = express.Router();

// Route per recuperare tutte le tipologiche
router.get('/', getTipologiche);

// Route per recuperare una tipologica specifica
router.get('/:id', getTipologicaById);

// Route per creare una nuova tipologica
router.post('/', creaTipologica);

// Route per modificare una tipologica
router.put('/:id', modificaTipologica);

// Route per eliminare una tipologica
router.delete('/:id', eliminaTipologica);

export default router;