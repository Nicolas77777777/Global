
import fetch from 'node-fetch';

// ✅ Mostra il form principale con eventuale evento selezionato e clienti trovati
export const mostraFormIscrizione = async (req, res) => {
  try {
    const eventiRes = await fetch('http://localhost:3000/evento/ricerca');
    const eventi = await eventiRes.json();

    const idEventoSelezionato = req.query.id_evento || null;
    const eventoSelezionato = idEventoSelezionato
      ? eventi.find(e => e.id_evento == idEventoSelezionato)
      : null;

    const clienti = req.query.clienti ? JSON.parse(decodeURIComponent(req.query.clienti)) : null;

    res.render('iscrizione', {
      eventi,
      eventoSelezionato,
      clienti,
      erroreEvento: req.query.erroreEvento || null,
      successo: req.query.successo || null,
      req
    });
  } catch (err) {
    console.error('❌ Errore mostra form iscrizione:', err);
    res.status(500).send("Errore caricamento dati");
  }
};

// ✅ Reindirizza alla pagina con evento selezionato
export const selezionaEvento = (req, res) => {
  const { id_evento } = req.body;
  res.redirect(`/iscrizioni?id_evento=${id_evento}`);
};

// ✅ Esegue la ricerca dei clienti e li invia tramite query (stateless)
export const ricercaClienti = async (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  try {
    const clientiRes = await fetch(`http://localhost:3000/cliente/ricerca?${query}`);
    const clienti = await clientiRes.json();

    const redirectUrl = `/iscrizioni?id_evento=${req.query.id_evento}&clienti=${encodeURIComponent(JSON.stringify(clienti))}`;
    res.redirect(redirectUrl);

  } catch (err) {
    console.error('❌ Errore ricerca clienti:', err);
    res.redirect('/iscrizioni?erroreEvento=Errore nella ricerca clienti');
  }
};

export const salvaIscrizione = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/iscrizioni/iscrivi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente: req.body.id_cliente,
        id_evento: req.body.id_evento
      })
    });

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      if (response.status === 201) {
        // ✅ Redirect alla pagina degli iscritti all'evento
        return res.redirect(`/iscrizioni/evento/${req.body.id_evento}/iscritti?successo=` + encodeURIComponent(data.messaggio));
      } else if (response.status === 409) {
        return res.redirect('/iscrizioni?erroreEvento=' + encodeURIComponent(data.messaggio));
      } else {
        return res.redirect('/iscrizioni?erroreEvento=' + encodeURIComponent(data.errore || 'Errore generico'));
      }
    } else {
      // 🔴 Risposta non JSON: stampa e mostra testo
      const text = await response.text();
      console.error('📄 Risposta non-JSON dal backend:', text);
      return res.redirect('/iscrizioni?erroreEvento=' + encodeURIComponent('Risposta non valida dal server'));
    }
  } catch (err) {
    console.error('❌ Errore salva iscrizione:', err);
    res.redirect('/iscrizioni?erroreEvento=Errore comunicazione server');
  }
};


export const mostraIscrittiEvento = async (req, res) => {
  const { id_evento } = req.params;

  try {
    const [eventoRes, iscrittiRes] = await Promise.all([
      fetch(`http://localhost:3000/evento/${id_evento}`),
      fetch(`http://localhost:3000/iscrizioni/evento/${id_evento}/clienti`)
    ]);

    const evento = await eventoRes.json();
    const iscritti = await iscrittiRes.json();

    res.render('risultati_iscritti_eventi', {
      evento,
      iscritti,
      successo: req.query.successo || null, // ✅ questo risolve l'errore
      errore: req.query.errore || null      // opzionale, utile in caso di errori
    });
  } catch (err) {
    console.error("❌ Errore caricamento iscritti evento:", err);
    res.status(500).send("Errore caricamento dati evento/iscritti");
  }
};

