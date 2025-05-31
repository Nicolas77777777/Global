#!/bin/bash

# Crea la cartella del frontend
mkdir frontend
cd frontend

# Inizializza il progetto npm
npm init -y

# Installa le dipendenze principali
npm install express ejs node-fetch

# Installa nodemon per sviluppo
npm install --save-dev nodemon

# Crea la struttura delle cartelle
mkdir -p controllers routes views/partials public/img public/css

# Crea i file principali
touch index.js .env

# Aggiunge gli script al package.json
sed -i '/"test":/a \    "start": "node index.js",\n    "dev": "nodemon index.js",' package.json

echo "✅ Frontend pronto."
echo "📁 Avvia con: cd frontend && npm run dev"

