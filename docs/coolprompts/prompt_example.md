ÜLESANNE: Tee nii, et Logid & Intsidendid lehelt avatud intsidendi detail oleks EDITITAV kuni status != CLOSED.

KONTEKST / BUG
- Kui avan intsidendi Logid & Intsidendid vaates, siis detail on read-only:
  - enamik välju on disabled / ei saa muuta
  - ainult staatust saab muuta
- See on vale: intsidenti peab saama muuta kuni see pole CLOSED.

NÕUTUD REEGEL
- Kui incident.status != 'CLOSED' → detailvaade on editable (samad väljad nagu triage/detail vaates).
- Kui incident.status == 'CLOSED' → detailvaade on read-only (OK).
- EELVAADE (incident “pole avatud” / preview) jääb endiselt read-only, isegi kui status pole CLOSED (see on eraldi UI-state).

SCOPE
- Parandada ainult incident detaili “readOnly/disabled” loogika ja Logs → detail avamise kontekst:
  - src/app.js ja/või crisis-app.js (incident detail render)
  - src/utils/incidentGate.js (kui see määrab preview/active)
  - src/utils/navigation.js (ainult kui route state vaja)
  - incients/logs page (IncidentsPage.js vms)
- ÄRA muuda:
  - incident create flow (dialoog + eelvaade)
  - LocalStorage skeemi (bcm_incidents jne)
  - nav history fix (see on juba tehtud)
  - UI kujundust (ainult enabled/disabled)

TÖÖJUHIS (kuidas leida põhjus)
1) Leia koht, kus incident detaili väljad pannakse disabled:
   - otsi "disabled", "readOnly", "preview", "isPreview", "isActive", "incidentNotOpened"
2) Leia, mis lipuga Logs lehelt avamine detaili jõuab (nt window.currentIncidentId, localStorage currentIncidentId, route param, etc).
3) Tee minimaalne paranduse loogika:
   - compute:
     - const isClosed = incident.status === 'CLOSED'
     - const isPreview = (existing preview condition)  // kollase ribaga variant
     - const canEdit = !isClosed && !isPreview
   - kasuta canEdit -> input.disabled = !canEdit
4) Kontrolli, et Logs-ist avades ei satuks kogemata preview režiimi (kui see oli probleem):
   - kui Logs avab incidenti, siis see peaks olema "opened context", mitte "preview"
   - ära muuda eelvaate reeglit stsenaariumivalikus (TÜHISTA → preview)

ACCEPTANCE CRITERIA (manual tests)
1) Ava Logid & Intsidendid → vali incident, mille status = ACTIVE (või muu != CLOSED):
   - saad muuta Põhiinfo/Mõju/Meeskond/Kokkuvõte välju + checkboxe
   - SAVE töötab ja jääb alles refreshiga
2) Muuda see incident status CLOSED:
   - pärast seda detail muutub read-only (väljad disabled)
3) Stsenaariumivalik → TÜHISTA (eelvaade):
   - jääb read-only + kollane riba + “AVA INTSIDENT”
4) Ei teki uusi nav/regressioone.

OUTPUT
- 1) juurpõhjus (miks Logs-ist tuli read-only)
- 2) muudetud failid
- 3) diff
- 4) testplaan

DOKUMENTATSIOONI MÕJU
- PRD.md → NO (reegel on juba olemas “editable until CLOSED” implitsiitselt)
- APP_FLOW.md → kui seal on kirjas, et Logs on read-only, siis YES; muidu NO
- FRONTEND_GUIDELINES.md → NO
