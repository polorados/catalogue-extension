// Validation du catalogue, sans dépendance : node scripts/validate.mjs
import { readFileSync } from 'node:fs';

const NEEDS = ['trop_onglets', 'aller_retour', 'copier_coller', 'ouverture_quotidienne', 'traduction', 'lecture_longue', 'raccourcis_clavier'];
const TYPES = ['chrome_feature', 'extension'];
const ALLOWED_HOSTS = ['support.google.com', 'developer.chrome.com', 'chromewebstore.google.com'];
const KNOWN_KEYS = ['id', 'type', 'name', 'summary', 'needs', 'url', 'shortcut', 'extension_id', 'permissions_level', 'last_verified'];

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

let catalog;
try {
  catalog = JSON.parse(readFileSync(new URL('../catalog.json', import.meta.url), 'utf8'));
} catch (e) {
  console.error('catalog.json illisible ou JSON invalide :', e.message);
  process.exit(1);
}

if (catalog.schema_version !== 1) err('racine', 'schema_version doit valoir 1');
if (!/^\d{4}-\d{2}-\d{2}$/.test(catalog.version || '')) err('racine', 'version doit être une date AAAA-MM-JJ');
if (!Array.isArray(catalog.entries)) { err('racine', 'entries doit être un tableau'); catalog.entries = []; }

const ids = new Set();
let unverified = 0;

catalog.entries.forEach((e, i) => {
  const w = `entrée ${i} (${e.id ?? '?'})`;

  for (const k of Object.keys(e)) if (!KNOWN_KEYS.includes(k)) err(w, `champ inconnu « ${k} »`);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id || '')) err(w, 'id invalide (minuscules, chiffres, tirets)');
  else if (ids.has(e.id)) err(w, 'id en double');
  ids.add(e.id);

  if (!TYPES.includes(e.type)) err(w, `type invalide (${TYPES.join(' | ')})`);
  if (!e.name || e.name.length > 80) err(w, 'name vide ou > 80 caractères');
  if (!e.summary || e.summary.length > 160) err(w, 'summary vide ou > 160 caractères');

  if (!Array.isArray(e.needs) || e.needs.length === 0) err(w, 'needs doit contenir au moins une étiquette');
  else e.needs.forEach((n) => { if (!NEEDS.includes(n)) err(w, `étiquette inconnue « ${n} »`); });

  try {
    const u = new URL(e.url);
    if (u.protocol !== 'https:') err(w, 'url doit être en https');
    if (!ALLOWED_HOSTS.includes(u.hostname)) err(w, `domaine non autorisé « ${u.hostname} »`);
  } catch { err(w, 'url invalide'); }

  if (e.type === 'extension') {
    if (!/^[a-p]{32}$/.test(e.extension_id || '')) err(w, 'extension_id requis (32 lettres a-p)');
    if (!['low', 'medium', 'high'].includes(e.permissions_level)) err(w, 'permissions_level requis (low | medium | high)');
  } else if (e.extension_id) {
    err(w, 'extension_id interdit pour une fonctionnalité native');
  }

  if (e.last_verified !== null && !/^\d{4}-\d{2}-\d{2}$/.test(e.last_verified || '')) err(w, 'last_verified doit être null ou AAAA-MM-JJ');
  if (e.last_verified === null) unverified++;
});

if (errors.length) {
  console.error(`✖ ${errors.length} erreur(s) :`);
  errors.forEach((m) => console.error('  - ' + m));
  process.exit(1);
}
console.log(`✔ Catalogue valide : ${catalog.entries.length} entrées.`);
if (unverified) console.log(`⚠ ${unverified} entrée(s) avec last_verified = null (à vérifier à la main).`);
