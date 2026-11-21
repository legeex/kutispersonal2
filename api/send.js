// Kutis Personal – odesílání formulářů e-mailem (Vercel funkce, bez Google skriptu)
//
// Nastavení ve Vercelu (Project → Settings → Environment Variables):
//   SMTP_USER  tvoje Gmail adresa (účet, ze kterého se posílá)
//   SMTP_PASS  heslo aplikace z Google účtu (16 znaků, ne běžné heslo!)
//   MAIL_TO    volitelné – kam mají poptávky chodit (výchozí = SMTP_USER)
//   SMTP_HOST / SMTP_PORT  volitelné – výchozí smtp.gmail.com / 465

const nodemailer = require('nodemailer');

const SMTP_USER = process.env.SMTP_USER;
const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
const RATE_LIMIT = 5;          // max. odeslání z jedné IP …
const RATE_WINDOW = 600000;    // … za 10 minut (navíc k firewallu Vercelu)
const hits = new Map();
const recent = new Map();      // ochrana proti duplicitám

const FORMS = {
  anfrage: {
    subject: 'Nová poptávka firmy',
    badge: 'Firemní poptávka',
    contact: 'kontakt',
    title: ['firma', 'gewerk'],
    head: 'firma', sub: 'name',
    chips: ['gewerk', 'anzahl', 'start', 'ort'],
    text: 'nachricht', lang: 'DE',
    fields: [
      ['gewerk', 'Profese', true],
      ['anzahl', 'Počet', true],
      ['start', 'Termín', true],
      ['ort', 'Lokalita', false],
      ['firma', 'Firma', true],
      ['name', 'Kontaktní osoba', true],
      ['kontakt', 'Telefon / e-mail', true],
      ['nachricht', 'Poptávka', false, true],
    ],
  },
  registrace: {
    subject: 'Nová registrace',
    badge: 'Registrace',
    contact: 'email',
    title: ['jmeno', 'obor'],
    head: 'jmeno', sub: 'typ',
    chips: ['obor', 'praxe', 'nemcina'],
    text: 'poznamka', lang: 'CZ',
    fields: [
      ['hledam', 'Hledá', false],
      ['typ', 'Jsem', true],
      ['obor', 'Profese', true],
      ['praxe', 'Praxe', true],
      ['nemcina', 'Němčina', true],
      ['jmeno', 'Jméno', true],
      ['telefon', 'Telefon', true],
      ['email', 'E-mail', false],
      ['poznamka', 'Poznámka', false, true],
    ],
  },
};

const cleanLine = (v, max = 200) => String(v || '').replace(/<[^>]*>/g, '').replace(/[\r\n\t]+/g, ' ')
  .replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, max);
const cleanText = (v, max = 3000) => String(v || '').replace(/<[^>]*>/g, '').replace(/\r\n/g, '\n')
  .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
const isEmail = (s) => /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]{2,}$/.test(s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  let raw = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
  if (!raw) {
    raw = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (c) => { data += c; if (data.length > 50000) req.destroy(); });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

function transport() {
  if (process.env.MAIL_TRANSPORT === 'json') return nodemailer.createTransport({ jsonTransport: true }); // jen pro testy
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const F = "font-family:Helvetica,Arial,sans-serif;";

function button(href, label, primary) {
  const bg = primary ? '#F26A1B' : '#ffffff';
  const fg = primary ? '#0E1A2B' : '#0E1A2B';
  const bd = primary ? '#F26A1B' : '#C9C4B8';
  return `<td style="padding:0 8px 8px 0"><a href="${esc(href)}" style="display:inline-block;padding:12px 18px;background:${bg};border:1px solid ${bd};border-radius:6px;${F}font-size:14px;font-weight:700;color:${fg};text-decoration:none">${esc(label)}</a></td>`;
}

function html(def, values, rows, when, page, subject) {
  const head = values[def.head] || '—';
  const sub = [values[def.sub], def === FORMS.anfrage ? 'Firemní poptávka' : 'Registrace z CZ webu'].filter(Boolean).join(' · ');
  const chipText = (k, v) => k === 'anzahl' ? `${v} ${v === '1' ? 'osoba' : 'osob'}` : k === 'nemcina' ? `Němčina: ${v.toLowerCase()}` : k === 'praxe' ? `Praxe: ${v.toLowerCase()}` : v;
  const chips = def.chips.filter((k) => values[k]).map((k) => chipText(k, values[k]))
    .map((v) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 10px;background:#F5F4EF;border:1px solid #E6E3DA;border-radius:999px;${F}font-size:13px;font-weight:600;color:#0E1A2B">${esc(v)}</span>`).join('');

  // quick actions
  const all = Object.values(values).join(' ');
  const email = (all.match(/[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]{2,}/) || [''])[0];
  const phoneRaw = Object.values(values).find((v) => /^[+\d][\d\s/()-]{6,}$/.test(v)) || '';
  const phone = phoneRaw.replace(/[^\d+]/g, '');
  let actions = '';
  if (phone) {
    actions += button('tel:' + phone, '📞 Zavolat', true);
    actions += button('https://wa.me/' + phone.replace(/^\+/, '').replace(/^00/, ''), 'WhatsApp', false);
  }
  if (email) actions += button('mailto:' + email + '?subject=' + encodeURIComponent('Re: ' + subject), '✉️ Odpovědět e-mailem', !phone);

  const skip = new Set([def.head, def.text, ...def.chips]);
  const detail = rows.filter((r) => !skip.has(r.key)).map((r, i, arr) => `<tr>
    <td style="padding:11px 0;width:38%;vertical-align:top;border-bottom:${i === arr.length - 1 ? '0' : '1px solid #EEEBE3'};${F}font-size:12px;font-weight:600;color:#8A8F98;text-transform:uppercase;letter-spacing:.05em">${esc(r.label)}</td>
    <td style="padding:11px 0 11px 12px;vertical-align:top;border-bottom:${i === arr.length - 1 ? '0' : '1px solid #EEEBE3'};${F}font-size:15px;color:#0E1A2B">${r.link ? `<a href="${esc(r.link)}" style="color:#B4470A;font-weight:700;text-decoration:none">${esc(r.value)}</a>` : esc(r.value)}</td></tr>`).join('');

  const msg = values[def.text] ? `<tr><td style="padding:4px 28px 8px">
      <div style="${F}font-size:12px;font-weight:600;color:#8A8F98;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${def === FORMS.anfrage ? 'Zpráva' : 'Poznámka'}</div>
      <div style="padding:14px 16px;background:#F5F4EF;border-left:3px solid #F26A1B;border-radius:4px;${F}font-size:15px;line-height:1.6;color:#0E1A2B">${esc(values[def.text]).replace(/\n/g, '<br>')}</div>
    </td></tr>` : '';

  const pre = [head, ...def.chips.map((k) => values[k]).filter(Boolean)].join(' · ');
  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#ECEAE4">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(pre)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ECEAE4;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #DEDAD0">
  <tr><td style="background:#0E1A2B;padding:20px 28px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
      <td style="vertical-align:middle"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
        <td style="width:32px;height:32px;background:#F5F4EF;border-radius:5px;text-align:center;vertical-align:middle"><div style="width:12px;height:12px;background:#F26A1B;margin:0 auto"></div></td>
        <td style="padding-left:10px;${F}line-height:1"><div style="font-size:16px;font-weight:800;color:#ffffff;letter-spacing:.03em">KUTIS</div><div style="font-size:9px;font-weight:600;color:#A9B1BD;letter-spacing:.32em;margin-top:2px">PERSONAL</div></td>
      </tr></table></td>
      <td align="right" style="vertical-align:middle"><span style="display:inline-block;padding:6px 10px;background:#F26A1B;border-radius:4px;${F}font-size:11px;font-weight:800;color:#0E1A2B;letter-spacing:.08em;text-transform:uppercase">${esc(def.badge)} · ${esc(def.lang)}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:28px 28px 6px">
    <div style="${F}font-size:26px;line-height:1.2;font-weight:800;color:#0E1A2B">${esc(head)}</div>
    <div style="${F}font-size:14px;color:#555B66;margin-top:6px">${esc(sub)}</div>
  </td></tr>
  ${chips ? `<tr><td style="padding:12px 28px 4px">${chips}</td></tr>` : ''}
  ${actions ? `<tr><td style="padding:14px 28px 10px"><table role="presentation" cellspacing="0" cellpadding="0"><tr>${actions}</tr></table></td></tr>` : ''}
  ${msg}
  <tr><td style="padding:10px 28px 18px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${detail}</table></td></tr>
  <tr><td style="padding:16px 28px;background:#F5F4EF;border-top:1px solid #E6E3DA;${F}font-size:12px;line-height:1.6;color:#8A8F98">
    Přijato ${esc(when)} · z webu kutispersonal.com<br>
    <span style="color:#A9AEB6">${esc(page)}</span>
  </td></tr>
</table>
<div style="${F}font-size:11px;color:#A9AEB6;margin-top:14px">Automatická zpráva z formuláře na webu Kutis Personal</div>
</td></tr></table>
</body></html>`;
}

module.exports = async function handler(req, res) {
  const wantsJson = String(req.headers.accept || '').includes('application/json');
  let def = null;
  const finish = (ok, error = '', code = 200) => {
    res.setHeader('Cache-Control', 'no-store');
    if (wantsJson) {
      res.statusCode = code;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok, error }));
    } else {
      res.statusCode = 303;
      res.setHeader('Location', (def && def === FORMS.registrace ? '/cz/registrace.html' : '/anfrage.html') + (ok ? '?sent=1' : '?error=1'));
      res.end();
    }
  };

  if (req.method !== 'POST') return finish(false, 'method', 405);
  if (!SMTP_USER || !process.env.SMTP_PASS) { console.error('SMTP_USER / SMTP_PASS chybí'); return finish(false, 'config', 500); }

  let body;
  try { body = await readBody(req); } catch (e) { return finish(false, 'body', 400); }
  def = FORMS[cleanLine(body.form, 20)] || null;
  if (!def) return finish(false, 'form', 400);

  // roboti: skryté pole + minimální doba vyplnění
  if (body.website) return finish(true);
  const ts = Number(body.ts || 0);
  if (!ts || Date.now() - ts < 3000) return finish(true);

  // limit na IP
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0].trim();
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => t > now - RATE_WINDOW);
  if (list.length >= RATE_LIMIT) return finish(false, 'rate', 429);
  list.push(now); hits.set(ip, list);

  const values = {};
  for (const [key, , required, multi] of def.fields) {
    const v = multi ? cleanText(body[key]) : cleanLine(body[key]);
    if (required && !v) return finish(false, 'required', 422);
    values[key] = v;
  }

  // duplicita (stejný obsah během 6 hodin)
  const fp = JSON.stringify(values).toLowerCase();
  for (const [k, t] of recent) if (t < now - 6 * 3600000) recent.delete(k);
  if (recent.has(fp)) return finish(true);
  recent.set(fp, now);

  const rows = [];
  for (const [key, label] of def.fields) {
    const v = values[key];
    if (!v) continue;
    let link = '';
    if (isEmail(v)) link = 'mailto:' + v;
    else if (/^[+\d][\d\s/()-]{6,}$/.test(v)) link = 'tel:' + v.replace(/[^\d+]/g, '');
    rows.push({ key, label, value: v, link });
  }
  const when = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });
  const page = cleanLine(req.headers.referer || 'kutispersonal.com');
  const titleParts = def.title.map((k) => values[k]).filter(Boolean);
  const subject = `${def.subject}${titleParts.length ? ': ' + titleParts.join(' – ') : ''} – Kutis Personal`;
  const visitorEmail = isEmail(values[def.contact] || '') ? values[def.contact] : '';

  try {
    await transport().sendMail({
      from: { name: 'Kutis Personal Web', address: SMTP_USER },
      to: MAIL_TO,
      replyTo: visitorEmail || undefined,
      subject,
      text: rows.map((r) => `${r.label}: ${r.value}`).join('\n') + `\n\nOdesláno: ${when} · ${page}`,
      html: html(def, values, rows, when, page, subject),
    });
  } catch (e) {
    console.error('mail failed:', e && e.message);
    return finish(false, 'mail', 500);
  }
  return finish(true);
};
