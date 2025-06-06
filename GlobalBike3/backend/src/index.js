// backend/src/index.js
// importiamo le librerie
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';



//Importiamo le rotte dei vari moduli
import clienteRoutes from './routes/clienteRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import tipologicheRoutes from './routes/tipologicheRoutes.js'; // <--- AGGIUNTA
import eventoRoutes from './routes/eventoRoutes.js';
import clienteEventoRoutes from './routes/clienteEventoRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname per ES module Setup iniziale del percorso __dirname (serve per compatibilità con ESModules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const server = express();
const port = process.env.PORT || 3000;

server.use(cors());


// Middleware per parsing
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// ✅ Registriamo le rotte principali

server.use('/', loginRoutes);
server.use('/cliente', clienteRoutes);
server.use('/tipologiche',tipologicheRoutes);
server.use('/evento', eventoRoutes); // pronto per estensione
server.use('/iscrizioni', clienteEventoRoutes);
server.use('/download', express.static(path.join(__dirname, '../export')));




// Avvio server
server.listen(port, () => {
  console.log(`✅ Backend in ascolto su http://localhost:${port}`);
});
