// src/db/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configurazione pool connessioni MariaDB
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin1',
  database: process.env.DB_DATABASE || 'bike_db3',
  password: process.env.DB_PASSWORD || '4TfkotJ4Ciyi3a$?',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+00:00'
});

// Test connessione al database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connessione al database MariaDB stabilita con successo');
    console.log(`📊 Database: ${process.env.DB_DATABASE}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
  } catch (error) {
    console.error('❌ Errore connessione al database:', error.message);
    process.exit(1);
  }
};

// Esegui test connessione all'avvio
testConnection();

// Gestione eventi pool
pool.on('connection', (connection) => {
  console.log(`🔗 Nuova connessione al database: ${connection.threadId}`);
});

pool.on('error', (err) => {
  console.error('❌ Errore del pool database:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Riconnessione al database...');
  } else {
    throw err;
  }
});

// Esporta sia come named export che come default per compatibilità
export { pool };
export default pool;