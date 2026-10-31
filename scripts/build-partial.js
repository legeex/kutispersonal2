/**
 * Generates the full Kutis Personal static site (CS + DE).
 * Run: node scripts/build-site.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.kutispersonal.com";

const PROFESSIONS = [
  {
    id: "pokryvaci",
    cs: {
      name: "Pokrývači",
      slug: "pokryvaci",
      title: "Práce pro pokrývače v Německu | Václav Kutiš",
      desc: "Zakázky a práce v Německu pro zkušené pokrývače, OSVČ i pokrývačské týmy. Propojení s německými stavebními firmami.",
      h1: "Pokrývači – práce a zakázky v Německu",
      intro:
        "Propojujeme zkušené pokrývače a pokrývačské týmy s projekty u německých stavebních firem. Hledáme spolehlivé profíky s praxí, kteří zvládnou práci na německých stavbách.",
      body: "Typicky jde o strechy, opravy, rekonstrukce i novostavby. Konkrétní podmínky, lokalita a forma spolupráce se vždy odvíjí od dané nabídky – zaměstnání, OSVČ nebo subdodávka.",
    },
    de: {
      name: "Dachdecker",
      slug: "dachdecker",
      title: "Dachdecker Subunternehmer aus Tschechien | Václav Kutiš",
      desc: "Dachdecker und Dachdeckerteams aus Tschechien für Bauprojekte in Deutschland. Einzelmonteure oder eingespielte Teams.",
      h1: "Dachdecker und Dachdeckerteams für Ihre Projekte",
      intro:
        "Wir vermitteln geprüfte Dachdecker und eingespielte Teams aus Tschechien und Mitteleuropa an deutsche Bauunternehmen – für Neubau, Sanierung und Instandhaltung.",
      body: "Ob Einzelkraft oder komplettes Team: Wir klären Qualifikation, Verfügbarkeit, Deutschkenntnisse sowie Fahrzeug und Werkzeug und stellen Ihnen passende Kapazitäten vor.",
    },
  },
  {
    id: "klempiri",
    cs: {
      name: "Klempíři",
      slug: "klempiri",
      title: "Práce pro klempíře v Německu | Václav Kutiš",
      desc: "Zakázky v Německu pro klempíře a klempířské týmy. Subdodávky a práce u německých firem.",
      h1: "Klempíři – práce a zakázky v Německu",
      intro:
        "Hledáme klempíře s praxí na střechách a oplechování pro projekty v Německu – jednotlivce i dvojice nebo týmy.",
      body: "Nabídky se liší lokalitou, délkou zakázky a formou spolupráce. Důležitá je spolehlivost, kvalita provedení a ochota komunikovat k projektu.",
    },
    de: {
      name: "Klempner / Spengler",
      slug: "klempner",
      title: "Klempner und Spengler aus Tschechien | Václav Kutiš",
      desc: "Klempner und Spengler für deutsche Baustellen – Einzelmonteure oder Teams aus Tschechien.",
      h1: "Klempner und Spengler für deutsche Baustellen",
      intro:
        "Wir finden Klempner und Spengler mit Baustellenerfahrung für Dach und Fassade – als Einzelkraft oder als Team.",
      body: "Gemeinsam klären wir Einsatzort, Zeitraum, Deutschkenntnisse und Ausstattung, bevor wir Ihnen passende Kandidaten vorstellen.",
    },
  },
  {
    id: "tesari",
    cs: {
      name: "Tesaři",
      slug: "tesari",
      title: "Práce pro tesaře v Německu | Václav Kutiš",
      desc: "Práce a zakázky v Německu pro tesaře a tesařské týmy.",
      h1: "Tesaři – práce a zakázky v Německu",
      intro:
        "Propojujeme tesaře a tesařské skupiny s německými projekty – od krovů po dřevěné konstrukce.",
      body: "Hodí se zkušenost z německých nebo mezinárodních staveb, vlastní nářadí podle profese a jasná dostupnost.",
    },
    de: {
      name: "Zimmerer",
      slug: "zimmerer",
      title: "Zimmerer aus Tschechien für Deutschland | Václav Kutiš",
      desc: "Zimmerer und Zimmermannsteams aus Tschechien für deutsche Bauprojekte.",
      h1: "Zimmerer für Ihre Bauprojekte",
      intro:
        "Wir vermitteln Zimmerer und Teams für Holzbau, Dachstühle und konstruktive Arbeiten auf deutschen Baustellen.",
      body: "Sie erhalten transparente Informationen zu Qualifikation, Verfügbarkeit und Organisation – ohne leere Versprechen.",
    },
  },
  {
    id: "instalateri",
    cs: {
      name: "Instalatéři a topenáři",
      slug: "instalateri",
      title: "Práce pro instalatéry a topenáře v Německu | Václav Kutiš",
      desc: "Zakázky v Německu pro instalatéry, topenáře a montážní týmy TZB.",
      h1: "Instalatéři a topenáři – práce v Německu",
      intro:
        "Hledáme instalatéry a topenáře pro montáže a servisní zakázky u německých firem.",
      body: "Důležitá je praxe, případné certifikace dle nabídky a schopnost pracovat podle německých standardů na stavbě.",
    },
    de: {
      name: "Installateure / Heizungsbauer",
      slug: "installateure",
      title: "Installateure aus Tschechien | Václav Kutiš",
      desc: "Installateure und Heizungsbauer aus Tschechien für Projekte in Deutschland.",
      h1: "Installateure und Heizungsbauer",
      intro:
        "Wir stellen Installateure und Heizungsbauer für Montage- und Bauprojekte in Deutschland bereit – einzeln oder im Team.",
      body: "Anforderungen, Starttermin und Einsatzdauer klären wir vorab, damit die Kapazität zu Ihrem Projekt passt.",
    },
  },
  {
    id: "elektrikari",
    cs: {
      name: "Elektrikáři",
      slug: "elektrikari",
      title: "Práce pro elektrikáře v Německu | Václav Kutiš",
      desc: "Práce a zakázky v Německu pro elektrikáře a elektro montážní týmy.",
      h1: "Elektrikáři – práce a zakázky v Německu",
      intro:
        "Propojujeme elektrikáře a elektro týmy s projekty v Německu – montáž, instalace, průmysl i stavebnictví.",
      body: "Konkrétní požadavky na oprávnění a praxi se řídí nabídkou. Registrací získáte přístup k relevantním příležitostem, nikoli automatickou zakázku.",
    },
    de: {
      name: "Elektriker",
      slug: "elektriker",
      title: "Elektriker Subunternehmer aus Tschechien | Václav Kutiš",
      desc: "Elektriker und Elektroteams aus Tschechien für deutsche Baustellen und Industrieprojekte.",
      h1: "Elektriker und Elektroteams",
      intro:
        "Wir vermitteln Elektriker für Bau, Montage und Industrie – als Fachkraft oder als Nachunternehmer-Team.",
      body: "Wir prüfen Verfügbarkeit und Passung und stellen Ihnen geeignete Profile vor. Details zu Qualifikationen klären wir projektspezifisch.",
    },
  },
  {
    id: "izolateri",
    cs: {
      name: "Izolatéři",
      slug: "izolateri",
      title: "Práce pro izolatéry v Německu | Václav Kutiš",
      desc: "Zakázky v Německu pro izolatéry a izolační týmy.",
      h1: "Izolatéři – práce v Německu",
      intro:
        "Hledáme izolatéry pro tepelné a stavební izolace na německých projektech.",
      body: "Vhodné pro jednotlivce i skupiny se zkušeností z reálných staveb.",
    },
    de: {
      name: "Dämmer / Isolierer",
      slug: "daemmer",
      title: "Dämmer und Isolierer aus Tschechien | Václav Kutiš",
      desc: "Dämmer und Isolierer für Wärmedämmung und Bauisolierung in Deutschland.",
      h1: "Dämmer und Isolierer",
      intro:
        "Kapazitäten für Dämm- und Isolierarbeiten – Einzelmonteure oder Teams aus Tschechien.",
      body: "Wir stimmen Einsatz, Dauer und Anforderungen mit Ihnen ab und suchen passende Kräfte.",
    },
  },
  {
    id: "svarci",
    cs: {
      name: "Svářeči",
      slug: "svarci",
      title: "Práce pro svářeče v Německu | Václav Kutiš",
      desc: "Práce a zakázky v Německu pro svářeče a svařovací týmy.",
      h1: "Svářeči – práce a zakázky v Německu",
      intro:
        "Propojujeme svářeče s průmyslovými a stavebními zakázkami v Německu.",
      body: "Uveďte metody svařování, praxi a dostupnost – podle toho hledáme vhodné projekty.",
    },
    de: {
      name: "Schweißer",
      slug: "schweisser",
      title: "Schweißer aus Tschechien | Václav Kutiš",
      desc: "Schweißer für Industrie- und Bauprojekte in Deutschland.",
      h1: "Schweißer für Ihre Projekte",
      intro:
        "Wir finden Schweißer mit passender Erfahrung für Industrie und Bau in Deutschland.",
      body: "Verfahren, Zertifikate und Verfügbarkeit klären wir anhand Ihrer Projektanforderungen.",
    },
  },
  {
    id: "zamecnici",
    cs: {
      name: "Zámečníci",
      slug: "zamecnici",
      title: "Práce pro zámečníky v Německu | Václav Kutiš",
      desc: "Zakázky v Německu pro zámečníky a kovovýrobní týmy.",
      h1: "Zámečníci – práce v Německu",
      intro:
        "Hledáme zámečníky pro montáže a kovovýrobu u německých partnerů.",
      body: "Forma spolupráce závisí na nabídce – od jednotlivců po menší týmy.",
    },
    de: {
      name: "Schlosser / Metallbauer",
      slug: "schlosser",
      title: "Schlosser und Metallbauer aus Tschechien | Václav Kutiš",
      desc: "Schlosser und Metallbauer für Montage und Fertigung in Deutschland.",
      h1: "Schlosser und Metallbauer",
      intro:
        "Fachkräfte und Teams für Schlosserei- und Metallbauarbeiten auf deutschen Projekten.",
      body: "Wir klären Anforderungsprofil und Kapazität und schlagen passende Partner vor.",
    },
  },
  {
    id: "lesenari",
    cs: {
      name: "Lešenáři",
      slug: "lesenari",
      title: "Práce pro lešenáře v Německu | Václav Kutiš",
      desc: "Práce v Německu pro lešenáře a lešenářské týmy.",
      h1: "Lešenáři – práce v Německu",
      intro:
        "Propojujeme lešenáře a lešenářské skupiny s projekty v Německu.",
      body: "Důraz na bezpečnost, praxi a spolehlivost při montáži a demontáži.",
    },
    de: {
      name: "Gerüstbauer",
      slug: "geruestbauer",
      title: "Gerüstbauer aus Tschechien | Václav Kutiš",
      desc: "Gerüstbauer und Gerüstbauteams für deutsche Baustellen.",
      h1: "Gerüstbauer für Ihre Baustellen",
      intro:
        "Wir vermitteln Gerüstbauer und Teams für Auf- und Abbau auf deutschen Baustellen.",
      body: "Verfügbarkeit und Teamgröße stimmen wir auf Ihren Zeitplan ab.",
    },
  },
  {
    id: "zednici",
    cs: {
      name: "Zedníci",
      slug: "zednici",
      title: "Práce pro zedníky v Německu | Václav Kutiš",
      desc: "Zakázky v Německu pro zedníky a zednické týmy.",
      h1: "Zedníci – práce a zakázky v Německu",
      intro:
        "Hledáme zedníky s praxí pro stavební projekty v Německu.",
      body: "Jednotlivci, dvojice i celé skupiny – podle aktuální poptávky zákazníků.",
    },
    de: {
      name: "Maurer",
      slug: "maurer",
      title: "Maurer aus Tschechien | Václav Kutiš",
      desc: "Maurer und Maurerteams aus Tschechien für deutsche Bauprojekte.",
      h1: "Maurer und Maurerteams",
      intro:
        "Zuverlässige Maurer für Rohbau und Sanierung – einzeln oder als Team.",
      body: "Wir prüfen Passung zu Ort, Termin und Projektumfang.",
    },
  },
  {
    id: "sadrokartonari",
    cs: {
      name: "Sádrokartonáři",
      slug: "sadrokartonari",
      title: "Práce pro sádrokartonáře v Německu | Václav Kutiš",
      desc: "Práce v Německu pro sádrokartonáře a suchou výstavbu.",
      h1: "Sádrokartonáři – práce v Německu",
      intro:
        "Propojujeme sádrokartonáře se zakázkami suché výstavby v Německu.",
      body: "Vhodné pro OSVČ i menší montážní týmy s vlastní dostupností.",
    },
    de: {
      name: "Trockenbauer",
      slug: "trockenbauer",
      title: "Trockenbauer aus Tschechien | Václav Kutiš",
      desc: "Trockenbauer und Ausbauteams für Projekte in Deutschland.",
      h1: "Trockenbauer für Ausbau und Montage",
      intro:
        "Fachkräfte und Teams für Trockenbau auf deutschen Baustellen.",
      body: "Kapazität, Start und Dauer klären wir vor der Vorstellung.",
    },
  },
  {
    id: "maliri",
    cs: {
      name: "Malíři",
      slug: "maliri",
      title: "Práce pro malíře v Německu | Václav Kutiš",
      desc: "Zakázky v Německu pro malíře a malířské týmy.",
      h1: "Malíři – práce a zakázky v Německu",
      intro:
        "Hledáme malíře pro interiérové a stavební zakázky v Německu.",
      body: "Registrace je první krok – konkrétní nabídku posíláme při shodě s projektem.",
    },
    de: {
      name: "Maler",
      slug: "maler",
      title: "Maler aus Tschechien | Václav Kutiš",
      desc: "Maler und Malerteams für deutsche Bauprojekte.",
      h1: "Maler für Ihre Projekte",
      intro:
        "Maler und Teams für Innen- und Bauanstricharbeiten in Deutschland.",
      body: "Wir vermitteln passende Kapazitäten nach Ihren Vorgaben zu Termin und Ort.",
    },
  },
  {
    id: "monteri",
    cs: {
      name: "Montéři",
      slug: "monteri",
      title: "Práce pro montéry v Německu | Václav Kutiš",
      desc: "Práce a zakázky v Německu pro montéry a montážní týmy.",
      h1: "Montéři – práce v Německu",
      intro:
        "Propojujeme montéry různých specializací s německými firmami a projekty.",
      body: "Uveďte specializaci, praxi, jazyk a vybavení – podle toho hledáme shodu.",
    },
    de: {
      name: "Monteure",
      slug: "monteure",
      title: "Monteure aus Tschechien | Václav Kutiš",
      desc: "Monteure und Montageteams aus Tschechien für deutsche Projekte.",
      h1: "Monteure und Montageteams",
      intro:
        "Wir finden Monteure für Bau, Technik und Industrie – Einzelkräfte oder Teams.",
      body: "Spezialisierung und Verfügbarkeit stimmen wir auf Ihr Projekt ab.",
    },
  },
  {
    id: "pomocni",
    cs: {
      name: "Pomocní pracovníci",
      slug: "pomocni-pracovnici",
      title: "Práce pro pomocné pracovníky v Německu | Václav Kutiš",
      desc: "Příležitosti v Německu pro pomocné stavební a montážní pracovníky.",
      h1: "Pomocní pracovníci – práce v Německu",
      intro:
        "Občas hledáme i spolehlivé pomocné pracovníky na stavby a montáže v Německu.",
      body: "Prioritou jsou zkušenosti ze staveb, dochvilnost a ochota pracovat v týmu.",
    },
    de: {
      name: "Hilfskräfte",
      slug: "hilfskraefte",
      title: "Hilfskräfte Bau aus Tschechien | Václav Kutiš",
      desc: "Zuverlässige Hilfskräfte für Bau und Montage in Deutschland.",
      h1: "Hilfskräfte für Bau und Montage",
      intro:
        "Bei Bedarf vermitteln wir auch Hilfskräfte für Baustellen und Montageeinsätze.",
      body: "Einsatzort, Dauer und Anforderungen klären wir transparent im Vorfeld.",
    },
  },
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

/** Odstraní .html z odkazů / canonical / og:url (Vercel cleanUrls). */
function cleanUrlsInHtml(content) {
  return String(content).replace(
    /\b(href|content)=(["'])([^"']*?)\.html([?#][^"']*)?\2/gi,
    (_, attr, quote, pathPart, suffix) =>
      `${attr}=${quote}${pathPart}${suffix || ""}${quote}`
  );
}

function write(file, content) {
  ensureDir(path.dirname(file));
  const out =
    file.endsWith(".html") || file.endsWith(".xml")
      ? cleanUrlsInHtml(content)
      : content;
  fs.writeFileSync(file, out, "utf8");
}

function asset(rel) {
  // from /cs/ or /de/ pages → ../
  // from /cs/profese/ → ../../
  return rel;
}

function head({
  lang,
  title,
  description,
  path: pagePath,
  altPath,
  ogType = "website",
}) {
  const url = `${SITE}${pagePath}`;
  const altUrl = `${SITE}${altPath}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="${lang}" href="${url}">
  <link rel="alternate" hreflang="${lang === "cs" ? "de" : "cs"}" href="${altUrl}">
  <link rel="alternate" hreflang="x-default" href="${SITE}/de/">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Václav Kutiš">
  <meta property="og:locale" content="${lang === "cs" ? "cs_CZ" : "de_DE"}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#090909">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
</head>`;
}

/** Absolutní cesta stránky pro Vercel cleanUrls + trailingSlash. */
function abs(lang, slug = "", query = "") {
  const base = slug ? `/${lang}/${slug}/` : `/${lang}/`;
  return query ? `${base}?${query}` : base;
}

function header(lang, pageId, depth = 1) {
  const links =
    lang === "cs"
      ? [
          ["o-nas", "O mně", "about"],
          ["pro-pracovniky", "Pro pracovníky", "workers"],
          ["pro-firmy", "Pro firmy", "companies"],
          ["profese", "Profese", "professions"],
          ["jak-spoluprace-funguje", "Jak to funguje", "process"],
          ["kontakt", "Kontakt", "contact"],
        ]
      : [
          ["ueber-uns", "Über mich", "about"],
          ["fuer-unternehmen", "Für Unternehmen", "companies"],
          ["berufe", "Berufe", "professions"],
          ["so-funktioniert-es", "Ablauf", "process"],
          ["kontakt", "Kontakt", "contact"],
        ];

  const cta =
    lang === "cs"
      ? { href: abs("cs", "kontakt", "form=worker"), label: "Registrovat se" }
      : { href: abs("de", "kontakt", "form=company"), label: "Personal anfragen" };

  const langPairs = {
    home: ["", ""],
    companies: ["pro-firmy", "fuer-unternehmen"],
    workers: ["pro-pracovniky", "fuer-fachkraefte"],
    subcontractors: ["pro-subdodavatele", "fuer-nachunternehmer"],
    professions: ["profese", "berufe"],
    process: ["jak-spoluprace-funguje", "so-funktioniert-es"],
    about: ["o-nas", "ueber-uns"],
    references: ["reference", "referenzen"],
    faq: ["faq", "faq"],
    contact: ["kontakt", "kontakt"],
    privacy: ["ochrana-osobnich-udaju", "datenschutz"],
    cookies: ["cookies", "cookies"],
    legal: ["pravni-upozorneni", "impressum"],
  };

  let csHref = abs("cs");
  let deHref = abs("de");
  const pair = langPairs[pageId];
  if (pair) {
    csHref = abs("cs", pair[0]);
    deHref = abs("de", pair[1]);
  } else {
    const prof = PROFESSIONS.find((x) => x.id === pageId);
    if (prof) {
      csHref = abs("cs", `profese/${prof.cs.slug}`);
      deHref = abs("de", `berufe/${prof.de.slug}`);
    }
  }

  const navLinks = links
    .map(
      ([slug, label, id]) =>
        `<a href="${abs(lang, slug)}"${id === pageId ? ' aria-current="page"' : ""}>${label}</a>`
    )
    .join("\n          ");

  return `
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="logo" href="${abs(lang)}">
        <span class="logo__brand">Václav <span>Kutiš</span></span>
        <span class="logo__sub">Kutis Personal · DACH</span>
      </a>
      <nav class="nav" aria-label="Main">
          ${navLinks}
      </nav>
      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="${lang === "cs" ? "Jazyk" : "Sprache"}">
          <a href="${csHref}" class="${lang === "cs" ? "is-active" : ""}" hreflang="cs">CZ</a>
          <a href="${deHref}" class="${lang === "de" ? "is-active" : ""}" hreflang="de">DE</a>
        </div>
        <a class="btn btn--primary btn--sm header-cta" href="${cta.href}">${cta.label}</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-label="${lang === "cs" ? "Otevřít menu" : "Menü öffnen"}">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <nav class="nav--mobile" aria-label="Mobile">
      ${navLinks}
      <a class="btn btn--primary" href="${cta.href}">${cta.label}</a>
  </nav>`;
}

function footer(lang, depth = 1) {
  if (lang === "cs") {
    return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="logo__brand">Václav <span>Kutiš</span></div>
          <p>Propojuji české řemeslníky, montéry a firmy s projekty v Německu a regionu DACH.</p>
          <p class="mt-2"><a data-email href="mailto:">e-mail</a><br><span data-phone></span></p>
        </div>
        <div>
          <h3>Spolupráce</h3>
          <ul>
            <li><a href="${abs("cs", "pro-pracovniky")}">Pro pracovníky</a></li>
            <li><a href="${abs("cs", "pro-firmy")}">Pro firmy</a></li>
            <li><a href="${abs("cs", "pro-subdodavatele")}">Pro týmy</a></li>
            <li><a href="${abs("cs", "profese")}">Profese</a></li>
            <li><a href="${abs("cs", "kontakt")}">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <h3>O mně</h3>
          <ul>
            <li><a href="${abs("cs", "o-nas")}">Kdo jsem</a></li>
            <li><a href="${abs("cs", "jak-spoluprace-funguje")}">Jak to funguje</a></li>
            <li><a href="${abs("cs", "reference")}">Track record</a></li>
            <li><a href="${abs("cs", "faq")}">FAQ</a></li>
            <li><a href="${abs("cs", "kontakt")}">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <h3>Právní</h3>
          <ul>
            <li><a href="${abs("cs", "ochrana-osobnich-udaju")}">Ochrana osobních údajů</a></li>
            <li><a href="${abs("cs", "cookies")}">Cookies</a></li>
            <li><a href="${abs("cs", "pravni-upozorneni")}">Právní upozornění</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span data-year></span> Václav Kutiš · Kutis Personal</p>
        <div class="footer-legal">
          <a href="${abs("cs", "ochrana-osobnich-udaju")}">GDPR</a>
          <a href="${abs("de", "impressum")}">Impressum (DE)</a>
        </div>
      </div>
    </div>
  </footer>`;
  }

  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="logo__brand">Václav <span>Kutiš</span></div>
          <p>Ich verbinde deutsche Unternehmen mit Handwerkern, Monteuren und Teams aus Tschechien.</p>
          <p class="mt-2"><a data-email href="mailto:">E-Mail</a><br><span data-phone></span></p>
        </div>
        <div>
          <h3>Zusammenarbeit</h3>
          <ul>
            <li><a href="${abs("de", "fuer-unternehmen")}">Für Unternehmen</a></li>
            <li><a href="${abs("de", "fuer-nachunternehmer")}">Teams &amp; Nachunternehmer</a></li>
            <li><a href="${abs("de", "berufe")}">Berufe</a></li>
            <li><a href="${abs("de", "kontakt")}">Kontakt</a></li>
            <li><a href="${abs("de", "fuer-fachkraefte")}">Für Fachkräfte</a></li>
          </ul>
        </div>
        <div>
          <h3>Über mich</h3>
          <ul>
            <li><a href="${abs("de", "ueber-uns")}">Wer ich bin</a></li>
            <li><a href="${abs("de", "so-funktioniert-es")}">Ablauf</a></li>
            <li><a href="${abs("de", "referenzen")}">Track record</a></li>
            <li><a href="${abs("de", "faq")}">FAQ</a></li>
            <li><a href="${abs("de", "kontakt")}">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <h3>Rechtliches</h3>
          <ul>
            <li><a href="${abs("de", "impressum")}">Impressum</a></li>
            <li><a href="${abs("de", "datenschutz")}">Datenschutz</a></li>
            <li><a href="${abs("de", "cookies")}">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span data-year></span> Václav Kutiš · Kutis Personal</p>
        <div class="footer-legal">
          <a href="${abs("de", "datenschutz")}">Datenschutz</a>
          <a href="${abs("de", "impressum")}">Impressum</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function mobileBar(lang, depth = 1) {
  if (lang === "cs") {
    return `
  <div class="mobile-bar" aria-label="Rychlý kontakt">
    <a data-tel-link href="tel:"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.35 1.92.66 2.84a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.24-1.24a2 2 0 0 1 2.11-.45c.92.31 1.87.53 2.84.66A2 2 0 0 1 22 16.92z"/></svg>Zavolat</a>
    <a data-whatsapp href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.5-1-1-.9-1.7-1.2-2-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.2-.3.1-.4 0-.1-.6-1.4-.8-1.9-.3-.5-.7-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5 2.3 1 2.3.7 2.7.7.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.2-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>WhatsApp</a>
    <a href="${abs("cs", "kontakt")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4zM4 8l8 5 8-5"/></svg>Poptávka</a>
  </div>`;
  }
  return `
  <div class="mobile-bar" aria-label="Schnellkontakt">
    <a data-tel-link href="tel:"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.35 1.92.66 2.84a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.24-1.24a2 2 0 0 1 22 16.92z"/></svg>Anrufen</a>
    <a data-whatsapp href="#"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.5-1-1-.9-1.7-1.2-2-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.2-.3.1-.4 0-.1-.6-1.4-.8-1.9-.3-.5-.7-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5 2.3 1 2.3.7 2.7.7.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.2-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>WhatsApp</a>
    <a href="${abs("de", "kontakt", "form=company")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4zM4 8l8 5 8-5"/></svg>Anfragen</a>
  </div>`;
}

function scripts(depth = 1) {
  return `
  <script src="/js/config.js"></script>
  <script src="/js/site.js"></script>`;
}

function pageShell({
  lang,
  pageId,
  title,
  description,
  path: pagePath,
  altPath,
  depth = 1,
  bodyClass = "has-mobile-bar",
  content,
  jsonLd,
}) {
  return `${head({ lang, title, description, path: pagePath, altPath })}
<body class="${bodyClass}" data-lang="${lang}" data-page="${pageId}" data-base="/${lang}">
${header(lang, pageId, depth)}
<main>
${content}
</main>
${footer(lang, depth)}
${mobileBar(lang, depth)}
${jsonLd || ""}
${scripts(depth)}
</body>
</html>
`;
}

const HERO_IMG = "/assets/images/hero.jpg?v=4";
const ABOUT_IMG = "/assets/images/about.jpg";
const SITE_WORK_IMG = "/assets/images/site-work.jpg";

function imgPath(file, depth = 1) {
  return `/assets/images/${file}`;
}

/* ===================== PAGE CONTENTS ===================== */

function csHome() {
  const profCards = PROFESSIONS.slice(0, 8)
    .map(
      (pr) => `
            <a class="prof-card reveal" href="profese/${pr.cs.slug}.html">
              <span class="prof-card__name">${pr.cs.name}</span>
              <span class="prof-card__link">Detail →</span>
            </a>`
    )
    .join("");

  return pageShell({
    lang: "cs",
    pageId: "home",
    title: "Václav Kutiš | Propojení řemeslníků s projekty v Německu",
    description:
      "Václav Kutiš – Kutis Personal. 8 let v DACH, 400+ nasazených pracovníků. Propojuji české řemeslníky a týmy s německými stavebními projekty.",
    path: "/cs/",
    altPath: "/de/",
    content: `
    <section class="hero">
      <div class="hero__media" aria-hidden="true">
        <img src="${HERO_IMG}" alt="" width="2400" height="1600" fetchpriority="high">
        <div class="hero__overlay"></div>
      </div>
      <div class="container hero__content">
        <p class="hero__brand">Václav <span>Kutiš</span></p>
        <h1 class="hero__title">Práce a zakázky mezi Českem a Německem</h1>
        <p class="hero__text">Zprostředkování personálu v DACH. Osobně, napřímo – od první domluvy až po řešení věcí, které kolem nástupu bývají.</p>
        <div class="btn-group">
          <a class="btn btn--primary" href="kontakt.html?form=worker">Chci se registrovat</a>
          <a class="btn btn--outline" href="o-nas.html">Kdo jsem</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="intro-bar reveal">
          <p class="intro-bar__text">Osm let v regionu DACH. Znám trh, firmy i praxi na místě – včetně ubytování a krizových situací.</p>
          <div class="stats-inline">
            <div class="stats-inline__item"><strong>8 let</strong><span>Zkušenost DACH</span></div>
            <div class="stats-inline__item"><strong>400+</strong><span>Nasazených lidí</span></div>
            <div class="stats-inline__item"><strong>DE · AT · CH</strong><span>Působnost</span></div>
            <div class="stats-inline__item"><strong>1:1</strong><span>Přímý kontakt</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section__head">
          <p class="label">Co dělám</p>
          <h2>Primárně personál. Otevřený i jiným výzvám.</h2>
          <p class="lead">Jsem obchodník. Hlavní činnost je zprostředkování práce a zakázek – ale když přijdete s nápadem, rád sedneme a uvidíme, co z toho bude.</p>
        </div>
        <div class="work-rows">
          <article class="work-row reveal"><span class="work-row__num">01</span><h3>Zprostředkování práce</h3><p>Jednotlivci, OSVČ i týmy na stavební, řemeslné a montážní projekty v Německu.</p></article>
          <article class="work-row reveal"><span class="work-row__num">02</span><h3>Orientace na trhu</h3><p>Znám konkurenční firmy a vím, kam dává smysl lidi doporučit – a kam ne.</p></article>
          <article class="work-row reveal"><span class="work-row__num">03</span><h3>Ubytování a organizace</h3><p>Pomůžu s bydlením, dopravou, termíny a komunikací kolem nástupu.</p></article>
          <article class="work-row reveal"><span class="work-row__num">04</span><h3>Krize i individuální nabídky</h3><p>Vím, jak postupovat, když se něco pokazí. A jsem otevřený i jiným obchodům – včetně věcí kolem programování.</p></article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head">
          <p class="label">Kam dál</p>
          <h2>Vyberte cestu</h2>
        </div>
        <div class="path-links">
          <a class="path-link reveal" href="pro-pracovniky.html">
            <span class="path-link__tag">Pracovníci</span>
            <div><h3>Hledám práci nebo zakázku</h3><p>Registrace pro řemeslníky, montéry, OSVČ i týmy.</p></div>
            <span class="path-link__arrow" aria-hidden="true">→</span>
          </a>
          <a class="path-link reveal" href="../de/">
            <span class="path-link__tag">Firmen</span>
            <div><h3>Hledám kapacity na projekt</h3><p>Německá verze webu pro firemní poptávky.</p></div>
            <span class="path-link__arrow" aria-hidden="true">→</span>
          </a>
          <a class="path-link reveal" href="kontakt.html">
            <span class="path-link__tag">Individuálně</span>
            <div><h3>Mám jiný nápad na spolupráci</h3><p>Napište mi – dáme hlavy dohromady.</p></div>
            <span class="path-link__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        <div class="section__head">
          <p class="label">Postup</p>
          <h2>Od registrace k nástupu</h2>
          <p class="lead">Jednoduchý proces, konkrétní informace, žádné prázdné sliby.</p>
        </div>
        <ol class="steps">
          <li class="step reveal"><h3>Registrace</h3><p>Vyplníte profil: profese, praxe, jazyk, vybavení, dostupnost.</p></li>
          <li class="step reveal"><h3>Posouzení</h3><p>Porovnám váš profil s aktuálními a nadcházejícími poptávkami.</p></li>
          <li class="step reveal"><h3>Nabídka projektu</h3><p>Při shodě dostanete lokalitu, termín a požadavky – srozumitelně.</p></li>
          <li class="step reveal"><h3>Dohoda stran</h3><p>Obchodní a organizační podmínky potvrzujete přímo s druhou stranou.</p></li>
          <li class="step reveal"><h3>Nástup</h3><p>Zahájíte práci. U prvotní koordinace jsem k dispozici.</p></li>
          <li class="step reveal"><h3>Další zakázky</h3><p>Při spolehlivé spolupráci vás oslovím i na další projekty.</p></li>
        </ol>
        <div class="mt-3"><a class="btn btn--outline" href="jak-spoluprace-funguje.html">Detail procesu</a></div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <p class="label">O mně</p>
          <h2>Obchodník, který zná DACH z praxe</h2>
          <p class="lead mt-2">Jmenuji se Václav Kutiš. Primárně zprostředkovávám práci a zakázky mezi Českem a Německem. Mám rád výzvy – a jsem otevřený i individuálním nabídkám mimo standardní personál.</p>
          <p class="mt-2">Částečně se věnuji i programování. Když přijdete s nápadem, rád dám hlavy dohromady a uvidíme, jestli z toho vznikne další spolupráce nebo obchod. Za značkou Kutis Personal stojím osobně – KV Haustechnik &amp; Service s.r.o.</p>
          <a class="btn btn--outline-dark mt-3" href="o-nas.html">Více o mně</a>
        </div>
        <div class="split__media">
          <img src="${ABOUT_IMG}" alt="Práce na stavbě" width="1200" height="900" loading="lazy">
        </div>
      </div>
    </section>

    <section class="section section--alt" id="profese">
      <div class="container">
        <div class="section__head">
          <p class="label">Profese</p>
          <h2>Nejčastěji poptávané obory</h2>
          <p class="lead">Stavebnictví, řemesla a montáže. Konkrétní poptávka se mění podle projektů německých zákazníků.</p>
        </div>
        <div class="prof-grid">${profCards}</div>
        <div class="mt-3">
          <a class="btn btn--outline-dark" href="profese/">Všechny profese</a>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2>Napište mi – uvidíme, co spolu vymyslíme</h2>
        <p class="lead">Hledáte práci v Německu, kapacity na projekt, nebo máte jiný nápad na spolupráci? Ozvěte se. Primárně řeším personál v DACH – ale jsem otevřený i individuálním nabídkám.</p>
        <a class="btn btn--primary" href="kontakt.html">Kontaktovat</a>
      </div>
    </section>`,
  });
}

// Continue in next part of the script - the file is getting large
// I'll write the rest of the build script

module.exports = {
  PROFESSIONS,
  pageShell,
  write,
  ROOT,
  SITE,
  abs,
  HERO_IMG,
  ABOUT_IMG,
  SITE_WORK_IMG,
  imgPath,
  csHome,
};
