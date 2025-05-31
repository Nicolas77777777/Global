import fetch from 'node-fetch';

export const showFormNuovo = (req, res) => {
  res.render('clienti_nuovo', { errore: null, successo: null });
};

export const salvaNuovoCliente = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      res.render('clienti_nuovo', { errore: null, successo: 'Cliente salvato con successo!' });
    } else {
      res.render('clienti_nuovo', { errore: 'Errore nel salvataggio del cliente.', successo: null });
    }
  } catch (err) {
    console.error('Errore nella richiesta fetch:', err);
    res.render('clienti_nuovo', { errore: 'Errore durante il salvataggio', successo: null });
  }
};

export const showFormRicerca = (req, res) => {
  res.render('cliente_ricerca', { errore: null, successo: null });
};

export const eseguiRicerca = async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const response = await fetch(`http://localhost:3000/ricerca_cliente?${queryString}`);
    const clienti = await response.json();
    res.render('risultati_ricerca', { clienti });
  } catch (err) {
    console.error("Errore nella ricerca cliente:", err);
    res.render('risultati_ricerca', { clienti: [] });
  }
};

export const mostraModifica = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`http://localhost:3000/cliente/${id}`);
    if (!response.ok) throw new Error('Cliente non trovato');
    const cliente = await response.json();
    res.render('cliente_modifica', { cliente });
  } catch (err) {
    console.error("Errore caricamento cliente:", err);
    res.status(500).send("Errore nel caricamento del cliente");
  }
};

export const salvaModifica = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`http://localhost:3000/cliente/${id}/modifica`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) throw new Error("Errore nella risposta dal backend");
    res.redirect('/clienti/form');
  } catch (err) {
    console.error("Errore durante il salvataggio delle modifiche:", err);
    res.status(500).send("Errore nel salvataggio delle modifiche");
  }
};
