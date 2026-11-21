# Kutis Personal – web

Statický web (čisté HTML/CSS/JS, bez build kroku) nasazovaný na Vercel z tohoto repozitáře.
Německá verze pro firmy hledající subdodavatele, česká verze pro řemeslníky a firmy.

## Struktura
| Cesta | Obsah |
|---|---|
| `index.html` | Německá úvodní stránka |
| `subunternehmer/` | Rozcestník + 8 stránek podle oborů (SEO) |
| `ratgeber/` | Odborný článek „Subunternehmer aus Osteuropa beauftragen“ |
| `anfrage.html` | Německý poptávkový formulář |
| `impressum.html`, `datenschutz.html` | Německé právní stránky |
| `cz/` | Česká verze: úvod, registrace, provozovatel webu, ochrana údajů |
| `assets/` | `site.css`, `site.js`, písma (lokálně, bez Googlu), obrázky, favicon, logo, OG obrázek |
| `vercel.json` | Přesměrování starých adres (`/de/…`, `/cs/…`) a hlavičky |
| `sitemap.xml`, `robots.txt` | Pro vyhledávače |
| `google-apps-script.txt` | Kód skriptu, který z formulářů posílá e-maily |

## Formuláře
Oba formuláře posílají data na Google Apps Script (adresa je v `assets/site.js`, proměnná `GAS_URL`).
Skript pošle e-mail na adresu v proměnné `EMAIL_PRIJEMCE` (viz `google-apps-script.txt`).
Ochrana proti spamu: skryté pole a minimální doba vyplnění. Web nepoužívá cookies.

## Lokální náhled
```bash
python3 -m http.server 8080
```

## Nasazení
Každý push do `main` Vercel automaticky nasadí. Nastavení projektu: Framework **Other**, bez build command, root `.`.

## SEO po spuštění
1. Google Search Console: ověřit doménu a odeslat `https://kutispersonal.com/sitemap.xml`.
2. Google Business Profile + recenze od zákazníků.
3. Zpětné odkazy: Auftragsbank.de, wlw.de, LinkedIn, weby partnerů.
4. Každý měsíc nový článek nebo stránka.

## Fotky
`assets/img/dachdecker.*` a `assets/img/baustelle.*` jsou ilustrační fotky z fotobanky (převzaté ze starého webu).
Vlastní fotky z vašich staveb nahraďte se stejným názvem souboru (`.jpg` i `.webp`).
