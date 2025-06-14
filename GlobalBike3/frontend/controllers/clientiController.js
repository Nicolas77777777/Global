import fetch from 'node-fetch';

export const showFormNuovo = (req, res) => {
  res.render('clienti_nuovo', { errore: null, successo: null });
};

export const salvaNuovoCliente = async (req, res) => {
  try {
    // ✅ CORRETTO: Endpoint backend giusto (singolare)
    const response = await fetch('http://localhost:3000/cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      res.render('clienti_nuovo', { errore: null, successo: 'Cliente salvato con successo!' });
    } else {
      const errorText = await response.text();
      console.error('❌ Errore salvataggio:', errorText);
      res.render('clienti_nuovo', { errore: 'Errore nel salvataggio del cliente.', successo: null });
    }
  } catch (err) {
    console.error('Errore nella richiesta fetch:', err);
    res.render('clienti_nuovo', { errore: 'Errore durante il salvataggio', successo: null });
  }
};

export const showFormRicerca = (req, res) => {
  console.log('🎯 === DEBUG SHOW FORM RICERCA ===');
  console.log('📋 req.query completo:', req.query);
  
  // ✅ Controllo esplicito del parametro
  const eliminaParam = req.query.elimina;
  console.log('🔍 req.query.elimina:', eliminaParam, '(tipo:', typeof eliminaParam, ')');
  
  const modalitaEliminazione = eliminaParam === 'true';
  console.log('🗑️ modalitaEliminazione calcolata:', modalitaEliminazione);
  
  const dataToRender = {
    errore: req.query.errore || null, 
    successo: req.query.successo || null,
    clienti: null,
    modalitaEliminazione: modalitaEliminazione
  };
  
  console.log('🎨 Dati che sto per passare alla vista:', dataToRender);
  console.log('🎯 === FINE DEBUG SHOW FORM RICERCA ===');
  
  res.render('cliente_ricerca', dataToRender);
};

export const eseguiRicerca = async (req, res) => {
  console.log('🎯 === DEBUG ESEGUI RICERCA ===');
  console.log('📋 req.query completo:', req.query);
  
  try {
    // ✅ Controllo esplicito del parametro
    const eliminaParam = req.query.elimina;
    console.log('🔍 req.query.elimina:', eliminaParam, '(tipo:', typeof eliminaParam, ')');
    
    const modalitaEliminazione = eliminaParam === 'true';
    console.log('🗑️ modalitaEliminazione calcolata:', modalitaEliminazione);
    
    // ✅ MODIFICATO: Rimuove il parametro 'elimina' dalla query string per il backend
    const searchParams = { ...req.query };
    delete searchParams.elimina;
    
    const queryString = new URLSearchParams(searchParams).toString();
    console.log('🔗 Query string per backend:', queryString);
    
    // ✅ CORRETTO: Endpoint backend giusto (singolare cliente)
    const backendUrl = `http://localhost:3000/cliente/ricerca?${queryString}`;
    console.log('📡 Chiamata backend:', backendUrl);
    
    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Errore backend response:', response.status, errorText);
      throw new Error(`Errore backend: ${response.status} - ${errorText}`);
    }

    const clienti = await response.json();
    console.log('✅ Risultati ricevuti:', clienti.length, 'clienti trovati');
    
    const dataToRender = {
      clienti: clienti,
      errore: null,
      successo: clienti.length > 0 ? `Trovati ${clienti.length} clienti` : 'Nessun cliente trovato',
      modalitaEliminazione: modalitaEliminazione
    };
    
    console.log('🎨 Dati che sto per passare alla vista risultati_ricerca:');
    console.log('   - clienti:', clienti.length, 'elementi');
    console.log('   - modalitaEliminazione:', dataToRender.modalitaEliminazione);
    console.log('   - errore:', dataToRender.errore);
    console.log('   - successo:', dataToRender.successo);
    console.log('🎯 === FINE DEBUG ESEGUI RICERCA ===');
    
    res.render('risultati_ricerca', dataToRender);
  } catch (err) {
    console.error("❌ Errore completo nella ricerca cliente:", err);
    
    const modalitaEliminazione = req.query.elimina === 'true';
    console.log('🗑️ modalitaEliminazione (errore):', modalitaEliminazione);
    
    res.render('risultati_ricerca', { 
      clienti: [],
      errore: `Errore durante la ricerca: ${err.message}`,
      successo: null,
      modalitaEliminazione: modalitaEliminazione
    });
  }
};

export const mostraModifica = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('🔧 Caricamento cliente per modifica, ID:', id);
    
    // ✅ CORRETTO: Endpoint giusto (singolare)
    const response = await fetch(`http://localhost:3000/cliente/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cliente non trovato:', response.status, errorText);
      throw new Error(`Cliente non trovato: ${response.status}`);
    }
    
    const cliente = await response.json();
    console.log('✅ Cliente caricato:', cliente);
    
    res.render('cliente_modifica', { cliente });
  } catch (err) {
    console.error("❌ Errore caricamento cliente:", err);
    res.status(500).send(`Errore nel caricamento del cliente: ${err.message}`);
  }
};

export const salvaModifica = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('💾 Salvataggio modifica cliente ID:', id, 'Dati:', req.body);
    
    // ✅ CORRETTO: Endpoint giusto (singolare)
    const response = await fetch(`http://localhost:3000/cliente/${id}/modifica`, {
      method: 'POST', // Il backend usa POST per le modifiche
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Errore salvataggio backend:', response.status, errorText);
      throw new Error(`Errore backend: ${response.status} - ${errorText}`);
    }
    
    console.log('✅ Cliente modificato con successo');
    res.redirect('/clienti/form?successo=Cliente modificato con successo');
  } catch (err) {
    console.error("❌ Errore durante il salvataggio delle modifiche:", err);
    res.status(500).send(`Errore nel salvataggio: ${err.message}`);
  }
};

// ✅ CORRETTO: Elimina cliente con endpoint e gestione errori corretti
export async function eliminaCliente(req, res) {
  const { id } = req.params;

  try {
    console.log('🗑️ Eliminazione cliente ID:', id);
    
    // ✅ ENDPOINT CORRETTO: Ora corrisponde al backend /:id
    const response = await fetch(`http://localhost:3000/cliente/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // ✅ Il backend restituisce JSON con messaggio
      const result = await response.json();
      console.log('✅ Cliente eliminato con successo:', result.messaggio);
      
      res.redirect('/clienti/form?elimina=true&successo=Cliente eliminato con successo (incluse tutte le iscrizioni agli eventi)');
    } else {
      // ✅ GESTIONE ERRORI: Il backend può restituire testo o JSON
      let errorMessage = 'Errore durante l\'eliminazione del cliente';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.errore || errorData.messaggio || errorMessage;
      } catch {
        // Se non è JSON, prova come testo
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      
      console.error("❌ Errore eliminazione:", response.status, errorMessage);
      
      if (response.status === 404) {
        res.redirect('/clienti/form?elimina=true&errore=Cliente non trovato');
      } else if (response.status === 400 || response.status === 409) {
        res.redirect('/clienti/form?elimina=true&errore=Impossibile eliminare: cliente associato a vincoli nel database');
      } else {
        res.redirect(`/clienti/form?elimina=true&errore=${encodeURIComponent(errorMessage)}`);
      }
    }
  } catch (err) {
    console.error("❌ Errore connessione:", err);
    res.redirect('/clienti/form?elimina=true&errore=Errore di connessione al server');
  }
}