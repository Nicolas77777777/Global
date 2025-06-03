export const mostraFormInserimento = (req, res) => {
  res.render('tipologiche_nuovo', { titolo: 'Nuova Tipologia Evento' });
};

export const mostraFormModifica = (req, res) => {
  res.render('tipologiche_modifica', { titolo: 'Modifica Tipologia Evento' });
};
