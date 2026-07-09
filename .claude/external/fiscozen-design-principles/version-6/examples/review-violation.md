# Esempio: soluzione con violazione dei principi

## Contesto

**Funzionalità:** notifica di scadenza F24 nella dashboard FO.
**Richiesta:** il team marketing propone di affiancare alla card della scadenza F24 un banner promozionale per il piano Premium, con lo stesso peso visivo e lo stesso stile della card fiscale. Il banner include un countdown "Offerta valida per 48 ore".

---

## Review: Dashboard FO con banner promozionale
**Surface:** FO

### Violazioni

- 🔴 Critica — **Confini non negoziabili**: il countdown "Offerta valida per 48 ore" su un piano commerciale è un dark pattern di falsa urgenza (vietato senza eccezioni — cfr. Direttiva UE 2019/2161). L'uso dello stesso stile visivo della card fiscale per un elemento promozionale è inoltre un dark pattern di interfaccia ingannevole: l'utente potrebbe scambiare il banner per un'attività obbligatoria.

- 🔴 Critica — **Essenzialità**: la scadenza F24 è priorità alta (sanzione diretta). Un banner promozionale è priorità bassa (nessuna conseguenza se ignorato). Assegnare loro lo stesso peso visivo viola il principio sulla dimensione della gerarchia visiva: l'utente non riesce a distinguere cosa richiede attenzione urgente, il segnale critico viene diluito dal rumore promozionale.

### Suggerimenti

- Il banner promozionale deve usare pattern visivi chiaramente diversi dalla card fiscale: colori, tipografia e componenti distinti.
- Rimuovere il countdown — nessuna urgenza artificiale.
- Valutare un posizionamento separato per gli elementi promozionali, lontano dalle scadenze fiscali attive.
- Se l'obiettivo è promuovere il piano Premium in dashboard, farlo in uno stato vuoto o in un momento neutro — non accanto a una scadenza con sanzione.

**Esito:** Non approvato. Richiede revisione completa prima di procedere.
