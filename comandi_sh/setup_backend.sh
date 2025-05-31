#!/bin/bash

# Crea cartelle struttura backend
mkdir -p backend/src/controllers backend/src/routes backend/src/db backend/src/models backend/sql
cd backend

# Inizializza npm
npm init -y

# Installa dipendenze
npm install express pg dotenv
npm install --save-dev nodemon

# Crea file principali
cd src
> index.js
cd db
> db.js
cd ../../
> .env

# Aggiunge script start e dev nel package.json
npx json -I -f package.json -e 'this.scripts={"start":"node src/index.js","dev":"nodemon src/index.js"}'

echo "✅ Backend inizializzato con struttura standard."
echo "Ora puoi avviare con: cd backend && npm run dev"

