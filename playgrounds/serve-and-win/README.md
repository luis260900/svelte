# Serve and Win by Consti

Website für das Tennistraining von Constantin Weiss im TC Neckarrems (Remseck am Neckar).
Gebaut mit Svelte 5 + Vite.

## Starten

```bash
pnpm install        # im Repo-Root
cd playgrounds/serve-and-win
pnpm dev            # Entwicklungsserver
pnpm build          # statische Website in dist/ (auf jeden Webspace hochladbar)
```

## Inhalte anpassen

Alle Texte, Preise, Trainingszeiten, FAQ und Kontaktdaten stehen in `src/lib/data.js`.
Werte mit dem Kommentar `PLATZHALTER` (E-Mail, Telefon, WhatsApp, Instagram, Adresse der Anlage)
sowie Impressum/Datenschutz im Footer (`src/App.svelte`) müssen vor dem Livegang ersetzt werden.

## Buchung

Das Buchungsformular (`src/lib/Booking.svelte`) zeigt die freien Zeiten der nächsten 21 Tage
(Mo–Sa laut `schedule`), speichert Anfragen im Browser und erzeugt eine vorausgefüllte E-Mail an den Trainer.
Für ein zentrales Buchungssystem (belegte Slots für alle Besucher sichtbar, automatische Bestätigung)
wird ein Backend benötigt, z. B. ein Formular-Dienst, eine Datenbank oder ein Kalender-Tool.
