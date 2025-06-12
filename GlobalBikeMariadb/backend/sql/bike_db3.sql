-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Giu 12, 2025 alle 10:33
-- Versione del server: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- Versione PHP: 8.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bike_db3`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `numero_tessera` int(11) DEFAULT NULL,
  `cellulare` varchar(20) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `cognome_rag_soc` varchar(150) NOT NULL,
  `luogo_nascita` varchar(100) DEFAULT NULL,
  `data_nascita` date NOT NULL,
  `data_iscrizione` date NOT NULL,
  `data_scadenza` date NOT NULL,
  `indirizzo` varchar(200) DEFAULT NULL,
  `citta` varchar(100) DEFAULT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `cap` varchar(20) DEFAULT NULL,
  `cf_piva` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Trigger `cliente`
--
DELIMITER $$
CREATE TRIGGER `trg_set_numero_tessera` BEFORE INSERT ON `cliente` FOR EACH ROW BEGIN
    DECLARE max_tessera INT;

    IF NEW.numero_tessera IS NULL THEN
        SELECT IFNULL(MAX(numero_tessera), 0) + 1 INTO max_tessera FROM cliente;
        SET NEW.numero_tessera = max_tessera;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struttura della tabella `cliente_evento`
--

CREATE TABLE `cliente_evento` (
  `id_cliente_evento` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `data_iscrizione` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `evento`
--

CREATE TABLE `evento` (
  `id_evento` int(11) NOT NULL,
  `titolo` varchar(255) NOT NULL,
  `categoria` int(11) NOT NULL,
  `data_inizio` date NOT NULL,
  `data_fine` date NOT NULL,
  `orario_inizio` time DEFAULT NULL,
  `orario_fine` time DEFAULT NULL,
  `luogo` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `prezzo` decimal(10,2) DEFAULT NULL,
  `attivo` tinyint(1) DEFAULT 1,
  `creato_il` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `login`
--

CREATE TABLE `login` (
  `id_login` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tipologiche`
--

CREATE TABLE `tipologiche` (
  `id_tipologica` int(11) NOT NULL,
  `descrizione` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `numero_tessera` (`numero_tessera`);

--
-- Indici per le tabelle `cliente_evento`
--
ALTER TABLE `cliente_evento`
  ADD PRIMARY KEY (`id_cliente_evento`),
  ADD UNIQUE KEY `univoco_cliente_evento` (`id_cliente`,`id_evento`),
  ADD KEY `fk_evento` (`id_evento`);

--
-- Indici per le tabelle `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `categoria` (`categoria`);

--
-- Indici per le tabelle `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id_login`);

--
-- Indici per le tabelle `tipologiche`
--
ALTER TABLE `tipologiche`
  ADD PRIMARY KEY (`id_tipologica`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `cliente_evento`
--
ALTER TABLE `cliente_evento`
  MODIFY `id_cliente_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `evento`
--
ALTER TABLE `evento`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `login`
--
ALTER TABLE `login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `tipologiche`
--
ALTER TABLE `tipologiche`
  MODIFY `id_tipologica` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `cliente_evento`
--
ALTER TABLE `cliente_evento`
  ADD CONSTRAINT `fk_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE CASCADE;

--
-- Limiti per la tabella `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`categoria`) REFERENCES `tipologiche` (`id_tipologica`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
