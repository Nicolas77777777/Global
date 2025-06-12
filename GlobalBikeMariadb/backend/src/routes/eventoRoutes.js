// src/routes/eventoRoutes.js
import express from 'express';
import {
  getEventi,
  getEventiAttivi,
  getEventoById,
  ricercaEventi,
  creaEvento,
  modificaEvento,
  eliminaEvento,
  toggleEventoAttivo
} from '../controllers/eventoController.js';

const router = express.Router();

// Route per recuperare tutti gli eventi
router.get('/', getEventi);

// Route per ricerca eventi (deve essere prima di /:id)
router.get('/ricerca', ricercaEventi);

// Route per eventi attivi
router.get('/attivi', getEventiAttivi);

// Route per recuperare un evento specifico
router.get('/:id', getEventoById);

// Route per creare un nuovo evento
router.post('/', creaEvento);

// Route per modificare un evento
router.put('/:id', modificaEvento);

// Route per attivare/disattivare un evento
router.patch('/:id/toggle', toggleEventoAttivo);

// Route per eliminare un evento
router.delete('/:id', eliminaEvento);

export default router;