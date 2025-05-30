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

# Aggiungi script a package.json
npx json -I -f package.json -e \
  'this.scripts = { "start": "node src/index.js", "dev": "nodemon src/index.js" }'

echo "✅ Frontend pronto. Avvia con: npm run dev"

