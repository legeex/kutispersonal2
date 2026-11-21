/* Kutis Personal – site behaviour (no dependencies, no cookies, no tracking) */
(function () {
  'use strict';
  var lang = document.documentElement.lang === 'cs' ? 'cs' : 'de';
  var T = {
    de: {
      sending: 'Wird gesendet …',
      required: 'Bitte füllen Sie alle Pflichtfelder aus.',
      failed: 'Das Senden hat leider nicht geklappt. Bitte rufen Sie uns an: +49 160 98767681 oder schreiben Sie an info@kutispersonal.com.',
      open: 'Menü öffnen', close: 'Menü schließen'
    },
    cs: {
      sending: 'Odesílám …',
      required: 'Vyplňte prosím všechna povinná pole.',
      failed: 'Odeslání se bohužel nepovedlo. Zavolejte nám prosím na +49 160 98767681 nebo napište na info@kutispersonal.com.',
      open: 'Otevřít menu', close: 'Zavřít menu'
    }
  }[lang];

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('kp-burger');
  var mnav = document.getElementById('kp-mnav');
  if (burger && mnav) {
    var icoOpen = burger.querySelector('.kp-ico-open');
    var icoClose = burger.querySelector('.kp-ico-close');
    var setMenu = function (open) {
      mnav.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? T.close : T.open);
      if (icoOpen) icoOpen.hidden = open;
      if (icoClose) icoClose.hidden = !open;
    };
    burger.addEventListener('click', function () { setMenu(mnav.hidden); });
    mnav.querySelectorAll('[data-close-menu]').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && !mnav.hidden) setMenu(false);
    });
  }

  /* ---------- goal chips (CZ registration) ---------- */
  var chips = document.querySelectorAll('.kp-chip');
  if (chips.length) {
    var goalInput = document.querySelector('input[name="hledam"]');
    var syncGoals = function () {
      var sel = [];
      chips.forEach(function (c) { if (c.getAttribute('aria-pressed') === 'true') sel.push(c.dataset.goal); });
      if (goalInput) goalInput.value = sel.join(', ');
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        syncGoals();
      });
    });
    syncGoals();
  }

  /* ---------- prefill inquiry from the quick form (?gewerk=…&anzahl=…) ---------- */
  var params = new URLSearchParams(window.location.search);
  var prefill = function (name, value) {
    var el = document.querySelector('.js-form [name="' + name + '"]');
    if (!el || !value) return;
    if (el.tagName === 'SELECT') {
      for (var i = 0; i < el.options.length; i++) {
        var o = el.options[i].text;
        if (o === value || o.indexOf(value.split(' ')[0]) === 0) { el.selectedIndex = i; break; }
      }
    } else { el.value = value; }
  };
  var gw = params.get('gewerk');
  var gwMap = { 'Trockenbauer': 'Trockenbau', 'Anderes Gewerk': 'Anderes / mehrere' };
  prefill('gewerk', gwMap[gw] || gw);
  var anz = params.get('anzahl');
  var anzMap = { '1 Person': '1', '2–3 Personen': '2–3', '4–8 Personen': '4–8', 'Team 8+': 'mehr als 8' };
  if (anz) prefill('anzahl', anzMap[anz] || anz);

  /* ---------- forms -> Google Apps Script (sends the e-mail) ---------- */
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbzC1cvlEk_5ea2Pw4Le3OO8XnBGBy-UHkl0tvbhjeGRanBOgB2oZIapkDczp6MuNrxI/exec';
  var LABELS = {
    anfrage: { gewerk: 'Profese', anzahl: 'Počet', start: 'Termín', ort: 'Lokalita', firma: 'Firma',
               name: 'Kontaktní osoba', kontakt: 'Telefon / e-mail', nachricht: 'Poptávka' },
    registrace: { hledam: 'Hledá', typ: 'Jsem', obor: 'Profese', praxe: 'Praxe', nemcina: 'Němčina',
                  jmeno: 'Jméno', telefon: 'Telefon', email: 'E-mail', poznamka: 'Poznámka' }
  };
  var isLive = /(^|\.)kutispersonal\.com$/.test(window.location.hostname) || /\.vercel\.app$/.test(window.location.hostname) ||
               window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  var showSuccess = function (form) {
    var box = form.parentNode.querySelector('.js-success');
    form.hidden = true;
    if (box) { box.hidden = false; box.focus(); box.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  };

  document.querySelectorAll('.js-form').forEach(function (form) {
    var started = Date.now();
    var err = form.querySelector('.js-error');
    var btn = form.querySelector('button[type="submit"]');
    var btnText = btn ? btn.textContent : '';
    var kind = form.dataset.form;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (err) err.hidden = true;
      if (!form.checkValidity()) {
        if (err) { err.textContent = T.required; err.hidden = false; }
        form.reportValidity();
        return;
      }
      var hp = form.querySelector('[name="website"]');
      if ((hp && hp.value) || Date.now() - started < 3000) { showSuccess(form); return; } // bots
      if (!isLive) { showSuccess(form); return; } // design preview outside the real site

      var company = kind === 'anfrage';
      var payload = {
        subject: company ? 'Neue Firmenanfrage – Kutis Personal' : 'Nová registrace pracovníka/partnera – Kutis Personal',
        'Typ formuláře': company ? 'Firma' : 'Pracovník / partner',
        'Jazyk webu': lang === 'de' ? 'Němčina' : 'Čeština',
        'Stránka': window.location.pathname
      };
      var map = LABELS[kind] || {};
      new FormData(form).forEach(function (value, key) {
        if (!map[key] || String(value).trim() === '') return;
        payload[map[key]] = String(value).trim().slice(0, 3000);
      });

      if (btn) { btn.disabled = true; btn.textContent = T.sending; }
      fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return r.json().then(function (j) { return j && j.success !== false; }, function () { return r.ok; });
      }).then(function (ok) {
        if (!ok) throw new Error('failed');
        showSuccess(form);
      }).catch(function () {
        if (err) { err.textContent = T.failed; err.hidden = false; }
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      });
    });
  });
})();
