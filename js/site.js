/**
 * Kutis Personal – shared site logic
 * Navigation, forms, mobile bar, language routing, reveal
 */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const page = document.body.dataset;
  const lang = page.lang || "cs";
  const pageId = page.page || "home";
  const base = page.base || (lang === "de" ? "/de" : "/cs");

  /* ---------- Language map (CZ ↔ DE) ---------- */
  const LANG_MAP = {
    home: { cs: "/cs/", de: "/de/" },
    companies: { cs: "/cs/pro-firmy/", de: "/de/fuer-unternehmen/" },
    workers: { cs: "/cs/pro-pracovniky/", de: "/de/fuer-fachkraefte/" },
    subcontractors: {
      cs: "/cs/pro-subdodavatele/",
      de: "/de/fuer-nachunternehmer/",
    },
    professions: { cs: "/cs/profese/", de: "/de/berufe/" },
    process: {
      cs: "/cs/jak-spoluprace-funguje/",
      de: "/de/so-funktioniert-es/",
    },
    about: { cs: "/cs/o-nas/", de: "/de/ueber-uns/" },
    references: { cs: "/cs/reference/", de: "/de/referenzen/" },
    faq: { cs: "/cs/faq/", de: "/de/faq/" },
    contact: { cs: "/cs/kontakt/", de: "/de/kontakt/" },
    privacy: {
      cs: "/cs/ochrana-osobnich-udaju/",
      de: "/de/datenschutz/",
    },
    cookies: { cs: "/cs/cookies/", de: "/de/cookies/" },
    legal: { cs: "/cs/pravni-upozorneni/", de: "/de/impressum/" },
    pokryvaci: {
      cs: "/cs/profese/pokryvaci/",
      de: "/de/berufe/dachdecker/",
    },
    klempiri: {
      cs: "/cs/profese/klempiri/",
      de: "/de/berufe/klempner/",
    },
    tesari: { cs: "/cs/profese/tesari/", de: "/de/berufe/zimmerer/" },
    instalateri: {
      cs: "/cs/profese/instalateri/",
      de: "/de/berufe/installateure/",
    },
    elektrikari: {
      cs: "/cs/profese/elektrikari/",
      de: "/de/berufe/elektriker/",
    },
    izolateri: {
      cs: "/cs/profese/izolateri/",
      de: "/de/berufe/daemmer/",
    },
    svarci: {
      cs: "/cs/profese/svarci/",
      de: "/de/berufe/schweisser/",
    },
    zamecnici: {
      cs: "/cs/profese/zamecnici/",
      de: "/de/berufe/schlosser/",
    },
    lesenari: {
      cs: "/cs/profese/lesenari/",
      de: "/de/berufe/geruestbauer/",
    },
    zednici: { cs: "/cs/profese/zednici/", de: "/de/berufe/maurer/" },
    sadrokartonari: {
      cs: "/cs/profese/sadrokartonari/",
      de: "/de/berufe/trockenbauer/",
    },
    maliri: { cs: "/cs/profese/maliri/", de: "/de/berufe/maler/" },
    monteri: {
      cs: "/cs/profese/monteri/",
      de: "/de/berufe/monteure/",
    },
    pomocni: {
      cs: "/cs/profese/pomocni-pracovnici/",
      de: "/de/berufe/hilfskraefte/",
    },
  };

  function langHref(targetLang) {
    const entry = LANG_MAP[pageId];
    if (entry && entry[targetLang]) return entry[targetLang];
    return targetLang === "de" ? "/de/" : "/cs/";
  }

  /* ---------- Header scroll + mobile nav ---------- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".nav--mobile");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Contact links from config ---------- */
  const email = (cfg.contactEmail || "").trim();
  const phone =
    lang === "de"
      ? (cfg.phoneDE || cfg.phone || "").trim()
      : (cfg.phoneCS || cfg.phone || "").trim();
  const whatsappRaw =
    lang === "de"
      ? cfg.whatsappDE || cfg.whatsapp || ""
      : cfg.whatsappCS || cfg.whatsapp || "";
  const whatsapp = String(whatsappRaw).replace(/[^\d+]/g, "");

  document.querySelectorAll("[data-email]").forEach((el) => {
    if (!email) {
      el.textContent = "[DOPLNIT E-MAIL]";
      return;
    }
    if (el.tagName === "A") {
      el.href = `mailto:${email}`;
      el.textContent = email;
    } else {
      el.textContent = email;
    }
  });

  document.querySelectorAll("[data-phone]").forEach((el) => {
    if (!phone) {
      el.textContent = "[DOPLNIT TELEFON]";
      return;
    }
    if (el.tagName === "A") {
      el.href = `tel:${phone.replace(/\s/g, "")}`;
      el.textContent = phone;
    } else {
      el.textContent = phone;
    }
  });

  document.querySelectorAll("[data-address]").forEach((el) => {
    el.textContent = cfg.address || "";
  });

  document.querySelectorAll("[data-company]").forEach((el) => {
    el.textContent = cfg.companyName || "";
  });

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    if (!whatsapp) {
      if (el.closest(".mobile-bar")) el.style.display = "none";
      return;
    }
    const num = whatsapp.replace(/^\+/, "");
    el.href = `https://wa.me/${num}`;
  });

  document.querySelectorAll("[data-tel-link]").forEach((el) => {
    if (!phone) {
      el.style.display = "none";
      return;
    }
    el.href = `tel:${phone.replace(/\s/g, "")}`;
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Forms ---------- */
  const i18nForm = {
    cs: {
      submitting: "Odesílám…",
      successTitle: "Registrace odeslána",
      successText:
        "Děkujeme. Ozveme se vám, jakmile budeme mít vhodné informace k dalšímu kroku.",
      successCompanyTitle: "Poptávka odeslána",
      successCompanyText:
        "Děkujeme. Projednáme vaše požadavky a ozveme se osobně.",
      error:
        "Odeslání se nezdařilo. Zkuste to prosím znovu, nebo napište e-mail.",
      errorConfig:
        "Formulář zatím není napojen. Napište prosím přímo na e-mail.",
      privacyRequired: "Potvrďte souhlas se zpracováním osobních údajů.",
    },
    de: {
      submitting: "Wird gesendet…",
      successTitle: "Anfrage gesendet",
      successText:
        "Vielen Dank. Wir prüfen Ihre Angaben und melden uns persönlich.",
      successCompanyTitle: "Anfrage gesendet",
      successCompanyText:
        "Vielen Dank. Wir prüfen die Projektdaten und melden uns bei Ihnen.",
      error:
        "Senden fehlgeschlagen. Bitte erneut versuchen oder per E-Mail kontaktieren.",
      errorConfig:
        "Formular ist noch nicht verbunden. Bitte schreiben Sie uns per E-Mail.",
      privacyRequired: "Bitte bestätigen Sie die Datenschutzerklärung.",
    },
  };

  const t = i18nForm[lang] || i18nForm.cs;

  function getScriptUrl() {
    return (cfg.googleScriptUrl || "").trim();
  }

  async function submitForm(form) {
    const type = form.dataset.formType || "candidate";
    const privacy = form.querySelector('[name="privacy"]');
    if (privacy && !privacy.checked) {
      alert(t.privacyRequired);
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    const scriptUrl = getScriptUrl();
    const btn = form.querySelector('[type="submit"]');
    const wrap = form.closest(".form-wrap") || form.parentElement;
    const feedback = wrap.querySelector(".form-feedback--success");
    const errBox = wrap.querySelector(".form-feedback--error");

    if (feedback) feedback.hidden = true;
    if (errBox) errBox.hidden = true;

    if (!scriptUrl) {
      if (errBox) {
        errBox.querySelector("p").textContent = t.errorConfig;
        errBox.hidden = false;
      }
      return;
    }

    const original = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = t.submitting;
    }

    const data = new FormData(form);
    const subject =
      type === "company"
        ? lang === "de"
          ? "Neue Firmenanfrage – Kutis Personal"
          : "Nová firemní poptávka – Kutis Personal"
        : lang === "de"
          ? "Neue Fachkraft-/Partner-Registrierung – Kutis Personal"
          : "Nová registrace pracovníka/partnera – Kutis Personal";

    const payload = {
      subject,
      "Typ formuláře": type === "company" ? "Firma" : "Pracovník / partner",
      "Jazyk webu": lang === "de" ? "Němčina" : "Čeština",
      "Stránka": pageId,
    };

    for (const [key, value] of data.entries()) {
      if (key === "_gotcha" || key === "privacy" || value === "") continue;
      payload[key] = value;
    }

    if (payload.profession === "__other__") {
      payload.profession = payload.professionOther || (lang === "de" ? "Andere" : "Jiné");
      delete payload.professionOther;
    }

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      let ok = response.ok;
      try {
        const result = await response.json();
        if (result.success === true) ok = true;
        else if (result.success === false) ok = false;
      } catch (_) {
        /* text/plain ok */
      }

      if (!ok) throw new Error("fail");

      form.hidden = true;
      if (feedback) {
        const title = feedback.querySelector("h3");
        const text = feedback.querySelector("p");
        if (title) {
          title.textContent =
            type === "company" ? t.successCompanyTitle : t.successTitle;
        }
        if (text) {
          text.textContent =
            type === "company" ? t.successCompanyText : t.successText;
        }
        feedback.hidden = false;
      }
      form.reset();
    } catch (_) {
      if (errBox) {
        errBox.querySelector("p").textContent = t.error;
        errBox.hidden = false;
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = original;
      }
    }
  }

  document.querySelectorAll("form[data-form-type]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(form);
    });

    const professionSelect = form.querySelector("[data-profession-select]");
    const otherWrap = form.querySelector("[data-profession-other]");
    const otherInput = otherWrap
      ? otherWrap.querySelector('input[name="professionOther"]')
      : null;
    if (professionSelect && otherWrap && otherInput) {
      const syncOther = () => {
        const show = professionSelect.value === "__other__";
        otherWrap.hidden = !show;
        otherInput.required = show;
        if (!show) otherInput.value = "";
      };
      professionSelect.addEventListener("change", syncOther);
      syncOther();
    }
  });

  /* ---------- Deep-link to form via ?form= / ?gewerk= / ?profession= ---------- */
  const params = new URLSearchParams(window.location.search);
  const formParam = params.get("form");
  const gewerk = (params.get("gewerk") || "").trim();
  const professionParam = (params.get("profession") || "").trim();

  if (formParam === "company" || formParam === "worker" || formParam === "team") {
    const targetId =
      formParam === "company" ? "form-company" : "form-worker";
    const el = document.getElementById(targetId);
    if (el) {
      const form = el.querySelector("form") || el;

      if (formParam === "company" && gewerk) {
        const message = form.querySelector('[name="message"]');
        if (message && !message.value) {
          message.value =
            lang === "de"
              ? `Bedarf: ${gewerk}\nAnzahl / Team:\nEinsatzort:\nStart:`
              : `Poptávka: ${gewerk}\nPočet / tým:\nLokalita:\nTermín:`;
        }
        const coop = form.querySelector('[name="cooperation"]');
        if (coop) coop.focus();
      }

      if ((formParam === "worker" || formParam === "team") && professionParam) {
        const select = form.querySelector("[data-profession-select]");
        if (select) {
          const match = Array.from(select.options).find(
            (o) => o.value === professionParam || o.textContent === professionParam
          );
          if (match) {
            select.value = match.value;
            select.dispatchEvent(new Event("change"));
          } else {
            select.value = "__other__";
            select.dispatchEvent(new Event("change"));
            const other = form.querySelector('[name="professionOther"]');
            if (other) other.value = professionParam;
          }
        }
      }

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  /* ---------- Expose helpers ---------- */
  window.KutisSite = { langHref, lang, pageId, LANG_MAP, base };
})();
