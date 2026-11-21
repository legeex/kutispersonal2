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

function html(def, rows, when, page) {
  const tr = rows.map(([label, value, link]) => `<tr><td style="padding:10px 0;width:34%;vertical-align:top;font:600 11px/1.4 Helvetica,Arial,sans-serif;color:#888;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #eee">${esc(label)}</td><td style="padding:10px 0 10px 16px;vertical-align:top;font:400 15px/1.55 Helvetica,Arial,sans-serif;color:#111;border-bottom:1px solid #eee">${link ? `<a href="${esc(link)}" style="color:#B4470A;font-weight:600;text-decoration:none">${esc(value)}</a>` : esc(value).replace(/\n/g, '<br>')}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f3f2ee;padding:24px 12px;font-family:Helvetica,Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fff;border:1px solid #e6e3da;border-radius:6px;overflow:hidden"><tr><td style="height:4px;background:#F26A1B"></td></tr><tr><td style="padding:24px 28px;background:#0E1A2B"><div style="font:700 11px/1 Helvetica,Arial,sans-serif;color:#F26A1B;letter-spacing:.16em;text-transform:uppercase">Kutis Personal</div><div style="margin-top:10px;font:700 22px/1.25 Helvetica,Arial,sans-serif;color:#fff">${esc(def.badge)}</div></td></tr><tr><td style="padding:16px 28px 24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${tr}</table></td></tr><tr><td style="padding:14px 28px;background:#fafaf7;border-top:1px solid #eee;font:12px/1.5 Helvetica,Arial,sans-serif;color:#999">Odesláno ${esc(when)} · ${esc(page)}</td></tr></table></td></tr></table></body></html>`;
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
    rows.push([label, v, link]);
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
      text: rows.map(([l, v]) => `${l}: ${v}`).join('\n') + `\n\nOdesláno: ${when} · ${page}`,
      html: html(def, rows, when, page),
    });
  } catch (e) {
    console.error('mail failed:', e && e.message);
    return finish(false, 'mail', 500);
  }
  return finish(true);
};
