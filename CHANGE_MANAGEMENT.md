# CHANGE_MANAGEMENT.md

## Cel

Ten dokument opisuje prosty proces zarządzania zmianami w projekcie GLB Viewer, tak aby:

- wprowadzać małe i bezpieczne zmiany,
- łatwo wracać do poprzednich działających wersji,
- szybko wykrywać regresje,
- nie mieszać bieżącego MVP z przyszłymi funkcjami.

Proces ma wspierać aktualny priorytet projektu:

1. działający viewer całego modelu GLB,
2. stabilne ładowanie plików `.glb`,
3. dopracowanie nawigacji mobilnej i desktopowej,
4. debug i odporność na błędy.

---

## Zasady ogólne

- Preferuj najmniejszą zmianę, która realnie rozwiązuje problem.
- Nie rób dużych refaktorów bez wyraźnej potrzeby.
- Nie łącz wielu tematów w jednym commicie.
- Utrzymuj zgodność z GitHub Pages.
- Preferuj lokalne vendor files zamiast CDN dla kluczowych modułów runtime.
- Zachowuj fallback debugowy do czasu pełnej stabilizacji viewer-a.
- Nie przechodź do clipping / sections / AR, dopóki loading i nawigacja nie są stabilne.

---

## Model gałęzi

### Główne gałęzie

- `main`  
  Zawiera tylko wersje działające i gotowe do publikacji.

- `dev`  
  Gałąź integracyjna dla małych, sprawdzonych zmian przed wejściem na `main`.

### Gałęzie robocze

Twórz małe gałęzie tematyczne:

- `fix/...` — poprawki błędów
- `feat/...` — małe funkcje w obecnym etapie projektu
- `chore/...` — porządki techniczne bez zmiany zachowania
- `test/...` — eksperymenty i próby, które nie powinny od razu trafiać do głównego nurtu

### Przykłady nazw

- `fix/reset-view-after-glb-load`
- `fix/drop-glb-replaces-model`
- `feat/debug-build-date`
- `test/mobile-zoom-threshold`

### Reguła

Nie pracuj bezpośrednio na `main`.

---

## Jednostka zmiany

Jedna zmiana powinna rozwiązywać jeden konkretny problem.

### Dobra zmiana

- poprawa reset view,
- poprawa drag & drop,
- poprawa fit-to-view,
- dodanie jednej informacji do debug panelu,
- poprawa limitów zoomu.

### Zła zmiana

- jednoczesna zmiana loadera, kontrolek i UI,
- refaktor struktury plików razem z poprawką błędu,
- mieszanie Viewer mode z przyszłym AR mode,
- zmiana vendor files razem z innymi zmianami logiki viewer-a.

---

## Klasy ryzyka zmian

### Niskie ryzyko

Zmiany kosmetyczne i debugowe:

- teksty UI,
- debug overlay,
- dodatkowe informacje diagnostyczne,
- drobne style.

Wymaganie:
- szybki test manualny,
- osobny commit.

### Średnie ryzyko

Zmiany wpływające na podstawowe użycie viewer-a:

- file input,
- drag & drop,
- reset view,
- fit-to-view,
- fallback visibility,
- zachowanie po błędzie ładowania.

Wymaganie:
- osobna gałąź,
- pełny test minimum,
- commit dopiero po sprawdzeniu.

### Wysokie ryzyko

Zmiany w obszarach wrażliwych:

- vendor module paths,
- wersje i łańcuch zależności Three.js,
- loader,
- dispose / replace model flow,
- camera / controls / zoom / limits,
- logika mobilnej nawigacji.

Wymaganie:
- bardzo mały zakres zmiany,
- tylko jeden temat na branch,
- checkpoint przed zmianą,
- obowiązkowy test minimum po zmianie.

---

## Workflow dla każdej zmiany

### 1. Nazwij problem

Zapisz w 1–2 zdaniach:

- co nie działa,
- jaka jest najbardziej prawdopodobna przyczyna.

Przykład:

> Reset view po załadowaniu nie wraca do poprawnej pozycji kamery.  
> Najbardziej prawdopodobna przyczyna: defaultView nie jest aktualizowany po finalnym fitCameraToObject.

### 2. Zrób najmniejszą możliwą poprawkę

- bez pobocznego refaktoru,
- bez zmiany niezwiązanych fragmentów,
- bez przebudowy architektury „na przyszłość”.

### 3. Wykonaj test manualny

Uruchom checklistę odpowiednią do zakresu zmiany.

### 4. Zrób commit

Commit dopiero po przejściu testów.

### 5. Dodaj krótkie podsumowanie

Po każdej większej zmianie zapisz:

- Root cause
- What changed
- What may still break
- Suggested next step
- Suggested commit message

---

## Polityka commitów

Commit message powinien być:

- krótki,
- konkretny,
- w trybie rozkazującym lub prostym technicznym opisie.

### Zalecany format

- `fix: restore reset view after glb load`
- `fix: keep fallback visible on load failure`
- `feat: add debug date to overlay`
- `chore: align local vendor imports`

### Reguły

- jeden commit = jeden temat,
- nie wrzucaj „przy okazji” innych poprawek,
- jeśli zmiana jest ryzykowna, zrób najpierw checkpoint.

---

## Polityka checkpointów i tagów

Żeby rollback był łatwy, stosuj dwa poziomy zabezpieczenia.

### Poziom 1 — checkpoint commit

Przed ryzykowną zmianą zrób czysty commit stanu wyjściowego.

Przykłady:
- przed zmianą vendor imports,
- przed zmianą zoom limits,
- przed zmianą zachowania OrbitControls,
- przed zmianą logiki replace/dispose model.

### Poziom 2 — tag stabilnej wersji

Po każdej stabilnej wersji nadaj tag.

### Zalecane tagi

- `v0.1-stable-fallback`
- `v0.2-glb-load-stable`
- `v0.3-fit-reset-stable`
- `v0.4-mobile-nav-stable`

### Kiedy tagować

Tag twórz wtedy, gdy:

- app startuje bez crasha,
- fallback działa,
- GLB load działa,
- reset działa,
- fit-to-view działa,
- debug nadal jest użyteczny,
- GitHub Pages nadal działa poprawnie.

---

## Procedura rollbacku

### Scenariusz A — wiadomo, który commit popsuł projekt

1. Cofnij tylko ten commit.
2. Uruchom test minimum.
3. Jeśli projekt wrócił do stabilności, poprawkę zrób ponownie na nowej gałęzi.

### Scenariusz B — nie wiadomo, co dokładnie zepsuło projekt

1. Wróć do ostatniego stabilnego taga.
2. Potwierdź, że aplikacja działa.
3. Dopiero potem analizuj problem na osobnym branchu.

### Scenariusz C — awaria dotyczy vendor/import/runtime

1. Priorytetem jest odzyskanie działającej wersji, nawet z fallbackiem.
2. Nie kontynuuj eksperymentów na uszkodzonym stanie.
3. Najpierw przywróć stabilny runtime, potem szukaj źródła problemu.

---

## Test minimum po zmianach

Po każdej istotnej zmianie sprawdź:

1. App starts without crashing
2. Debug overlay appears
3. Fallback object appears when no GLB is loaded
4. Load GLB works from file input
5. Drag-and-drop GLB works
6. Reset view works
7. Camera fit-to-view works
8. GitHub Pages relative paths still work

### Dodatkowo na mobile

- basic navigation works
- model stays visible
- reset view recovers from bad camera state
- no obvious startup failure on phone browser

### Dodatkowo dla GitHub Pages

- hard refresh with cache-bust query works
- vendor modules load from expected paths
- no broken dynamic imports

---

## Kiedy nie mergować do `main`

Nie wrzucaj do `main` zmian, które:

- są eksperymentem,
- mieszają Viewer mode z AR/WebXR,
- wprowadzają clipping/sectioning przed stabilizacją nawigacji,
- osłabiają fallback,
- osłabiają debug visibility,
- zmieniają wiele obszarów naraz,
- nie przeszły testu minimum.

---

## Polityka zmian w plikach

Na obecnym etapie projektu:

- preferuj edycję `index.html`,
- unikaj rozbijania logiki na wiele plików bez mocnego powodu,
- nie zmieniaj struktury katalogów bez potrzeby,
- nie mieszaj zmian logiki viewer-a ze zmianami vendor files w jednym commicie.

### Dokumentacja procesu

Dopuszczalne osobne pliki dokumentacyjne:

- `CHANGE_MANAGEMENT.md`
- `TESTING.md`
- `KNOWN_ISSUES.md`
- `ROADMAP.md`

---

## Co robić przy błędzie

Kiedy pojawia się błąd:

1. Najpierw nazwij najbardziej prawdopodobną przyczynę.
2. Potem wskaż najmniejszy sensowny następny krok.
3. Nie przechodź od razu do dużego refaktoru.
4. Jeśli przyczyna nie jest pewna, najpierw potwierdź ją debugiem lub prostym testem.

### Format szybkiej diagnozy

- Root cause
- Evidence
- Minimal fix
- Risk
- Next check

---

## Definicja „gotowe” dla zmiany

Zmiana jest uznana za gotową tylko wtedy, gdy:

- rozwiązuje konkretny problem,
- nie psuje ładowania `.glb`,
- nie psuje reset view,
- nie psuje fit-to-view,
- nie psuje fallbacku,
- nie pogarsza debug panelu,
- nie łamie GitHub Pages,
- przeszła odpowiedni test manualny.

---

## Proponowany rytm pracy

Najbezpieczniejszy rytm dla tego projektu:

1. wybierz jeden mały problem,
2. utwórz branch,
3. zrób minimalną poprawkę,
4. wykonaj test minimum,
5. zrób commit,
6. dodaj krótkie podsumowanie,
7. merge do `dev`,
8. po kilku sprawdzonych zmianach merge do `main` i tag.

---

## Minimalna wersja zasad operacyjnych

Jeśli trzeba działać szybko, trzymaj się tych reguł:

- nie pracuj na `main`,
- jedna zmiana = jeden commit,
- przed ryzykowną zmianą zrób checkpoint,
- po każdej zmianie odpal test minimum,
- taguj stabilne wersje,
- nie mieszaj AR i clipping z obecnym MVP,
- nie osłabiaj fallbacku ani debugu.

---

## Suggested commit message

`docs: add change management process with rollback rules`