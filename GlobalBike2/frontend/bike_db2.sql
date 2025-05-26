-- Tabelle db bike -- 

CREATE TABLE login (
    id_login SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    numero_tessera SERIAL UNIQUE,
    cellulare VARCHAR(20),
    nome VARCHAR(100),
    cognome_rag_soc VARCHAR(150) NOT NULL,
    luogo_nascita VARCHAR(100),
    data_nascita DATE NOT NULL,
    data_iscrizione DATE NOT NULL,
    data_scadenza DATE NOT NULL,
    indirizzo VARCHAR(200),
    citta VARCHAR(100),
    provincia VARCHAR(50),
    cap VARCHAR(20),
    cf_piva VARCHAR(50),
    email VARCHAR(150) NOT NULL,
    note TEXT
);
