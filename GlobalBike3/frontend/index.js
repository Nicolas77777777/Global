import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import clientiRoutes from './routes/clienti.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 8081;

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));

// Rotte
server.use('/', authRoutes);
server.use('/clienti', clientiRoutes);

server.listen(port, () => {
  console.log(`✅ Server frontend avviato su http://localhost:${port}`);
});
