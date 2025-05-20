// db.js
import pkg from 'pg'; // connesione con pgadmin serve per parlare col database PostgreSQL
import dotenv from 'dotenv'; //file env serve per leggere le informazioni 
                                // segrete da un file .env (es: password del database)

dotenv.config(); // // carica le variabili del file .env e le rende disponiobili al sistema

const { Pool } = pkg;  // prende dalla libreira  pg la 
//                      funzione Pool, che serve per connettersi al database

const pool = new Pool({ // Crea una "piscina" di connessioni
                        //  (in inglese pool) al database.


  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;

