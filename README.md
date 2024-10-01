# Kylling&Ris

Kylling&Ris er en nettside à la myfitnesspal, som lar brukeren søke på og registrere mat de har spist. Nettsiden gir brukeren muligheten til å søke, filtrere og sortere et sett med data, hentet fra et REST-API med produkter fra norske dagligvarebutikker: <https://kassal.app/api>. Brukeren kan så enkelt registrere matelementer ved å klikke på tilhørende pluss-knapp. Deretter kan brukeren skrive inn vekten på produktet og velge hvilken dato hen vil registrere det på. Produktet vises så i en tabell, hvor man kan navigere mellom datoer ved hjelp av en kalender og dens tilhørende pilknapper. I tabellen kan brukeren siden fjerne eller endre registrerte elementer fra tabellen vha. henholdvis et søppelbøtte- og blyantikon.

## Oppsett

For å starte nettsiden, naviger til rotmappen, og kjør med npm:  
`cd .\kylling-ris`  
`npm install`  
`npm run dev`

For å starte serveren må man enten være på Eduroam eller ha på VPN. Naviger deretter til rotmappen, og kjør med npm:  
`cd .\backend`  
`npm install`  
`npm run dev`

## Krav

### Funksjonelle krav

- Søkemulighet med søkefelt for input av søk.
- Listebasert presentasjon av søk med dynamisk lasting av flere resultater ved scrolling.
- Relevant info om matobjekt vises ved søk eller i tabellen. Man kan klikke seg innpå hvert matobjekt i søket for å få mer informasjon.
- Mulighet for sortering og filtrering av resultatsettet (allergener, proteininnhold o.l.).
- Matloggen og brukeren den hører til er vår brukergenerte data. Dataen lagres på server. Hvis du ikke har laget bruker, får du tildelt en gjestebruker, slik at dataen uansett blir lagret på server.
- Applikasjonen har et pent og responsivt design.
- Database og backend er satt opp på gruppas virtuelle maskin.

### Tekniske krav

- Applikasjonen er laget med React, Typescript, og satt opp med Vite.
- State managment ved hjelp av redux. Vi lagrer søkeinnstillinger og datoen matloggen er på.
- Bruker importerte tredjepartskomponenter (f.eks. datepicker-kalender- og infinite scroll-elementene).
- Benytter Neo4j for backend-database. Bruker GraphQL, Apollo Server og Apollo Client for spørringer. Ca. 7500 ulike matobjekter ligger i databasen.
- Prettier har (stort sett) blitt benyttet underveis for å formatere koden. Det har blitt kjørt gjennom repoet med eslint og prettier før innlevering.
- Vi har satt opp tester for frontend, og backend testes noe i "end-to-end"-tester av matsøk. Vi testet også manuelt queries og mutations med Apollo Server sandbox.
- Kommentarer har blitt benyttet underveis for å utdype koden.

## Testing

- Vi har testet det meste av funksjonaliteten i appen.
  - Basic frontend-funksjonalitet testes med enhetstester for komponenter, samt snapshot-tester for sidene.
  - Mocking brukes for å teste frontend-funksjonalitet uavhengig av serveren.
  - Vi har satt opp end-to-end-tester med Playwright for å teste flyten i appen, og indirekte teste backend-funksjonalitet. Disse ligger i en egen "e2e"-mappe.

For å kjøre enhetstestene, naviger til rotmappen og kjør med npm:  
`cd .\kylling-ris`  
`npm run test`

For å kjøre end-to-end-testene, naviger til rotmappen og kjør med npm:  
`cd .\kylling-ris`  
`npx playwright test`

Det kan hende du må installere browsers for å kjøre e2e-testene, kjør med npm:  
`npx playwright install`

End-to-end tester krever tilgang til server. Ta på VPN.

Vi har prøvd nettsiden på Firefox, Edge, Chrome og Opera på PC. I tillegg har vi skrevet tester for de fleste komponentene og sidene.

## Tilgjengelighet

### Mulighet til å oppfatte og betjene nettsiden

- Lagt til aria-labels for å støtte skjermlesere.
- Passelig tekstavstand og valg av farger med tydelig kontrast slik at det er lettere å lese nettsiden for mennesker med synsproblemer.
- Lagt til tekstalternativer til ikke-tekstlig innhold.
- All funksjonalitet som er viktig er tilgjengelig med tastatur.
- Det er lett å navigere nettsiden vår siden den består kun av tre sider.
- Vi har prøvd å unngå overbruk av div/span taggen.

### Forståelighet

- Lagt til "Kaloriteller" som undertekst i logoen slik at bruker skjønner hensikten med nettsiden.
- Lagt til beskrivende hjelptekst i matloggen når brukeren ikke har lagt til noe mat for dagen.
- Lagt til ulik styling når komponenter får fokus for å tydliggjøre at brukeren kan samhandle med den aktuelle komponenten.
- Nettsiden hjelper brukeren med å unngå feil. Det er for eksempel umulig å legge til mat i fremtiden.

## Bærekraft

- Vi bruker kun små bilder på SVG format, noe som minker datatraffiken på nettsiden vår.
- Det gjøres kall til databasen for å laste inn flere matvarer etterhvert som man scroller ned. På den måten hentes ikke unødvendig mye data ut.
- Vi er klar over at mørke farger sparer strøm, men vi har lyst at nettsiden skal ha akkurat det fargepalettet vi har. Dark mode mener vi hadde sett stygt ut med fargene våre.

## Diverse

### Søkeinnstillinger

Vi har sortering og filtreringsvalg på matsøk fordi det er krav, men det passer ikke helt til denne typen applikasjon. Hensikten med matsøket er å finne mat man allerede har spist; den er ikke der for å finne ut av hva man skal handle på butikken. Derfor har vi gitt denne funksjonaliteten lite plass på nettsiden - den er gjemt bak en liten knapp. Nåværende implementasjon tillater bare sortering når man ikke har søkt på noe. Dette er på grunn av begrensninger med soteringsfunksjonen. Brukeren informeres om dette ved hjelp av et tooltip.

### Lucene søk

Vi bruker neo4j, som bruker lucene til søking. Den kunne vi ikke helt få til å gi gode søkeresultater. Vi har prøvd å matche med "\*" på slutten. Da gir den alle resultatene, men resultatene har samme relevans. Vi bruker fuzzy søk med "~", og da får de ulik relevans, men det er fortsatt noen rare resultater. Lucene virker ikke å være laget for sånn type søk vi har.

### Brukersikkerhet

Når det kommer til brukersikkerhet valgte gruppen å nedprioritere dette. Dette grunnet at applikasjonen kun skal brukes i prosjektsammenheng, og det ikke var spesifisert noe krav om dette. Derfor er passord lagret i klartekst i databasen. I en reell situasjon ville vi måttet "hashe" passordene, for å ikke lagre de i klartekst i databasen. Dette vil øke sikkerheten dersom databasen skulle blitt kompromittert, eller lekket på en annen måte.

### Gjemming av warnings/errors

Vi har gjemt noen warnings/errors fra konsollen. Dette gjøres i [main.tsx](/kylling-ris/src/main.tsx). Dette ble gjort fordi dette er feilmeldinger som vi ikke har kontroll over, da de skyldes bruk av tredjeparts komponenter. Vi har heller ikke noe bruk for disse feilmeldingene, i tillegg til at siden kjører fint på tross av de. Det ble derfor gjort et valg om å gjemme disse.

### Ekstra funksjonalitet vi kunne implementert

Vi hadde noen ideer for funksjonalitet vi hadde lyst til å implementere, men ikke fikk til pga. tidspress. Disse er:

- Støtte for QR-scanning av strekkoder på matvarer, for å enkelt kunne legge til mat i applikasjonen.
- Gi brukeren mulighet til å legge til egendefinerte måltider (f.eks. brødskive med ost og skinke).
