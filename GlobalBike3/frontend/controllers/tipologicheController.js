import fetch from 'node-fetch';

// 🔽 Mostra il form di inserimento
export const mostraFormInserimento = (req, res) => {
  res.render('tipologiche_nuovo', { errore: null, successo: null });
};

// 🔽 Salva la nuova tipologica inviando i dati al backend
export const salvaNuovaTipologica = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/tipologiche/nuovo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      res.render('tipologiche_nuovo', { errore: null, successo: 'Tipologica salvata con successo!' });
    } else {
      res.render('tipologiche_nuovo', { errore: 'Errore nel salvataggio', successo: null });
    }
  } catch (err) {
    console.error('❌ Errore:', err);
    res.render('tipologiche_nuovo', { errore: 'Errore server', successo: null });
  }
};

// 🔽 Mostra il form di ricerca
export const mostraFormRicerca = (req, res) => {
  res.render('tipologiche_ricerca', { errore: null, successo: null, tipologiche: [] });
};

// 🔽 Esegue la ricerca sul backend e mostra i risultati
export const eseguiRicercaTipologiche = async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const response = await fetch(`http://localhost:3000/tipologiche/ricerca?${query}`);
    const tipologiche = await response.json();

    res.render('tipologiche_ricerca', { errore: null, successo: 'Ricerca completata', tipologiche });
  } catch (err) {
    console.error('❌ Errore ricerca:', err);
    res.render('tipologiche_ricerca', { errore: 'Errore durante la ricerca', successo: null, tipologiche: [] });
  }
};

// 🔽 Mostra il form per modificare una tipologica
export const mostraFormModifica = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`http://localhost:3000/tipologiche/${id}`);
    const tipologica = await response.json();

    res.render('tipologiche_modifica', { tipologica });
  } catch (err) {
    console.error('❌ Errore caricamento modifica:', err);
    res.status(500).send('Errore nel caricamento della tipologica');
  }
};

// 🔽 Salva la modifica della tipologica
export const salvaModificaTipologica = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`http://localhost:3000/tipologiche/${id}/modifica`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      res.redirect('/tipologiche/ricerca');
    } else {
      res.status(500).send('Errore nella modifica');
    }
  } catch (err) {
    console.error('❌ Errore salvataggio modifica:', err);
    res.status(500).send('Errore nella richiesta');
  }
};
