
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

// ✅ Salva l'iscrizione al backend
export const salvaIscrizione = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/iscrizioni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente: req.body.id_cliente,
        id_evento: req.body.id_evento
      })
    });

    if (response.ok) {
      res.redirect('/iscrizioni?successo=Iscrizione completata con successo');
    } else {
      const errData = await response.json();
      res.redirect('/iscrizioni?erroreEvento=' + encodeURIComponent(errData.messaggio || 'Errore nell’iscrizione'));
    }
  } catch (err) {
    console.error('❌ Errore salva iscrizione:', err);
    res.redirect('/iscrizioni?erroreEvento=Errore comunicazione server');
  }
};
