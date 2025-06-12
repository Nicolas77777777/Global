// src/routes/clienteEventoRoutes.js
import express from 'express';
import {
  getIscrizioni,
  getIscrizioniByCliente,
  getIscrizioniByEvento,
  iscriviCliente,
  rimuoviIscrizione,
  rimuoviIscrizioneByClienteEvento,
  verificaIscrizione,
  getStatisticheIscrizioni
} from '../controllers/clienteEventoController.js';

const router = express.Router();

// Route per recuperare tutte le iscrizioni
router.get('/', getIscrizioni);

// Route per statistiche iscrizioni
router.get('/statistiche', getStatisticheIscrizioni);

// Route per verificare iscrizione specifica
router.get('/verifica/:id_cliente/:id_evento', verificaIscrizione);

// Route per iscrizioni di un cliente
router.get('/cliente/:id_cliente', getIscrizioniByCliente);

// Route per iscrizioni di un evento
router.get('/evento/:id_evento', getIscrizioniByEvento);

// Route per iscrivere un cliente a un evento
router.post('/', iscriviCliente);

// Route per rimuovere un'iscrizione per ID
router.delete('/:id', rimuoviIscrizione);

// Route per rimuovere iscrizione specificando cliente ed evento
router.delete('/cliente/:id_cliente/evento/:id_evento', rimuoviIscrizioneByClienteEvento);

export default router;