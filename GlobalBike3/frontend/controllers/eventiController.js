import fetch from 'node-fetch';

// 🔽 Mostra il form per creare un nuovo evento
export const mostraFormNuovoEvento = async (req, res) => {
  try {
    // ✅ CORRETTO: endpoint per tipologiche
    const response = await fetch('http://localhost:3000/api/tipologiche/ricerca');
    const tipologiche = await response.json();

    res.render('eventi_nuovo', {
      errore: null,
      successo: null,
      tipologiche
    });
  } catch (err) {
    console.error("Errore nel caricamento delle tipologiche:", err);
    res.render('eventi_nuovo', {
      errore: "Errore nel recupero delle categorie.",
      successo: null,
      tipologiche: []
    });
  }
};

export const salvaNuovoEvento = async (req, res) => {
  try {
    // ✅ CORRETTO: endpoint per creare evento
    const response = await fetch('http://localhost:3000/api/eventi/nuovo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titolo: req.body.titolo,
        categoria: req.body.categoria, // ✅ CORRETTO: campo categoria
        data_inizio: req.body.data_inizio,
        data_fine: req.body.data_fine,
        orario_inizio: req.body.orario_inizio,
        orario_fine: req.body.orario_fine,
        luogo: req.body.luogo,
        note: req.body.note,
        prezzo: req.body.prezzo
      })
    });

    // Recupera sempre le tipologiche per ri-renderizzare la pagina
    const tipologicheRes = await fetch('http://localhost:3000/api/tipologiche/ricerca');
    const tipologiche = await tipologicheRes.json();

    if (response.ok) {
      res.render('eventi_nuovo', {
        successo: 'Evento salvato con successo!',
        errore: null,
        tipologiche
      });
    } else {
      const errorData = await response.json();
      res.render('eventi_nuovo', {
        errore: errorData.errore || 'Errore nel salvataggio dell\'evento.',
        successo: null,
        tipologiche
      });
    }
  } catch (err) {
    console.error('Errore:', err);
    res.render('eventi_nuovo', {
      errore: 'Errore nella comunicazione con il server',
      successo: null,
      tipologiche: []
    });
  }
};

// ✅ Mostra la pagina di ricerca evento
export const mostraFormRicercaEvento = (req, res) => {
  res.render('eventi_ricerca', { errore: null, successo: null });
};

// ✅ Esegue la ricerca evento e mostra i risultati
export const eseguiRicercaEvento = async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    // ✅ CORRETTO: endpoint per ricerca eventi
    const response = await fetch(`http://localhost:3000/api/eventi/ricerca?${query}`);
    const eventi = await response.json();

    res.render('eventi_risultati', {
      errore: null,
      successo: req.query.titolo ? `Ricerca per "${req.query.titolo}" completata` : null,
      eventi
    });
  } catch (err) {
    console.error("❌ Errore nella ricerca:", err);
    res.render('eventi_ricerca', {
      errore: 'Errore durante la ricerca evento',
      successo: null
    });
  }
};

// ✅ Mostra form di modifica evento
export const mostraFormModificaEvento = async (req, res) => {
  const { id } = req.params;

  try {
    // Carica evento E tipologiche
    const [eventoRes, tipologicheRes] = await Promise.all([
      fetch(`http://localhost:3000/api/eventi/${id}`),
      fetch('http://localhost:3000/api/tipologiche/ricerca')
    ]);

    const evento = await eventoRes.json();
    const tipologiche = await tipologicheRes.json();

    // ✅ AGGIUNTO: formatta le date per l'input HTML
    if (evento.data_inizio) {
      evento.data_inizio = new Date(evento.data_inizio).toISOString().split('T')[0];
    }
    if (evento.data_fine) {
      evento.data_fine = new Date(evento.data_fine).toISOString().split('T')[0];
    }

    res.render('eventi_modifica', { 
      evento, 
      tipologiche, // ✅ AGGIUNTO: passa le tipologiche
      errore: null 
    });
  } catch (err) {
    console.error("❌ Errore caricamento evento:", err);
    res.status(500).send("Errore nel caricamento dell'evento");
  }
};

// ✅ Salva le modifiche evento
export const salvaModificaEvento = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ CORRETTO: endpoint e metodo per modifica
    const response = await fetch(`http://localhost:3000/api/eventi/${id}/modifica`, {
      method: 'PUT', // ✅ CORRETTO: usa PUT invece di POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titolo: req.body.titolo,
        categoria: req.body.categoria, // ✅ CORRETTO: campo categoria
        data_inizio: req.body.data_inizio,
        data_fine: req.body.data_fine,
        orario_inizio: req.body.orario_inizio,
        orario_fine: req.body.orario_fine,
        luogo: req.body.luogo,
        note: req.body.note,
        prezzo: req.body.prezzo
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errore || "Errore salvataggio");
    }

    res.redirect('/eventi/ricerca?successo=modificato');
  } catch (err) {
    console.error("❌ Errore durante la modifica:", err);
    res.status(500).send("Errore nel salvataggio delle modifiche");
  }
};