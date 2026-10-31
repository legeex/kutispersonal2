# Kutis Personal – web

Profesionální B2B prezentační web: německá verze pro firmy hledající kapacity, česká verze pro řemeslníky, OSVČ a subdodavatele.

## Struktura

```
├── index.html              ← přesměrování podle jazyka prohlížeče
├── cs/                     ← česká verze (pracovníci / partneři)
├── de/                     ← německá verze (B2B firmy)
├── css/styles.css          ← design systém černá / červená / bílá
├── js/config.js            ← e-mail, telefon, WhatsApp, Google Script
├── js/site.js              ← navigace, formuláře, mobilní lišta
├── scripts/build-site.js   ← generátor stránek (po úpravách textů)
├── robots.txt
└── sitemap.xml
```

## Lokální náhled

```bash
python3 -m http.server 8080
```

Otevřete http://localhost:8080 → přesměruje na `/cs/` nebo `/de/`.

## Regenerace stránek

Texty a stránky se generují ze skriptů:

```bash
node scripts/build-site.js
```

Po změně obsahu v `scripts/build-site.js` nebo `scripts/build-partial.js` vždy spusťte generátor znovu.

## Konfigurace

V `js/config.js`:

```js
window.SITE_CONFIG = {
  contactEmail: "info@kutispersonal.com",
  phoneCS: "+420 …",
  phoneDE: "+49 …",
  googleScriptUrl: "https://script.google.com/macros/s/…/exec",
};
```

Formuláře posílají data na Google Apps Script (viz `google-apps-script.txt`).

## Nasazení (Vercel)

Framework: **Other** · bez build command · root = `.`

```bash
vercel --prod
```

Připojte doménu `www.kutispersonal.com`.

## Správa nabídek

Jednoduchá administrace: **`/admin/`** (heslo v `js/config.js` → `adminPassword`).

1. Přihlásíte se  
2. Přidáte / upravíte nabídky  
3. Stáhnete `offers.json`  
4. Nahrajete ho do složky `data/` na hostingu  

Stránky `/cs/nabidky.html` a `/de/angebote.html` si soubor načtou automaticky.

## Co ještě doplnit

Viz **DOPLNIT.md**.
