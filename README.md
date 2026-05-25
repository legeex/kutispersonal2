# Václav Kutiš – osobní web

Moderní responzivní prezentační web pro zprostředkování pracovních a obchodních příležitostí v regionu DACH.

## Struktura projektu

```
├── index.html
├── css/styles.css
├── js/
│   ├── config.js          ← váš e-mail + URL skriptu
│   ├── i18n.js
│   └── main.js
├── google-apps-script.txt ← kód pro Google (zkopírovat)
└── README.md
```

## Spuštění lokálně

```bash
python3 -m http.server 8080
```

Poté otevřete http://localhost:8080

## Nasazení na Vercel

Příkaz `npx plugins add vercel/vercel-plugin` je **doplněk do Cursoru** – web na Vercel tím samo nenahraje. Stačí statická složka s `index.html`.

### Varianta A – příkazová řádka (nejrychlejší)

V terminálu ve složce projektu:

```bash
cd "/Users/vaclavkutis/Desktop/Kutiš Václav"
vercel login
vercel
```

- První `vercel`: odpovězte na otázky (Enter = výchozí)
- **Set up and deploy?** Y  
- **Which scope?** váš účet  
- **Link to existing project?** N (poprvé)  
- **Project name?** např. `vaclav-kutis`  
- **In which directory is your code?** `./`  
- **Want to modify settings?** N  

Na konci dostanete URL typu `https://vaclav-kutis.vercel.app`.

Produkční doména:

```bash
vercel --prod
```

### Varianta B – přes web vercel.com

1. Účet na https://vercel.com  
2. **Add New…** → **Project**  
3. Nahrajte složku (Import Git repository **nebo** drag & drop přes CLI / GitHub)  
4. Framework Preset: **Other**  
5. Build Command: *(prázdné)*  
6. Output Directory: *(prázdné nebo `.`)*  
7. **Deploy**

### Po nasazení

- Otestujte formulář na živé URL (ne localhost)  
- Google Apps Script musí mít přístup **Kdokoli** (už máte)  
- Volitelně v Vercel → **Settings** → **Domains** připojíte vlastní doménu

## Formuláře – 100 % zdarma (Google Apps Script)

Žádná placená služba. Formuláře posílají e-mail přes váš **Gmail** a malý skript na Google (zdarma navždy).

### Krok 1: Vytvořit skript

1. Otevřete https://script.google.com → **Nový projekt**
2. Smažte výchozí kód a vložte obsah souboru **`google-apps-script.txt`**
3. Na řádku `EMAIL_PRIJEMCE` zkontrolujte svůj e-mail
4. Uložte projekt (Ctrl+S), název např. „Formulář web Kutiš“

### Krok 2: Nasadit jako webovou aplikaci

1. Klikněte **Nasadit** → **Nové nasazení**
2. Typ: **Webová aplikace**
3. Nastavení:
   - Spouštět jako: **Já**
   - Kdo má přístup: **Kdokoli** (kdokoli s odkazem)
4. **Nasadit** → při prvním spuštění povolte přístup k účtu Google
5. Zkopírujte **URL webové aplikace** (končí na `/exec`)

### Krok 3: Vložit URL do webu

V souboru `js/config.js`:

```js
window.SITE_CONFIG = {
  contactEmail: "vaclav.kutis99@gmail.com",
  googleScriptUrl: "https://script.google.com/macros/s/...../exec",
};
```

Nahrajte web na hosting a formulář otestujte.

### Poznámky

- E-maily chodí jako **HTML** (tmavá hlavička, zlatý akcent, přehledná tabulka) + textová záloha
- První e-mail z nového skriptu může skončit ve **spamu** – zkontrolujte
- Po změně kódu vždy **nová verze nasazení** v Google Scriptu
- Web musí běžet přes **http/https** (ne `file://` z disku)
- V kontaktu je i odkaz **mailto:** – funguje vždy, i bez skriptu

## Jazyky (CS / DE)

- Čeština pro CZ/SK (podle IP)
- Němčina pro ostatní země
- Přepínač CS | DE v hlavičce
- `?lang=cs` nebo `?lang=de` v URL

## Úpravy textů

- Překlady: `js/i18n.js`
- Barvy: `css/styles.css` → `:root`
