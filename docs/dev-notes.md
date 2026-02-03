# Dev Notes

## LocalStorage võtmete konventsioon
Näited (täpsusta vastavalt koodile):
- `bcm_incidents`
- `bcm_system_status`
- `bcm_exercise_mode`

## Tüüpilised “gotchas”
- DOM elementide olemasolu kontroll (eriti, kui lehed on conditionally renderdatud)
- duplikaat incidentite vältimine (create vs update)
- ÕPPUS flag’i järjepidevus kõigis töövoogudes

## Kuidas lisada sisu
- Uus stsenaarium: lisa scenarios andmefaili / andmestruktuuri
- Uus plaan: lisa plans andmefaili / struktuuri
- UI tekstid: `index.html`

## Debug
- LocalStorage clear = reset
- Console log aitab kiiresti flow’d jälgida
