// backend/src/routes/clienteRoutes.js
import express from 'express';
import {
  creaCliente,
  modificaCliente,
  ricercaCliente
} from '../controllers/clienteController.js';

const router = express.Router();

// Inserimento nuovo cliente
router.post('/', creaCliente);

// Modifica cliente esistente
router.post('/:id/modifica', modificaCliente);

// Ricerca clienti con parametri
router.get('/ricerca', ricercaCliente);

export default router;
