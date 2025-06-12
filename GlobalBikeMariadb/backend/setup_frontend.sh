#!/bin/bash

# Crea la cartella e inizializza npm
mkdir frontend
cd frontend
npm init -y

# Installa le dipendenze
npm install express ejs node-fetch
npm install --save-dev nodemon

# Crea la struttura delle cartelle
mkdir -p src/views src/public/img src/public/css

# Crea file base
touch src/index.js .env

# Aggiungi script a package.json (alternativa più semplice senza json CLI)
sed -i '/"test":/a \    "start": "node src/index.js",\n    "dev": "nodemon src/index.js",' package.json

echo "✅ Frontend pronto. Avvia con: cd frontend && npm run dev"
