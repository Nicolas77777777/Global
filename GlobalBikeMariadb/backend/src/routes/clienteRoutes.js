// src/routes/clienteRoutes.js
import express from 'express';
import {
  getClienti,
  getClienteById,
  ricercaCliente,
  creaCliente,
  modificaCliente,
  eliminaCliente,
  aggiornaScadenza,
  getClientiInScadenza
} from '../controllers/clienteController.js';

const router = express.Router();

// Route per recuperare tutti i clienti
router.get('/', getClienti);

// Route per ricerca clienti (deve essere prima di /:id per evitare conflitti)
router.get('/ricerca', ricercaCliente);

// Route per clienti in scadenza
router.get('/scadenza', getClientiInScadenza);

// Route per recuperare un cliente specifico
router.get('/:id', getClienteById);

// Route per creare un nuovo cliente
router.post('/', creaCliente);

// Route per modificare un cliente
router.put('/:id', modificaCliente);
router.post('/:id/modifica', modificaCliente); // Supporto anche per POST (compatibilità)

// Route per aggiornare solo la scadenza
router.patch('/:id/scadenza', aggiornaScadenza);

// Route per eliminare un cliente
router.delete('/:id', eliminaCliente);

export default router;