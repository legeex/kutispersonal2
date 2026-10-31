# Co ještě zbývá

## Hotovo

- Kontakty CS/DE, e-mail, adresa, IČO/DIČ
- Právní stránky (GDPR, Impressum, cookies, právní upozornění)
- 8 let DACH + 400+ pracovníků
- Fotografie v `assets/images/`
- Webová prezentace (bez adminu / nabídek)

## Důležité – příjem e-mailů z formulářů

Na webu je `info@kutispersonal.com`, ale **skutečný příjemce** určuje Google Apps Script.

1. Otevři [script.google.com](https://script.google.com) a projekt napojený na formuláře
2. V kódu: `var EMAIL_PRIJEMCE = "anfrage@kutispersonal.com";`  
   (kompletní kód je v `google-apps-script.txt`)
3. **Nasadit → Spravovat nasazení → tužka → Nová verze → Nasadit**
4. Pošli testovací poptávku a ověř schránku `anfrage@kutispersonal.com`

## Volitelné další kroky

- [ ] Nasadit web na Vercel / připojit `www.kutispersonal.com`
- [ ] Favicon
- [ ] Google Analytics / Search Console (volitelně)
