// backend/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importiamo la connessione al database per il test iniziale
import pool from './db/db.js';

// Importiamo le rotte dei vari moduli
import clienteRoutes from './routes/clienteRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import tipologicheRoutes from './routes/tipologicheRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import clienteEventoRoutes from './routes/clienteEventoRoutes.js';

// Setup __dirname per ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione ambiente
dotenv.config();
const server = express();
const port = process.env.PORT || 3000;

// Configurazione CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

server.use(cors(corsOptions));

// Middleware per parsing
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware per log delle richieste in development
if (process.env.NODE_ENV === 'development') {
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Route di base per verificare che il server funzioni
server.get('/', (req, res) => {
  res.json({
    message: 'Bike & Hike API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'running'
  });
});

// Route per verificare la connessione al database
server.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Registrazione delle rotte principali
server.use('/api/auth', loginRoutes);
server.use('/api/clienti', clienteRoutes);
server.use('/api/tipologiche', tipologicheRoutes);
server.use('/api/eventi', eventoRoutes);
server.use('/api/iscrizioni', clienteEventoRoutes);

// Manteniamo anche le route originali per backward compatibility
server.use('/', loginRoutes);
server.use('/cliente', clienteRoutes);
server.use('/tipologiche', tipologicheRoutes);
server.use('/evento', eventoRoutes);
server.use('/iscrizioni', clienteEventoRoutes);

// Serve file statici per download ed export
server.use('/download', express.static(path.join(__dirname, '../export')));
server.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Gestione errori globale
server.use((err, req, res, next) => {
  console.error('Errore non gestito:', err);
  res.status(500).json({
    error: 'Errore interno del server',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Si è verificato un errore'
  });
});

// Gestione route non trovate
server.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trovata',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Gestione chiusura graceful del server
process.on('SIGINT', async () => {
  console.log('\n🛑 Arresto del server in corso...');
  try {
    await pool.end();
    console.log('✅ Connessioni database chiuse');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante la chiusura:', error);
    process.exit(1);
  }
});

// Avvio server
server.listen(port, () => {
  console.log('🚀 ===================================');
  console.log(`✅ Bike & Hike API Server avviato`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`🗄️  Database: ${process.env.DB_DATABASE}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ===================================');
  console.log('📍 Endpoints disponibili:');
  console.log('   GET  /                    - Info server');
  console.log('   GET  /health              - Health check');
  console.log('   POST /api/auth/login      - Login');
  console.log('   GET  /api/clienti         - Lista clienti');
  console.log('   GET  /api/eventi          - Lista eventi');
  console.log('   GET  /api/tipologiche     - Lista categorie');
  console.log('   GET  /api/iscrizioni      - Lista iscrizioni');
  console.log('🚀 ===================================');
});

export default server;