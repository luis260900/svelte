// Gemeinsamer Zustand, damit "Jetzt buchen"-Buttons im Angebot
// das passende Training im Buchungsformular vorauswählen können.
export const selection = $state({ offerId: 'einzel' });

export function preselect(offerId) {
	selection.offerId = offerId;
	document.getElementById('buchen')?.scrollIntoView({ behavior: 'smooth' });
}
