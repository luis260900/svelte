// ---------------------------------------------------------------------------
// Alle Inhalte der Website an einer Stelle. Werte mit "PLATZHALTER" bitte
// durch echte Angaben ersetzen (Telefon, E-Mail, Adresse, Preise ...).
// ---------------------------------------------------------------------------

export const coach = {
	name: 'Constantin Weiss',
	nickname: 'Consti',
	brand: 'Serve and Win',
	brandFull: 'Serve and Win by Consti',
	email: 'kontakt@serve-and-win.de', // PLATZHALTER
	phone: '+49 170 0000000', // PLATZHALTER
	whatsapp: '491700000000', // PLATZHALTER (nur Ziffern, für wa.me-Link)
	instagram: 'serveandwin.consti' // PLATZHALTER
};

export const club = {
	name: 'TC Neckarrems',
	street: 'Vereinsgelände TC Neckarrems', // PLATZHALTER – genaue Straße eintragen
	city: '71686 Remseck am Neckar (Neckarrems)',
	mapsUrl: 'https://www.google.com/maps/search/?api=1&query=TC+Neckarrems+Remseck+am+Neckar',
	courts: 'Sandplätze im Sommer, Hallentraining im Winter nach Absprache'
};

export const offers = [
	{
		id: 'einzel',
		title: 'Einzeltraining',
		tag: 'Beliebt',
		text: 'Volle Aufmerksamkeit für dich: Technik, Taktik und Matchpraxis – exakt auf dein Niveau und deine Ziele abgestimmt.',
		points: ['1 Spieler:in', 'Video-Analyse auf Wunsch', 'Ideal für schnelle Fortschritte'],
		durations: [
			{ minutes: 60, price: 45 },
			{ minutes: 90, price: 65 }
		],
		maxPlayers: 1
	},
	{
		id: 'duo',
		title: 'Duo-Training',
		text: 'Mit Partner:in, Freund:in oder Doppelpartner trainieren – intensiv und günstiger pro Person.',
		points: ['2 Spieler:innen', 'Doppeltaktik & Spielformen', 'Preis pro Person'],
		durations: [
			{ minutes: 60, price: 28 },
			{ minutes: 90, price: 40 }
		],
		maxPlayers: 2
	},
	{
		id: 'gruppe',
		title: 'Gruppentraining',
		text: 'Training in kleinen Gruppen mit ähnlichem Spielniveau. Viel Ballkontakt, Spaß und Wettkampfformen.',
		points: ['3–4 Spieler:innen', 'Feste Gruppen pro Saison', 'Preis pro Person'],
		durations: [{ minutes: 60, price: 18 }],
		maxPlayers: 4
	},
	{
		id: 'kids',
		title: 'Kinder & Jugend',
		text: 'Spielerischer Einstieg ab 5 Jahren mit Kleinfeld und Methodikbällen bis hin zum Leistungstraining für Medenspieler:innen.',
		points: ['Ab 5 Jahren', 'Talentinos bis Leistungsgruppe', 'Turniervorbereitung'],
		durations: [{ minutes: 60, price: 15 }],
		maxPlayers: 4
	},
	{
		id: 'probe',
		title: 'Probetraining',
		tag: 'Kostenlos',
		text: 'Lerne mich und das Training kennen. Wir schauen gemeinsam, wo du stehst und was dein nächster Schritt ist.',
		points: ['30 Minuten', 'Unverbindlich', 'Schläger kann gestellt werden'],
		durations: [{ minutes: 30, price: 0 }],
		maxPlayers: 2
	}
];

export const packages = [
	{ title: '10er-Karte Einzel', detail: '10 × 60 Min. Einzeltraining', price: 420, saving: 'Du sparst 30 €' },
	{ title: 'Saisonvertrag Gruppe', detail: '1 × pro Woche, ca. 20 Einheiten (Mai–Sept.)', price: 320, saving: 'Feste Gruppe & fester Termin' },
	{ title: 'Sommer-Camp', detail: '5 Tage, je 3 Std. Tennis + Spiele (Kinder 6–14)', price: 189, saving: 'In den Sommerferien' }
];

export const levels = ['Einsteiger:in', 'Fortgeschritten', 'Medenspieler:in', 'Kind / Jugendliche:r'];

// Trainingszeiten pro Wochentag (0 = Sonntag). Volle Stunden, Ende exklusiv.
export const schedule = {
	1: { from: 14, to: 21 },
	2: { from: 14, to: 21 },
	3: { from: 14, to: 21 },
	4: { from: 14, to: 21 },
	5: { from: 13, to: 19 },
	6: { from: 9, to: 14 }
};

export const faqs = [
	{
		q: 'Muss ich Mitglied im TC Neckarrems sein?',
		a: 'Für ein Probetraining nicht. Für regelmäßiges Training ist eine Mitgliedschaft im TC Neckarrems sinnvoll – bei Fragen zur Mitgliedschaft helfe ich gern weiter. Gastspieler:innen sind nach Absprache möglich.'
	},
	{
		q: 'Was passiert bei Regen?',
		a: 'Fällt das Training wetterbedingt aus, entstehen dir keine Kosten. Wir verschieben den Termin oder ich schreibe dir die Stunde gut.'
	},
	{
		q: 'Wie kurzfristig kann ich absagen?',
		a: 'Bis 24 Stunden vor Trainingsbeginn kostenfrei. Danach wird die Stunde berechnet, sofern sie nicht neu belegt werden kann.'
	},
	{
		q: 'Brauche ich eigene Ausrüstung?',
		a: 'Sportkleidung und Sandplatzschuhe reichen. Schläger kann ich für die ersten Stunden stellen, Bälle sind immer inklusive.'
	},
	{
		q: 'Gibt es Training im Winter?',
		a: 'Ja – in der Wintersaison (Okt.–April) findet das Training in der Halle statt. Termine und Hallenkosten besprechen wir individuell.'
	},
	{
		q: 'Wie bezahle ich?',
		a: 'Bar, per Überweisung oder PayPal. Pakete und Saisonverträge werden im Voraus bezahlt.'
	}
];
