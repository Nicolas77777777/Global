import express from 'express';
import {
  mostraFormInserimento,
  mostraFormModifica
} from '../controllers/tipologicheController.js';

const router = express.Router();

router.get('/nuovo', mostraFormInserimento);
router.get('/modifica', mostraFormModifica);

export default router;
