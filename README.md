Mangler før version 1.0
-----------------------
1. Syntax tjek
2. Der mangler lidt opsætning i kommunikationen mellem backend og frontend. Så pt. virker det ikke.
3. Backend forsøger at logge ind på https://odensebib.dk, brug et site som alle danskere har brugere på, fx https://borger.dk.

Formålet
--------------
Digitaliseringsstyrelsen skal erkende at det er nødvendigt for sikkerheden, at de ændrer arkitekturen for NemID/MitID.
Det bliver gjort ved at gøre det nemt for enhver at lave et NemID phishing site.

Hvordan
-------------
Installér [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) og [Docker](https://docs.docker.com/install/).
Kør dernæst følgende kommandoer i en kommando-prompt.
```
git clone https://github.com/runephilosof/nemid-phishing.git
cd nemid-phishing
docker build -t nemid-phishing .
docker run --rm -p 80:localhost:80 nemid-phishing
```
Åben din browser på `http://localhost`.

Baggrund
---------------
NemID er sårbart over for et nemt angreb (få timer, hvis man har erfaring med Javascript og Puppeteer).
Digitaliseringsstyrelsen er opmærksom på det, men af hensyn til brugervenlighed, så vil de ikke ændre på arkitekturen.

Problemet blev beskrevet i 2011. Og er sidenhen blevet demonstreret på mere og mere automatiserede måder.

2018 https://www.version2.dk/artikel/digitaliseringsstyrelsen-efter-udvikler-angreb-ja-nemid-saarbar-phishing-1086131

Problemet
----------------
NemID login boksen tillades på mange forskellige domæner. Som slutbruger kan du ikke vide, om du sender login oplysningerne til NemID eller direkte til den hjemmeside, du er ved at logge ind på.
Hvis man fjerner den mulighed og informerer brugerne om hvilket domæne, der skal stå i adresselinjen, så har brugerne mulighed for at opdage snyd. Ligesom brugere kun skal logge ind på Google på google.com.

Løsningen
----------------
Hvis man kun måtte logge ind gennem nem-login.dk og brugerne blev oplyst om det, så ville sikkerhedshullet være lukket.
Det offentliges hjemmesider bruger en fælles NemID gateway til borger.dk, sundhed.dk osv. Man bliver altid omdirigeret til nem-login.dk, logger ind, og bliver så sendt tilbage til siden man kom fra.

Roadmap
-------
Afsnittet "Hvordan" skal gøres simplere (Undgå kommandoprompt, undgå git ved at uploade til Docker Hub).
Vis backend browseren i frontenden, ligesom browserless.io (open source, docker project)
