# Andmemudel

## Incident (põhientiteet)
Incident esindab reaalse või õppus-intsidendi juhtumit.

Soovituslikud väljad (minimaalne skeem):
- `id` (string)
- `title` (string)
- `scenarioId` (string|null)
- `type` (`physical` | `cyber`)
- `status` (`active` | `closed`)
- `isExercise` (boolean)
- `severity` (`S0`–`S3`)
- `createdAt` (ISO string)
- `updatedAt` (ISO string)

## Cyber Incident Metrics (triage / mõõtmed)
Kasutatakse küberintsidendi esmaseks hindamiseks ja raporteerimiseks.

Tüüpilised väljad:
- `t0` (esmatuvastuse aeg)
- `affectedDomain` / `affectedService`
- `serviceDisruption` (yes/no või boolean)
- `dataLeakSuspected` (yes/no või boolean)
- `notifications` (objekt või list: CERT/regulaator/sisemine)

## System Status
Organisatsiooni üldolek (Home pill + vajadusel manual override).

Soovituslikud väljad:
- `mode` (`AUTO` | `MANUAL`)
- `level` (`OK` | `WARNING` | `ALERT`)
- `reason` (string)
- `updatedAt` (ISO string)

## Hoiustamine
Kõik entiteedid salvestatakse LocalStorage’is JSON’ina.
