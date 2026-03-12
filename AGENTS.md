# AGENTS.md

## Cel
Utrzymuj działającą stronę GitHub Pages z webowym viewerem 3D (Android).
Priorytet: widoczny model, nawigacja gestami, opcjonalnie sterowanie kamerą ruchem telefonu (żyroskop).

## Definicja „działa”
- Strona ładuje się na GitHub Pages (HTTPS) i w Chrome na Androidzie.
- Canvas/widok 3D wypełnia ekran (nie może być „tylko przycisk”).
- Jest widoczny obiekt testowy (np. sześcian) nawet bez GLB.
- Gesty działają:
  - 1 palec: obrót (orbit) — gdy gyro OFF
  - pinch: przybliż/oddal (dolly)
- Po włączeniu „sterowania ruchem telefonu”:
  - obrót kamery ruchem telefonu działa
  - pinch nadal działa
  - OrbitControls nie może nadpisywać obrotu z gyro (np. wyłącz rotate w controls albo rozdziel odpowiedzialności)

## Zasady implementacji
1) Minimalne zmiany: popraw tylko to, co konieczne.
2) Zawsze dodaj debug na ekranie:
   - widoczny status „JS OK” po starcie modułu
   - obsługa window.onerror + unhandledrejection i wypis błędu w UI
   - przy włączonym gyro wyświetlaj alpha/beta/gamma lub status sensora
3) Zadbaj o layout:
   - canvas (lub viewer) ma zawsze 100vw x 100vh, display:block, brak scrolla
   - UI (przycisk) ma fixed position i nie zasłania całego widoku
4) Kompatybilność:
   - hostowanie przez HTTPS
   - brak zależności od lokalnych plików / file://
   - importy z CDN muszą być stabilne; jeśli CDN jest problemem, rozważ bundling (np. Vite) i użycie wersji pinowanych
5) Sensory:
   - uruchamiaj czujniki dopiero po kliknięciu (user gesture)
   - jeśli `DeviceOrientationEvent` nie działa, dodaj fallback na Generic Sensor API (`AbsoluteOrientationSensor`) gdy dostępne
   - jeśli sensory niedostępne, zostaw pełną nawigację gestami (bez błędów)

## Workflow dla agentów
1) Zlokalizuj entrypoint GitHub Pages:
   - index.html w root, lub /docs, lub /dist zgodnie z ustawieniami Pages.
2) Otwórz stronę lokalnie (np. prosty serwer) i sprawdź konsolę błędów.
3) Napraw błędy importów/CORS/layoutu aż obiekt testowy będzie widoczny.
4) Dodaj/napraw tryb gyro:
   - upewnij się, że przycisk zmienia stan (tekst) i debug pokazuje wartości
5) Zrób commit z opisem zmian + krótką instrukcją testu.

## Komendy (jeśli projekt ma bundler)
- Install: `npm i`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

Jeśli brak bundlera, użyj prostego serwera statycznego:
- `npx http-server . -p 8080`
