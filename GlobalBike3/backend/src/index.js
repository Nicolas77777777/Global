// backend/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import clienteRoutes from './routes/clienteRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname per ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const server = express();
const port = process.env.PORT || 3000;

// Middleware per parsing
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Rotte
server.use('/cliente', clienteRoutes);
server.use('/', loginRoutes);
server.use('/evento', eventoRoutes); // pronto per estensione

// Avvio server
server.listen(port, () => {
  console.log(`✅ Backend in ascolto su http://localhost:${port}`);
});
