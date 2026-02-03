# Arhitektuur

## Kõrgtasemel pilt
Rakendus on staatiline (HTML/CSS/JS) ja käitub SPA-laadselt: eri “lehed” on sama dokumendi `.page` sektsioonid.

Navigeerimise reegel:
- korraga on aktiivne ainult **üks** `.page.active`
- nav toimub `navigateTo(pageId)` stiilis helper’i kaudu (või samaväärselt)

## Vaated (loogiline jaotus)
- **Home** (avaleht)
- **Plans**
- **Contacts**
- **Communication**
- **Incident Log**
- **Scenario Detail**
- **Incident Detail**

## State ja andmete hoidmine
Framework’i state’i pole.

Andmete kiht:
- **LocalStorage**: püsivad andmed (incidents, toggled jms)
- **Runtime**: JS muutujad / praegune valik UI-s (nt aktiivne incident/scenario)

## Kriisirežiim
Kriisirežiim aktiveeritakse stsenaariumi valiku kaudu.

Tüüpiline efekt:
- Home’il kuvatakse kriisibänner
- avaneb Scenario Detail vaade
- tekib (või uuendatakse) Incident (sõltuvalt reeglitest)

## Disainiprintsiibid
- deterministlikud töövood (vähe “maagiat”)
- explicit “Save” tegevused
- lihtne, väikese kognitiivse koormusega UI
