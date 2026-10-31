/**
 * Generates the full Kutis Personal static website.
 * Run: node scripts/build-site.js
 */
const {
  PROFESSIONS,
  pageShell,
  write,
  ROOT,
  SITE,
  HERO_IMG,
  ABOUT_IMG,
  imgPath,
  csHome,
} = require("./build-partial.js");

const COMPANY = {
  name: "KV Haustechnik & Service s.r.o.",
  brand: "Kutis Personal",
  person: "Václav Kutiš",
  address: "Chudenická 1059/30, Praha",
  ico: "19392869",
  dic: "CZ19392869",
  email: "info@kutispersonal.com",
  phoneCS: "+420 737 869 820",
  phoneDE: "+49 160 98767681",
};

function shell(lang, pageId, title, description, pagePath, altPath, content, depth = 1) {
  return pageShell({
    lang,
    pageId,
    title,
    description,
    path: pagePath,
    altPath,
    depth,
    content,
  });
}

function hero(lang, crumb, title, lead) {
  const home = lang === "cs" ? "Úvod" : "Startseite";
  return `<section class="page-hero"><div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${lang === "cs" ? "./" : "./"}">${home}</a><span aria-hidden="true">/</span><span>${crumb}</span></nav>
    <h1>${title}</h1><p class="lead">${lead}</p>
  </div></section>`;
}

function cta(lang, heading, text, depth = 1) {
  const cs = lang === "cs";
  const prefix = depth > 1 ? "../".repeat(depth - 1) : "";
  return `<section class="cta-band"><div class="container">
    <h2>${heading}</h2><p class="lead">${text}</p>
    <a class="btn btn--primary" href="${prefix}kontakt.html?form=${cs ? "worker" : "company"}">${cs ? "Odeslat registraci" : "Bedarf anfragen"}</a>
  </div></section>`;
}

function cards(items) {
  return `<div class="benefit-list">${items.map(([title, text]) => `<article class="benefit-item reveal"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
}

function steps(items) {
  return `<ol class="steps">${items.map(([title, text]) => `<li class="step reveal"><h3>${title}</h3><p>${text}</p></li>`).join("")}</ol>`;
}

function faq(items) {
  return `<div class="faq">${items.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div>`;
}

function professionGrid(lang, prefix = "") {
  const cs = lang === "cs";
  // Na homepage je prefix "berufe/" / "profese/" → kontakt je o úroveň výš relativně? Ne: homepage je /de/ a prefix jen u odkazů na detail.
  // Grid teď vede rovnou na kontakt s předvyplněnou profesí (funkční CTA).
  const contactBase = prefix
    ? `kontakt.html`
    : `../kontakt.html`;
  const form = cs ? "worker" : "company";
  const param = cs ? "profession" : "gewerk";
  const items = PROFESSIONS.map((profession) => {
    const p = profession[lang];
    const q = encodeURIComponent(p.name);
    return `<li><a href="${contactBase}?form=${form}&${param}=${q}">${p.name}</a></li>`;
  }).join("");
  const other = `<li><a class="prof-list__other" href="${contactBase}?form=${form}">${cs ? "Jiné profese…" : "Andere Gewerke…"}</a></li>`;
  return `<ul class="prof-list">${items}${other}</ul>`;
}

function formFeedback(lang) {
  const cs = lang === "cs";
  return `<div class="form-feedback form-feedback--success" hidden>
      <h3>${cs ? "Odesláno" : "Gesendet"}</h3>
      <p>${cs ? "Děkujeme. Ozveme se vám." : "Vielen Dank. Wir melden uns bei Ihnen."}</p>
    </div>
    <div class="form-feedback form-feedback--error" hidden>
      <p>${cs ? "Odeslání se nezdařilo." : "Senden fehlgeschlagen."}</p>
    </div>`;
}

function workerForm(lang, idPrefix = "worker") {
  const cs = lang === "cs";
  const professionOptions = PROFESSIONS.map((p) => `<option>${p[lang].name}</option>`).join("");
  const privacyHref = cs ? "ochrana-osobnich-udaju.html" : "datenschutz.html";
  return `<div class="form-wrap" id="form-${idPrefix}">
  <form class="form-panel" data-form-type="worker">
    <h2>${cs ? "Krátká registrace" : "Kurze Registrierung"}</h2>
    <p class="mt-1 mb-2">${cs ? "Stačí kontakt a krátký popis. Detaily doladíme spolu." : "Kontakt und kurze Beschreibung reichen – den Rest klären wir danach."}</p>
    <div class="form-grid form-grid--2">
      <div class="form-group"><label for="${idPrefix}-name">${cs ? "Jméno / firma" : "Name / Firma"} <span class="required">*</span></label><input id="${idPrefix}-name" name="name" required autocomplete="name"></div>
      <div class="form-group"><label for="${idPrefix}-phone">${cs ? "Telefon" : "Telefon"} <span class="required">*</span></label><input id="${idPrefix}-phone" name="phone" type="tel" required autocomplete="tel"></div>
      <div class="form-group"><label for="${idPrefix}-email">E-mail <span class="required">*</span></label><input id="${idPrefix}-email" name="email" type="email" required autocomplete="email"></div>
      <div class="form-group"><label for="${idPrefix}-profession">${cs ? "Profese" : "Beruf"} <span class="required">*</span></label><select id="${idPrefix}-profession" name="profession" required data-profession-select><option value="">${cs ? "Vyberte profesi" : "Beruf auswählen"}</option>${professionOptions}<option value="__other__">${cs ? "Jiné…" : "Andere…"}</option></select></div>
      <div class="form-group" data-profession-other hidden><label for="${idPrefix}-profession-other">${cs ? "Uveďte profesi" : "Beruf angeben"} <span class="required">*</span></label><input id="${idPrefix}-profession-other" name="professionOther" placeholder="${cs ? "např. obkladač, tesařské práce…" : "z. B. Fliesenleger…"}" autocomplete="off"></div>
      <div class="form-group form-group--full"><label for="${idPrefix}-cooperation">${cs ? "Forma spolupráce" : "Zusammenarbeitsform"}</label><select id="${idPrefix}-cooperation" name="cooperation"><option>${cs ? "OSVČ" : "Selbstständig"}</option><option>${cs ? "Subdodavatelská firma / tým" : "Nachunternehmerfirma / Team"}</option><option>${cs ? "Zaměstnání dle nabídky" : "Anstellung nach Angebot"}</option></select></div>
      <div class="form-group form-group--full"><label for="${idPrefix}-message">${cs ? "Pár vět o vás" : "Kurz über Sie"} <span class="required">*</span></label><textarea id="${idPrefix}-message" name="message" required rows="5" placeholder="${cs ? "např. 2 klempíři, 8 let praxe, auto + nářadí, dostupní od května, Bavorsko" : "z. B. 2 Spengler, 8 Jahre Praxis, Auto + Werkzeug, ab Mai, Bayern"}"></textarea></div>
    </div>
    <div class="form-honeypot" aria-hidden="true"><label>Website<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    <label class="form-check mt-2"><input type="checkbox" name="privacy" required><span>${cs ? `Souhlasím se zpracováním údajů podle <a href="${privacyHref}">zásad ochrany osobních údajů</a>. <span class="required">*</span>` : `Ich stimme der Verarbeitung meiner Daten gemäß der <a href="${privacyHref}">Datenschutzerklärung</a> zu. <span class="required">*</span>`}</span></label>
    <button class="btn btn--primary mt-2" type="submit">${cs ? "Odeslat registraci" : "Registrierung senden"}</button>
  </form>
  ${formFeedback(lang)}
  </div>`;
}

function companyForm(lang, idPrefix = "company") {
  const cs = lang === "cs";
  const privacyHref = cs ? "ochrana-osobnich-udaju.html" : "datenschutz.html";
  return `<div class="form-wrap" id="form-${idPrefix}">
  <form class="form-panel" data-form-type="company">
    <h2>${cs ? "Firemní poptávka" : "Kurze Anfrage"}</h2>
    <p class="mt-1 mb-2">${cs ? "Stačí kontakt a stručný popis. Ozvu se a detaily doladíme." : "Kontakt und kurze Beschreibung reichen – den Rest klären wir persönlich."}</p>
    <div class="form-grid form-grid--2">
      <div class="form-group"><label for="${idPrefix}-name">${cs ? "Název firmy" : "Firmenname"} <span class="required">*</span></label><input id="${idPrefix}-name" name="company" required autocomplete="organization"></div>
      <div class="form-group"><label for="${idPrefix}-contact">${cs ? "Kontaktní osoba" : "Ansprechpartner"} <span class="required">*</span></label><input id="${idPrefix}-contact" name="contact" required autocomplete="name"></div>
      <div class="form-group"><label for="${idPrefix}-email">E-Mail <span class="required">*</span></label><input id="${idPrefix}-email" name="email" type="email" required autocomplete="email"></div>
      <div class="form-group"><label for="${idPrefix}-phone">${cs ? "Telefon" : "Telefon"} <span class="required">*</span></label><input id="${idPrefix}-phone" name="phone" type="tel" required autocomplete="tel"></div>
      <div class="form-group form-group--full"><label for="${idPrefix}-cooperation">${cs ? "Forma spolupráce" : "Form der Zusammenarbeit"}</label><select id="${idPrefix}-cooperation" name="cooperation"><option>${cs ? "Podle domluvy" : "Nach Absprache"}</option><option>${cs ? "Zaměstnání (HPP)" : "Arbeitnehmer / Anstellung"}</option><option>${cs ? "Subdodávka / tým" : "Nachunternehmer-Team"}</option><option>${cs ? "Kombinace" : "Kombination"}</option></select></div>
      <div class="form-group form-group--full"><label for="${idPrefix}-message">${cs ? "Co potřebujete?" : "Was brauchen Sie?"} <span class="required">*</span></label><textarea id="${idPrefix}-message" name="message" required rows="5" placeholder="${cs ? "např. 4 klempíři, Mnichov, od května – Anstellung nebo sub tým" : "z. B. 4 Spengler, München, ab Mai – Anstellung oder Nachunternehmer-Team"}"></textarea></div>
    </div>
    <div class="form-honeypot" aria-hidden="true"><label>Website<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    <label class="form-check mt-2"><input type="checkbox" name="privacy" required><span>${cs ? `Souhlasím se zpracováním údajů podle <a href="${privacyHref}">zásad ochrany osobních údajů</a>. <span class="required">*</span>` : `Ich stimme der Verarbeitung meiner Daten gemäß der <a href="${privacyHref}">Datenschutzerklärung</a> zu. <span class="required">*</span>`}</span></label>
    <button class="btn btn--primary mt-2" type="submit">${cs ? "Odeslat poptávku" : "Anfrage senden"}</button>
  </form>
  ${formFeedback(lang)}
  </div>`;
}

function contactPage(lang) {
  const cs = lang === "cs";
  if (cs) {
    const title = "Kontakt a registrace";
    const intro =
      "Pošlete registraci pracovníka, týmu nebo firemní poptávku. Ozveme se, jakmile budeme mít potřebné informace.";
    return shell(
      lang,
      "contact",
      `${title} | Václav Kutiš`,
      intro,
      "/cs/kontakt.html",
      "/de/kontakt.html",
      `
    ${hero(lang, title, title, intro)}
    <section class="section"><div class="container form-layout">
      <aside><p class="label">Kontakt</p><h2>Stačí krátká zpráva</h2>
      <p class="lead">Jméno, telefon a pár vět o profesi. Ozvu se a detaily doladíme.</p>
      <div class="contact-card mt-2"><p>Napište nebo zavolejte. Odpovídám osobně.</p><p class="mt-1"><a data-email href="mailto:">E-Mail</a><br><a data-tel-link href="tel:"><span data-phone></span></a></p></div></aside>
      ${workerForm(lang, "worker")}
    </div></section>
    <section class="section section--alt"><div class="container form-layout"><aside><p class="label">Pro firmy</p><h2>Hledáte kapacitu na projekt?</h2><p class="lead">Popište profesi, termín a místo projektu. Německé firmy mohou využít i německou verzi webu.</p></aside>${companyForm(lang, "company")}</div></section>`
    );
  }

  // DE: pouze firemní poptávka (B2B). Uchazeči → česká registrace.
  const title = "Bedarf anfragen";
  const intro =
    "Schildern Sie mir Ihr Projekt – Fachkräfte im Anstellungsverhältnis oder Nachunternehmer-Team. Ich prüfe Kapazitäten und melde mich persönlich.";
  return shell(
    lang,
    "contact",
    `${title} | Václav Kutiš`,
    intro,
    "/de/kontakt.html",
    "/cs/kontakt.html",
    `
    ${hero(lang, title, title, intro)}
    <section class="section"><div class="container form-layout">
      <aside><p class="label">Direktkontakt</p><h2>Unverbindliche Anfrage</h2>
      <p class="lead">Kurz schreiben reicht. Anstellung oder Nachunternehmer – Details klären wir danach.</p>
      <div class="contact-card mt-2"><p>Schreiben oder rufen Sie mich an.</p><p class="mt-1"><a data-email href="mailto:">E-Mail</a><br><a data-tel-link href="tel:"><span data-phone></span></a></p></div>
      <p class="mt-3" style="font-size:0.95rem">Sie sind Fachkraft oder Team und suchen einen Einsatz? <a href="../cs/kontakt.html?form=worker">Zur Registrierung auf Tschechisch →</a></p>
      </aside>
      ${companyForm(lang, "company")}
    </div></section>`
  );
}

function professionPage(lang, profession) {
  const p = profession[lang];
  const cs = lang === "cs";
  const listPath = cs ? "/cs/profese/" : "/de/berufe/";
  const alt = cs ? `/de/berufe/${profession.de.slug}.html` : `/cs/profese/${profession.cs.slug}.html`;
    return shell(lang, profession.id, p.title, p.desc, `${listPath}${p.slug}.html`, alt, `
    ${hero(lang, cs ? "Profese" : "Berufe", p.h1, p.intro)}
    <section class="section"><div class="container split"><div class="prose"><p class="label">${cs ? "Pro pracovníky a týmy" : "Für Unternehmen"}</p><h2>${cs ? "Co u této profese řešíme" : "Passende Kapazität für Ihr Projekt"}</h2><p>${p.body}</p><p>${cs ? "Při registraci popište zkušenost, počet lidí, dostupnost, němčinu a vybavení. Díky tomu dokážeme rychleji vyhodnotit vhodnou poptávku." : "Teilen Sie uns Einsatzort, Starttermin, Teamgröße und Anforderungen mit. Wir klären die Verfügbarkeit und stellen geeignete Profile vor."}</p><a class="btn btn--primary mt-3" href="../kontakt.html?form=${cs ? "worker" : "company"}">${cs ? "Zaregistrovat se pro tuto profesi" : "Personal anfragen"}</a></div><div class="split__media"><img src="${imgPath("about.jpg", 2)}" alt="${p.name}" width="1200" height="900" loading="lazy"></div></div></section>
    <section class="section section--alt"><div class="container"><div class="section__head"><p class="label">${cs ? "Důležité informace" : "Transparenter Ablauf"}</p><h2>${cs ? "Než vznikne spolupráce" : "Vor dem Einsatz"}</h2></div>${cards(cs ? [["Praxe a specializace", "Zajímají nás konkrétní činnosti, které zvládáte samostatně."], ["Dostupnost", "Uveďte reálný termín nástupu a délku možného nasazení."], ["Podmínky projektu", "Každý projekt má vlastní lokalitu, rozsah a organizační požadavky."], ["Bez automatických slibů", "Registrace je zařazení do databáze, nikoli garance zakázky."]] : [["Anforderungsprofil", "Wir gleichen Qualifikation und Spezialisierung mit Ihrem Projekt ab."], ["Verfügbarkeit", "Sie erhalten nur Profile, deren mögliche Einsatzzeit geklärt wurde."], ["Ausstattung", "Fahrzeug und Werkzeug werden projektspezifisch abgestimmt."], ["Klare Abstimmung", "Konditionen und Organisation klären die Vertragsparteien vor dem Start."]])}</div></section>
    ${cta(lang, cs ? "Máte zkušenost v této profesi?" : `Benötigen Sie ${p.name}?`, cs ? "Pošlete svůj profil. Ozveme se při vhodné příležitosti." : "Schildern Sie mir Ihren Bedarf – Fachkräfte im Anstellungsverhältnis oder Nachunternehmer-Team.", 2)}`, 2);
}

function genericPage(lang, pageId, slug, altSlug, title, lead, body) {
  return shell(lang, pageId, `${title} | Václav Kutiš`, lead, `/${lang}/${slug}`, `/${lang === "cs" ? "de" : "cs"}/${altSlug}`, `${hero(lang, title, title, lead)}${body}`);
}

function legalPage(lang, pageId, slug, altSlug, title, content) {
  return genericPage(lang, pageId, slug, altSlug, title, content.lead, `<section class="section"><div class="container prose legal-content">${content.body}</div></section>`);
}

function buildCs() {
  write(`${ROOT}/cs/index.html`, csHome());
  write(`${ROOT}/cs/pro-firmy.html`, genericPage("cs", "companies", "pro-firmy.html", "fuer-unternehmen.html", "Pro firmy", "Německým firmám hledám pracovníky a týmy z Česka. Českým firmám pomůžu i s prvním kontaktem v Německu.", `<section class="section"><div class="container"><div class="section__head"><p class="label">Kapacity pro DACH</p><h2>Spolehliví lidé na konkrétní projekt</h2><p class="lead">Nejdřív zjistím rozsah, lokalitu a termín. Pak hledám kapacity, které tomu odpovídají.</p></div>${cards([["Pracovníci podle profese", "Řemeslníci, montéři a technické profese."], ["Týmy a subdodavatelé", "Sehraná kapacita podle rozsahu projektu."], ["První koordinace", "Pomůžu s úvodní komunikací a předáním informací."], ["České firmy do Německa", "Pomůžu s představením vaší kapacity německé straně."]])}</div></section>${cta("cs", "Hledáte pracovníky?", "Detailní firemní formulář je i v německé verzi webu.")}`));
  write(`${ROOT}/cs/pro-pracovniky.html`, genericPage("cs", "workers", "pro-pracovniky.html", "fuer-fachkraefte.html", "Pro pracovníky a OSVČ", "Hledáte práci nebo zakázku v Německu? Registruji zkušené řemeslníky, montéry, OSVČ i pracovní dvojice.", `<section class="section"><div class="container split"><div class="prose"><p class="label">Práce v Německu</p><h2>Profil, se kterým můžu něco udělat</h2><p>Nejdřív potřebuju znát vaši profesi, praxi, jazyk, dostupnost a vybavení. Při shodě s poptávkou vám pošlu konkrétní info o projektu.</p><p>Neslibuju práci každému. Preferuju přesné údaje a lidi, se kterými se dá dlouhodobě počítat.</p><a class="btn btn--primary mt-3" href="kontakt.html?form=worker">Napsat mi</a></div><div class="split__media"><img src="${HERO_IMG}" alt="Řemeslník na stavbě" width="1800" height="1200"></div></div></section><section class="section section--alt"><div class="container"><div class="section__head"><h2>Co si připravit</h2></div>${steps([["Profese a praxe", "Popište konkrétní činnosti, které ovládáte."], ["Dostupnost", "Uveďte, kdy můžete reálně nastoupit."], ["Jazyk a vybavení", "Němčina, auto a nářadí pomáhají správně posoudit nabídku."], ["Doklady", "CV nebo reference můžete poslat mailem po registraci."]])}</div></section>`));
  write(`${ROOT}/cs/pro-subdodavatele.html`, genericPage("cs", "subcontractors", "pro-subdodavatele.html", "fuer-nachunternehmer.html", "Pro týmy a subdodavatele", "Máte sehraný tým nebo firmu a hledáte projekty v Německu? Potřebuju znát kapacitu a zaměření.", `<section class="section"><div class="container"><div class="section__head"><p class="label">Subdodávka v DACH</p><h2>Týmy, které můžu představit německým firmám</h2><p class="lead">Představuju jen týmy s jasně popsanou kapacitou, zkušeností a dostupností.</p></div>${cards([["Profil firmy", "IČO, profesní zaměření a zkušenost s podobnými projekty."], ["Velikost týmu", "Kolik lidí nasadíte a jestli se tým může rozšířit."], ["Organizace", "Doprava, nářadí, vedoucí a německy mluvící kontakt."], ["Dlouhodobý vztah", "Cílím na spolupráci, která funguje i na dalších projektech."]])}<div class="mt-3"><a class="btn btn--primary" href="kontakt.html?form=worker">Registrovat tým</a></div></div></section>`));
  write(`${ROOT}/cs/jak-spoluprace-funguje.html`, genericPage("cs", "process", "jak-spoluprace-funguje.html", "so-funktioniert-es.html", "Jak to u mě funguje", "Konkrétní informace, výběr podle projektu a jasné potvrzení podmínek.", `<section class="section section--dark"><div class="container"><div class="section__head"><p class="label">Proces</p><h2>Od prvního kontaktu k nástupu</h2></div>${steps([["Napíšete mi", "Pracovník pošle profil, firma parametry projektu."], ["Upřesním", "Doptám se na praxi, termín, lokalitu, jazyk a vybavení."], ["Párování", "Porovnávám jen relevantní profily a poptávky."], ["Představení", "Při shodě propojím obě strany a předám podklady."], ["Dohoda", "Podmínky potvrzují přímo účastníci spolupráce."], ["Nástup", "Po zahájení jsem k dispozici pro prvotní koordinaci."]])} </div></section>`));
  write(`${ROOT}/cs/o-nas.html`, genericPage("cs", "about", "o-nas.html", "ueber-uns.html", "O mně", "Václav Kutiš – zprostředkování práce v DACH, individuální nabídky a obchodní spolupráce.", `<section class="section"><div class="container split"><div class="prose"><p class="label">Václav Kutiš</p><h2>Primárně personál. Otevřený i jiným výzvám.</h2><p>Stojím za značkou <strong>Kutis Personal</strong> a firmou <strong>KV Haustechnik &amp; Service s.r.o.</strong> Osm let pracuji v regionu DACH a za tu dobu jsem pomohl osadit více než 400 pracovníků.</p><p>Znám německý trh i konkurenční firmy – vím, kam lidi doporučit. Umím řešit ubytování, nástup i krizové situace na místě. Nejsem call centrum; komunikuji napřímo.</p><p>Jsem obchodník a mám rád výzvy. Primárně zprostředkovávám práci a zakázky, částečně se věnuji i programování. Máte individuální nabídku nebo nápad? Ozvěte se – dáme hlavy dohromady a uvidíme, co z toho vznikne.</p></div><div class="split__media"><img src="${ABOUT_IMG}" alt="Práce v týmu" width="1200" height="900" loading="lazy"></div></div></section><section class="section section--alt"><div class="container"><div class="work-list"><article class="work-item reveal"><h3>Pro pracovníky</h3><p>Práce a zakázky v Německu, orientace na trhu, pomoc s ubytováním a nástupem.</p></article><article class="work-item reveal"><h3>Pro firmy</h3><p>Kapacity podle projektu – jednotlivci i týmy, bez fantazie o dostupnosti.</p></article><article class="work-item reveal"><h3>V krizích i v praxi</h3><p>Vím, jak postupovat, když se situace zkomplikuje – a znám firmy, kam dává smysl doporučit.</p></article><article class="work-item reveal"><h3>Individuální spolupráce</h3><p>Jste otevření jinému obchodu nebo nápadu? Napište – rád si sednu a probereme možnosti.</p></article></div><div class="trust-stats mt-3" style="max-width:48rem"><div class="trust-stat"><div class="trust-stat__value">8 let</div><div class="trust-stat__label">Zkušenost v DACH</div></div><div class="trust-stat"><div class="trust-stat__value">400+</div><div class="trust-stat__label">Nasazených pracovníků</div></div><div class="trust-stat"><div class="trust-stat__value">Praha</div><div class="trust-stat__label">Sídlo</div></div><div class="trust-stat"><div class="trust-stat__value">DE · AT · CH</div><div class="trust-stat__label">Působnost</div></div></div></div></section>${cta("cs", "Chcete se ozvat?", "Napište mi – ozvu se, jakmile budu mít relevantní informace.")}`));
  write(`${ROOT}/cs/reference.html`, genericPage("cs", "references", "reference.html", "referenzen.html", "Reference", "Jmenovité reference zveřejňuji jen se souhlasem partnerů. Níže je ověřený track record.", `<section class="section"><div class="container">${cards([["8 let v regionu DACH", "Praktická zkušenost s projekty a koordinací v Německu, Rakousku a Švýcarsku."], ["400+ nasazených pracovníků", "Propojení řemeslníků, montérů a týmů s konkrétními zakázkami."], ["Reference klientů", "Jmenovité reference a loga partnerů zveřejníme až se souhlasem – zatím je na webu neuvádíme."]])}<p class="mt-3 lead">Máte-li zájem o nestandardní projekt, napište – probereme možnosti osobně.</p></div></section>`));
  write(`${ROOT}/cs/faq.html`, genericPage("cs", "faq", "faq.html", "faq.html", "Časté dotazy", "Odpovědi pro české pracovníky a OSVČ, kteří zvažují práci nebo zakázku v Německu.", `<section class="section"><div class="container">${faq([["Je registrace placená?", "Před odesláním vždy ověřte aktuální podmínky spolupráce. Samotná registrace slouží k posouzení vašeho profilu."], ["Zaručíte mi práci?", "Ne. Registrace není garance zakázky. Kontaktujeme vás, pokud se váš profil hodí ke konkrétní poptávce."], ["Musím umět německy?", "Záleží na projektu. Uveďte skutečnou úroveň, aby bylo možné nabídku správně posoudit."], ["Potřebuji vlastní auto a nářadí?", "Požadavky se liší. Tyto informace však často rozhodují o vhodnosti pro daný projekt."], ["Mohu se přihlásit jako tým?", "Ano. Uveďte počet lidí, specializaci, vedoucího týmu a společnou dostupnost."], ["Jak rychle se ozvete?", "Jakmile budeme mít dostatek informací a relevantní příležitost."]])} </div></section>`));
  write(`${ROOT}/cs/kontakt.html`, contactPage("cs"));
  write(`${ROOT}/cs/ochrana-osobnich-udaju.html`, legalPage("cs", "privacy", "ochrana-osobnich-udaju.html", "datenschutz.html", "Ochrana osobních údajů", { lead: "Informace o zpracování osobních údajů při používání webu Kutis Personal.", body: `<p><strong>Správce:</strong> ${COMPANY.name}, IČO ${COMPANY.ico}, DIČ ${COMPANY.dic}, sídlo ${COMPANY.address}. Značka Kutis Personal, kontaktní osoba ${COMPANY.person}.</p><p>E-mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br>Telefon CZ: ${COMPANY.phoneCS}<br>Telefon DE: ${COMPANY.phoneDE}</p><h2>Jaké údaje zpracováváme</h2><p>Zpracováváme údaje z kontaktních formulářů: jméno, firmu, telefon, e-mail, profesní informace, dostupnost, popis projektu a další údaje, které dobrovolně uvedete.</p><h2>Účel a právní základ</h2><p>Údaje používáme pro vyřízení poptávky, posouzení možné spolupráce a navazující komunikaci. Právním základem je provedení kroků před uzavřením smlouvy (čl. 6 odst. 1 písm. b GDPR) a oprávněný zájem na komunikaci s potenciálními partnery (čl. 6 odst. 1 písm. f GDPR), případně souhlas, pokud je vyžadován.</p><h2>Doba uchování</h2><p>Údaje uchováváme po dobu potřebnou k vyřízení poptávky a přiměřeně dlouho pro možné navazující spolupráce, nejdéle podle zákonných povinností nebo do odvolání souhlasu, pokud je souhlas právním základem.</p><h2>Příjemci</h2><p>Údaje nezveřejňujeme. Mohou být zpřístupněny pouze poskytovatelům technických služeb (hosting, e-mail), kteří je zpracovávají na základě smlouvy o zpracování.</p><h2>Vaše práva</h2><p>Můžete požadovat přístup, opravu, výmaz, omezení zpracování, námitku i přenositelnost údajů. Máte právo podat stížnost u Úřadu pro ochranu osobních údajů. Kontaktujte nás na ${COMPANY.email}.</p>` }));
  write(`${ROOT}/cs/cookies.html`, legalPage("cs", "cookies", "cookies.html", "cookies.html", "Cookies", { lead: "Jak web Kutis Personal používá soubory cookies.", body: `<h2>Co jsou cookies</h2><p>Cookies jsou malé textové soubory ukládané v prohlížeči. Pomáhají zajistit základní fungování webu.</p><h2>Nezbytné cookies</h2><p>Tyto cookies jsou nutné pro funkce webu (např. zapamatování jazyka nebo technické nastavení) a nelze je vypnout bez omezení jeho provozu.</p><h2>Analytické a marketingové cookies</h2><p>Aktuálně web nepoužívá analytické ani marketingové cookies třetích stran. Pokud je v budoucnu zapneme, doplníme sem informace a nabídneme možnost souhlasu.</p>` }));
  write(`${ROOT}/cs/pravni-upozorneni.html`, legalPage("cs", "legal", "pravni-upozorneni.html", "impressum.html", "Právní upozornění", { lead: "Základní právní informace k provozu webu Kutis Personal.", body: `<p><strong>Provozovatel:</strong> ${COMPANY.name}<br>IČO: ${COMPANY.ico}<br>DIČ: ${COMPANY.dic}<br>Sídlo: ${COMPANY.address}<br>Značka: ${COMPANY.brand}<br>Jednatel / kontakt: ${COMPANY.person}<br>E-mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br>Telefon: ${COMPANY.phoneCS}</p><h2>Obsah webu</h2><p>Informace na webu mají obecný informační charakter. Konkrétní obchodní, pracovněprávní a smluvní podmínky jsou vždy předmětem individuální dohody mezi zapojenými stranami.</p><h2>Odpovědnost</h2><p>Provozovatel usiluje o aktuálnost obsahu, nezaručuje však nepřetržitou dostupnost webu ani úplnost informací třetích stran. Web slouží k propojení kapacit a poptávek, nikoli jako právní, daňové ani personální poradenství.</p><h2>Autorská práva</h2><p>Texty, grafika a struktura webu jsou chráněny autorským právem. Jejich užití bez souhlasu provozovatele není dovoleno, pokud právní předpis nestanoví jinak.</p>` }));
  write(`${ROOT}/cs/profese/index.html`, shell("cs", "professions", "Profese pro práci v Německu | Václav Kutiš", "Přehled profesí, pro které Václav Kutiš hledá lidi na německé projekty.", "/cs/profese/", "/de/berufe/", `${hero("cs", "Profese", "Profese pro práci a zakázky v Německu", "Vyberte profesi a pošlete mi svůj profil. Poptávky se mění podle projektů.")}<section class="section section--alt"><div class="container">${professionGrid("cs")}</div></section>`, 2));
  PROFESSIONS.forEach((p) => write(`${ROOT}/cs/profese/${p.cs.slug}.html`, professionPage("cs", p)));
}

function buildDe() {
  const deHomeContent = `
    <section class="hero">
      <div class="hero__media" aria-hidden="true"><img src="${HERO_IMG}" alt="" width="2400" height="1600" fetchpriority="high"><div class="hero__overlay"></div></div>
      <div class="container hero__content">
        <p class="hero__brand">Václav <span>Kutiš</span></p>
        <h1 class="hero__title">Fachkräfte und Teams für Ihre Baustelle</h1>
        <p class="hero__text">Zuverlässige Kapazitäten aus Tschechien – als Arbeitnehmer oder als eingespieltes Nachunternehmerteam. Klar, direkt und projektbezogen.</p>
        <div class="btn-group">
          <a class="btn btn--primary" href="kontakt.html?form=company">Bedarf anfragen</a>
          <a class="btn btn--outline" href="fuer-unternehmen.html">Für Unternehmen</a>
        </div>
      </div>
    </section>

    <section class="section"><div class="container">
      <div class="intro-bar reveal">
        <p class="intro-bar__text">8 Jahre DACH. Ich besetze Gewerke so, dass Ihre Baustelle weiterläuft – mit realistischer Zusage und einem Ansprechpartner.</p>
        <div class="stats-inline">
          <div class="stats-inline__item"><strong>8 Jahre</strong><span>Erfahrung DACH</span></div>
          <div class="stats-inline__item"><strong>400+</strong><span>Vermittelte Fachkräfte</span></div>
          <div class="stats-inline__item"><strong>DE · AT · CH</strong><span>Region</span></div>
          <div class="stats-inline__item"><strong>1:1</strong><span>Direkter Kontakt</span></div>
        </div>
      </div>
    </div></section>

    <section class="section section--alt"><div class="container">
      <div class="section__head">
        <p class="label">Zusammenarbeit</p>
        <h2>So stelle ich Kapazität bereit</h2>
        <p class="lead">Je nach Ihrem Bedarf – einzelne Fachkräfte im Anstellungsverhältnis oder komplette Teams als Nachunternehmer.</p>
      </div>
      <div class="work-rows">
        <article class="work-row reveal"><span class="work-row__num">01</span><h3>Arbeitnehmer / Anstellung</h3><p>Fachkräfte für Ihren Betrieb – auch im sozialversicherungspflichtigen Anstellungsverhältnis, wenn Sie das wünschen.</p></article>
        <article class="work-row reveal"><span class="work-row__num">02</span><h3>Nachunternehmer-Teams</h3><p>Eingespielte Kolonnen für definierte Gewerke – skalierbar nach Baustellenstärke, mit festem Ansprechpartner.</p></article>
        <article class="work-row reveal"><span class="work-row__num">03</span><h3>Kurzfristige Verstärkung</h3><p>Wenn Bauzeitenpläne eng werden: passende Kapazität prüfen und realistisch zurückmelden – ohne leere Versprechen.</p></article>
        <article class="work-row reveal"><span class="work-row__num">04</span><h3>Organisation vor Ort</h3><p>Unterkunft, Anreise, Sprache, Fahrzeug und Werkzeug – frühzeitig klären, damit der Einsatz startklar ist.</p></article>
      </div>
    </div></section>

    <section class="section"><div class="container">
      <div class="section__head"><p class="label">Für Bauunternehmen</p><h2>Was Sie erwarten können</h2></div>
      ${cards([
        ["Passende Gewerke", "Dach, Maurer, Montage, Technik und weitere Berufe – immer mit Blick auf Ihr Projekt."],
        ["Flexible Teamstärke", "Einzelkraft, 2er-/3er-Team oder größere Nachunternehmergruppe – je nach Bedarf."],
        ["Klare Absprachen", "Sie sprechen mit mir persönlich. Realistische Zusagen statt unnötiger Komplexität."],
        ["Dokumente & Nachweise", "Qualifikation und Einsatzbereitschaft werden vor der Vorstellung geprüft."],
      ])}
      <div class="mt-3"><a class="btn btn--primary" href="kontakt.html?form=company">Unverbindliche Anfrage</a></div>
    </div></section>

    <section class="section section--dark"><div class="container">
      <div class="section__head">
        <p class="label">Ablauf</p>
        <h2>Von der Anfrage bis zum Einsatz</h2>
        <p class="lead">Transparent und nachvollziehbar – damit Sie Planungssicherheit behalten.</p>
      </div>
      ${steps([
        ["Bedarf schildern", "Gewerk, Anzahl, Einsatzort, Start und gewünschte Form (Anstellung oder Nachunternehmer)."],
        ["Anforderungen klären", "Sprache, Ausstattung, Dauer und organisatorische Rahmenbedingungen."],
        ["Kapazität prüfen", "Ich gleiche Ihren Bedarf mit verfügbaren Fachkräften und Teams ab."],
        ["Profile vorstellen", "Sie erhalten nur passende Informationen für Ihre Entscheidung."],
        ["Konditionen abstimmen", "Vertrag und Organisation regeln die beteiligten Parteien verbindlich."],
        ["Einsatz starten", "Bei Bedarf bleibe ich für die erste Koordination ansprechbar."],
      ])}
      <div class="mt-3"><a class="btn btn--outline" href="so-funktioniert-es.html">Ablauf im Detail</a></div>
    </div></section>

    <section class="section"><div class="container split">
      <div>
        <p class="label">Über mich</p>
        <h2>Persönlicher Ansprechpartner statt anonymer Agentur</h2>
        <p class="lead mt-2">Ich bin Václav Kutiš. Seit 8 Jahren arbeite ich im DACH-Raum und vermittle Fachkräfte sowie Teams aus Tschechien an deutsche Bauunternehmen.</p>
        <p class="mt-2">Hinter Kutis Personal stehe ich und ${COMPANY.name}. Ziel ist einfach: Ihre Baustelle mit der richtigen Kapazität absichern – klar und verlässlich.</p>
        <a class="btn btn--outline-dark mt-3" href="ueber-uns.html">Mehr über mich</a>
      </div>
      <div class="split__media"><img src="${ABOUT_IMG}" alt="Baustelle" width="1200" height="900" loading="lazy"></div>
    </div></section>

    <section class="section section--alt"><div class="container">
      <div class="section__head">
        <p class="label">Gewerke</p>
        <h2>Berufe, die ich häufig besetze</h2>
        <p class="lead">Gewerk anklicken – die Anfrage öffnet sich vorausgefüllt. Einzelkraft oder Nachunternehmer-Team schreiben Sie dazu.</p>
      </div>
      ${professionGrid("de", "berufe/")}
    </div></section>

    ${cta("de", "Benötigen Sie Fachkräfte oder ein Team?", "Schildern Sie mir Ihren Bedarf – Anstellung oder Nachunternehmer. Ich melde mich mit einer realistischen Einschätzung.")}`;

  write(`${ROOT}/de/index.html`, shell("de", "home", "Václav Kutiš | Fachkräfte und Nachunternehmer-Teams für Deutschland", "Fachkräfte im Anstellungsverhältnis oder eingespielte Nachunternehmerteams aus Tschechien – Václav Kutiš / Kutis Personal.", "/de/", "/cs/", deHomeContent));
  write(`${ROOT}/de/fuer-unternehmen.html`, genericPage("de", "companies", "fuer-unternehmen.html", "pro-firmy.html", "Für Unternehmen", "Fachkräfte und Teams für Bau-, Montage- und Industrieprojekte – als Arbeitnehmer oder als Nachunternehmer.", `<section class="section"><div class="container"><div class="section__head"><p class="label">Kapazität für Ihre Baustelle</p><h2>Zwei Wege – je nach Ihrem Bedarf</h2><p class="lead">Ob Sie einzelne Fachkräfte anstellen wollen oder ein komplettes Team als Nachunternehmer brauchen: Ich prüfe passende Kapazitäten und melde mich persönlich.</p></div>${cards([["Arbeitnehmer / Anstellung", "Fachkräfte für Ihren Betrieb – auch sozialversicherungspflichtig, wenn Sie diese Form bevorzugen."], ["Nachunternehmer-Teams", "Eingespielte Kolonnen für klar definierte Leistungen und Gewerke."], ["Flexible Stärke", "Einzelkraft, kleine Teams oder größere Gruppen – abgestimmt auf Ihren Bauzeitenplan."], ["Gewerk und Qualifikation", "Auswahl nach tatsächlicher Tätigkeit und benötigter Erfahrung."], ["Organisation", "Einsatzort, Start, Dauer, Sprache, Fahrzeug und Werkzeug werden vorab geklärt."], ["Keine Fantasiezusagen", "Kapazitäten stelle ich erst nach Prüfung als verfügbar vor."]])}<div class="mt-3 btn-group"><a class="btn btn--primary" href="kontakt.html?form=company">Bedarf anfragen</a><a class="btn btn--outline-dark" href="fuer-nachunternehmer.html">Mehr zu Teams</a></div></div></section>`));
  write(`${ROOT}/de/fuer-fachkraefte.html`, genericPage("de", "workers", "fuer-fachkraefte.html", "pro-pracovniky.html", "Für Fachkräfte", "Sie sind Fachkraft oder Team aus Tschechien und suchen einen Einsatz in Deutschland? Die Registrierung läuft über die tschechische Seite.", `<section class="section"><div class="container split"><div class="prose"><p class="label">Tschechische Registrierung</p><h2>Profil für deutsche Projekte anlegen</h2><p>Bitte nutzen Sie die tschechische Seite für Beruf, Erfahrung, Verfügbarkeit, Sprache und Ausstattung. So kann Ihr Profil bei passenden Firmenanfragen berücksichtigt werden.</p><p>Eine Registrierung ist keine Zusage für einen Einsatz – sie hilft, bei Bedarf gezielt Kontakt aufzunehmen.</p><a class="btn btn--primary mt-3" href="../cs/kontakt.html?form=worker">Zur Registrierung auf Tschechisch</a></div><div class="split__media"><img src="${ABOUT_IMG}" alt="Fachkräfte bei der Arbeit" width="1200" height="900"></div></div></section>`));
  write(`${ROOT}/de/fuer-nachunternehmer.html`, genericPage("de", "subcontractors", "fuer-nachunternehmer.html", "pro-subdodavatele.html", "Nachunternehmer-Teams", "Eingespielte Teams aus Tschechien für klar definierte Leistungen auf deutschen Baustellen.", `<section class="section"><div class="container"><div class="section__head"><p class="label">Teams mit Struktur</p><h2>Nachunternehmer, die zur Aufgabe passen</h2><p class="lead">Wenn Sie keine Einzelkräfte, sondern eine Kolonne brauchen: Ich stelle Teams vor, deren Größe, Gewerk und Organisation zu Ihrem Projekt passen.</p></div>${cards([["Teamgröße", "Von kleinen Arbeitsgruppen bis zu größeren Nachunternehmerteams – je nach Baustellenbedarf."], ["Leistung und Erfahrung", "Nur für Aufgaben, die zum Profil des Teams passen."], ["Fester Ansprechpartner", "Erleichtert die tägliche Abstimmung mit Bauleitung und Polier."], ["Organisation", "Beginn, Dauer, Unterkunft, Fahrzeug und Werkzeug werden frühzeitig angesprochen."]])}<div class="mt-3"><a class="btn btn--primary" href="kontakt.html?form=company">Team anfragen</a></div></div></section>`));
  write(`${ROOT}/de/so-funktioniert-es.html`, genericPage("de", "process", "so-funktioniert-es.html", "jak-spoluprace-funguje.html", "So funktioniert es", "Ein klarer Ablauf – egal ob Anstellung oder Nachunternehmer-Team.", `<section class="section section--dark"><div class="container"><div class="section__head"><p class="label">Ablauf</p><h2>Von der Anfrage bis zum Einsatz</h2></div>${steps([["Anfrage senden", "Beschreiben Sie Projekt, Gewerk, Einsatzort, Zeitraum und gewünschte Form der Zusammenarbeit."], ["Bedarf konkretisieren", "Ich kläre Anzahl, Qualifikation, Sprache und Ausstattung."], ["Kapazität prüfen", "Abgleich mit verfügbaren Fachkräften und Teams."], ["Profile vorstellen", "Sie erhalten die Informationen für Ihre Entscheidung."], ["Direkte Abstimmung", "Konditionen und Verträge regeln die Beteiligten verbindlich."], ["Einsatz begleiten", "Bei der ersten Koordination bleibe ich ansprechbar."]])} </div></section>`));
  write(`${ROOT}/de/ueber-uns.html`, genericPage("de", "about", "ueber-uns.html", "o-nas.html", "Über mich", "Václav Kutiš – Fachkräfte und Nachunternehmer-Teams für deutsche Bauprojekte.", `<section class="section"><div class="container split"><div class="prose"><p class="label">Václav Kutiš</p><h2>Persönlich. Direkt. Projektbezogen.</h2><p>Hinter <strong>Kutis Personal</strong> stehe ich und <strong>${COMPANY.name}</strong> (IČO ${COMPANY.ico}). Seit 8 Jahren im DACH-Raum, mehr als 400 vermittelte Fachkräfte.</p><p>Deutsche Unternehmen unterstütze ich mit Fachkräften im Anstellungsverhältnis und mit eingespielten Nachunternehmerteams – inklusive Orientierung zu Unterkunft, Organisation und kritischen Situationen vor Ort.</p><p>Sitz: ${COMPANY.address}<br>E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br>Telefon DE: ${COMPANY.phoneDE}</p></div><div class="split__media"><img src="${ABOUT_IMG}" alt="Team auf einer Baustelle" width="1200" height="900" loading="lazy"></div></div></section>${cta("de", "Projekt anfragen?", "Senden Sie mir die Eckdaten – ich melde mich persönlich.")}`));
  write(`${ROOT}/de/referenzen.html`, genericPage("de", "references", "referenzen.html", "reference.html", "Referenzen", "Namentliche Kundenreferenzen veröffentliche ich nur mit Zustimmung.", `<section class="section"><div class="container">${cards([["8 Jahre DACH", "Praxis in Deutschland, Österreich und der Schweiz."], ["400+ Fachkräfte", "Vermittlung von Handwerkern, Monteuren und Teams."], ["Partnerlogos", "Werden später ergänzt – derzeit ohne Veröffentlichung von Kundennamen."]])}</div></section>`));
  write(`${ROOT}/de/faq.html`, genericPage("de", "faq", "faq.html", "faq.html", "Häufige Fragen", "Antworten für deutsche Unternehmen zu Fachkräften, Anstellung und Nachunternehmer-Teams.", `<section class="section"><div class="container">${faq([["Welche Formen der Zusammenarbeit sind möglich?", "Fachkräfte im Anstellungsverhältnis (Arbeitnehmer) sowie komplette Teams als Nachunternehmer – je nach Ihrem Bedarf."], ["Welche Gewerke vermitteln Sie?", "Schwerpunkte sind Bau, Handwerk, Montage und Technik. Übersicht unter Berufe."], ["Kann ich einzelne Fachkräfte und Teams anfragen?", "Ja. Nennen Sie Anzahl und ob Sie Einzelkräfte oder ein eingespieltes Team benötigen."], ["Wie schnell können Sie Personal stellen?", "Das hängt von Gewerk, Ort, Start und Verfügbarkeit ab. Ich gebe nach Prüfung eine realistische Rückmeldung."], ["Sind Fahrzeug und Werkzeug vorhanden?", "Das kläre ich profil- und projektspezifisch. Bitte Anforderungen in der Anfrage nennen."], ["Wer schließt den Vertrag?", "Konditionen werden direkt zwischen den Vertragsparteien vereinbart."]])} </div></section>`));
  write(`${ROOT}/de/kontakt.html`, contactPage("de"));
  write(`${ROOT}/de/impressum.html`, legalPage("de", "legal", "impressum.html", "pravni-upozorneni.html", "Impressum", { lead: "Angaben gemäß den geltenden gesetzlichen Vorschriften.", body: `<p><strong>${COMPANY.name}</strong><br>Marke: ${COMPANY.brand} / Václav Kutiš<br>${COMPANY.address}<br>Tschechische Republik</p><p>E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br>Telefon DE: ${COMPANY.phoneDE}<br>Telefon CZ: ${COMPANY.phoneCS}</p><h2>Vertreten durch</h2><p>${COMPANY.person}</p><h2>Register- und Steuerangaben</h2><p>Rechtsform: s.r.o. (tschechische Gesellschaft mit beschränkter Haftung)<br>IČO: ${COMPANY.ico}<br>DIČ / USt-IdNr.: ${COMPANY.dic}</p><h2>Haftung für Inhalte</h2><p>Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für Vollständigkeit, Aktualität und ständige Verfügbarkeit wird keine Gewähr übernommen. Konkrete Vertragsbedingungen werden zwischen den jeweiligen Parteien vereinbart. Die Website dient der Vermittlung von Kontakten und Kapazitäten und ersetzt keine Rechts-, Steuer- oder Personalberatung.</p><h2>Urheberrecht</h2><p>Inhalte und Gestaltung dieser Website unterliegen dem Urheberrecht. Jede Verwendung außerhalb der gesetzlichen Grenzen bedarf der vorherigen Zustimmung.</p>` }));
  write(`${ROOT}/de/datenschutz.html`, legalPage("de", "privacy", "datenschutz.html", "ochrana-osobnich-udaju.html", "Datenschutz", { lead: "Informationen zur Verarbeitung personenbezogener Daten.", body: `<p><strong>Verantwortlicher:</strong> ${COMPANY.name}, IČO ${COMPANY.ico}, DIČ ${COMPANY.dic}, ${COMPANY.address}. Marke Kutis Personal, Ansprechpartner ${COMPANY.person}.</p><p>E-Mail: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br>Telefon: ${COMPANY.phoneDE}</p><h2>Verarbeitete Daten</h2><p>Bei einer Anfrage verarbeiten wir Kontakt-, Firmen- und Projektdaten sowie Angaben zu Qualifikation, Verfügbarkeit und weiteren freiwillig übermittelten Informationen.</p><h2>Zweck und Rechtsgrundlage</h2><p>Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage, zur Anbahnung einer Zusammenarbeit und zur Kommunikation. Rechtsgrundlage sind vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO), berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO) und gegebenenfalls Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</p><h2>Speicherdauer</h2><p>Wir speichern Daten nur so lange, wie dies für die Anfrage, mögliche Folgekommunikation oder gesetzliche Aufbewahrungspflichten erforderlich ist.</p><h2>Empfänger</h2><p>Eine Weitergabe erfolgt nur an technische Dienstleister (Hosting, E-Mail), soweit erforderlich und vertraglich abgesichert.</p><h2>Ihre Rechte</h2><p>Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit verlangen. Außerdem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde. Kontakt: ${COMPANY.email}</p>` }));
  write(`${ROOT}/de/cookies.html`, legalPage("de", "cookies", "cookies.html", "cookies.html", "Cookies", { lead: "Hinweise zu Cookies auf dieser Website.", body: `<h2>Was sind Cookies?</h2><p>Cookies sind kleine Textdateien, die im Browser gespeichert werden.</p><h2>Technisch notwendige Cookies</h2><p>Diese Cookies dienen dem funktionsfähigen Betrieb der Website.</p><h2>Optionale Cookies</h2><p>Derzeit setzen wir keine Analyse- oder Marketing-Cookies von Drittanbietern ein.</p>` }));
  write(`${ROOT}/de/berufe/index.html`, shell("de", "professions", "Berufe und Gewerke | Václav Kutiš", "Fachkräfte und Teams aus Tschechien für deutsche Projekte – Václav Kutiš.", "/de/berufe/", "/cs/profese/", `${hero("de", "Berufe", "Berufe und Gewerke für Ihre Projekte", "Wählen Sie ein Gewerk und senden Sie mir die Eckdaten Ihres Bedarfs.")}<section class="section section--alt"><div class="container">${professionGrid("de")}</div></section>`, 2));
  PROFESSIONS.forEach((p) => write(`${ROOT}/de/berufe/${p.de.slug}.html`, professionPage("de", p)));
}

function rootFiles() {
  write(`${ROOT}/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Václav Kutiš</title><script>!function(){var l=(navigator.language||navigator.userLanguage||"").toLowerCase();location.replace(l.indexOf("de")===0?"/de/":"/cs/")}();</script></head><body><p>Redirecting… <a href="/de/">Deutsch</a> · <a href="/cs/">Čeština</a></p></body></html>`);
  write(`${ROOT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  const urls = [
    "/cs/", "/de/",
    ...["pro-firmy.html", "pro-pracovniky.html", "pro-subdodavatele.html", "jak-spoluprace-funguje.html", "o-nas.html", "reference.html", "faq.html", "kontakt.html", "ochrana-osobnich-udaju.html", "cookies.html", "pravni-upozorneni.html"].map((x) => `/cs/${x}`),
    "/cs/profese/",
    ...PROFESSIONS.map((p) => `/cs/profese/${p.cs.slug}.html`),
    ...["fuer-unternehmen.html", "fuer-fachkraefte.html", "fuer-nachunternehmer.html", "so-funktioniert-es.html", "ueber-uns.html", "referenzen.html", "faq.html", "kontakt.html", "impressum.html", "datenschutz.html", "cookies.html"].map((x) => `/de/${x}`),
    "/de/berufe/",
    ...PROFESSIONS.map((p) => `/de/berufe/${p.de.slug}.html`),
  ];
  write(`${ROOT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${SITE}${url}</loc></url>`).join("\n")}\n</urlset>\n`);
}

buildCs();
buildDe();
rootFiles();
console.log(`Generated ${2 * PROFESSIONS.length + 27} HTML pages plus robots.txt and sitemap.xml.`);
