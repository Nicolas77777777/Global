import express from 'express';
import {
  iscriviCliente,
  clientiPerEvento,
  eventiPerCliente,
  rimuoviIscrizione
} from '../controllers/clienteEventoController.js';

const router = express.Router();

// 🔽 POST: Iscrivi un cliente a un evento
router.post('/iscrivi', iscriviCliente);

// 🔽 GET: Tutti i clienti iscritti a un evento
router.get('/evento/:id_evento/clienti', clientiPerEvento);

// 🔽 GET: Tutti gli eventi a cui è iscritto un cliente
router.get('/cliente/:id_cliente/eventi', eventiPerCliente);

// 🔽 DELETE: Rimuovi iscrizione
router.delete('/rimuovi', rimuoviIscrizione);

export default router;
