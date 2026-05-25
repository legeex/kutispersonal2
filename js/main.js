/**
 * Václav Kutiš – osobní web
 * Navigace, přepínání formulářů, procesních karet a jazyka
 */

(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  const yearEl = document.getElementById("year");

  let menuOpen = false;

  function menuAriaLabel() {
    const lang = I18n.getLocale();
    const nav = I18n.locales[lang].nav;
    return menuOpen ? nav.closeMenu : nav.openMenu;
  }

  function updateMenuAria() {
    if (!navToggle) return;
    navToggle.setAttribute("aria-label", menuAriaLabel());
  }

  // Rok v patičce
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Jazyk – detekce IP + ruční přepínač
  document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      I18n.setLocale(btn.dataset.lang, true);
    });
  });

  document.addEventListener("localechange", () => {
    updateMenuAria();
    if (I18n.getLocale() === "de") {
      switchForm("company");
    } else {
      switchForm("candidate");
    }
  });

  I18n.init();

  // Scroll efekt na header
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobilní menu
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      menuOpen = nav.classList.toggle("nav--open");
      navToggle.classList.toggle("nav-toggle--open", menuOpen);
      navToggle.setAttribute("aria-expanded", String(menuOpen));
      updateMenuAria();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuOpen = false;
        nav.classList.remove("nav--open");
        navToggle.classList.remove("nav-toggle--open");
        navToggle.setAttribute("aria-expanded", "false");
        updateMenuAria();
      });
    });
  }

  updateMenuAria();

  // Přepínání formulářů (kontakt)
  const formTabs = document.querySelectorAll(".form-tab");
  const forms = {
    candidate: document.getElementById("form-candidate"),
    company: document.getElementById("form-company"),
  };
  const formSuccess = document.getElementById("formSuccess");
  const formError = document.getElementById("formError");

  function getContactEmail() {
    return (window.SITE_CONFIG && window.SITE_CONFIG.contactEmail || "").trim();
  }

  function getGoogleScriptUrl() {
    return (window.SITE_CONFIG && window.SITE_CONFIG.googleScriptUrl || "")
      .trim();
  }

  function initContactEmailLink() {
    const email = getContactEmail();
    const link = document.getElementById("contactEmailLink");
    if (!link || !email) return;
    link.href = `mailto:${email}`;
    link.textContent = email;
  }

  initContactEmailLink();

  function hideFormFeedback() {
    if (formSuccess) formSuccess.hidden = true;
    if (formError) formError.hidden = true;
  }

  function showFormSuccess() {
    hideFormFeedback();
    if (formSuccess) formSuccess.hidden = false;
  }

  function showFormError(messageKey) {
    hideFormFeedback();
    if (formError) {
      const lang = I18n.getLocale();
      const dict = I18n.locales[lang].contact;
      const msg = dict[messageKey] || dict.errorText;
      const p = formError.querySelector("p");
      if (p) p.textContent = msg;
      formError.hidden = false;
    }
  }

  function setSubmitButtonState(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      const lang = I18n.getLocale();
      btn.textContent = I18n.locales[lang].contact.submitting;
    } else if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
      delete btn.dataset.originalText;
    }
  }

  function switchForm(type) {
    formTabs.forEach((tab) => {
      tab.classList.toggle("form-tab--active", tab.dataset.form === type);
    });

    Object.entries(forms).forEach(([key, form]) => {
      if (!form) return;
      form.classList.toggle("contact-form--active", key === type);
    });

    hideFormFeedback();
    Object.values(forms).forEach((f) => {
      if (f) f.style.display = "";
    });
    const tabs = document.querySelector(".form-tabs");
    if (tabs) tabs.style.display = "";
  }

  formTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchForm(tab.dataset.form));
  });

  document.querySelectorAll("[data-form]").forEach((el) => {
    if (el.classList.contains("form-tab")) return;

    el.addEventListener("click", () => {
      const type = el.dataset.form;
      if (!type || !forms[type]) return;

      switchForm(type);

      if (el.getAttribute("href") === "#kontakt") {
        setTimeout(() => switchForm(type), 100);
      }
    });
  });

  if (window.location.hash === "#kontakt") {
    const params = new URLSearchParams(window.location.search);
    const formType = params.get("form");
    if (formType === "company" || formType === "candidate") {
      switchForm(formType);
    }
  }

  // Přepínání procesních karet
  const processTabs = document.querySelectorAll(".process-tab");
  const processPanels = {
    candidate: document.getElementById("process-candidate"),
    company: document.getElementById("process-company"),
  };

  processTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const type = tab.dataset.tab;

      processTabs.forEach((t) => {
        t.classList.toggle("process-tab--active", t === tab);
      });

      Object.entries(processPanels).forEach(([key, panel]) => {
        if (!panel) return;
        panel.classList.toggle("process-panel--active", key === type);
      });
    });
  });

  async function sendToEmail(form, type) {
    const scriptUrl = getGoogleScriptUrl();
    if (!scriptUrl) {
      showFormError("errorNotConfigured");
      return false;
    }

    const data = new FormData(form);
    if (data.get("_gotcha")) {
      return true;
    }

    const lang = I18n.getLocale();
    const subject =
      type === "company"
        ? lang === "de"
          ? "Neue Anfrage – Unternehmen (Web)"
          : "Nová poptávka – firma (web)"
        : lang === "de"
          ? "Neue Anfrage – Bewerber (Web)"
          : "Nová žádost – uchazeč (web)";

    const payload = {
      subject,
      "Typ formuláře":
        type === "company"
          ? "Firma – hledá kapacity / partnery"
          : "Uchazeč – hledá práci / zakázku",
      "Jazyk webu": lang === "de" ? "Němčina" : "Čeština",
    };

    const fieldLabels = {
      name: "Jméno a příjmení",
      email: "E-mail",
      phone: "Telefon",
      profession: "Profese",
      experience: "Praxe",
      languages: "Jazykové znalosti",
      country: "Země",
      start: "Termín / dostupnost",
      cooperation: "Forma spolupráce",
      note: "Poznámka",
      company: "Název firmy",
      contact: "Kontaktní osoba",
      location: "Lokalita projektu",
    };

    const valueLabels = {
      country: { de: "Německo", at: "Rakousko", ch: "Švýcarsko", any: "Více zemí" },
      cooperation: {
        employment: "Zaměstnání",
        osvc: "OSVČ",
        subcontract: "Subdodávka",
        unknown: "Nevím",
      },
    };

    for (const [key, value] of data.entries()) {
      if (key === "_gotcha" || value === "") continue;
      const label = fieldLabels[key] || key;
      const mapped = valueLabels[key] && valueLabels[key][value];
      payload[label] = mapped || value;
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    try {
      const result = await response.json();
      if (result.success === true) return true;
      console.error("Google Script:", result);
      return false;
    } catch (_) {
      return response.ok;
    }
  }

  function handleSubmit(form, type) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      hideFormFeedback();
      setSubmitButtonState(submitBtn, true);

      try {
        const ok = await sendToEmail(form, type);
        if (!ok) {
          showFormError("errorText");
          return;
        }

        form.style.display = "none";
        const sibling = type === "candidate" ? forms.company : forms.candidate;
        if (sibling) sibling.style.display = "none";
        const tabs = document.querySelector(".form-tabs");
        if (tabs) tabs.style.display = "none";

        showFormSuccess();
        form.reset();
      } catch (err) {
        console.error("Formulář:", err);
        showFormError("errorText");
      } finally {
        setSubmitButtonState(submitBtn, false);
      }
    });
  }

  if (forms.candidate) handleSubmit(forms.candidate, "candidate");
  if (forms.company) handleSubmit(forms.company, "company");
})();
