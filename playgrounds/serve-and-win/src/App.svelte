<script>
	import Booking from './lib/Booking.svelte';
	import { coach, club, offers, packages, faqs } from './lib/data.js';
	import { preselect } from './lib/selection.svelte.js';

	let menuOpen = $state(false);
	let scrolled = $state(false);

	const nav = [
		['#ueber-mich', 'Über mich'],
		['#angebot', 'Angebot'],
		['#preise', 'Preise'],
		['#standort', 'Standort'],
		['#faq', 'FAQ'],
		['#kontakt', 'Kontakt']
	];

	const fromPrice = (o) => Math.min(...o.durations.map((d) => d.price));
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 20)} />

<header class:scrolled>
	<div class="container bar">
		<a class="logo" href="#top" aria-label="Serve and Win by Consti – Startseite">
			<span class="ball" aria-hidden="true"></span>
			<span>Serve<em>&amp;</em>Win <small>by Consti</small></span>
		</a>
		<button
			class="burger"
			aria-label="Menü"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span></span><span></span><span></span>
		</button>
		<nav class:open={menuOpen}>
			{#each nav as [href, label] (href)}
				<a {href} onclick={() => (menuOpen = false)}>{label}</a>
			{/each}
			<a class="btn btn-primary" href="#buchen" onclick={() => (menuOpen = false)}>Training buchen</a>
		</nav>
	</div>
</header>

<main id="top">
	<!-- HERO -->
	<section class="hero">
		<svg class="court" viewBox="0 0 400 800" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
			<g fill="none" stroke="rgb(255 255 255 / .55)" stroke-width="4">
				<rect x="40" y="40" width="320" height="720" />
				<line x1="80" y1="40" x2="80" y2="760" />
				<line x1="320" y1="40" x2="320" y2="760" />
				<line x1="80" y1="230" x2="320" y2="230" />
				<line x1="80" y1="570" x2="320" y2="570" />
				<line x1="200" y1="230" x2="200" y2="570" />
				<line x1="200" y1="40" x2="200" y2="52" />
				<line x1="200" y1="748" x2="200" y2="760" />
			</g>
			<line x1="20" y1="400" x2="380" y2="400" stroke="#fff" stroke-width="7" />
		</svg>

		<div class="container hero-inner">
			<span class="eyebrow light">Tennistraining im {club.name}</span>
			<h1>Besser spielen.<br /><span>Öfter gewinnen.</span></h1>
			<p class="lead light">
				Ich bin {coach.name} – Tennistrainer im {club.name} in Remseck am Neckar. Mit
				<strong>{coach.brandFull}</strong> bringe ich Kinder, Einsteiger:innen und Medenspieler:innen auf ihr nächstes
				Level.
			</p>
			<div class="hero-cta">
				<a class="btn btn-primary" href="#buchen">Training buchen</a>
				<button class="btn btn-ghost light" onclick={() => preselect('probe')}>Kostenloses Probetraining</button>
			</div>
			<ul class="facts">
				<li><strong>Alle</strong><span>Altersklassen</span></li>
				<li><strong>5</strong><span>Trainingsformate</span></li>
				<li><strong>Mo–Sa</strong><span>flexible Zeiten</span></li>
			</ul>
		</div>
	</section>

	<!-- ÜBER MICH -->
	<section id="ueber-mich">
		<div class="container two">
			<div class="portrait" aria-hidden="true">
				<div class="initials">CW</div>
				<div class="badge">Coach im<br /><strong>{club.name}</strong></div>
			</div>
			<div>
				<span class="eyebrow">Über mich</span>
				<h2>Hi, ich bin Consti.</h2>
				<p class="lead">
					Tennis ist meine Leidenschaft – und die gebe ich am liebsten auf dem Platz weiter. Ob erster Ballwechsel oder
					entscheidender Matchball: Ich helfe dir, mit Freude und System besser zu werden.
				</p>
				<p>
					Mein Training verbindet saubere Technik mit cleverer Taktik, Athletik und mentaler Stärke. Jede Einheit hat ein
					klares Ziel, viele Ballwiederholungen und genug Spielformen, damit der Spaß nie zu kurz kommt.
				</p>
				<ul class="values">
					<li><span>🎯</span><div><strong>Individuell</strong>Trainingsplan nach deinem Niveau und deinen Zielen</div></li>
					<li><span>📈</span><div><strong>Messbar</strong>Regelmäßiges Feedback, auf Wunsch mit Video-Analyse</div></li>
					<li><span>🤝</span><div><strong>Mit Herz</strong>Motivierend, geduldig und mit viel Spaß am Spiel</div></li>
				</ul>
			</div>
		</div>
	</section>

	<!-- ANGEBOT -->
	<section id="angebot" class="offers">
		<div class="container">
			<span class="eyebrow">Angebot</span>
			<h2>Das passende Training für dich</h2>
			<p class="lead">Von den ersten Schlägen bis zur Medenrunde – wähle das Format, das zu dir passt.</p>
			<div class="offer-grid">
				{#each offers as o (o.id)}
					<article class="offer-card">
						{#if o.tag}<span class="tag">{o.tag}</span>{/if}
						<h3>{o.title}</h3>
						<p>{o.text}</p>
						<ul>
							{#each o.points as p (p)}<li>{p}</li>{/each}
						</ul>
						<div class="offer-foot">
							<span class="price">
								{#if fromPrice(o) === 0}gratis{:else}<small>ab</small> {fromPrice(o)} €{/if}
							</span>
							<button class="btn btn-clay" onclick={() => preselect(o.id)}>Buchen</button>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- PREISE -->
	<section id="preise">
		<div class="container">
			<span class="eyebrow">Preise</span>
			<h2>Transparent &amp; fair</h2>
			<p class="lead">Alle Preise inklusive Bälle. Platzkosten im Sommer für Mitglieder des {club.name} inklusive.</p>

			<div class="price-wrap">
				<table>
					<thead>
						<tr><th>Training</th><th>Dauer</th><th>Preis</th></tr>
					</thead>
					<tbody>
						{#each offers as o (o.id)}
							{#each o.durations as d, i (d.minutes)}
								<tr>
									<td>{i === 0 ? o.title : ''}</td>
									<td>{d.minutes} Min.</td>
									<td>
										{d.price === 0 ? 'kostenlos' : `${d.price} €`}{o.maxPlayers > 1 && d.price > 0 ? ' p. P.' : ''}
									</td>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>

				<div class="packages">
					{#each packages as p (p.title)}
						<div class="package">
							<div>
								<h3>{p.title}</h3>
								<p>{p.detail}</p>
								<span class="saving">{p.saving}</span>
							</div>
							<strong>{p.price} €</strong>
						</div>
					{/each}
					<p class="small">Pakete und Camps bitte per <a href="#kontakt">Kontakt</a> anfragen.</p>
				</div>
			</div>
		</div>
	</section>

	<Booking />

	<!-- STANDORT -->
	<section id="standort">
		<div class="container two">
			<div>
				<span class="eyebrow">Standort</span>
				<h2>Wir sehen uns im {club.name}</h2>
				<p class="lead">Trainiert wird auf der Anlage des {club.name} in Remseck am Neckar.</p>
				<address>
					<strong>{club.name}</strong><br />
					{club.street}<br />
					{club.city}
				</address>
				<ul class="info">
					<li><strong>Plätze:</strong> {club.courts}</li>
					<li><strong>Sommersaison:</strong> Mai bis September</li>
					<li><strong>Wintersaison:</strong> Oktober bis April (Halle)</li>
					<li><strong>Parken:</strong> Parkplätze direkt an der Anlage</li>
				</ul>
				<a class="btn btn-clay" href={club.mapsUrl} target="_blank" rel="noopener">Route planen</a>
			</div>
			<div class="map" aria-hidden="true">
				<svg viewBox="0 0 400 300">
					<rect width="400" height="300" fill="#e9e2d6" />
					<path d="M-10 210 C80 170 140 250 230 205 S360 160 410 190" fill="none" stroke="#9cc3d6" stroke-width="26" />
					<path d="M60 -10 C90 80 70 140 120 200" fill="none" stroke="#9cc3d6" stroke-width="14" />
					<path d="M0 90 L400 60 M180 0 L210 300" stroke="#fff" stroke-width="8" />
					<g transform="translate(250 95)">
						<rect x="-34" y="-20" width="68" height="40" fill="var(--clay)" rx="3" />
						<line x1="0" y1="-20" x2="0" y2="20" stroke="#fff" stroke-width="2" />
						<rect x="-28" y="-14" width="56" height="28" fill="none" stroke="#fff" stroke-width="1.5" />
					</g>
					<g transform="translate(250 58)">
						<path d="M0 22 C-14 4 -14 -10 0 -10 S14 4 0 22Z" fill="var(--green)" />
						<circle cx="0" cy="-1" r="4.5" fill="var(--ball)" />
					</g>
					<text x="300" y="275" font-family="Inter" font-size="13" fill="#5f5d57">Neckar &amp; Rems</text>
				</svg>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section id="faq" class="faq">
		<div class="container narrow">
			<span class="eyebrow">FAQ</span>
			<h2>Häufige Fragen</h2>
			{#each faqs as f (f.q)}
				<details>
					<summary>{f.q}</summary>
					<p>{f.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- KONTAKT -->
	<section id="kontakt" class="contact">
		<div class="container contact-inner">
			<div>
				<span class="eyebrow light">Kontakt</span>
				<h2>Fragen? Schreib mir einfach.</h2>
				<p class="lead light">Ich melde mich schnellstmöglich – meistens noch am selben Tag.</p>
			</div>
			<div class="contact-links">
				<a href={`mailto:${coach.email}`}><span>E-Mail</span>{coach.email}</a>
				<a href={`tel:${coach.phone.replace(/\s/g, '')}`}><span>Telefon</span>{coach.phone}</a>
				<a href={`https://wa.me/${coach.whatsapp}`} target="_blank" rel="noopener"><span>WhatsApp</span>Nachricht schreiben</a>
				<a href={`https://instagram.com/${coach.instagram}`} target="_blank" rel="noopener">
					<span>Instagram</span>@{coach.instagram}
				</a>
			</div>
		</div>
	</section>
</main>

<footer>
	<div class="container foot">
		<div>
			<strong>{coach.brandFull}</strong><br />
			{coach.name} · Tennistraining im {club.name}
		</div>
		<div class="legal">
			<details id="impressum">
				<summary>Impressum</summary>
				<p>
					Angaben gemäß § 5 DDG:<br />
					{coach.name} – {coach.brandFull}<br />
					[Straße, Hausnummer]<br />
					[PLZ Ort]<br />
					E-Mail: {coach.email} · Telefon: {coach.phone}
				</p>
			</details>
			<details id="datenschutz">
				<summary>Datenschutz</summary>
				<p>
					Daten aus dem Buchungsformular werden nur zur Bearbeitung deiner Trainingsanfrage verwendet und nicht an Dritte
					weitergegeben. Die Anfrage wird lokal in deinem Browser gespeichert und von dir per E-Mail an {coach.nickname}
					gesendet. [Vollständige Datenschutzerklärung ergänzen.]
				</p>
			</details>
		</div>
		<small>© {new Date().getFullYear()} {coach.brandFull}</small>
	</div>
</footer>

<style>
	/* HEADER */
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--green);
		color: #fff;
		transition: box-shadow 0.2s;
	}

	header.scrolled {
		box-shadow: 0 6px 20px -10px rgb(0 0 0 / 0.5);
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 68px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		font-family: var(--font-head);
		font-weight: 800;
		font-size: 1.3rem;
		letter-spacing: -0.02em;
	}

	.logo em {
		color: var(--ball);
		font-style: normal;
		margin: 0 2px;
	}

	.logo small {
		font-weight: 500;
		font-size: 0.8rem;
		opacity: 0.75;
		margin-left: 4px;
	}

	.ball {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background:
			radial-gradient(circle at -30% 50%, transparent 58%, #fff 59% 66%, transparent 67%),
			radial-gradient(circle at 130% 50%, transparent 58%, #fff 59% 66%, transparent 67%),
			var(--ball);
	}

	nav {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	nav a:not(.btn) {
		text-decoration: none;
		font-weight: 500;
		font-size: 0.95rem;
		opacity: 0.85;
	}

	nav a:not(.btn):hover {
		opacity: 1;
		color: var(--ball);
	}

	nav .btn {
		padding: 0.6em 1.2em;
	}

	.burger {
		display: none;
		background: none;
		border: 0;
		padding: 8px;
		cursor: pointer;
	}

	.burger span {
		display: block;
		width: 24px;
		height: 2px;
		background: #fff;
		margin: 5px 0;
	}

	/* HERO */
	.hero {
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, var(--clay) 0%, #b44a26 60%, var(--clay-dark) 100%);
		color: #fff;
		padding: clamp(72px, 12vw, 150px) 0 clamp(64px, 9vw, 110px);
	}

	.court {
		position: absolute;
		right: -6%;
		top: 50%;
		width: min(48vw, 560px);
		height: 130%;
		transform: translateY(-50%) rotate(14deg);
		opacity: 0.6;
	}

	.hero-inner {
		position: relative;
	}

	h1 {
		font-size: clamp(2.8rem, 8vw, 5.6rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 1.2rem;
	}

	h1 span {
		color: var(--ball);
	}

	.light {
		color: rgb(255 255 255 / 0.9);
	}

	.eyebrow.light {
		color: var(--ball);
	}

	.hero-cta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 2rem 0 3rem;
	}

	.btn-ghost.light {
		color: #fff;
	}

	.btn-ghost.light:hover {
		background: rgb(255 255 255 / 0.12);
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(24px, 5vw, 56px);
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.facts li {
		display: flex;
		flex-direction: column;
	}

	.facts strong {
		font-family: var(--font-head);
		font-size: 1.8rem;
		color: var(--ball);
	}

	.facts span {
		font-size: 0.9rem;
		opacity: 0.85;
	}

	/* ZWEISPALTIG */
	.two {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: clamp(32px, 6vw, 80px);
		align-items: center;
	}

	.portrait {
		position: relative;
		aspect-ratio: 4 / 5;
		border-radius: 24px;
		background:
			repeating-linear-gradient(90deg, transparent 0 46%, rgb(255 255 255 / 0.25) 46% 48%, transparent 48% 100%),
			linear-gradient(160deg, var(--green-2), var(--green));
		display: grid;
		place-items: center;
		box-shadow: var(--shadow);
	}

	.initials {
		font-family: var(--font-head);
		font-weight: 800;
		font-size: clamp(5rem, 14vw, 9rem);
		color: var(--ball);
		letter-spacing: -0.04em;
	}

	.badge {
		position: absolute;
		left: -14px;
		bottom: 28px;
		background: var(--ball);
		color: var(--green);
		padding: 14px 18px;
		border-radius: 12px;
		font-size: 0.9rem;
		line-height: 1.3;
		box-shadow: var(--shadow);
	}

	.values {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
		display: grid;
		gap: 14px;
	}

	.values li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
	}

	.values span {
		font-size: 1.4rem;
		width: 44px;
		height: 44px;
		flex: none;
		display: grid;
		place-items: center;
		background: var(--sand);
		border-radius: 12px;
	}

	.values strong {
		display: block;
	}

	/* ANGEBOT */
	.offers {
		background: var(--green);
		color: #fff;
	}

	.offers .lead {
		color: rgb(255 255 255 / 0.75);
	}

	.offers .eyebrow {
		color: var(--ball);
	}

	.offer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 18px;
		margin-top: 2.5rem;
	}

	.offer-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		color: var(--ink);
		border-radius: var(--radius);
		padding: 26px;
	}

	.offer-card h3 {
		font-size: 1.35rem;
	}

	.offer-card p {
		color: var(--muted);
		font-size: 0.97rem;
	}

	.offer-card ul {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem;
		font-size: 0.93rem;
	}

	.offer-card li {
		padding: 4px 0 4px 22px;
		position: relative;
	}

	.offer-card li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 11px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--ball);
		box-shadow: inset 0 0 0 2px var(--green-2);
	}

	.tag {
		position: absolute;
		top: 18px;
		right: 18px;
		background: var(--ball);
		color: var(--green);
		font-size: 0.75rem;
		font-weight: 700;
		padding: 3px 10px;
		border-radius: 999px;
	}

	.offer-foot {
		margin-top: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.price {
		font-family: var(--font-head);
		font-weight: 800;
		font-size: 1.6rem;
	}

	.price small {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--muted);
	}

	/* PREISE */
	.price-wrap {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 28px;
		margin-top: 2rem;
		align-items: start;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
	}

	th,
	td {
		text-align: left;
		padding: 13px 18px;
		border-bottom: 1px solid var(--line);
	}

	th {
		background: var(--sand);
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	td:first-child {
		font-weight: 600;
	}

	td:last-child,
	th:last-child {
		text-align: right;
		white-space: nowrap;
	}

	tbody tr:last-child td {
		border-bottom: 0;
	}

	.packages {
		display: grid;
		gap: 14px;
	}

	.package {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 20px;
		border-radius: var(--radius);
		border: 2px solid var(--green);
	}

	.package h3 {
		font-size: 1.1rem;
		margin-bottom: 0.2em;
	}

	.package p {
		margin: 0 0 0.4em;
		color: var(--muted);
		font-size: 0.93rem;
	}

	.package > strong {
		font-family: var(--font-head);
		font-size: 1.5rem;
		color: var(--clay);
		white-space: nowrap;
	}

	.saving {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--green-2);
	}

	.small {
		font-size: 0.88rem;
		color: var(--muted);
	}

	/* STANDORT */
	address {
		font-style: normal;
		padding: 16px 20px;
		border-left: 4px solid var(--clay);
		background: var(--sand);
		border-radius: 0 10px 10px 0;
		margin-bottom: 1.2rem;
	}

	.info {
		padding-left: 1.1em;
		margin: 0 0 1.6rem;
	}

	.map {
		border-radius: 24px;
		overflow: hidden;
		box-shadow: var(--shadow);
	}

	.map svg {
		display: block;
		width: 100%;
		height: auto;
	}

	/* FAQ */
	.faq {
		background: var(--sand);
	}

	.narrow {
		max-width: 780px;
	}

	details {
		border-bottom: 1px solid var(--line);
	}

	.faq details {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 12px;
		margin-bottom: 10px;
		padding: 0 20px;
	}

	summary {
		cursor: pointer;
		font-weight: 600;
		padding: 18px 0;
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 16px;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.faq summary::after {
		content: '+';
		font-size: 1.4rem;
		line-height: 1;
		color: var(--clay);
		transition: transform 0.2s;
	}

	.faq details[open] summary::after {
		transform: rotate(45deg);
	}

	details p {
		color: var(--muted);
	}

	/* KONTAKT */
	.contact {
		background: var(--clay);
		color: #fff;
	}

	.contact-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: center;
	}

	.contact-links {
		display: grid;
		gap: 12px;
	}

	.contact-links a {
		display: flex;
		flex-direction: column;
		padding: 16px 20px;
		background: rgb(255 255 255 / 0.1);
		border: 1px solid rgb(255 255 255 / 0.2);
		border-radius: 12px;
		text-decoration: none;
		font-weight: 600;
		transition: background 0.15s;
		overflow-wrap: anywhere;
	}

	.contact-links a:hover {
		background: rgb(255 255 255 / 0.18);
	}

	.contact-links span {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ball);
		font-weight: 700;
	}

	/* FOOTER */
	footer {
		background: #0e2b20;
		color: rgb(255 255 255 / 0.8);
		padding: 40px 0;
		font-size: 0.93rem;
	}

	.foot {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 24px;
		align-items: start;
	}

	.foot strong {
		color: #fff;
	}

	.legal details {
		border-color: rgb(255 255 255 / 0.15);
	}

	.legal summary {
		padding: 6px 0;
	}

	.legal p {
		color: rgb(255 255 255 / 0.65);
		font-size: 0.88rem;
	}

	/* RESPONSIVE */
	@media (max-width: 900px) {
		.burger {
			display: block;
		}

		nav {
			position: absolute;
			top: 68px;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			background: var(--green);
			padding: 8px 16px 20px;
			display: none;
			box-shadow: 0 12px 20px -12px rgb(0 0 0 / 0.5);
		}

		nav.open {
			display: flex;
		}

		nav a:not(.btn) {
			padding: 12px 0;
			border-bottom: 1px solid rgb(255 255 255 / 0.1);
		}

		nav .btn {
			margin-top: 14px;
		}

		.two,
		.price-wrap,
		.contact-inner,
		.foot {
			grid-template-columns: 1fr;
		}

		.portrait {
			max-width: 360px;
			aspect-ratio: 1;
		}

		.badge {
			left: 12px;
		}

		.court {
			opacity: 0.25;
			width: 90vw;
			right: -30%;
		}
	}
</style>
