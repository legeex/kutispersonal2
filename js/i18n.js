/**
 * Václav Kutiš – internacionalizace (CS / DE)
 */
const I18n = (function () {
  "use strict";

  const STORAGE_KEY = "vk-lang";
  const CZECH_REGIONS = new Set(["CZ", "SK"]);

  const locales = {
    cs: {
      meta: {
        title: "Václav Kutiš | Práce a spolupráce v regionu DACH",
        description:
          "Václav Kutiš – propojení řemeslníků, firem a obchodních partnerů v regionu DACH. Práce, kapacity i B2B spolupráce v Německu, Rakousku a Švýcarsku.",
      },
      nav: {
        openMenu: "Otevřít menu",
        closeMenu: "Zavřít menu",
        forCandidates: "Pro uchazeče",
        forCompanies: "Pro firmy",
        howItWorks: "Jak to funguje",
        contact: "Kontakt",
      },
      logo: { tagline: "DACH · Propojení" },
      hero: {
        badge: "",
        claim: "Pomáhám lidem a firmám navázat přímou spolupráci v regionu DACH.",
        title: "Práce a obchodní příležitosti v Německu, Rakousku a Švýcarsku",
        subtitle:
          "Propojuji řemeslníky, technické pracovníky, OSVČ i odborné týmy s firmami v regionu DACH. Pomáhám firmám najít vhodné lidi a kapacity pro projekty i vhodné firmy pro obchodní nebo subdodavatelskou spolupráci.",
        ctaCandidate: "Hledám práci / zakázku",
        ctaCompany: "Hledám kapacity / partnery",
        regionDE: "🇩🇪 Německo",
        regionAT: "🇦🇹 Rakousko",
        regionCH: "🇨🇭 Švýcarsko",
      },
      trust: {
        t1: "Přímá spolupráce mezi kandidátem a firmou",
        t2: "Propojení firem pro obchodní spolupráci v DACH",
        t3: "Podpora při navázání spolupráce",
        t4: "Transparentní propojení obou stran",
        t5: "Region DACH – DE, AT, CH",
      },
      candidates: {
        label: "Pro uchazeče",
        title: "Vhodná pracovní nebo obchodní příležitost",
        text: "Pomáhám jednotlivcům, řemeslníkům, montérům, OSVČ i menším týmům najít vhodné pracovní nebo obchodní příležitosti u firem v Německu, Rakousku a Švýcarsku. Spolupráce může být podle konkrétní situace formou zaměstnání, OSVČ, subdodávky nebo jiné přímé dohody s firmou.",
        cta: "Kontaktovat jako uchazeč",
        profAria: "Oblasti a profese",
        prof1: "Stavebnictví",
        prof2: "Pokrývači",
        prof3: "Klempíři",
        prof4: "Instalatéři / topenáři",
        prof5: "Elektrikáři",
        prof6: "Montéři",
        prof7: "Svářeči",
        prof8: "Zámečníci",
        prof9: "Další technické profese",
      },
      companies: {
        label: "Pro firmy",
        title: "Kapacity, partneři i obchodní spolupráce",
        text: "Firmám pomáhám najít vhodné kandidáty, řemeslníky, OSVČ nebo subdodavatelské kapacity pro konkrétní projekty. Pomáhám také firmám najít vhodné firmy v regionu DACH – například pro subdodávku, společný projekt nebo dlouhodobou obchodní spolupráci. Cílem je férové a transparentní propojení obou stran.",
        f1: "Propojuji kandidáty s firmami v regionu DACH",
        f2: "Pomáhám firmám navázat přímou spolupráci s jinými firmami v regionu",
        f3: "Pomáhám s komunikací, prvotním výběrem a propojením",
        f4: "Možnost práce na zaměstnanecký poměr nebo obchodní spolupráce dle konkrétní nabídky",
        f5: "Každá spolupráce probíhá přímo mezi oběma stranami",
        f6: "",
        f7: "",
        cta: "Kontaktovat jako firma",
      },
      service: {
        label: "",
        title: "",
        text: "",
        i1: "",
        i2: "",
        i3: "",
        i4: "",
        i5: "",
        note: "",
      },
      process: {
        label: "Proces",
        title: "Jak to funguje",
        tabCandidate: "Pro uchazeče",
        tabCompany: "Pro firmy",
        c1title: "Kontakt",
        c1text: "Vyplníte krátký kontaktní formulář",
        c2title: "Profil",
        c2text: "Popíšete své zkušenosti, profesi, jazykové znalosti a dostupnost",
        c3title: "Výběr",
        c3text: "Společně vyhodnotíme vhodné možnosti",
        c4title: "Propojení",
        c4text: "Pokud existuje vhodná nabídka, propojím vás přímo s firmou",
        c5title: "Dohoda",
        c5text: "Podmínky spolupráce si vždy potvrzujete přímo s danou firmou",
        co1title: "Poptávka",
        co1text: "Firma popíše, koho nebo jakou spolupráci hledá",
        co2title: "Analýza",
        co2text: "Vyhodnotím požadavky, termín, lokalitu a typ spolupráce",
        co3title: "Výběr",
        co3text: "Najdu vhodné kandidáty, kapacity nebo firmy v regionu DACH",
        co4title: "Propojení",
        co4text: "Propojím obě strany",
        co5title: "Dohoda",
        co5text:
          "Spolupráce probíhá na základě přímé dohody mezi firmami, kandidátem nebo dodavatelem",
      },
      contact: {
        label: "Kontakt",
        title: "Napište mi",
        text: "Vyberte, zda hledáte pracovní nebo obchodní příležitost, nebo zda vaše firma potřebuje vhodné kapacity či partnera v regionu DACH. Ozvu se vám co nejdříve.",
        tabCandidate: "Hledám práci / zakázku",
        tabCompany: "Hledám kapacity / partnery",
        submitCandidate: "Odeslat žádost",
        submitCompany: "Odeslat poptávku",
        successTitle: "Odesláno!",
        successText: "Děkuji, zpráva mi dorazila. Ozvu se vám co nejdříve.",
        errorText:
          "Odeslání se nezdařilo. Zkuste to prosím znovu, nebo mě kontaktujte přímo e-mailem.",
        errorNotConfigured:
          "Formulář není nastaven. Nastavte Google Apps Script (zdarma) – návod v README, URL do js/config.js.",
        emailDirect: "Nebo napište přímo:",
        submitting: "Odesílám…",
      },
      form: {
        cName: "Jméno a příjmení",
        cEmail: "E-mail",
        cPhone: "Telefon",
        cProfession: "Profese",
        cExperience: "Praxe",
        cExperiencePh: "Roky praxe, reference, certifikace…",
        cLanguages: "Jazykové znalosti",
        cLanguagesPh: "např. němčina B2, angličtina A2",
        cCountry: "Preferovaná země",
        cStart: "Od kdy můžete začít",
        cStartPh: "např. ihned, od 1. 6. 2026",
        cCooperation: "Forma spolupráce",
        cNote: "Poznámka",
        fCompany: "Název firmy",
        fContact: "Kontaktní osoba",
        fEmail: "E-mail",
        fPhone: "Telefon",
        fCountry: "Země",
        fProfession: "Hledáte (kapacity / partnera)",
        fProfessionPh: "např. elektrikáře, subdodavatele, stavební firmu…",
        fLocation: "Lokalita projektu",
        fStart: "Termín nástupu",
        fCooperation: "Typ spolupráce",
        fCooperationPh: "zaměstnání, OSVČ, subdodávka, B2B spolupráce…",
        fNote: "Poznámka",
        select: "Vyberte",
        countryDE: "Německo",
        countryAT: "Rakousko",
        countryCH: "Švýcarsko",
        countryAny: "Více zemí / flexibilně",
        coopEmployment: "Zaměstnání",
        coopOsvc: "OSVČ",
        coopSub: "Subdodávka",
        coopUnknown: "Nevím",
      },
      legal: {
        text: "<strong>Právní upozornění:</strong> Václav Kutiš neposkytuje právní, daňové ani personální poradenství. Web slouží k prezentaci služeb v oblasti zprostředkování kontaktů a podpory při navazování pracovních nebo obchodních příležitostí. Konkrétní forma spolupráce musí být vždy nastavena individuálně podle platných právních předpisů dané země.",
      },
      footer: {
        tagline: "Pomáhám lidem a firmám navázat přímou spolupráci v regionu DACH.",
        rights: "Všechna práva vyhrazena.",
      },
      lang: { cs: "Čeština", de: "Deutsch", switch: "Jazyk" },
    },
    de: {
      meta: {
        title: "Václav Kutiš | Fachkräfte & Subunternehmer für die DACH-Region",
        description:
          "Kostenlose Vermittlung für DACH-Unternehmen: Fachkräfte aus Osteuropa, Unterstützung bei Unterlagen, auf Wunsch komplette Firma – reibungsloser Projektstart.",
      },
      nav: {
        openMenu: "Menü öffnen",
        closeMenu: "Menü schließen",
        forCandidates: "Kapazitäten",
        forCompanies: "Für Unternehmen",
        howItWorks: "So funktioniert es",
        contact: "Kontakt",
      },
      logo: { tagline: "DACH · Direktvermittlung" },
      hero: {
        badge: "Kostenloser Vermittlungsservice",
        claim:
          "Kostenlose Kontaktvermittlung für DACH-Unternehmen – direkte Zusammenarbeit mit Fachkräften aus Osteuropa.",
        title: "Fachkräfte, Mitarbeiter und Subunternehmer für Ihre Projekte",
        subtitle:
          "Ich finde passende Fachkräfte aus Osteuropa und Mitteleuropa und koordiniere alle nötigen Schritte – von der Auswahl über Unterlagen bis zum Start auf Ihrer Baustelle. Auf Wunsch auch mit einer kompletten Firma als Partner: Sie bekommen ein eingespieltes Team, das direkt einsteigen kann.",
        ctaCandidate: "Verfügbare Gewerke",
        ctaCompany: "Personal / Kapazitäten anfragen",
        regionDE: "🇩🇪 Deutschland",
        regionAT: "🇦🇹 Österreich",
        regionCH: "🇨🇭 Schweiz",
      },
      trust: {
        t1: "Unterstützung bei allen nötigen Unterlagen für den Start",
        t2: "Fachkräfte aus Osteuropa & Mitteleuropa",
        t3: "Auf Wunsch: komplette Firma als Subunternehmer-Partner",
        t4: "Kostenlose Vermittlung – wenig Aufwand für Sie",
        t5: "Ihre Leute steigen ein – Sie führen das Projekt",
      },
      candidates: {
        label: "Verfügbare Kapazitäten",
        title: "Fachkräfte und Gewerke aus Osteuropa",
        text: "Für Ihre Projekte in der DACH-Region vermittle ich erfahrene Fachkräfte, Handwerker, Monteure, Selbstständige und kleinere Teams aus Osteuropa. Je nach Bedarf als Mitarbeiter, Subunternehmer oder projektbezogene Kapazität – immer in direkter Absprache zwischen Ihrem Unternehmen und der jeweiligen Person oder Firma.",
        cta: "Kapazitäten anfragen",
        profAria: "Verfügbare Gewerke und Berufe",
        prof1: "Bauwesen",
        prof2: "Dachdecker",
        prof3: "Klempner / Spengler",
        prof4: "Installateure / Heizungstechniker",
        prof5: "Elektriker",
        prof6: "Monteure",
        prof7: "Schweißer",
        prof8: "Schlosser",
        prof9: "Weitere technische Berufe",
      },
      companies: {
        label: "Für Unternehmen",
        title: "Ihr Partner für Personal und Subunternehmerschaft",
        text: "Sie brauchen zuverlässige Verstärkung – aber keine Zeit für komplizierte Formalitäten? Ich übernehme die Koordination: passende Leute finden, Unterlagen vorbereiten, Abläufe abstimmen. Wenn Sie möchten, stelle ich auch eine komplette Firma aus Ost- oder Mitteleuropa bereit. Für Sie zählt vor Ort vor allem eins: Ihr Team kann arbeiten.",
        f1: "Fachkräfte und Teams aus Osteuropa & Mitteleuropa",
        f2: "Unterstützung bei allen erforderlichen Unterlagen für den reibungslosen Start",
        f3: "Anstellung, Subunternehmerschaft oder komplette Firma als Partner",
        f4: "Koordination von Auswahl, Verträgen und organisatorischen Schritten",
        f5: "Kostenlose Vermittlung – minimaler Aufwand auf Ihrer Seite",
        f6: "Auf Wunsch: ganze Firma aus dem Ausland – Ihr Subunternehmer mit eigenem Team",
        f7: "Sie führen das Projekt – ich bereite den Einstieg der Fachkräfte vor",
        cta: "Unverbindlich anfragen",
      },
      service: {
        label: "Rundum-Betreuung",
        title: "Wenig Aufwand für Sie – ich koordiniere den gesamten Ablauf",
        text: "Viele Auftraggeber wünschen sich nicht nur gute Leute, sondern eine Lösung ohne bürokratischen Stress. Genau dabei unterstütze ich Sie: von der ersten Anfrage bis zum Tag, an dem Ihre Fachkräfte auf der Baustelle stehen.",
        i1: "Auswahl passender Fachkräfte, Monteure, Handwerker oder ganzer Teams",
        i2: "Unterstützung und Koordination aller nötigen Unterlagen für einen reibungslosen Start",
        i3: "Abstimmung von Anstellung, Entsendung, Subunternehmerschaft oder Projektmodell",
        i4: "Auf Wunsch: Organisation der Zusammenarbeit mit einer kompletten Firma aus Ost- oder Mitteleuropa",
        i5: "Ihr Ziel: eingespielte Leute vor Ort – mein Ziel: Sie entlasten und alles vorbereiten",
        note: "Konkrete Verträge und rechtliche Gestaltung erfolgen stets direkt zwischen Ihrem Unternehmen und dem Kandidaten bzw. Partner – ich koordiniere und vermittle, ersetze aber keine Rechts- oder Steuerberatung.",
      },
      process: {
        label: "Ablauf",
        title: "So funktioniert die Zusammenarbeit",
        tabCandidate: "Kapazitäten",
        tabCompany: "Für Unternehmen",
        c1title: "Überblick",
        c1text: "Sie sehen, welche Gewerke und Berufe ich vermitteln kann",
        c2title: "Profil",
        c2text: "Qualifizierte Fachkräfte aus verschiedenen Ländern Osteuropas",
        c3title: "Matching",
        c3text: "Auswahl passend zu Ihrem Projekt, Termin und Standort",
        c4title: "Kontakt",
        c4text: "Ich stelle den direkten Kontakt zu Kandidat oder Subunternehmer her",
        c5title: "Direktabschluss",
        c5text: "Vertrag und Konditionen vereinbaren Sie direkt mit Ihrem Partner",
        co1title: "Anfrage",
        co1text: "Sie beschreiben, welche Kapazitäten oder Profile Sie benötigen",
        co2title: "Analyse",
        co2text: "Ich kläre Anforderungen, Termin, Standort und Art der Zusammenarbeit",
        co3title: "Auswahl",
        co3text: "Ich schlage passende Kandidaten, Teams oder – bei Bedarf – eine komplette Firma vor",
        co4title: "Unterlagen",
        co4text: "Ich koordiniere die nötigen Schritte und Unterlagen für einen reibungslosen Start",
        co5title: "Projektstart",
        co5text:
          "Ihre Fachkräfte steigen ein – Sie konzentrieren sich auf Ihr Projekt, die Vermittlung bleibt kostenlos",
      },
      contact: {
        label: "Kontakt",
        title: "Projekt besprechen",
        text: "Schreiben Sie mir, welche Leute oder Kapazitäten Sie brauchen – einzelne Fachkräfte, ein Team oder eine komplette Firma als Partner. Ich melde mich zeitnah und kläre mit Ihnen den einfachsten Weg bis zum Start auf der Baustelle. Erstberatung und Vermittlung sind kostenlos.",
        tabCandidate: "Verfügbare Gewerke",
        tabCompany: "Personal / Kapazitäten anfragen",
        submitCandidate: "Anfrage senden",
        submitCompany: "Unverbindlich anfragen",
        successTitle: "Gesendet!",
        successText: "Vielen Dank, Ihre Nachricht ist angekommen. Ich melde mich so schnell wie möglich.",
        errorText:
          "Der Versand ist fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie mir direkt per E-Mail.",
        errorNotConfigured:
          "Formular nicht eingerichtet. Richten Sie Google Apps Script ein (kostenlos) – Anleitung in README.",
        emailDirect: "Oder schreiben Sie direkt:",
        submitting: "Wird gesendet…",
      },
      form: {
        cName: "Vor- und Nachname",
        cEmail: "E-Mail",
        cPhone: "Telefon",
        cProfession: "Beruf",
        cExperience: "Berufserfahrung",
        cExperiencePh: "Jahre Erfahrung, Referenzen, Zertifikate…",
        cLanguages: "Sprachkenntnisse",
        cLanguagesPh: "z. B. Deutsch B2, Englisch A2",
        cCountry: "Bevorzugtes Land",
        cStart: "Verfügbar ab",
        cStartPh: "z. B. sofort, ab 1. 6. 2026",
        cCooperation: "Art der Zusammenarbeit",
        cNote: "Anmerkung",
        fCompany: "Firmenname",
        fContact: "Ansprechpartner",
        fEmail: "E-Mail",
        fPhone: "Telefon",
        fCountry: "Land / Region",
        fProfession: "Gesuchte Kapazitäten",
        fProfessionPh: "z. B. 3 Elektriker, Dachdecker-Team, Baufirma als Subunternehmer…",
        fLocation: "Projektstandort",
        fStart: "Eintrittstermin / Projektstart",
        fCooperation: "Art der Zusammenarbeit",
        fCooperationPh: "Anstellung, Subunternehmerschaft, Projektkapazität…",
        fNote: "Projektbeschreibung / Anmerkung",
        select: "Bitte wählen",
        countryDE: "Deutschland",
        countryAT: "Österreich",
        countryCH: "Schweiz",
        countryAny: "Mehrere Länder / flexibel",
        coopEmployment: "Anstellung",
        coopOsvc: "Selbstständigkeit",
        coopSub: "Subunternehmerschaft",
        coopUnknown: "Noch offen",
      },
      legal: {
        text: "<strong>Rechtlicher Hinweis:</strong> Václav Kutiš bietet keine Rechts-, Steuer- oder Personalberatung an. Unterstützung bei Unterlagen bedeutet Koordination und Vermittlung im Rahmen der vereinbarten Zusammenarbeit – keine Garantie für behördliche oder rechtliche Genehmigungen. Es handelt sich nicht um Arbeitnehmerüberlassung. Verträge schließen Sie direkt mit Kandidat, Team oder Partnerfirma, stets nach den geltenden Vorschriften des jeweiligen Landes.",
      },
      footer: {
        tagline:
          "Fachkräfte aus Osteuropa – Unterlagen koordiniert, auf Wunsch ganze Firma. Kostenlose Vermittlung für die DACH-Region.",
        rights: "Alle Rechte vorbehalten.",
      },
      lang: { cs: "Čeština", de: "Deutsch", switch: "Sprache" },
    },
  };

  let current = "cs";

  function getNested(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  function applyLocale(lang) {
    const dict = locales[lang];
    if (!dict) return;

    current = lang;
    document.documentElement.lang = lang === "de" ? "de" : "cs";

    const title = getNested(dict, "meta.title");
    const desc = getNested(dict, "meta.description");
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) metaDesc.setAttribute("content", desc);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getNested(dict, key);
      if (val != null) el.textContent = val;
      if (el.classList.contains("feature-list__item--de")) {
        el.hidden = !val || String(val).trim() === "";
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = getNested(dict, key);
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = getNested(dict, key);
      if (val != null) el.placeholder = val;
    });

    document.querySelectorAll("[data-i18n-option]").forEach((el) => {
      const key = el.getAttribute("data-i18n-option");
      const val = getNested(dict, key);
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = getNested(dict, key);
      if (val != null) el.setAttribute("aria-label", val);
    });

    const langGroup = document.querySelector(".lang-switch");
    if (langGroup) {
      langGroup.setAttribute("aria-label", getNested(dict, "lang.switch") || "Language");
    }

    document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("lang-switch__btn--active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    applyLayout(lang);

    document.dispatchEvent(
      new CustomEvent("localechange", { detail: { lang } })
    );
  }

  function applyLayout(lang) {
    const isDach = lang === "de";
    document.body.classList.toggle("audience-dach", isDach);
    document.body.classList.toggle("audience-czsk", !isDach);

    const badge = document.querySelector(".hero__badge");
    const badgeText = getNested(locales[lang], "hero.badge");
    if (badge) {
      if (badgeText && String(badgeText).trim()) {
        badge.textContent = badgeText;
        badge.classList.add("is-visible");
        badge.removeAttribute("aria-hidden");
      } else {
        badge.textContent = "";
        badge.classList.remove("is-visible");
        badge.setAttribute("aria-hidden", "true");
      }
    }

    const heroCompany = document.querySelector(
      '.hero__cta [data-form="company"]'
    );
    const heroCandidate = document.querySelector(
      '.hero__cta [data-form="candidate"]'
    );
    if (heroCompany && heroCandidate) {
      if (isDach) {
        heroCompany.classList.add("btn--primary");
        heroCompany.classList.remove("btn--outline");
        heroCandidate.classList.add("btn--outline");
        heroCandidate.classList.remove("btn--primary");
        if (heroCandidate.getAttribute("href") === "#kontakt") {
          heroCandidate.setAttribute("href", "#pro-uchazece");
        }
      } else {
        heroCandidate.classList.add("btn--primary");
        heroCandidate.classList.remove("btn--outline");
        heroCompany.classList.add("btn--outline");
        heroCompany.classList.remove("btn--primary");
        heroCandidate.setAttribute("href", "#kontakt");
      }
    }

    const processTabs = document.querySelectorAll(".process-tab");
    const processPanels = {
      candidate: document.getElementById("process-candidate"),
      company: document.getElementById("process-company"),
    };
    const defaultTab = isDach ? "company" : "candidate";
    processTabs.forEach((tab) => {
      const active = tab.dataset.tab === defaultTab;
      tab.classList.toggle("process-tab--active", active);
    });
    Object.entries(processPanels).forEach(([key, panel]) => {
      if (panel) {
        panel.classList.toggle("process-panel--active", key === defaultTab);
      }
    });

    const formTabs = document.querySelectorAll(".form-tab");
    const forms = {
      candidate: document.getElementById("form-candidate"),
      company: document.getElementById("form-company"),
    };
    const defaultForm = isDach ? "company" : "candidate";
    formTabs.forEach((tab) => {
      tab.classList.toggle("form-tab--active", tab.dataset.form === defaultForm);
    });
    Object.entries(forms).forEach(([key, form]) => {
      if (form) {
        form.classList.toggle("contact-form--active", key === defaultForm);
      }
    });

    const formTabsWrap = document.querySelector(".form-tabs");
    if (formTabsWrap) {
      formTabsWrap.style.display = isDach ? "none" : "";
    }

    const serviceBox = document.getElementById("rundum-service");
    if (serviceBox) {
      const hasService = Boolean(getNested(locales[lang], "service.title"));
      serviceBox.hidden = !hasService;
    }

    const candidateCta = document.querySelector(
      '#pro-uchazece [data-form="candidate"].btn'
    );
    if (candidateCta) {
      candidateCta.dataset.form = isDach ? "company" : "candidate";
    }
  }

  function setLocale(lang, persist = true) {
    if (!locales[lang]) return;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (_) {
        /* ignore */
      }
    }
    applyLocale(lang);
    document.documentElement.classList.remove("lang-loading");
  }

  async function detectCountryCode() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch("https://ipwho.is/", {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("geo failed");
      const data = await res.json();
      if (data.success && data.country_code) {
        return data.country_code.toUpperCase();
      }
    } catch (_) {
      clearTimeout(timeout);
    }
    return null;
  }

  function localeFromCountry(code) {
    if (code && CZECH_REGIONS.has(code)) return "cs";
    return "de";
  }

  function localeFromUrl() {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "cs" || param === "de") return param;
    return null;
  }

  function localeFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "cs" || stored === "de") return stored;
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  async function init() {
    document.documentElement.classList.add("lang-loading");

    const urlLang = localeFromUrl();
    if (urlLang) {
      setLocale(urlLang, true);
      return;
    }

    const stored = localeFromStorage();
    if (stored) {
      setLocale(stored, false);
      return;
    }

    applyLocale("cs");
    const code = await detectCountryCode();
    const detected = localeFromCountry(code);
    setLocale(detected, false);
  }

  return { init, setLocale, getLocale: () => current, locales };
})();
