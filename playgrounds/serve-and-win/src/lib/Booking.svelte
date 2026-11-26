<script>
	import { offers, levels, schedule, coach } from './data.js';
	import { untrack } from 'svelte';
	import { selection } from './selection.svelte.js';

	const STORAGE_KEY = 'saw-bookings';
	const DAYS_AHEAD = 21;
	const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });
	const dayMonth = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' });
	const longDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

	function load() {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
		} catch {
			return [];
		}
	}

	let bookings = $state(load());

	let offer = $derived(offers.find((o) => o.id === selection.offerId) ?? offers[0]);
	let minutes = $state(offers[0].durations[0].minutes);
	let duration = $derived(offer.durations.find((d) => d.minutes === minutes) ?? offer.durations[0]);

	let dateKey = $state('');
	let hour = $state(/** @type {number | null} */ (null));

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let level = $state(levels[0]);
	let players = $state(1);
	let notes = $state('');
	let accepted = $state(false);

	let confirmed = $state(/** @type {any} */ (null));
	let tried = $state(false);

	// Bei Wechsel des Angebots: Dauer und Spielerzahl zurücksetzen
	$effect(() => {
		const o = offer;
		untrack(() => {
			minutes = o.durations[0].minutes;
			players = Math.min(players, o.maxPlayers);
			hour = null;
		});
	});

	const pad = (n) => String(n).padStart(2, '0');
	const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

	let days = $derived.by(() => {
		const list = [];
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		for (let i = 1; i <= DAYS_AHEAD; i++) {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			list.push({ date: d, key: keyOf(d), open: !!schedule[d.getDay()] });
		}
		return list;
	});

	let selectedDay = $derived(days.find((d) => d.key === dateKey));

	/** Stunden, die durch vorhandene Buchungen belegt sind */
	function busyHours(key) {
		const busy = new Set();
		for (const b of bookings) {
			if (b.date !== key) continue;
			const blocks = Math.ceil(b.minutes / 60);
			for (let i = 0; i < blocks; i++) busy.add(b.hour + i);
		}
		return busy;
	}

	let slots = $derived.by(() => {
		if (!selectedDay) return [];
		const range = schedule[selectedDay.date.getDay()];
		if (!range) return [];
		const busy = busyHours(selectedDay.key);
		const blocks = Math.ceil(duration.minutes / 60);
		const list = [];
		for (let h = range.from; h + blocks <= range.to; h++) {
			let free = true;
			for (let i = 0; i < blocks; i++) if (busy.has(h + i)) free = false;
			list.push({ hour: h, free });
		}
		return list;
	});

	function endTime(h, mins) {
		const total = h * 60 + mins;
		return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
	}

	let total = $derived(duration.price * (offer.maxPlayers > 1 && offer.id !== 'probe' ? players : 1));
	let emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	let ready = $derived(!!selectedDay && hour !== null && name.trim().length > 1 && emailValid && accepted);
	let step = $derived(!selectedDay || hour === null ? 2 : 3);

	function mailtoFor(b) {
		const subject = `Trainingsanfrage: ${b.offer} am ${b.dateLabel}`;
		const body = [
			`Hallo ${coach.nickname},`,
			'',
			`ich möchte folgendes Training buchen:`,
			`• ${b.offer} (${b.minutes} Min.)`,
			`• ${b.dateLabel}, ${b.time} Uhr`,
			`• Spieler:innen: ${b.players}`,
			`• Spielniveau: ${b.level}`,
			b.notes ? `• Anmerkung: ${b.notes}` : '',
			'',
			`Name: ${b.name}`,
			`E-Mail: ${b.email}`,
			b.phone ? `Telefon: ${b.phone}` : '',
			'',
			'Viele Grüße'
		]
			.filter((l) => l !== '')
			.join('\n');
		return `mailto:${coach.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	function submit(event) {
		event.preventDefault();
		tried = true;
		if (!ready || !selectedDay || hour === null) return;

		const booking = {
			id: crypto.randomUUID?.() ?? String(Date.now()),
			offer: offer.title,
			minutes: duration.minutes,
			date: selectedDay.key,
			dateLabel: longDate.format(selectedDay.date),
			hour,
			time: `${pad(hour)}:00–${endTime(hour, duration.minutes)}`,
			players,
			level,
			notes: notes.trim(),
			name: name.trim(),
			email: email.trim(),
			phone: phone.trim(),
			price: total
		};

		bookings = [...bookings, booking];
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
		} catch {}
		confirmed = booking;
	}

	function reset() {
		confirmed = null;
		tried = false;
		hour = null;
		dateKey = '';
		notes = '';
		accepted = false;
	}

	function cancel(id) {
		bookings = bookings.filter((b) => b.id !== id);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
		} catch {}
	}

	let upcoming = $derived(
		bookings.filter((b) => b.date >= keyOf(new Date())).toSorted((a, b) => (a.date + pad(a.hour)).localeCompare(b.date + pad(b.hour)))
	);
</script>

<section id="buchen" class="booking">
	<div class="container">
		<span class="eyebrow">Training buchen</span>
		<h2>In drei Schritten auf den Platz</h2>
		<p class="lead">
			Wähle Training, Termin und trage deine Daten ein. Ich bestätige deine Buchung in der Regel innerhalb von 24 Stunden
			per E-Mail oder WhatsApp.
		</p>

		{#if confirmed}
			<div class="card confirm" role="status">
				<div class="check" aria-hidden="true">✓</div>
				<h3>Danke, {confirmed.name.split(' ')[0]}! Deine Anfrage ist eingegangen.</h3>
				<dl>
					<dt>Training</dt>
					<dd>{confirmed.offer} · {confirmed.minutes} Min.</dd>
					<dt>Termin</dt>
					<dd>{confirmed.dateLabel}, {confirmed.time} Uhr</dd>
					<dt>Ort</dt>
					<dd>TC Neckarrems</dd>
					<dt>Preis</dt>
					<dd>{confirmed.price === 0 ? 'kostenlos' : `${confirmed.price} €`}</dd>
				</dl>
				<p class="hint">
					Damit {coach.nickname} deine Anfrage sicher erhält, sende sie bitte noch kurz per E-Mail ab – die Nachricht ist
					schon vorausgefüllt.
				</p>
				<div class="actions">
					<a class="btn btn-clay" href={mailtoFor(confirmed)}>Anfrage per E-Mail senden</a>
					<button class="btn btn-ghost" onclick={reset}>Weiteres Training buchen</button>
				</div>
			</div>
		{:else}
			<form class="grid" onsubmit={submit} novalidate>
				<!-- Schritt 1 -->
				<fieldset class="card">
					<legend><span class="num">1</span> Training wählen</legend>
					<div class="offer-list">
						{#each offers as o (o.id)}
							<label class="offer" class:active={o.id === offer.id}>
								<input type="radio" name="offer" value={o.id} bind:group={selection.offerId} class="visually-hidden" />
								<span class="o-title">{o.title}</span>
								<span class="o-price">
									{o.durations[0].price === 0 ? 'gratis' : `ab ${Math.min(...o.durations.map((d) => d.price))} €`}
								</span>
							</label>
						{/each}
					</div>

					{#if offer.durations.length > 1}
						<p class="sub">Dauer</p>
						<div class="chips">
							{#each offer.durations as d (d.minutes)}
								<label class="chip" class:active={d.minutes === minutes}>
									<input type="radio" name="duration" value={d.minutes} bind:group={minutes} class="visually-hidden" />
									{d.minutes} Min. · {d.price} €
								</label>
							{/each}
						</div>
					{:else}
						<p class="sub">Dauer: {duration.minutes} Minuten</p>
					{/if}

					{#if offer.maxPlayers > 1}
						<p class="sub">Anzahl Spieler:innen</p>
						<div class="chips">
							{#each Array.from({ length: offer.maxPlayers }, (_, i) => i + 1) as n (n)}
								<label class="chip" class:active={players === n}>
									<input type="radio" name="players" value={n} bind:group={players} class="visually-hidden" />
									{n}
								</label>
							{/each}
						</div>
					{/if}
				</fieldset>

				<!-- Schritt 2 -->
				<fieldset class="card">
					<legend><span class="num">2</span> Termin wählen</legend>
					<div class="days" role="radiogroup" aria-label="Datum">
						{#each days as d (d.key)}
							<button
								type="button"
								class="day"
								class:active={d.key === dateKey}
								disabled={!d.open}
								aria-pressed={d.key === dateKey}
								onclick={() => {
									dateKey = d.key;
									hour = null;
								}}
							>
								<span class="wd">{weekday.format(d.date)}</span>
								<span class="dm">{dayMonth.format(d.date)}</span>
							</button>
						{/each}
					</div>

					{#if selectedDay}
						<p class="sub">Freie Zeiten am {longDate.format(selectedDay.date)}</p>
						<div class="slots">
							{#each slots as s (s.hour)}
								<button
									type="button"
									class="slot"
									class:active={hour === s.hour}
									disabled={!s.free}
									aria-pressed={hour === s.hour}
									onclick={() => (hour = s.hour)}
								>
									{pad(s.hour)}:00
								</button>
							{/each}
						</div>
					{:else}
						<p class="sub muted">Bitte zuerst einen Tag auswählen. Sonntags findet kein Training statt.</p>
					{/if}
					{#if tried && hour === null}<p class="error">Bitte Tag und Uhrzeit auswählen.</p>{/if}
				</fieldset>

				<!-- Schritt 3 -->
				<fieldset class="card" class:dim={step < 3}>
					<legend><span class="num">3</span> Deine Daten</legend>
					<div class="fields">
						<div>
							<label for="name">Name *</label>
							<input id="name" bind:value={name} autocomplete="name" required />
							{#if tried && name.trim().length < 2}<p class="error">Bitte Namen angeben.</p>{/if}
						</div>
						<div>
							<label for="email">E-Mail *</label>
							<input id="email" type="email" bind:value={email} autocomplete="email" required />
							{#if tried && !emailValid}<p class="error">Bitte gültige E-Mail angeben.</p>{/if}
						</div>
						<div>
							<label for="phone">Telefon / WhatsApp</label>
							<input id="phone" type="tel" bind:value={phone} autocomplete="tel" />
						</div>
						<div>
							<label for="level">Spielniveau</label>
							<select id="level" bind:value={level}>
								{#each levels as l (l)}<option>{l}</option>{/each}
							</select>
						</div>
						<div class="full">
							<label for="notes">Anmerkungen</label>
							<textarea id="notes" rows="3" bind:value={notes} placeholder="Ziele, Wünsche, Name des Kindes …"></textarea>
						</div>
						<label class="consent full">
							<input type="checkbox" bind:checked={accepted} />
							<span>
								Ich akzeptiere die Stornobedingungen (kostenfrei bis 24 h vorher) und die
								<a href="#datenschutz">Datenschutzhinweise</a>. *
							</span>
						</label>
						{#if tried && !accepted}<p class="error full">Bitte bestätigen.</p>{/if}
					</div>
				</fieldset>

				<aside class="card summary">
					<h3>Zusammenfassung</h3>
					<ul>
						<li><span>Training</span><strong>{offer.title}</strong></li>
						<li><span>Dauer</span><strong>{duration.minutes} Min.</strong></li>
						{#if offer.maxPlayers > 1}<li><span>Spieler:innen</span><strong>{players}</strong></li>{/if}
						<li>
							<span>Termin</span>
							<strong>
								{#if selectedDay && hour !== null}
									{weekday.format(selectedDay.date)}, {dayMonth.format(selectedDay.date)} · {pad(hour)}:00 Uhr
								{:else}–{/if}
							</strong>
						</li>
						<li><span>Ort</span><strong>TC Neckarrems</strong></li>
					</ul>
					<div class="total">
						<span>Gesamt</span>
						<strong>{total === 0 ? 'kostenlos' : `${total} €`}</strong>
					</div>
					<button class="btn btn-clay wide" type="submit">Verbindlich anfragen</button>
					<p class="small">Bezahlung vor Ort, per Überweisung oder PayPal.</p>
				</aside>
			</form>
		{/if}

		{#if upcoming.length}
			<div class="card mine">
				<h3>Deine Anfragen auf diesem Gerät</h3>
				<ul>
					{#each upcoming as b (b.id)}
						<li>
							<span><strong>{b.offer}</strong> · {b.dateLabel}, {b.time} Uhr</span>
							<span class="row-actions">
								<a href={mailtoFor(b)}>E-Mail</a>
								<button type="button" onclick={() => cancel(b.id)}>Entfernen</button>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</section>

<style>
	.booking {
		background: var(--sand);
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-top: 2rem;
	}

	.card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 24px;
		margin: 0;
		min-width: 0;
	}

	.dim {
		opacity: 0.75;
	}

	legend {
		font-family: var(--font-head);
		font-weight: 700;
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0;
		margin-bottom: 1rem;
		float: left;
		width: 100%;
	}

	legend + * {
		clear: both;
	}

	.num {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--green);
		color: var(--ball);
		font-size: 0.95rem;
	}

	.offer-list {
		display: grid;
		gap: 8px;
	}

	.offer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border: 1.5px solid var(--line);
		border-radius: 10px;
		cursor: pointer;
		margin: 0;
		font-size: 1rem;
		transition: border-color 0.15s;
	}

	.offer:hover {
		border-color: var(--green-2);
	}

	.offer.active {
		border-color: var(--green);
		background: var(--green);
		color: #fff;
	}

	.o-price {
		font-weight: 500;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.sub {
		font-weight: 600;
		font-size: 0.92rem;
		margin: 1.2rem 0 0.5rem;
	}

	.muted {
		color: var(--muted);
		font-weight: 400;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.chip {
		padding: 8px 14px;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		cursor: pointer;
		margin: 0;
		font-weight: 500;
	}

	.chip.active {
		background: var(--ball);
		border-color: var(--ball);
		color: var(--green);
		font-weight: 700;
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
	}

	.day,
	.slot {
		font: inherit;
		border: 1.5px solid var(--line);
		background: #fff;
		border-radius: 10px;
		cursor: pointer;
		color: var(--ink);
	}

	.day {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 6px 2px;
		line-height: 1.25;
	}

	.wd {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--muted);
		font-weight: 600;
	}

	.dm {
		font-weight: 700;
		font-size: 0.9rem;
	}

	.day:disabled,
	.slot:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		text-decoration: line-through;
	}

	.day:not(:disabled):hover,
	.slot:not(:disabled):hover {
		border-color: var(--green-2);
	}

	.day.active,
	.slot.active {
		background: var(--green);
		border-color: var(--green);
		color: #fff;
	}

	.day.active .wd {
		color: var(--ball);
	}

	.slots {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
		gap: 8px;
	}

	.slot {
		padding: 9px 0;
		font-weight: 600;
	}

	.fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.full {
		grid-column: 1 / -1;
	}

	.consent {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		font-weight: 400;
		font-size: 0.9rem;
	}

	.consent input {
		width: 18px;
		height: 18px;
		margin-top: 3px;
		flex: none;
		accent-color: var(--green);
	}

	.error {
		color: #b3261e;
		font-size: 0.85rem;
		margin: 0.3rem 0 0;
	}

	.summary {
		background: var(--green);
		color: #fff;
		border: none;
		align-self: start;
		position: sticky;
		top: 90px;
	}

	.summary ul {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
	}

	.summary li {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 9px 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.12);
		font-size: 0.95rem;
	}

	.summary li span {
		opacity: 0.7;
	}

	.summary li strong {
		text-align: right;
	}

	.total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin: 1rem 0 1.25rem;
	}

	.total strong {
		font-family: var(--font-head);
		font-size: 2rem;
		color: var(--ball);
	}

	.wide {
		width: 100%;
	}

	.small {
		font-size: 0.82rem;
		opacity: 0.7;
		margin: 0.8rem 0 0;
		text-align: center;
	}

	.confirm {
		margin-top: 2rem;
		max-width: 640px;
	}

	.check {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--ball);
		color: var(--green);
		display: grid;
		place-items: center;
		font-size: 1.6rem;
		font-weight: 800;
		margin-bottom: 1rem;
	}

	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 6px 20px;
		margin: 1rem 0 1.5rem;
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		font-weight: 600;
	}

	.hint {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.mine {
		margin-top: 20px;
	}

	.mine ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.mine li {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 8px;
		padding: 10px 0;
		border-top: 1px solid var(--line);
	}

	.row-actions {
		display: flex;
		gap: 14px;
		font-size: 0.9rem;
	}

	.row-actions button {
		background: none;
		border: none;
		color: var(--clay);
		font: inherit;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
	}

	@media (max-width: 860px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.summary {
			position: static;
		}
	}

	@media (max-width: 520px) {
		.card {
			padding: 18px;
		}

		.fields {
			grid-template-columns: 1fr;
		}

		.days {
			gap: 4px;
		}

		.dm {
			font-size: 0.78rem;
		}
	}
</style>
