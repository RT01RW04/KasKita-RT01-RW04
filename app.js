/* KasKita v3 — antarmuka PWA multi-pengurus, empat jenis kas, kartu QR, pemindai kamera, laporan JPG, Drive. */
(function () {
  'use strict';

  const C = window.KasCore,
    A = window.KasAuth,
    D = window.KasDrive,
    R = window.KasReports;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = 'kaskita.rt.v1';
  const APP_VERSION = '3.0.7',
    DEVELOPER = 'BolangCorp';
  window.KasAppInfo = {
    version: APP_VERSION,
    developer: DEVELOPER
  };
  const ICONS = {
    wallet: '<path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M20 12h-4a2 2 0 0 0 0 4h4"/><path d="M16 14h.01"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    arrows: '<path d="M7 4v16m0 0-4-4m4 4 4-4M17 20V4m0 0-4 4m4-4 4 4"/>',
    'calendar-check': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-12 5 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
    chart: '<path d="M3 3v18h18M8 16v-5m5 5V7m5 9v-8"/>',
    whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.5 8.5c.5 3 2 4.5 5 5l1.5-1.5 2 1c-.5 2-2 2.5-4 1.5-3-1.5-4.5-3-5.5-6-.5-1.5 0-3 1.5-3l1 2Z"/>',
    'cloud-check': '<path d="M20 16.6A4.5 4.5 0 0 0 18 8h-1.3A7 7 0 1 0 4 16.3"/><path d="m9 17 3 3 6-6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    camera: '<path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5L14.5 4Z"/><circle cx="12" cy="13" r="3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-right': '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    'arrow-down-left': '<path d="M17 7 7 17M17 17H7V7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/><path d="M18 12h.01"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    drive: '<path d="M8 3h8l5 9-5 9H8l-5-9Z"/><path d="M8 3l5 9m3-9-5 9m-8 0h10"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/>'
  };
  function icon(name, cls = '') {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
  }
  function hydrate(root = document) {
    $$('[data-icon]', root).forEach(el => {
      el.innerHTML = icon(el.dataset.icon);
    });
    $$('[data-app-version]', root).forEach(el => {
      el.textContent = APP_VERSION;
    });
    $$('[data-developer-credit]', root).forEach(el => {
      el.textContent = 'Dikembangkan oleh ' + DEVELOPER;
    });
  }
  const esc = C.esc,
    money = C.money,
    pad = C.pad;
  const now = new Date();
  const ui = {
    view: 'ringkasan',
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    txType: 'all',
    txQuery: '',
    txMonth: 'all',
    txYear: now.getFullYear(),
    txPage: 1,
    duesQuery: '',
    duesStatus: 'all',
    iuranFund: 'wajib',
    residentQuery: '',
    reportNames: false,
    reportMode: 'monthly',
    reportResident: '',
    settingsTab: 'identitas'
  };
  let state,
    storageOK = true,
    corruptRaw = null,
    deferredInstall = null,
    pendingConfirm = null,
    forcedPassword = false;
  const cardExport = {
    ids: new Set(),
    year: 0,
    layout: '2up',
    query: '',
    busy: false
  };
  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        try {
          var _parsed$settings;
          const parsed = JSON.parse(raw);
          state = C.validateState(parsed);
          // Migrasi hash default lama (salt sempat diperlakukan sebagai teks) ke hash PBKDF2 yang benar.
          const oldHashes = {
            '7a15fa654b867b3b8f9b082b021a177e8602e74cc1cbeb3bebbcc37c1c44bdd1': 'bendahara1',
            'f43c1c7a31f148261d3d355e6a93deea59e7502e99404f5a074405328284067a': 'bendahara2',
            '839925bacae5aa4da961ebd386f90a7273f746a5ea33559684005fd8cda94574': 'ketua',
            '11d84bea023c1692ee444fdbfd470783fab73f422db818c7fe41d488f42a8d6b': 'sekretaris'
          };
          let fixed = false;
          for (const u of state.users) {
            const un = oldHashes[u.hash];
            if (un && u.username === un) {
              const d = C.DEFAULT_USERS.find(x => x.username === un);
              u.salt = d.salt;
              u.hash = d.hash;
              u.mustChange = true;
              fixed = true;
            }
          }
          if (parsed.version !== C.SCHEMA_VERSION || fixed || ((_parsed$settings = parsed.settings) === null || _parsed$settings === void 0 ? void 0 : _parsed$settings.singleDueMode) !== true) {
            localStorage.setItem(KEY, JSON.stringify(state));
          }
        } catch (e) {
          corruptRaw = raw;
          state = C.defaultState();
          storageOK = false;
        }
      } else {
        state = C.defaultState();
        localStorage.setItem(KEY, JSON.stringify(state));
      }
    } catch (e) {
      state = C.defaultState();
      storageOK = false;
    }
  }
  loadState();
  const user = () => A.currentUser(state);
  const can = p => A.can(user(), p);
  function need(p) {
    if (can(p)) return true;
    toast('Anda tidak memiliki izin untuk tindakan ini.', 'error');
    return false;
  }
  function toast(msg, type = 'ok', action) {
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.innerHTML = icon(type === 'error' ? 'alert' : 'check-circle') + `<span>${esc(msg)}</span>`;
    if (action) {
      const b = document.createElement('button');
      b.textContent = action.label;
      b.onclick = action.fn;
      el.appendChild(b);
    }
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), action ? 9000 : 4500);
  }
  function commit(mutator, action, detail, force = false) {
    if (corruptRaw && !force) {
      toast('Data lama tidak terbaca. Pulihkan cadangan atau kosongkan buku.', 'error');
      return false;
    }
    const next = JSON.parse(JSON.stringify(state));
    try {
      mutator(next);
      next.updatedAt = new Date().toISOString();
      next.audit.unshift({
        id: C.uid('a'),
        at: next.updatedAt,
        action,
        detail
      });
      next.audit = next.audit.slice(0, 100);
      C.validateState(next);
    } catch (e) {
      toast(e.message || 'Periksa kembali data.', 'error');
      return false;
    }
    state = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      storageOK = true;
      corruptRaw = null;
    } catch (e) {
      storageOK = false;
      toast('Penyimpanan penuh/dibatasi. Perubahan hanya di sesi ini — unduh cadangan.', 'error');
    }
    render();
    return true;
  }
  function years() {
    const ys = new Set([now.getFullYear(), ui.year, ui.txYear]);
    for (const t of state.transactions) ys.add(+t.date.slice(0, 4));
    for (const r of state.residents) ys.add(+r.since.slice(0, 4));
    ys.add(+state.settings.startMonth.slice(0, 4));
    return [...ys].filter(y => y >= 2000 && y <= 2100).sort((a, b) => b - a);
  }
  function yearOptions(sel) {
    return years().map(y => `<option value="${y}" ${y === +sel ? 'selected' : ''}>${y}</option>`).join('');
  }
  function monthOptions(sel, all = false) {
    return (all ? '<option value="all">Semua bulan</option>' : '') + C.MONTHS.map((m, i) => `<option value="${i + 1}" ${+sel === i + 1 ? 'selected' : ''}>${m}</option>`).join('');
  }
  function currentMonth() {
    return `${ui.year}-${pad(ui.month)}`;
  }
  function initials(name) {
    return name.split(/\s+/).filter(w => w && !/^[\/.]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'W';
  }
  const AV = [['#e8efe4', '#5c7446'], ['#e5eef3', '#4b718a'], ['#f3e9df', '#94704b'], ['#ece7f2', '#78628e'], ['#e2efeb', '#417b68'], ['#f5e6e4', '#a0645b']];
  function avatar(name, id = '') {
    let h = 0;
    for (const c of id + name) h = h * 31 + c.charCodeAt(0) >>> 0;
    const [bg, fg] = AV[h % AV.length];
    return `<span class="avatar" style="background:${bg};color:${fg}">${esc(initials(name))}</span>`;
  }
  function sortedTx(txs = state.transactions) {
    return [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }
  function periodPicker(withMonth = true) {
    return `<div class="period-picker">${withMonth ? `<select class="select" id="period-month" aria-label="Bulan">${monthOptions(ui.month)}</select>` : ''}<select class="select" id="period-year" aria-label="Tahun">${yearOptions(ui.year)}</select></div>`;
  }
  function pageHead(title, sub, eyebrow, actions = '') {
    return `<div class="page-head"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div><div class="head-actions">${actions}</div></div>`;
  }
  function emptyState(title, desc, btn = '') {
    return `<div class="empty-state"><div class="empty-icon">${icon('wallet')}</div><h3>${title}</h3><p>${desc}</p>${btn}</div>`;
  }
  function readonlyBanner() {
    return can('manage_transactions') ? '' : `<div class="readonly-banner">${icon('eye')}Mode hanya lihat. Anda dapat melihat dan membagikan laporan, tetapi tidak dapat mengubah data.</div>`;
  }
  function applyLogo() {
    const logo = state.settings.logo;
    ['sidebar-logo', 'mobile-logo', 'login-logo'].forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      el.innerHTML = logo ? `<img src="${logo}" alt="Logo RT">` : icon('wallet');
    });
    if (logo) {
      $('#favicon').href = logo;
      $('#apple-icon').href = logo;
    }
  }
  function applyPerms() {
    $$('[data-perm]').forEach(el => {
      el.hidden = !can(el.dataset.perm);
    });
  }
  function chartSVG(series) {
    const W = 640,
      H = 210,
      L = 48,
      Rm = 8,
      T = 12,
      B = 30,
      ih = H - T - B,
      iw = W - L - Rm;
    const peak = Math.max(...series.flatMap(s => [s.income, s.expense]), 0);
    const max = peak ? Math.ceil(peak / 40000) * 40000 : 200000;
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const y = T + ih - i * ih / 4,
        v = max * i / 4;
      g += `<line x1="${L}" y1="${y}" x2="${W - Rm}" y2="${y}" stroke="#edf1ee" stroke-dasharray="3 4"/><text x="${L - 9}" y="${y + 3}" text-anchor="end" font-size="9" fill="#9aa69f">${v ? C.compact(v) : '0'}</text>`;
    }
    const gw = iw / 12,
      bw = Math.min(11, gw * .24);
    series.forEach((s, i) => {
      const x = L + i * gw + gw / 2,
        hi = s.income / max * ih,
        ho = s.expense / max * ih;
      g += `<rect x="${x - bw - 2}" y="${T + ih - hi}" width="${bw}" height="${Math.max(hi, 0)}" rx="3" fill="#087764"/><rect x="${x + 2}" y="${T + ih - ho}" width="${bw}" height="${Math.max(ho, 0)}" rx="3" fill="#e7b5a9"/><text x="${x}" y="${H - 8}" text-anchor="middle" font-size="9" fill="${i + 1 === ui.month ? '#087764' : '#9aa69f'}" font-weight="${i + 1 === ui.month ? '800' : '500'}">${C.SHORT[i]}</text>`;
    });
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik arus kas ${ui.year}">${g}</svg>`;
  }
  function txTable(txs, compact = false) {
    if (!txs.length) return emptyState('Buku kas masih kosong', 'Catat pemasukan atau pengeluaran pertama.', can('manage_transactions') ? `<button class="btn btn-primary btn-sm" data-action="add-in">${icon('plus')}Catat transaksi pertama</button>` : '');
    return `<div class="table-wrap"><table><thead><tr><th>Transaksi</th><th>Tanggal</th>${compact ? '' : '<th class="hide-mobile">Metode</th>'}<th class="td-right">Nominal</th><th class="td-right">Aksi</th></tr></thead><tbody>${txs.map(t => {
      const r = C.residentById(state, t.residentId);
      return `<tr><td><button class="tx-name tx-link" data-action="tx-detail" data-id="${esc(t.id)}"><span class="tx-icon ${t.type}">${icon(t.type === 'in' ? 'arrow-down-left' : 'arrow-up-right')}</span><span><strong>${esc(t.category)}</strong><small>${esc(r ? r.name : t.note || (t.type === 'in' ? 'Pemasukan kas' : 'Pengeluaran kas'))}</small></span></button></td><td class="td-muted" style="white-space:nowrap">${C.dateLabel(t.date, true)}</td>${compact ? '' : `<td class="td-muted hide-mobile">${esc(t.method)}</td>`}<td class="td-right amount-${t.type}">${t.type === 'in' ? '+' : '−'} ${money(t.amount)}</td><td><div class="row-actions"><button class="icon-btn" data-action="tx-detail" data-id="${esc(t.id)}" aria-label="Detail">${icon('eye')}</button>${!compact && can('manage_transactions') ? `<button class="icon-btn" data-action="tx-edit" data-id="${esc(t.id)}" aria-label="Edit">${icon('edit')}</button><button class="icon-btn danger" data-action="tx-delete" data-id="${esc(t.id)}" aria-label="Hapus">${icon('trash')}</button>` : ''}</div></td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  function dashboard() {
    const m = currentMonth(),
      s = C.stats(state, m),
      series = C.yearSeries(state, ui.year),
      recent = sortedTx().slice(0, 5);
    const seeded = state.residents.some(r => /^w\d{2}$/.test(r.id));
    const onboard = !state.settings.onboarded ? `<div class="onboarding"><span class="onboarding-icon">${icon('book')}</span><div><strong>${state.residents.length ? 'Mulai dari buku yang sudah ada' : 'Mulai buku RT baru'}</strong><p>${state.residents.length ? `${state.residents.length} warga terdaftar. Pembayaran belum diimpor otomatis; periksa ejaan, tahun, dan nominal.` : 'Tambahkan identitas RT dan warga, atau gunakan template kosong untuk RT lain.'}</p></div>${can('settings') ? `<button class="btn btn-secondary btn-sm" data-action="settings">Atur RT ${icon('arrow-right')}</button>${seeded ? `<button class="btn btn-ghost btn-sm" data-action="reset-all">Hapus data contoh</button>` : ''}` : ''}<button class="icon-btn" data-action="dismiss-onboarding" aria-label="Tutup">${icon('x')}</button></div>` : '';
    const ring = 2 * Math.PI * 36,
      off = ring * (1 - s.rate / 100);
    const mini = s.unpaidResidents.slice(0, 3).map(r => `<div class="mini-resident">${avatar(r.name, r.id)}<span class="name">${esc(r.name)}</span><span class="badge badge-warn">Belum bayar</span></div>`).join('');
    return pageHead('Ringkasan kas', 'Pantau arus kas dan iuran warga dalam satu tempat.', 'BUKU KAS DIGITAL', periodPicker() + (can('manage_transactions') ? `<button class="btn btn-primary" data-action="add">${icon('plus')}Catat transaksi</button>` : '')) + readonlyBanner() + onboard + `<div class="stats-grid"><section class="balance-card"><div class="stat-label">${icon('wallet')}Saldo kas tercatat</div><div class="stat-value">${money(s.balance)}</div><div class="stat-foot">${icon('shield')}Akumulasi seluruh transaksi</div></section><section class="stat-card"><div class="stat-label">Pemasukan</div><span class="stat-icon in">${icon('arrow-down-left')}</span><div class="stat-value">${money(s.income)}</div><div class="stat-foot"><span class="trend-up">${C.MONTHS[ui.month - 1]} ${ui.year}</span></div></section><section class="stat-card"><div class="stat-label">Pengeluaran</div><span class="stat-icon out">${icon('arrow-up-right')}</span><div class="stat-value">${money(s.expense)}</div><div class="stat-foot"><span class="trend-down">${C.MONTHS[ui.month - 1]} ${ui.year}</span></div></section></div><div class="dashboard-grid"><section class="card"><div class="card-head"><div><h2>Arus kas ${ui.year}</h2><p>Pemasukan dan pengeluaran per bulan</p></div><div class="legend"><span><i></i>Masuk</span><span><i class="out"></i>Keluar</span></div></div><div class="chart-wrap">${chartSVG(series)}${series.every(x => !x.income && !x.expense) ? `<div class="chart-empty"><span class="chart-empty-icon">${icon('chart')}</span><strong>Belum ada arus kas tahun ini</strong><p>Grafik terisi otomatis saat transaksi dicatat.</p></div>` : ''}</div></section><section class="card dues-card"><div class="card-head"><div><h2>Iuran ${C.MONTHS[ui.month - 1]}</h2><p>Target ${money(s.target)}</p></div><span class="badge badge-ok">${s.eligibleCount} warga</span></div><div class="dues-summary"><div class="progress-ring"><svg viewBox="0 0 86 86"><circle cx="43" cy="43" r="36" fill="none" stroke="#edf2ee" stroke-width="8"/><circle cx="43" cy="43" r="36" fill="none" stroke="#087764" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ring}" stroke-dashoffset="${off}"/></svg><span class="ring-value">${s.rate}%</span></div><div><strong>${s.paidCount} dari ${s.eligibleCount} warga</strong><p>sudah membayar bulan ini</p><div class="amount">${money(s.collected)} terkumpul</div></div></div><div class="mini-residents">${mini || `<div class="mini-resident"><span class="td-muted" style="font-size:11px">${s.eligibleCount ? 'Semua warga sudah membayar.' : 'Belum ada warga aktif.'}</span></div>`}</div><div class="card-foot"><a href="#iuran" class="btn btn-soft btn-block">Lihat iuran warga ${icon('arrow-right')}</a></div></section></div><div class="quick-actions">${can('manage_transactions') ? `<button class="quick-action" data-action="add-in"><span class="qa-icon">${icon('plus')}</span><span><strong>Catat pemasukan</strong></span>${icon('arrow-up-right')}</button><button class="quick-action out" data-action="add-out"><span class="qa-icon">${icon('arrows')}</span><span><strong>Catat pengeluaran</strong></span>${icon('arrow-up-right')}</button>` : ''}<button class="quick-action wa" data-action="go-report"><span class="qa-icon">${icon('whatsapp')}</span><span><strong>Laporan & JPG</strong><small>Grup WA atau per rumah</small></span>${icon('arrow-up-right')}</button></div><section class="card table-card"><div class="card-head"><div><h2>Transaksi terakhir</h2></div><a href="#transaksi" class="text-link">Lihat semua ${icon('arrow-right')}</a></div>${txTable(recent, true)}</section>`;
  }
  function filteredTx() {
    const q = ui.txQuery.toLocaleLowerCase('id');
    return sortedTx().filter(t => {
      if (ui.txType !== 'all' && t.type !== ui.txType) return false;
      if (+t.date.slice(0, 4) !== ui.txYear) return false;
      if (ui.txMonth !== 'all' && +t.date.slice(5, 7) !== +ui.txMonth) return false;
      if (q) {
        const r = C.residentById(state, t.residentId);
        if (![t.category, t.note, t.method, t.amount, (r === null || r === void 0 ? void 0 : r.name) || '', t.date, (t.dues || []).map(d => C.fundLabel(C.dueKind(d))).join(' ')].join(' ').toLocaleLowerCase('id').includes(q)) return false;
      }
      return true;
    });
  }
  function transactions() {
    const txs = filteredTx(),
      inc = txs.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0),
      out = txs.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0),
      pages = Math.max(1, Math.ceil(txs.length / 10));
    ui.txPage = Math.min(ui.txPage, pages);
    const slice = txs.slice((ui.txPage - 1) * 10, ui.txPage * 10);
    return pageHead('Transaksi', 'Setiap rupiah tercatat dan bisa ditelusuri.', 'BUKU KAS', `<button class="btn btn-secondary" data-action="export-csv">${icon('download')}CSV</button>${can('manage_transactions') ? `<button class="btn btn-primary" data-action="add">${icon('plus')}Catat transaksi</button>` : ''}`) + readonlyBanner() + `<div class="summary-strip"><div class="summary-tile"><span>Pemasukan (filter)</span><strong class="amount-in">${money(inc)}</strong></div><div class="summary-tile"><span>Pengeluaran (filter)</span><strong class="amount-out">${money(out)}</strong></div><div class="summary-tile"><span>Jumlah catatan</span><strong>${txs.length}</strong></div></div><section class="card table-card"><div class="filters"><label class="search-field">${icon('search')}<input id="tx-search" type="search" placeholder="Cari kategori, warga, catatan…" value="${esc(ui.txQuery)}"></label><div class="segmented">${[['all', 'Semua'], ['in', 'Masuk'], ['out', 'Keluar']].map(([v, l]) => `<button data-action="filter-type" data-type="${v}" class="${ui.txType === v ? 'active' : ''}">${l}</button>`).join('')}</div><select class="select" id="tx-month">${monthOptions(ui.txMonth, true)}</select><select class="select" id="tx-year">${yearOptions(ui.txYear)}</select></div>${slice.length ? txTable(slice) : emptyState('Tidak ada transaksi yang cocok', 'Ubah filter atau kata kunci.', `<button class="btn btn-secondary btn-sm" data-action="clear-filters">Reset filter</button>`)}<div class="table-footer"><span>${txs.length} catatan</span><div class="pagination"><button class="icon-btn" data-action="page-prev" ${ui.txPage <= 1 ? 'disabled' : ''}>${icon('chevron-left')}</button><span>${ui.txPage}/${pages}</span><button class="icon-btn" data-action="page-next" ${ui.txPage >= pages ? 'disabled' : ''}>${icon('chevron-right')}</button></div></div></section>`;
  }
  function iuran() {
    const fund = ui.iuranFund || 'wajib';
    const dm = C.duesMap(state, fund),
      q = ui.duesQuery.toLocaleLowerCase('id'),
      m = currentMonth();
    const total = state.transactions.reduce((s, t) => s + (t.dues || []).filter(d => (d.kind || 'wajib') === fund && d.month.startsWith(ui.year + '-')).reduce((a, d) => a + d.amount, 0), 0);
    const list = state.residents.filter(r => {
      if (q && !r.name.toLocaleLowerCase('id').includes(q)) return false;
      const paid = dm.has(r.id + '|' + m);
      if (ui.duesStatus === 'paid') return paid;
      if (ui.duesStatus === 'unpaid') return r.active && !paid && r.since <= m && C.fundRequired(state, fund);
      return true;
    });
    const rows = list.map(r => {
      let sum = 0;
      const cells = C.MONTHS.map((_, i) => {
        const mo = `${ui.year}-${pad(i + 1)}`,
          v = dm.get(r.id + '|' + mo);
        if (v) sum += v.due.amount;
        return `<td class="${mo === m ? 'current' : ''}">${v ? `<button class="dues-cell paid" data-action="tx-detail" data-id="${esc(v.tx.id)}">${icon('check')}${C.compact(v.due.amount)}</button>` : can('manage_transactions') ? `<button class="dues-cell ${mo > C.monthOf(C.today()) ? 'future' : ''}" data-action="pay-due" data-resident="${esc(r.id)}" data-month="${mo}" data-fund="${fund}">+</button>` : '<span class="dues-cell">·</span>'}</td>`;
      }).join('');
      return `<tr><td><div class="dues-name">${avatar(r.name, r.id)}<span><strong>${esc(r.name)}</strong><small>${r.active ? 'Mulai ' + C.monthLabel(r.since, true) : 'Nonaktif'}</small></span></div></td>${cells}<td class="dues-total">${money(sum)}</td></tr>`;
    }).join('');
    const fs = C.fundMonthStats(state, m)[fund];
    return pageHead('Iuran warga', 'Klik sel untuk mencatat iuran bulanan warga.', 'IURAN BULANAN', periodPicker(false) + `<button class="btn btn-secondary" data-action="scan">${icon('camera')}Pindai kartu</button>` + (can('manage_transactions') ? `<button class="btn btn-primary" data-action="add-dues">${icon('plus')}Catat iuran</button>` : '')) + readonlyBanner() + `<div class="summary-strip"><div class="summary-tile"><span>${C.fundLabel(fund)} · ${ui.year}</span><strong class="amount-in">${money(total)}</strong></div><div class="summary-tile"><span>Warga aktif</span><strong>${C.activeResidents(state).length}</strong></div><div class="summary-tile"><span>Sudah bayar · ${C.SHORT[ui.month - 1]}</span><strong>${fs.paidCount}<small> / ${fs.eligibleCount}</small></strong></div></div><section class="card table-card"><div class="filters"><label class="search-field">${icon('search')}<input id="dues-search" type="search" placeholder="Cari nama warga…" value="${esc(ui.duesQuery)}"></label><select class="select" id="dues-status"><option value="all">Semua warga</option><option value="unpaid" ${ui.duesStatus === 'unpaid' ? 'selected' : ''}>Belum bayar bulan terpilih</option><option value="paid" ${ui.duesStatus === 'paid' ? 'selected' : ''}>Sudah bayar bulan terpilih</option></select></div>${list.length ? `<div class="table-wrap"><table class="dues-table"><thead><tr><th>Warga</th>${C.SHORT.map((s, i) => `<th class="${ui.year + '-' + pad(i + 1) === m ? 'current' : ''}">${s}</th>`).join('')}<th>Total</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState('Warga tidak ditemukan', 'Tambahkan warga atau ubah pencarian.', can('manage_residents') ? `<button class="btn btn-primary btn-sm" data-action="add-resident">Tambah warga</button>` : '')}<div class="legend-row"><span><i class="legend-dot"></i>Sudah dibayar</span><span><i class="legend-dot unpaid"></i>Belum</span><span style="margin-left:auto">Nominal mengikuti Pengaturan → Kas & pembayaran.</span></div></section><p class="scroll-hint">${icon('arrow-right')}Geser tabel untuk semua bulan. QR kartu warga dapat dipindai dari tombol di atas.</p>`;
  }
  function warga() {
    const q = ui.residentQuery.toLocaleLowerCase('id'),
      list = state.residents.filter(r => r.name.toLocaleLowerCase('id').includes(q)),
      through = C.monthOf(C.today());
    return pageHead('Data warga', 'Kelola warga, nomor WA, kartu QR, dan status iuran.', 'LINGKUNGAN KITA', `<button class="btn btn-secondary" data-action="print-all-cards">${icon('download')}PDF semua kartu</button>` + (can('manage_residents') ? `<button class="btn btn-primary" data-action="add-resident">${icon('plus')}Tambah warga</button>` : '')) + readonlyBanner() + `<section class="card" style="margin-bottom:18px"><div class="filters" style="border-bottom:0"><label class="search-field">${icon('search')}<input id="resident-search" type="search" placeholder="Cari nama warga…" value="${esc(ui.residentQuery)}"></label><span class="td-muted" style="font-size:11px">${list.length} warga</span></div></section>${list.length ? `<div class="resident-grid" id="resident-list">${list.map(r => {
      const ar = C.arrears(state, r, through);
      const ry = C.residentYear(state, r, ui.year);
      const paid = ry.funds.wajib.months.filter(m => m.paid).length;
      return `<article class="resident-card"><div class="resident-top">${avatar(r.name, r.id)}<div><h3>${esc(r.name)}</h3><p>${r.phone ? 'WA ' + esc(r.phone) : 'Nomor WA belum diisi'}</p></div>${can('manage_residents') ? `<button class="icon-btn" data-action="edit-resident" data-id="${esc(r.id)}">${icon('edit')}</button>` : ''}</div><div class="resident-meta"><span>Status<strong><span class="badge ${r.active ? 'badge-ok' : 'badge-muted'}">${r.active ? 'Aktif' : 'Nonaktif'}</span></strong></span><span>Wajib ${ui.year}<strong>${paid} bulan</strong></span><span>Tunggakan<strong>${r.active ? ar.length ? `<span class="badge badge-warn">${ar.length} bulan</span>` : '<span class="badge badge-ok">Lunas</span>' : '—'}</strong></span></div><div class="share-row">${can('manage_transactions') && r.active ? `<button class="btn btn-soft" data-action="resident-pay" data-id="${esc(r.id)}">${icon('calendar-check')}Catat iuran</button>` : ''}<button class="btn btn-secondary" data-action="resident-remind" data-id="${esc(r.id)}">${icon('whatsapp')}Pengingat</button>${can('manage_transactions') ? `<button class="btn btn-soft" data-action="annual-pay" data-id="${esc(r.id)}">${icon('check-circle')}Lunas 1 tahun</button>` : ''}<button class="btn btn-secondary" data-action="resident-jpg" data-id="${esc(r.id)}">${icon('image')}JPG</button><button class="btn btn-secondary" data-action="print-card" data-id="${esc(r.id)}">${icon('download')}PDF</button></div></article>`;
    }).join('')}</div>` : `<section class="card" id="resident-list">${emptyState('Belum ada warga', 'Tambahkan warga untuk memulai.', can('manage_residents') ? `<button class="btn btn-primary btn-sm" data-action="add-resident">Tambah warga</button>` : '')}</section>`}`;
  }
  function laporan() {
    var _state$residents$;
    const m = currentMonth(),
      s = C.stats(state, m),
      text = C.buildReport(state, m, ui.reportNames);
    const catRows = o => Object.entries(o).map(([k, v]) => `<div class="report-line"><dt>${esc(k)}</dt><dd>${money(v)}</dd></div>`).join('');
    const o = state.settings.officers;
    const monthly = `<div class="report-layout"><article class="report-paper"><div class="report-brand"><span class="brand-mark">${state.settings.logo ? `<img src="${state.settings.logo}" alt="Logo">` : icon('wallet')}</span><div><strong>${esc(state.settings.name)}</strong><small>${esc(C.rtTitle(state))}</small></div></div><h2>Laporan Kas Bulanan</h2><p class="report-sub">Periode ${C.monthLabel(m)}</p><dl class="report-lines"><div class="report-line"><dt>Saldo awal bulan</dt><dd>${money(s.opening)}</dd></div><div class="report-line"><dt>Total pemasukan</dt><dd class="amount-in">+ ${money(s.income)}</dd></div><div class="report-line"><dt>Total pengeluaran</dt><dd class="amount-out">− ${money(s.expense)}</dd></div><div class="report-line total"><dt>Saldo akhir bulan</dt><dd>${money(s.closing)}</dd></div></dl>${Object.keys(s.inCats).length ? `<div class="report-section-title">PEMASUKAN</div><dl>${catRows(s.inCats)}</dl>` : ''}${Object.keys(s.outCats).length ? `<div class="report-section-title">PENGELUARAN</div><dl>${catRows(s.outCats)}</dl>` : ''}<div class="report-section-title">IURAN WARGA</div><dl class="report-lines"><div class="report-line"><dt>Iuran bulanan — sudah membayar</dt><dd>${s.paidCount}/${s.eligibleCount} warga</dd></div><div class="report-line"><dt>Iuran bulanan — terkumpul</dt><dd>${money(s.collected)}</dd></div>${C.FUND_TYPES.filter(f => f.id !== 'wajib').map(f => `<div class="report-line"><dt>${f.label}${s.funds[f.id].required ? ` — ${s.funds[f.id].paidCount}/${s.funds[f.id].eligibleCount} warga` : ''}</dt><dd>${money(s.funds[f.id].collected)}</dd></div>`).join('')}</dl><div class="report-sign"><span>Ketua RT<strong>${esc(o.ketua || '—')}</strong></span><span>Sekretaris<strong>${esc(o.sekretaris || '—')}</strong></span><span>Bendahara<strong>${esc(o.bendahara1 || o.bendahara2 || '—')}</strong></span></div></article><aside class="card share-panel"><h2>${icon('whatsapp')}Laporan bulanan</h2><p>Unduh JPG seperti laporan kas, atau kirim teks ke grup. JPG bisa dilampirkan manual di WhatsApp.</p><div class="wa-preview"><div class="wa-bubble">${esc(text)}</div></div><label class="privacy-check"><input type="checkbox" id="report-names" ${ui.reportNames ? 'checked' : ''}><span>Sertakan nama penunggak (default off).</span></label><div class="share-actions"><button class="btn btn-primary btn-block" data-action="jpg-monthly-share">${icon('image')}Bagikan JPG laporan</button><button class="btn btn-secondary btn-block" data-action="jpg-monthly-download">${icon('download')}Unduh JPG</button><button class="btn btn-wa btn-block" data-action="share-wa">${icon('whatsapp')}Kirim teks ke grup WA</button><div class="share-row"><button class="btn btn-secondary" data-action="copy-report">${icon('copy')}Salin</button><button class="btn btn-secondary" data-action="print">${icon('print')}PDF</button></div><div class="share-row">${can('backup') ? `<button class="btn btn-secondary" data-action="backup">${icon('download')}Cadangan</button>` : ''}${can('restore') ? `<button class="btn btn-secondary" data-action="import">${icon('upload')}Pulihkan</button>` : ''}${can('drive') ? `<button class="btn btn-secondary" data-action="drive-backup">${icon('drive')}Drive</button>` : ''}</div></div><div class="info-box">${icon('info')}WhatsApp tidak mengizinkan lampiran otomatis dari tautan web. Bila berbagi file tidak didukung, JPG diunduh lalu lampirkan di grup.</div></aside></div>`;
    const rid = ui.reportResident || ((_state$residents$ = state.residents[0]) === null || _state$residents$ === void 0 ? void 0 : _state$residents$.id) || '';
    const r = C.residentById(state, rid);
    const ry = r ? C.residentYear(state, r, ui.year) : null;
    const perRumah = `<div class="report-layout"><section class="card share-panel"><h2>${icon('users')}Laporan & pengingat per rumah</h2><p>Pilih warga untuk membuat kartu iuran JPG dan mengirim pemberitahuan pembayaran.</p><div class="field"><label for="report-resident">Warga / rumah</label><select id="report-resident">${state.residents.map(x => `<option value="${esc(x.id)}" ${x.id === rid ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>${r ? `<div class="summary-strip" style="margin-top:16px"><div class="summary-tile"><span>Dibayar ${ui.year}</span><strong class="amount-in">${money(ry.paidTotal)}</strong></div><div class="summary-tile"><span>Tunggakan</span><strong>${ry.arrears.length} bulan</strong><small>${money(ry.arrearsAmount)}</small></div></div>${residentFundSummary(r, ry)}<div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>Bulan</th><th>Status</th><th class="td-right">Nominal</th></tr></thead><tbody>${ry.months.map(x => `<tr><td>${C.monthLabel(x.month, true)}</td><td><span class="badge ${!x.applicable ? 'badge-muted' : x.paid ? 'badge-ok' : 'badge-warn'}">${!x.applicable ? 'Belum berlaku' : x.paid ? 'Lunas' : x.future ? 'Akan datang' : 'Belum'}</span></td><td class="td-right">${x.paid ? money(x.amount) : x.applicable && !x.future ? money(state.settings.monthlyDue) : '—'}</td></tr>`).join('')}</tbody></table></div><div class="share-actions"><button class="btn btn-primary btn-block" data-action="jpg-resident-share" data-id="${esc(r.id)}">${icon('image')}Bagikan JPG kartu iuran</button><button class="btn btn-secondary btn-block" data-action="jpg-resident-download" data-id="${esc(r.id)}">${icon('download')}Unduh JPG</button>${can('manage_transactions') ? `<button class="btn btn-soft btn-block" data-action="annual-pay" data-id="${esc(r.id)}">${icon('check-circle')}Lunas 1 tahun</button>` : ''}<button class="btn btn-primary btn-block" data-action="print-card" data-id="${esc(r.id)}">${icon('download')}PDF kartu warga ini</button><button class="btn btn-secondary btn-block" data-action="print-all-cards">${icon('download')}PDF semua kartu aktif</button><button class="btn btn-wa btn-block" data-action="resident-remind" data-id="${esc(r.id)}">${icon('whatsapp')}Kirim pengingat ke warga</button></div><div class="info-box">${icon('info')}${r.phone ? 'Pengingat dibuka ke nomor WA ' + esc(r.phone) + '.' : 'Nomor WA warga belum diisi. Pengingat akan membuka pilihan kontak/grup.'} Lampirkan JPG secara manual bila perlu.</div>` : '<p class="confirm-text">Belum ada warga.</p>'}</section><aside class="card share-panel"><h2>${icon('image')}Pratinjau JPG</h2><p>Kartu berisi identitas RT, status 12 bulan, tunggakan, instruksi pembayaran, dan tanda tangan pengurus.</p><button class="btn btn-secondary btn-block" data-action="jpg-resident-preview" data-id="${esc(rid)}" ${r ? '' : 'disabled'}>${icon('eye')}Buat pratinjau</button><img id="resident-jpg-preview" class="jpg-preview" alt="Pratinjau kartu iuran" hidden></aside></div>`;
    return pageHead('Laporan kas', 'Bulanan untuk grup, per rumah untuk pemberitahuan pembayaran.', 'LAPORAN PENGURUS', periodPicker(ui.reportMode === 'monthly')) + `<div class="report-tabs"><button data-action="report-mode" data-mode="monthly" class="${ui.reportMode === 'monthly' ? 'active' : ''}">Per bulan</button><button data-action="report-mode" data-mode="resident" class="${ui.reportMode === 'resident' ? 'active' : ''}">Per rumah / warga</button></div>${ui.reportMode === 'monthly' ? monthly : perRumah}`;
  }
  function render() {
    if (!user()) return;
    const views = {
      ringkasan: dashboard,
      transaksi: transactions,
      iuran,
      warga,
      laporan
    };
    $('#main').innerHTML = (views[ui.view] || dashboard)();
    const labels = {
      ringkasan: 'Ringkasan',
      transaksi: 'Transaksi',
      iuran: 'Iuran warga',
      warga: 'Data warga',
      laporan: 'Laporan'
    };
    $('#breadcrumb-current').textContent = labels[ui.view];
    $$('[data-view]').forEach(a => {
      const on = a.dataset.view === ui.view;
      a.classList.toggle('active', on);
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    $('#nav-resident-count').textContent = state.residents.length;
    $('#sidebar-rt').textContent = `RT ${state.settings.rt} / RW ${state.settings.rw}`;
    const u = user();
    $('#user-role').textContent = u ? `${u.name} · ${A.roleLabel(u.role)}` : '';
    $('#user-avatar').textContent = u ? initials(u.name) : 'RT';
    $('#topbar-avatar').textContent = u ? initials(u.name) : 'RT';
    $('#save-status').innerHTML = icon(storageOK ? 'check-circle' : 'alert') + `<span>${storageOK ? 'Tersimpan di perangkat' : 'Belum tersimpan'}</span>`;
    const banner = $('#storage-banner');
    if (corruptRaw) {
      banner.hidden = false;
      banner.innerHTML = `Data lama tidak terbaca. <button class="text-link" data-action="raw-backup">Unduh data mentah</button> atau <button class="text-link" data-action="import">pulihkan cadangan</button>.`;
    } else if (!storageOK) {
      banner.hidden = false;
      banner.innerHTML = `Penyimpanan dibatasi. <button class="text-link" data-action="backup">Unduh cadangan</button>.`;
    } else banner.hidden = true;
    hydrate($('#main'));
    applyPerms();
    applyLogo();
  }
  function focusAfter(id) {
    requestAnimationFrame(() => {
      const el = $('#' + id);
      if (el) {
        el.focus();
        try {
          el.setSelectionRange(el.value.length, el.value.length);
        } catch (e) {}
      }
    });
  }
  const VIEWS = ['ringkasan', 'transaksi', 'iuran', 'warga', 'laporan'];
  function routeView() {
    const v = location.hash.slice(1);
    return VIEWS.includes(v) ? v : 'ringkasan';
  }
  function navigate(v) {
    if (!user()) return;
    ui.view = VIEWS.includes(v) ? v : 'ringkasan';
    render();
    window.scrollTo(0, 0);
    if (location.hash !== '#' + ui.view) {
      try {
        history.pushState(null, '', '#' + ui.view);
      } catch (e) {
        location.hash = ui.view;
      }
    }
  }
  function syncRoute() {
    if (!user()) return;
    ui.view = routeView();
    render();
    window.scrollTo(0, 0);
  }

  // ---- Auth UI ----
  function showLogin() {
    $('#app-shell').hidden = true;
    $('#bottom-nav').hidden = true;
    $('#mobile-add').hidden = true;
    $('#login-screen').hidden = false;
    $('#login-password').value = '';
    $('#login-error').textContent = '';
    applyLogo();
    hydrate($('#login-screen'));
    $('#login-username').focus();
  }
  function enterApp() {
    $('#login-screen').hidden = true;
    $('#app-shell').hidden = false;
    $('#bottom-nav').hidden = false;
    $('#mobile-add').hidden = false;
    ui.view = routeView();
    render();
  }
  async function submitLogin(e) {
    e.preventDefault();
    const btn = $('#login-submit');
    btn.disabled = true;
    $('#login-error').textContent = '';
    try {
      const fd = new FormData(e.target),
        username = String(fd.get('username')).trim().toLowerCase(),
        password = String(fd.get('password'));
      const u = state.users.find(x => x.username === username);
      if (!u || !(await A.verify(u, password))) throw new Error('Username atau password salah.');
      A.setSession(u.username);
      if (u.mustChange) {
        openChangePassword(true);
      } else enterApp();
    } catch (err) {
      $('#login-error').textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  }
  function logout() {
    if (window.KasScanner) KasScanner.stop();
    A.clearSession();
    closeModal();
    showLogin();
  }
  function openAccountMenu() {
    const u = user();
    if (!u) return;
    openModal('Akun & aplikasi', `<div class="resident-top" style="margin-bottom:14px">${avatar(u.name, u.id)}<div><h3>${esc(u.name)}</h3><p>@${esc(u.username)} · ${A.roleLabel(u.role)}</p></div></div><div class="share-actions">${can('settings') ? `<button class="btn btn-primary btn-block" data-action="settings">${icon('settings')}Pengaturan</button>` : ''}<button class="btn btn-secondary btn-block" data-action="go-warga" id="account-residents">${icon('users')}Data warga</button><button class="btn btn-secondary btn-block" data-action="change-password">${icon('shield')}Ganti password</button>${can('backup') ? `<button class="btn btn-secondary btn-block" data-action="backup">${icon('download')}Unduh cadangan JSON</button>` : ''}${can('restore') ? `<button class="btn btn-secondary btn-block" data-action="import">${icon('upload')}Pulihkan cadangan JSON</button>` : ''}<button class="btn btn-secondary btn-block" data-action="logout">${icon('x')}Kunci / keluar</button></div><div class="account-about"><strong>KasKita <span data-app-version>${APP_VERSION}</span></strong><span data-developer-credit>Dikembangkan oleh ${DEVELOPER}</span><button class="text-link" data-action="about">Tentang aplikasi ${icon('arrow-right')}</button></div>`, false, 'AKUN');
  }
  function openAbout() {
    openModal('Tentang KasKita', `<div class="about-brand"><span class="brand-mark">${icon('wallet')}</span><div><h3>KasKita</h3><p>Pembukuan kas RT</p></div></div><dl class="detail-list"><div><dt>Versi</dt><dd>${APP_VERSION}</dd></div><div><dt>Pengembang</dt><dd>${DEVELOPER}</dd></div><div><dt>Platform</dt><dd>${window.KasAndroid ? 'Android APK' : 'Web / PWA'}</dd></div><div><dt>Penyimpanan</dt><dd>Data lokal di perangkat</dd></div></dl><div class="info-box">${icon('info')}<span>KasKita dikembangkan oleh <strong>${DEVELOPER}</strong>. Gunakan cadangan JSON sebelum memperbarui aplikasi atau berganti perangkat.</span></div><div class="form-actions"><button class="btn btn-primary" data-action="close-modal">Tutup</button></div>`, false, 'TENTANG APLIKASI');
  }
  function openChangePassword(forced = false) {
    forcedPassword = forced;
    const u = user();
    if (!u) return;
    openModal(forced ? 'Buat password baru' : 'Ganti password', `${forced ? `<div class="info-box warn">${icon('shield')}Ini login pertama. Wajib mengganti password awal sebelum memakai aplikasi.</div>` : ''}<form id="password-form"><div class="field"><label for="pw-current">Password saat ini</label><input id="pw-current" type="password" required autocomplete="current-password"></div><div class="field"><label for="pw-new">Password baru (min. 8 karakter)</label><input id="pw-new" type="password" minlength="8" required autocomplete="new-password"></div><div class="field"><label for="pw-confirm">Ulangi password baru</label><input id="pw-confirm" type="password" minlength="8" required autocomplete="new-password"></div><div class="form-error" id="form-error"></div><div class="form-actions"><button type="submit" class="btn btn-primary btn-block">Simpan password</button></div></form>`, false, 'AKUN');
  }
  async function submitPassword(e) {
    e.preventDefault();
    const u = user();
    if (!u) return;
    const cur = $('#pw-current').value,
      nw = $('#pw-new').value,
      cf = $('#pw-confirm').value;
    if (nw !== cf) return formError('Password baru tidak sama.');
    if (nw.length < 8) return formError('Minimal 8 karakter.');
    try {
      if (!(await A.verify(u, cur))) return formError('Password saat ini salah.');
      const salt = A.randomSalt(),
        hash = await A.hash(nw, salt);
      if (commit(s => {
        const x = s.users.find(y => y.id === u.id);
        x.salt = salt;
        x.hash = hash;
        x.mustChange = false;
      }, 'Ganti password', u.username)) {
        forcedPassword = false;
        closeModal();
        toast('Password diganti.');
        enterApp();
      }
    } catch (err) {
      formError(err.message);
    }
  }

  // ---- Dialog ----
  function openModal(title, body, wide = false, eyebrow = 'KASKITA') {
    const d = $('#modal');
    d.classList.toggle('wide', wide);
    $('#modal-title').textContent = title;
    $('#modal-eyebrow').textContent = eyebrow;
    $('#modal-body').innerHTML = body;
    hydrate($('#modal-body'));
    if (!d.open) d.showModal();
  }
  function closeModal() {
    if (forcedPassword) {
      forcedPassword = false;
      logout();
      return;
    }
    if (window.KasScanner) KasScanner.stop();
    $('#modal').close();
    pendingConfirm = null;
  }
  function confirmAction(title, message, fn, {
    danger = true,
    typed = null,
    label = 'Hapus'
  } = {}) {
    pendingConfirm = {
      fn,
      typed
    };
    openModal(title, `<div class="confirm-icon">${icon(danger ? 'alert' : 'info')}</div><p class="confirm-text">${esc(message)}</p>${typed ? `<div class="field" style="margin-top:16px"><label for="confirm-typed">Ketik ${typed} untuk melanjutkan</label><input id="confirm-typed" autocomplete="off"></div>` : ''}<div class="form-error" id="confirm-error"></div><div class="form-actions"><button class="btn btn-secondary" data-action="close-modal">Batal</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm-ok">${label}</button></div>`, false, 'KONFIRMASI');
  }
  function formError(msg) {
    const el = $('#form-error');
    if (el) {
      el.textContent = msg;
      el.scrollIntoView({
        block: 'nearest'
      });
    } else toast(msg, 'error');
  }

  // ---- Transaksi ----
  function openTx(id = null, preset = {}) {
    var _existing$dues, _existing$dues2, _tx$dues;
    if (!need('manage_transactions')) return;
    const existing = id ? state.transactions.find(t => t.id === id) : null;
    if (id && !existing) return;
    if (existing !== null && existing !== void 0 && (_existing$dues = existing.dues) !== null && _existing$dues !== void 0 && _existing$dues.length && (existing.dues.some(d => C.dueKind(d) !== 'wajib' || d.amount !== state.settings.monthlyDue) || new Set(existing.dues.map(d => d.amount)).size > 1 || new Set(existing.dues.map(d => d.month.slice(0, 4))).size > 1)) return toast('Riwayat iuran lama tetap tersimpan dan dapat dilihat, tetapi tidak dapat diedit dalam mode iuran tunggal.', 'error');
    const type = (existing === null || existing === void 0 ? void 0 : existing.type) || preset.type || 'in';
    const month = preset.month || currentMonth();
    const fund = preset.fund || (existing === null || existing === void 0 || (_existing$dues2 = existing.dues) === null || _existing$dues2 === void 0 || (_existing$dues2 = _existing$dues2[0]) === null || _existing$dues2 === void 0 ? void 0 : _existing$dues2.kind) || 'wajib';
    const tx = existing || {
      type,
      date: C.today(),
      category: type === 'in' ? 'Iuran warga' : C.allCategories(state, 'out')[0],
      amount: '',
      residentId: preset.residentId || '',
      dues: [{
        month,
        kind: fund,
        amount: C.fundAmount(state, fund) || 0
      }],
      method: 'Tunai',
      note: '',
      fund
    };
    if (!tx.fund) tx.fund = fund;
    openTxForm(tx, !existing, +(preset.month || ((_tx$dues = tx.dues) === null || _tx$dues === void 0 || (_tx$dues = _tx$dues[0]) === null || _tx$dues === void 0 ? void 0 : _tx$dues.month) || currentMonth()).slice(0, 4));
  }
  function openTxForm(tx, isNew, formYear) {
    var _tx$dues2, _tx$dues3;
    const cats = C.allCategories(state, tx.type);
    const isDues = tx.type === 'in' && tx.category === 'Iuran warga';
    const fund = tx.fund || ((_tx$dues2 = tx.dues) === null || _tx$dues2 === void 0 || (_tx$dues2 = _tx$dues2[0]) === null || _tx$dues2 === void 0 ? void 0 : _tx$dues2.kind) || 'wajib';
    const nominal = ((_tx$dues3 = tx.dues) === null || _tx$dues3 === void 0 || (_tx$dues3 = _tx$dues3[0]) === null || _tx$dues3 === void 0 ? void 0 : _tx$dues3.amount) || C.fundAmount(state, fund) || 0;
    const selected = new Set((tx.dues || []).map(d => d.month));
    openModal(isNew ? tx.type === 'in' ? 'Catat pemasukan' : 'Catat pengeluaran' : 'Edit transaksi', `<form id="tx-form" data-id="${esc(tx.id || '')}" data-new="${isNew}"><div class="type-toggle"><button type="button" data-action="tx-type" data-type="in" class="${tx.type === 'in' ? 'active in' : ''}">${icon('arrow-down-left')}Pemasukan</button><button type="button" data-action="tx-type" data-type="out" class="${tx.type === 'out' ? 'active out' : ''}">${icon('arrow-up-right')}Pengeluaran</button></div><input type="hidden" name="type" value="${tx.type}"><div class="form-grid"><div class="field"><label for="tx-date">Tanggal</label><input id="tx-date" name="date" type="date" value="${esc(tx.date)}" max="${C.today()}" min="2000-01-01" required></div><div class="field"><label for="tx-method">Metode</label><select id="tx-method" name="method">${C.METHODS.map(m => `<option ${tx.method === m ? 'selected' : ''}>${m}</option>`).join('')}</select></div><div class="field"><label for="tx-category">Kategori</label><select id="tx-category" name="category">${cats.map(c => `<option ${tx.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div><div class="field"><label for="tx-amount">Nominal (Rp)</label><input id="tx-amount" name="amount" inputmode="numeric" value="${tx.amount ? C.number(tx.amount) : ''}" ${isDues ? 'readonly' : ''} required><small id="amount-hint">${isDues ? 'Otomatis dari bulan iuran.' : 'Contoh 30.000.'}</small></div><fieldset class="dues-fieldset" id="dues-fields" ${isDues ? '' : 'hidden'}><legend>Detail iuran warga</legend><div class="form-grid"><input type="hidden" id="tx-fund" name="fund" value="wajib"><div class="field"><label for="tx-resident">Warga</label><select id="tx-resident" name="residentId"><option value="">Pilih warga…</option>${state.residents.map(r => `<option value="${esc(r.id)}" ${tx.residentId === r.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select></div><div class="field"><label for="dues-nominal">Nominal/bulan</label><input id="dues-nominal" inputmode="numeric" value="${nominal ? C.number(nominal) : ''}" readonly><small>Tarif diatur di Pengaturan → Kas & pembayaran.</small></div><div class="field full"><label for="dues-form-year">Tahun iuran</label><select id="dues-form-year">${yearOptions(formYear)}</select><div class="month-checks" id="month-checks">${monthChecks(formYear, tx.residentId, selected, tx.id, fund)}</div><small>Bulan yang sudah dibayar tidak dapat dipilih lagi.</small></div></div></fieldset><div class="field full"><label for="tx-note">Catatan</label><textarea id="tx-note" name="note" maxlength="300">${esc(tx.note || '')}</textarea></div></div><div class="form-error" id="form-error"></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-modal">Batal</button><button type="submit" class="btn btn-primary">${icon('check')}Simpan</button></div></form>`, false, 'BUKU KAS');
    if (isDues) updateDuesAmount();
  }
  function monthChecks(year, rid, selected, exclude, fund = 'wajib') {
    return C.MONTHS.map((m, i) => {
      const mo = `${year}-${pad(i + 1)}`;
      const used = rid && C.findDue(state, rid, mo, exclude, fund);
      return `<label class="month-check"><input type="checkbox" name="dueMonth" value="${mo}" ${selected.has(mo) && !used ? 'checked' : ''} ${used ? 'disabled' : ''}><span>${C.SHORT[i]}</span></label>`;
    }).join('');
  }
  function updateDuesAmount() {
    const f = $('#tx-form');
    if (!f) return;
    const n = C.parseAmount($('#dues-nominal').value) || 0,
      c = $$('input[name="dueMonth"]:checked', f).length;
    if ($('#tx-category').value === 'Iuran warga') {
      $('#tx-amount').value = c ? C.number(n * c) : '';
      $('#tx-amount').readOnly = true;
      $('#amount-hint').textContent = `${c} bulan × ${money(n)}.`;
    }
  }
  function refreshMonthChecks() {
    var _$;
    const f = $('#tx-form');
    if (!f) return;
    const sel = new Set($$('input[name="dueMonth"]:checked', f).map(i => i.value));
    const fund = ((_$ = $('#tx-fund')) === null || _$ === void 0 ? void 0 : _$.value) || 'wajib';
    $('#month-checks').innerHTML = monthChecks(+$('#dues-form-year').value, $('#tx-resident').value, sel, f.dataset.id || null, fund);
    updateDuesAmount();
  }
  function readTxForm() {
    const f = $('#tx-form'),
      fd = new FormData(f),
      type = fd.get('type'),
      date = fd.get('date'),
      category = fd.get('category'),
      method = fd.get('method'),
      note = String(fd.get('note') || '').trim();
    if (!C.validDate(date) || date > C.today()) throw new Error('Tanggal tidak valid.');
    let amount = C.parseAmount(fd.get('amount')),
      residentId = null,
      dues = [];
    if (type === 'in' && category === 'Iuran warga') {
      const fund = fd.get('fund') || 'wajib';
      if (!C.FUND_TYPES.some(x => x.id === fund)) throw new Error('Jenis kas tidak valid.');
      residentId = fd.get('residentId');
      if (!residentId) throw new Error('Pilih warga.');
      const months = fd.getAll('dueMonth');
      if (!months.length) throw new Error('Pilih bulan iuran.');
      const nominal = C.parseAmount($('#dues-nominal').value);
      if (!Number.isInteger(nominal) || nominal < 1) throw new Error('Nominal iuran tidak valid.');
      for (const m of months) {
        if (C.findDue(state, residentId, m, f.dataset.id || null, fund)) throw new Error(`${C.fundLabel(fund)} ${C.monthLabel(m)} sudah tercatat.`);
        dues.push({
          month: m,
          kind: fund,
          amount: nominal
        });
      }
      amount = nominal * months.length;
    }
    if (!Number.isInteger(amount) || amount < 1) throw new Error('Nominal tidak valid.');
    const old = state.transactions.find(t => t.id === f.dataset.id);
    if (type === 'out') {
      const oldEffect = old ? old.type === 'in' ? old.amount : -old.amount : 0;
      if (amount > C.totalBalance(state) - oldEffect) throw new Error('Saldo tidak cukup. Catat saldo awal/pemasukan dulu.');
    }
    const ts = new Date().toISOString();
    return {
      id: (old === null || old === void 0 ? void 0 : old.id) || C.uid('t'),
      type,
      date,
      amount,
      category,
      residentId,
      dues,
      method,
      note,
      createdAt: (old === null || old === void 0 ? void 0 : old.createdAt) || ts,
      updatedAt: ts
    };
  }
  function submitTx(e) {
    e.preventDefault();
    if (!need('manage_transactions')) return;
    try {
      const tx = readTxForm(),
        isNew = !$('#tx-form').dataset.id;
      if (commit(s => {
        const i = s.transactions.findIndex(t => t.id === tx.id);
        i >= 0 ? s.transactions[i] = tx : s.transactions.push(tx);
      }, isNew ? 'Tambah transaksi' : 'Edit transaksi', `${tx.category} ${money(tx.amount)}`)) {
        closeModal();
        toast('Transaksi tersimpan.');
      }
    } catch (err) {
      formError(err.message);
    }
  }
  function txDetail(id) {
    var _t$dues;
    const t = state.transactions.find(x => x.id === id);
    if (!t) return;
    const r = C.residentById(state, t.residentId);
    openModal('Detail transaksi', `<span class="badge ${t.type === 'in' ? 'badge-ok' : 'badge-red'}">${t.type === 'in' ? 'Pemasukan' : 'Pengeluaran'}</span><div class="detail-amount amount-${t.type}">${t.type === 'in' ? '+' : '−'} ${money(t.amount)}</div><dl class="detail-list"><div><dt>Tanggal</dt><dd>${C.dateLabel(t.date)}</dd></div><div><dt>Kategori</dt><dd>${esc(t.category)}</dd></div><div><dt>Metode</dt><dd>${esc(t.method)}</dd></div><div><dt>Warga</dt><dd>${esc((r === null || r === void 0 ? void 0 : r.name) || '—')}</dd></div>${(_t$dues = t.dues) !== null && _t$dues !== void 0 && _t$dues.length ? `<div style="grid-column:1/-1"><dt>Bulan iuran</dt><dd>${t.dues.map(d => `${C.fundLabel(C.dueKind(d))}: ${C.monthLabel(d.month)} (${money(d.amount)})`).join(' · ')}</dd></div>` : ''}</dl>${t.note ? `<div class="detail-note">${esc(t.note)}</div>` : ''}<div class="form-actions">${can('manage_transactions') ? `<button class="btn btn-secondary" data-action="tx-delete" data-id="${esc(t.id)}">${icon('trash')}Hapus</button><button class="btn btn-primary" data-action="tx-edit" data-id="${esc(t.id)}">${icon('edit')}Edit</button>` : `<button class="btn btn-primary" data-action="close-modal">Tutup</button>`}</div>`, false, 'BUKU KAS');
  }
  function deleteTx(id) {
    if (!need('manage_transactions')) return;
    const t = state.transactions.find(x => x.id === id);
    if (!t) return;
    confirmAction('Hapus transaksi?', `${t.category} ${money(t.amount)} akan dihapus.`, () => {
      if (commit(s => {
        s.transactions = s.transactions.filter(x => x.id !== id);
      }, 'Hapus transaksi', t.id)) {
        closeModal();
        toast('Transaksi dihapus.');
      }
    });
  }

  // ---- Warga ----
  function openResident(id = null) {
    if (!need('manage_residents')) return;
    const r = id ? C.residentById(state, id) : null;
    if (id && !r) return;
    const hasTx = r && state.transactions.some(t => t.residentId === r.id);
    openModal(r ? 'Edit warga' : 'Tambah warga', `<form id="resident-form" data-id="${esc((r === null || r === void 0 ? void 0 : r.id) || '')}"><div class="form-grid"><div class="field full"><label for="resident-name">Nama warga / kepala keluarga</label><input id="resident-name" name="name" value="${esc((r === null || r === void 0 ? void 0 : r.name) || '')}" maxlength="100" required></div><div class="field"><label for="resident-phone">Nomor WhatsApp</label><input id="resident-phone" name="phone" inputmode="tel" value="${esc((r === null || r === void 0 ? void 0 : r.phone) || '')}" placeholder="08xxxxxxxxxx"><small>Untuk pengingat per rumah. Opsional.</small></div><div class="field"><label for="resident-since">Mulai iuran</label><input id="resident-since" name="since" type="month" value="${esc((r === null || r === void 0 ? void 0 : r.since) || state.settings.startMonth)}" required></div><div class="field full"><label class="checkbox-line"><input type="checkbox" name="active" ${!r || r.active ? 'checked' : ''}>Warga aktif</label></div><div class="field full"><label for="resident-note">Catatan / alamat</label><textarea id="resident-note" name="note" maxlength="300">${esc((r === null || r === void 0 ? void 0 : r.note) || '')}</textarea></div></div>${r ? `<div class="info-box">${icon('shield')}QR kartu adalah identitas warga. <button type="button" class="btn btn-secondary btn-sm" data-action="print-card" data-id="${esc(r.id)}">Cetak kartu</button> <button type="button" class="btn btn-secondary btn-sm" data-action="rotate-card" data-id="${esc(r.id)}">Buat QR baru</button></div>` : ''}<div class="form-error" id="form-error"></div><div class="form-actions">${r && !hasTx ? `<button type="button" class="btn btn-secondary" data-action="delete-resident" data-id="${esc(r.id)}">Hapus</button>` : ''}<button type="button" class="btn btn-secondary" data-action="close-modal">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`, false, 'DATA WARGA');
  }
  function submitResident(e) {
    e.preventDefault();
    if (!need('manage_residents')) return;
    const f = e.target,
      fd = new FormData(f),
      name = String(fd.get('name') || '').trim(),
      since = fd.get('since'),
      active = fd.get('active') === 'on',
      note = String(fd.get('note') || '').trim(),
      phone = C.normalizePhone(fd.get('phone'));
    if (!name) return formError('Nama wajib diisi.');
    if (!C.validMonth(since)) return formError('Bulan mulai tidak valid.');
    if (fd.get('phone') && !phone) return formError('Nomor WA tidak valid.');
    if (state.residents.some(r => r.id !== f.dataset.id && r.name.toLowerCase() === name.toLowerCase())) return formError('Nama sudah terdaftar.');
    const old = f.dataset.id ? C.residentById(state, f.dataset.id) : null;
    const r = {
      id: f.dataset.id || C.uid('w'),
      name,
      since,
      active,
      note,
      phone,
      cardToken: (old === null || old === void 0 ? void 0 : old.cardToken) || C.randomToken()
    };
    if (commit(s => {
      const i = s.residents.findIndex(x => x.id === r.id);
      i >= 0 ? s.residents[i] = r : s.residents.push(r);
    }, 'Simpan warga', name)) {
      closeModal();
      toast('Warga tersimpan.');
    }
  }
  function deleteResident(id) {
    if (!need('manage_residents')) return;
    const r = C.residentById(state, id);
    if (!r) return;
    if (state.transactions.some(t => t.residentId === id)) return toast('Warga punya transaksi; nonaktifkan saja.', 'error');
    confirmAction('Hapus warga?', r.name + ' akan dihapus.', () => {
      if (commit(s => {
        s.residents = s.residents.filter(x => x.id !== id);
      }, 'Hapus warga', r.name)) {
        closeModal();
        toast('Warga dihapus.');
      }
    });
  }
  function remindResident(id) {
    const r = C.residentById(state, id);
    if (!r) return;
    const text = C.residentMessage(state, r, C.monthOf(C.today()));
    const url = r.phone ? `https://wa.me/${r.phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    toast(r.phone ? 'Membuka chat warga di WhatsApp.' : 'Pilih kontak/grup di WhatsApp.');
  }
  async function residentJPG(id, mode) {
    const r = C.residentById(state, id);
    if (!r) return;
    try {
      const data = await R.residentJPG(state, id, ui.year);
      const name = `kartu-iuran-${r.name.replace(/[^\w]+/g, '-')}-${ui.year}.jpg`;
      if (mode === 'download') R.download(data, name);else if (mode === 'preview') {
        const img = $('#resident-jpg-preview');
        if (img) {
          img.src = data;
          img.hidden = false;
        }
      } else {
        const shared = await R.shareJPG(data, name, C.residentMessage(state, r, C.monthOf(C.today())));
        toast(shared ? 'JPG dibagikan.' : 'JPG diunduh. Lampirkan di WhatsApp.');
      }
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  // ---- Pengaturan ----
  function openSettings(tab = 'identitas') {
    if (!need('settings')) return;
    ui.settingsTab = tab;
    const s = state.settings,
      o = s.officers;
    const tabs = [['identitas', 'Identitas & pengurus'], ['kas', 'Kas & pembayaran'], ['kategori', 'Kategori'], ['logo', 'Logo'], ['akun', 'Akun login'], ['drive', 'Google Drive'], ['danger', 'Reset data']];
    const pane = (id, html) => `<div class="settings-pane" data-pane="${id}" ${ui.settingsTab === id ? '' : 'hidden'}>${html}</div>`;
    const body = `<div class="settings-tabs">${tabs.map(([id, l]) => `<button data-action="settings-tab" data-tab="${id}" class="${ui.settingsTab === id ? 'active' : ''}">${l}</button>`).join('')}</div><form id="settings-form">${pane('identitas', `<div class="form-grid"><div class="field"><label>RT</label><input name="rt" value="${esc(s.rt)}" maxlength="10" required></div><div class="field"><label>RW</label><input name="rw" value="${esc(s.rw)}" maxlength="10" required></div><div class="field full"><label>Nama lingkungan / desa</label><input name="neighborhood" value="${esc(s.neighborhood)}" maxlength="120"></div><div class="field"><label>Nama Ketua RT</label><input name="ketua" value="${esc(o.ketua)}" maxlength="80"></div><div class="field"><label>Nama Sekretaris</label><input name="sekretaris" value="${esc(o.sekretaris)}" maxlength="80"></div><div class="field"><label>Nama Bendahara 1</label><input name="bendahara1" value="${esc(o.bendahara1)}" maxlength="80"></div><div class="field"><label>Nama Bendahara 2</label><input name="bendahara2" value="${esc(o.bendahara2)}" maxlength="80"></div></div>`)}${pane('kas', `<div class="form-grid"><div class="field full"><label>Iuran bulanan per warga (Rp)</label><input name="monthlyDue" inputmode="numeric" value="${C.number(s.monthlyDue)}"><small>Tarif tunggal untuk iuran baru dan perkiraan tunggakan. Riwayat pembayaran tetap sesuai nominal saat dicatat.</small></div><div class="field"><label>Saldo awal (Rp)</label><input name="openingBalance" inputmode="numeric" value="${C.number(s.openingBalance)}"></div><div class="field full"><label>Bulan mulai pembukuan</label><input name="startMonth" type="month" value="${esc(s.startMonth)}" max="${C.monthOf(C.today())}"></div><div class="field full"><label>Instruksi pembayaran (tampil di pengingat/JPG)</label><textarea name="paymentNote" maxlength="500" placeholder="Contoh: transfer BRI 1234 a.n. Bendahara RT, atau bayar tunai ke Bendahara 1.">${esc(s.paymentNote)}</textarea></div></div>`)}${pane('logo', `<div class="logo-row"><span class="logo-preview">${s.logo ? `<img src="${s.logo}" alt="Logo">` : icon('wallet')}</span><div><button type="button" class="btn btn-secondary btn-sm" data-action="upload-logo">${icon('upload')}Unggah logo</button> ${s.logo ? `<button type="button" class="btn btn-ghost btn-sm" data-action="download-logo">Unduh ikon 512</button> <button type="button" class="btn btn-ghost btn-sm" data-action="remove-logo">Hapus logo</button>` : ''}<p class="form-hint">PNG/JPG/WebP. Dipakai di aplikasi, laporan JPG, dan favicon. Ikon PWA yang sudah terpasang di layar utama mungkin perlu instal ulang karena batasan browser.</p></div></div>`)}${pane('drive', `<div class="field"><label>Google OAuth Client ID</label><input name="googleClientId" value="${esc(s.googleClientId)}" placeholder="xxxx.apps.googleusercontent.com"><small>Buat di Google Cloud Console → Credentials → OAuth client ID (Web). Tambahkan origin HTTPS aplikasi ke Authorized JavaScript origins. Scope: drive.file.</small></div><div class="info-box">${icon('drive')}Cadangan diunggah sebagai file JSON ke Google Drive akun yang menyetujui OAuth. Aplikasi tidak menyimpan password Google Anda.</div><div style="margin-top:12px"><button type="button" class="btn btn-primary" data-action="drive-backup">${icon('drive')}Cadangkan ke Drive sekarang</button></div>`)}<div class="form-error" id="form-error"></div><div class="form-actions" ${['akun', 'danger', 'kategori'].includes(ui.settingsTab) ? 'hidden' : ''}><button type="submit" class="btn btn-primary btn-block">${icon('check')}Simpan pengaturan</button></div></form>
    ${pane('kategori', `<p class="confirm-text" style="font-size:11px">Kategori bawaan tetap ada. Tambahkan kategori sendiri untuk pemasukan atau pengeluaran.</p>${['in', 'out'].map(t => `<div class="settings-section"><h3>${t === 'in' ? 'Pemasukan' : 'Pengeluaran'}</h3><div class="cat-list">${C.allCategories(state, t).map(c => {
      const custom = (s.customCategories[t] || []).includes(c);
      return `<span class="cat-chip">${esc(c)}${custom ? `<button data-action="delete-category" data-type="${t}" data-cat="${esc(c)}" aria-label="Hapus kategori">${icon('x')}</button>` : ''}</span>`;
    }).join('')}</div><div class="search-field" style="max-width:none"><input id="new-cat-${t}" placeholder="Kategori baru…" maxlength="60"><button class="btn btn-soft btn-sm" data-action="add-category" data-type="${t}">Tambah</button></div></div>`).join('')}`)}
    ${pane('akun', `<div class="locked-note">${icon('shield')}Kunci lokal di perangkat. Admin dapat menambah akun dan mengatur ulang password. Jangan bagikan cadangan JSON sembarangan karena berisi hash akun.</div>${state.users.map(u => `<div class="user-row">${avatar(u.name, u.id)}<div><strong>${esc(u.name)} <span class="role-chip">${A.roleLabel(u.role)}</span></strong><small>@${esc(u.username)}${u.mustChange ? ' · wajib ganti password' : ''}</small></div><div class="row-actions"><button class="icon-btn" data-action="reset-user-password" data-id="${esc(u.id)}" title="Atur ulang password">${icon('shield')}</button>${u.id !== user().id ? `<button class="icon-btn danger" data-action="delete-user" data-id="${esc(u.id)}">${icon('trash')}</button>` : ''}</div></div>`).join('')}<button class="btn btn-secondary btn-sm" style="margin-top:12px" data-action="add-user">${icon('plus')}Tambah akun</button>`)}
    ${pane('danger', `<div class="info-box" style="margin-bottom:12px">${icon('shield')}Cadangkan data sebelum reset atau ganti perangkat. <button type="button" class="btn btn-secondary btn-sm" data-action="backup">Unduh JSON</button> <button type="button" class="btn btn-secondary btn-sm" data-action="import">Pulihkan JSON</button></div><div class="danger-zone" style="margin-bottom:12px"><strong>Hapus semua transaksi</strong><p>Warga, identitas, dan akun tetap ada.</p><button class="btn btn-secondary btn-sm" data-action="reset-transactions">Hapus transaksi</button></div><div class="danger-zone"><strong>Kosongkan buku untuk RT baru</strong><p>Menghapus data contoh: warga, transaksi, identitas, logo, kategori tambahan, dan instruksi pembayaran. Akun login tetap ada. Cocok bila template dipakai RT lain.</p><button class="btn btn-danger btn-sm" data-action="reset-all">${icon('trash')}Hapus data contoh / mulai kosong</button></div>`)}`;
    openModal('Pengaturan', body, true, 'PENGATURAN');
  }
  function submitSettings(e) {
    e.preventDefault();
    if (!need('settings')) return;
    const fd = new FormData(e.target),
      due = C.parseAmount(fd.get('monthlyDue')),
      opening = C.parseAmount(fd.get('openingBalance')),
      start = fd.get('startMonth');
    if (!Number.isInteger(due) || !Number.isInteger(opening)) return formError('Nominal tidak valid.');
    if (!C.validMonth(start) || start > C.monthOf(C.today())) return formError('Bulan mulai tidak valid.');
    const settings = {
      ...state.settings,
      rt: String(fd.get('rt')).trim(),
      rw: String(fd.get('rw')).trim(),
      neighborhood: String(fd.get('neighborhood')).trim(),
      monthlyDue: due,
      singleDueMode: true,
      funds: {
        ...state.settings.funds,
        wajib: {
          amount: due
        }
      },
      openingBalance: opening,
      startMonth: start,
      paymentNote: String(fd.get('paymentNote') || '').trim(),
      googleClientId: String(fd.get('googleClientId') || '').trim(),
      onboarded: true,
      officers: {
        ketua: String(fd.get('ketua') || '').trim(),
        sekretaris: String(fd.get('sekretaris') || '').trim(),
        bendahara1: String(fd.get('bendahara1') || '').trim(),
        bendahara2: String(fd.get('bendahara2') || '').trim()
      }
    };
    if (!settings.rt || !settings.rw) return formError('RT/RW wajib diisi.');
    if (commit(s => {
      s.settings = settings;
    }, 'Ubah pengaturan', 'Identitas, pengurus, kas, Drive')) {
      closeModal();
      toast('Pengaturan tersimpan.');
    }
  }
  function addCategory(type) {
    if (!need('categories')) return;
    const input = $('#new-cat-' + type),
      name = ((input === null || input === void 0 ? void 0 : input.value) || '').trim();
    if (!name) return;
    if (C.allCategories(state, type).includes(name)) return toast('Kategori sudah ada.', 'error');
    if (commit(s => {
      s.settings.customCategories[type].push(name);
    }, 'Tambah kategori', name)) openSettings('kategori');
  }
  function deleteCategory(type, cat) {
    if (!need('categories')) return;
    if (state.transactions.some(t => t.type === type && t.category === cat)) return toast('Kategori dipakai transaksi; tidak bisa dihapus.', 'error');
    if (commit(s => {
      s.settings.customCategories[type] = s.settings.customCategories[type].filter(c => c !== cat);
    }, 'Hapus kategori', cat)) openSettings('kategori');
  }
  function uploadLogo(file) {
    if (!need('logo') || !file) return;
    if (!/image\/(png|jpeg|webp)/.test(file.type)) return toast('Gunakan PNG/JPG/WebP.', 'error');
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const cv = document.createElement('canvas');
      const size = 512;
      cv.width = size;
      cv.height = size;
      const ctx = cv.getContext('2d');
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale,
        h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      const data = cv.toDataURL('image/png');
      URL.revokeObjectURL(url);
      if (commit(s => {
        s.settings.logo = data;
      }, 'Ubah logo', 'Logo kustom')) openSettings('logo');
    };
    img.onerror = () => toast('Gagal membaca gambar.', 'error');
    img.src = url;
  }
  function openUserForm(id = null) {
    if (!need('users')) return;
    const u = id ? state.users.find(x => x.id === id) : null;
    openModal(u ? 'Atur ulang password' : 'Tambah akun', `<form id="user-form" data-id="${esc((u === null || u === void 0 ? void 0 : u.id) || '')}"><div class="form-grid">${u ? '' : `<div class="field"><label>Username</label><input name="username" required minlength="3" maxlength="32" pattern="[a-zA-Z0-9._-]+"></div><div class="field"><label>Nama tampil</label><input name="name" required maxlength="80"></div><div class="field full"><label>Role</label><select name="role"><option value="viewer">Hanya lihat</option><option value="bendahara">Bendahara</option><option value="admin">Admin penuh</option></select></div>`}<div class="field full"><label>Password ${u ? 'baru' : 'awal'} (min. 8)</label><input name="password" type="password" minlength="8" required></div></div><div class="form-error" id="form-error"></div><div class="form-actions"><button type="submit" class="btn btn-primary btn-block">Simpan akun</button></div></form>`, false, 'AKUN LOGIN');
  }
  async function submitUser(e) {
    e.preventDefault();
    if (!need('users')) return;
    const f = e.target,
      fd = new FormData(f),
      pw = String(fd.get('password'));
    if (pw.length < 8) return formError('Password minimal 8 karakter.');
    try {
      const salt = A.randomSalt(),
        hash = await A.hash(pw, salt);
      const id = f.dataset.id;
      if (id) {
        if (commit(s => {
          const u = s.users.find(x => x.id === id);
          u.salt = salt;
          u.hash = hash;
          u.mustChange = true;
        }, 'Reset password', id)) {
          closeModal();
          openSettings('akun');
          toast('Password diatur ulang.');
        }
      } else {
        const username = String(fd.get('username')).trim().toLowerCase(),
          name = String(fd.get('name')).trim(),
          role = fd.get('role');
        if (state.users.some(u => u.username === username)) return formError('Username sudah ada.');
        if (commit(s => {
          s.users.push({
            id: C.uid('u'),
            username,
            name,
            role,
            salt,
            hash,
            mustChange: true
          });
        }, 'Tambah akun', username)) {
          closeModal();
          openSettings('akun');
          toast('Akun ditambahkan.');
        }
      }
    } catch (err) {
      formError(err.message);
    }
  }
  function deleteUser(id) {
    if (!need('users')) return;
    const u = state.users.find(x => x.id === id);
    if (!u || u.id === user().id) return;
    if (u.role === 'admin' && state.users.filter(x => x.role === 'admin').length <= 1) return toast('Harus ada minimal satu admin.', 'error');
    confirmAction('Hapus akun?', `${u.username} tidak akan bisa login lagi.`, () => {
      if (commit(s => {
        s.users = s.users.filter(x => x.id !== id);
      }, 'Hapus akun', u.username)) {
        closeModal();
        openSettings('akun');
      }
    });
  }
  function resetTransactions() {
    if (!need('reset')) return;
    confirmAction('Hapus semua transaksi?', 'Semua transaksi dan status iuran dihapus. Warga dan akun tetap ada.', () => {
      if (commit(s => {
        s.transactions = [];
      }, 'Hapus semua transaksi', 'Buku dikosongkan', true)) {
        closeModal();
        toast('Transaksi dihapus.');
      }
    }, {
      typed: 'HAPUS',
      label: 'Hapus transaksi'
    });
  }
  function resetAll() {
    if (!need('reset')) return;
    confirmAction('Kosongkan buku untuk RT baru?', 'Semua data contoh (warga, transaksi, identitas, logo, kategori tambahan, instruksi pembayaran, Client ID Drive) akan dihapus. Akun login tetap ada. Unduh cadangan dulu bila perlu.', () => {
      if (commit(s => {
        s.residents = [];
        s.transactions = [];
        s.settings = {
          ...C.defaultSettings(),
          onboarded: false
        };
      }, 'Reset buku RT baru', 'Data contoh dihapus', true)) {
        closeModal();
        toast('Buku kosong siap dipakai RT lain.');
      }
    }, {
      typed: 'RT BARU',
      label: 'Kosongkan buku'
    });
  }

  // ---- Cadangan & Drive ----
  function download(name, content, type = 'application/json') {
    const blob = new Blob([content], {
      type
    });
    const url = URL.createObjectURL(blob);
    if (window.KasCompat && window.KasCompat.legacyIOS) {
      window.KasCompat.offerFile(url, name);
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function backup() {
    if (!need('backup')) return;
    download(`kaskita-cadangan-${C.today()}.json`, JSON.stringify(state, null, 2));
    toast('Cadangan diunduh.');
  }
  async function driveBackup() {
    if (!need('drive')) return;
    const id = state.settings.googleClientId;
    if (!id) {
      toast('Admin perlu mengisi Google OAuth Client ID di Pengaturan → Google Drive.', 'error');
      if (can('settings')) openSettings('drive');
      return;
    }
    try {
      toast('Meminta izin Google Drive…');
      const res = await D.backup(state, id);
      toast('Cadangan tersimpan di Google Drive: ' + res.name, 'ok', res.webViewLink ? {
        label: 'Buka',
        fn: () => window.open(res.webViewLink, '_blank', 'noopener')
      } : null);
    } catch (e) {
      toast(e.message || 'Gagal mencadangkan ke Drive.', 'error');
    }
  }
  async function importFile(file) {
    if (!need('restore') || !file) return;
    if (file.size > 8 * 1024 * 1024) return toast('Maksimal 8 MB.', 'error');
    try {
      const imported = C.validateState(JSON.parse(await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Gagal membaca file cadangan.'));
        reader.readAsText(file);
      })));
      confirmAction('Pulihkan cadangan?', `Berisi ${imported.residents.length} warga, ${imported.transactions.length} transaksi, ${imported.users.length} akun. Data saat ini DIGANTI.`, () => {
        var _user;
        const me = (_user = user()) === null || _user === void 0 ? void 0 : _user.username;
        if (commit(s => {
          for (const k of Object.keys(s)) delete s[k];
          Object.assign(s, imported);
        }, 'Pulihkan cadangan', file.name, true)) {
          closeModal();
          if (!state.users.some(u => u.username === me)) {
            logout();
          } else toast('Cadangan dipulihkan.');
        }
      }, {
        danger: false,
        label: 'Ganti & pulihkan'
      });
    } catch (err) {
      toast(err instanceof SyntaxError ? 'File JSON tidak valid.' : err.message, 'error');
    }
  }
  function exportCSV() {
    let txs, name;
    if (ui.view === 'transaksi') {
      txs = filteredTx();
      name = `kaskita-transaksi-${ui.txYear}.csv`;
    } else if (ui.view === 'laporan') {
      txs = state.transactions.filter(t => C.monthOf(t.date) === currentMonth());
      name = `kaskita-laporan-${currentMonth()}.csv`;
    } else {
      txs = state.transactions;
      name = 'kaskita-transaksi.csv';
    }
    download(name, C.transactionsCSV(state, txs), 'text/csv;charset=utf-8');
    toast('CSV diunduh.');
  }
  async function copyReport() {
    const text = C.buildReport(state, currentMonth(), ui.reportNames);
    try {
      await navigator.clipboard.writeText(text);
      toast('Laporan disalin.');
    } catch (e) {
      openModal('Salin manual', `<div class="field"><textarea readonly rows="14" id="manual-copy">${esc(text)}</textarea></div>`);
      $('#manual-copy').select();
    }
  }
  function shareWA() {
    const text = C.buildReport(state, currentMonth(), ui.reportNames);
    const a = document.createElement('a');
    a.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    toast('Pilih grup RT di WhatsApp.');
  }
  async function monthlyJPG(mode) {
    try {
      const data = await R.monthlyJPG(state, currentMonth());
      const name = `laporan-kas-${currentMonth()}.jpg`;
      if (mode === 'download') {
        R.download(data, name);
        toast('JPG laporan diunduh.');
      } else {
        const shared = await R.shareJPG(data, name, C.buildReport(state, currentMonth(), ui.reportNames));
        toast(shared ? 'JPG dibagikan.' : 'JPG diunduh. Lampirkan di grup WhatsApp.');
      }
    } catch (e) {
      toast(e.message, 'error');
    }
  }
  function isEmbedded() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  function openExternal() {
    window.open(location.href, '_blank', 'noopener,noreferrer');
  }
  async function installApp() {
    if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
      toast('KasKita sudah berjalan sebagai aplikasi terpasang.');
      return;
    }
    if (deferredInstall) {
      const prompt = deferredInstall;
      deferredInstall = null;
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'accepted') toast('KasKita sedang dipasang di perangkat Anda.');else toast('Instalasi dibatalkan. Anda tetap bisa memakai aplikasi di browser.');
      } catch (e) {
        toast('Gunakan menu Chrome → Instal aplikasi atau Tambahkan ke layar utama.');
      }
      return;
    }
    openModal('Pasang KasKita di HP', `${isEmbedded() ? `<div class="info-box warn">${icon('info')}Anda membuka pratinjau di dalam chat. Buka di tab browser dahulu agar Chrome dapat menampilkan menu instal.</div><button class="btn btn-primary btn-block" data-action="open-external">Buka di tab browser ${icon('arrow-up-right')}</button>` : ''}<ol class="install-steps"><li><span><strong>Android — Chrome:</strong> buka tautan aplikasi, tunggu halaman selesai dimuat, lalu ketuk tombol <strong>Pasang KasKita di HP</strong>. Bila dialog instal belum muncul, buka menu <strong>titik tiga → Instal aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>, kemudian konfirmasi.</span></li><li><span><strong>iPhone — Safari:</strong> buka tautan, tekan <strong>Bagikan → Tambah ke Layar Utama → Tambah</strong>.</span></li><li><span><strong>Setelah terpasang:</strong> buka ikon KasKita di layar utama dan masuk. Buka sekali saat online agar berkas aplikasi tersimpan untuk penggunaan offline.</span></li></ol><div class="info-box">${icon('shield')}Data kas tersimpan di perangkat masing-masing, bukan tertanam dalam index.html. Unduh cadangan sebelum berganti HP atau menghapus data browser.</div><div class="form-actions"><button class="btn btn-primary" data-action="close-modal">Mengerti</button></div>`, false, 'INSTAL PWA');
  }
  function residentFundSummary(r, ry) {
    return `<div class="fund-summary">${C.FUND_TYPES.map(f => {
      const fd = ry.funds[f.id];
      const cur = fd.months.find(x => x.month === currentMonth());
      const status = !cur || !cur.applicable ? 'Belum berlaku' : cur.paid ? 'Lunas bulan ini' : cur.future ? 'Akan datang' : fd.required ? 'Belum bayar' : f.id === 'donasi' ? 'Sukarela' : 'Nominal belum ditetapkan';
      return `<div class="fund-row"><div><strong>${f.label}</strong><small>${status}${fd.required ? ` · ${fd.arrears.length} bulan tertunggak` : ''}</small></div><b>${money(fd.paidTotal)}</b>${can('manage_transactions') ? `<button class="btn btn-soft btn-sm" data-action="pay-fund" data-resident="${esc(r.id)}" data-kind="${f.id}">Catat</button>` : ''}</div>`;
    }).join('')}</div>`;
  }
  function openScanner() {
    openModal('Pindai kartu warga', `<div class="scanner-box"><video id="scanner-video" playsinline muted></video><div class="scanner-frame"></div></div><p id="scanner-status" class="scanner-status">Menyiapkan kamera…</p><div class="share-row"><button class="btn btn-secondary" data-action="scan-switch">${icon('refresh')}Ganti kamera</button><button class="btn btn-secondary" data-action="scan-torch">${icon('eye')}Lampu</button></div><div class="field" style="margin-top:14px"><label for="scanner-manual">Atau tempel isi QR kartu</label><div class="search-field" style="max-width:none"><input id="scanner-manual" placeholder='Tempel isi QR kartu (JSON)'><button class="btn btn-soft btn-sm" data-action="scan-manual">Cari</button></div></div><div class="share-row" style="margin-top:10px"><button class="btn btn-secondary" data-action="scan-image">${icon('image')}Unggah foto kartu</button><button class="btn btn-secondary" data-action="close-modal">Tutup</button></div><div class="info-box">${icon('shield')}Kamera hanya aktif saat dialog ini dibuka dan dimatikan saat ditutup. QR kartu tidak berisi saldo atau nomor rekening.</div>`, false, 'PEINDAI KARTU');
    KasScanner.start($('#scanner-video'), $('#scanner-status'), handleScan);
  }
  function handleScan(text) {
    const res = C.findResidentByCard(state, String(text || '').trim());
    if (!res.ok) {
      const st = $('#scanner-status');
      if (st) {
        st.textContent = res.reason;
        st.dataset.kind = 'error';
      }
      toast(res.reason, 'error');
      return;
    }
    KasScanner.stop();
    closeModal();
    openResidentCard(res.resident.id);
  }
  function openResidentCard(id) {
    const r = C.residentById(state, id);
    if (!r) return;
    const ry = C.residentYear(state, r, ui.year);
    openModal('Kartu warga dikenali', `<div class="resident-top" style="margin-bottom:14px">${avatar(r.name, r.id)}<div><h3>${esc(r.name)}</h3><p>ID ${esc(r.id)} · ${r.active ? 'Aktif' : 'Nonaktif'} · QR valid</p></div></div>${residentFundSummary(r, ry)}<div class="share-actions">${can('manage_transactions') ? `<button class="btn btn-soft btn-block" data-action="annual-pay" data-id="${esc(r.id)}">${icon('check-circle')}Lunas 1 tahun</button>` : ''}<button class="btn btn-primary btn-block" data-action="print-card" data-id="${esc(r.id)}">${icon('download')}PDF kartu iuran</button><button class="btn btn-secondary btn-block" data-action="resident-jpg" data-id="${esc(r.id)}">${icon('image')}Unduh / bagikan JPG kartu</button><button class="btn btn-secondary btn-block" data-action="resident-remind" data-id="${esc(r.id)}">${icon('whatsapp')}Pengingat WhatsApp</button>${can('manage_residents') ? `<button class="btn btn-secondary btn-block" data-action="edit-resident" data-id="${esc(r.id)}">${icon('edit')}Edit warga</button>` : ''}</div>`, false, 'HASIL PINDAI');
  }
  function rotateCard(id) {
    if (!need('manage_residents')) return;
    const r = C.residentById(state, id);
    if (!r) return;
    confirmAction('Buat QR kartu baru?', 'QR pada kartu lama tidak akan berlaku lagi. Cetak ulang kartu setelah membuat QR baru.', () => {
      if (commit(s => {
        C.residentById(s, id).cardToken = C.randomToken();
      }, 'Buat QR kartu baru', r.name)) {
        closeModal();
        toast('QR baru dibuat. Cetak ulang kartu.');
        openResident(id);
      }
    }, {
      danger: false,
      label: 'Buat QR baru'
    });
  }
  function openCardExport(preselect) {
    const all = state.residents;
    if (!all.length) return toast('Belum ada warga. Tambahkan warga terlebih dahulu.', 'error');
    cardExport.ids = new Set(preselect && preselect.length ? preselect : C.activeResidents(state).map(r => r.id));
    cardExport.year = ui.year;
    cardExport.layout = '2up';
    cardExport.query = '';
    cardExport.busy = false;
    renderCardExport();
  }
  function cardExportList() {
    const q = cardExport.query.toLocaleLowerCase('id');
    return state.residents.filter(r => r.name.toLocaleLowerCase('id').includes(q));
  }
  function renderCardExport() {
    const list = cardExportList();
    const body = `<p class="confirm-text" style="margin-bottom:14px">Pilih warga, lalu buat <b>PDF A4</b> langsung. File siap diunduh dan diprint; setiap warga mendapat kartu iuran lengkap dengan QR.</p>
    <div class="form-grid">
      <div class="field"><label for="ce-year">Tahun kartu</label><select id="ce-year">${yearOptions(cardExport.year)}</select></div>
      <div class="field"><label for="ce-layout">Tata letak A4</label><select id="ce-layout"><option value="2up" ${cardExport.layout === '2up' ? 'selected' : ''}>2 kartu per halaman A4 (hemat)</option><option value="4up" ${cardExport.layout === '4up' ? 'selected' : ''}>4 kartu per halaman A4 (2×2, kartu A6)</option><option value="1up" ${cardExport.layout === '1up' ? 'selected' : ''}>1 kartu per halaman A4</option></select></div>
      <div class="field full"><label for="ce-search">Cari warga</label><input id="ce-search" type="search" placeholder="Ketik nama warga…" value="${esc(cardExport.query)}"></div>
    </div>
    <div class="share-row" style="margin:6px 0 10px"><button class="btn btn-soft btn-sm" data-action="ce-all">Pilih semua</button><button class="btn btn-soft btn-sm" data-action="ce-active">Hanya aktif</button><button class="btn btn-secondary btn-sm" data-action="ce-none">Kosongkan</button></div>
    <div class="ce-list" id="ce-list">${list.map(r => `<label class="ce-item"><input type="checkbox" data-resident="${esc(r.id)}" ${cardExport.ids.has(r.id) ? 'checked' : ''}><span class="ce-name">${esc(r.name)}</span><span class="badge ${r.active ? 'badge-ok' : 'badge-muted'}">${r.active ? 'Aktif' : 'Nonaktif'}</span></label>`).join('') || '<p class="td-muted" style="padding:10px">Nama tidak ditemukan.</p>'}</div>
    <p id="ce-count" class="ce-count"></p>
    <div id="ce-progress" class="info-box" hidden></div>
    <div class="form-actions"><button class="btn btn-secondary" data-action="close-modal">Batal</button><button class="btn btn-secondary" data-action="ce-print">${icon('print')}Cetak langsung</button><button class="btn btn-primary" data-action="ce-pdf" id="ce-pdf">${icon('download')}Buat PDF A4</button></div>
    <div class="info-box">${icon('info')}<span>PDF disimpan ke <b>Download/KasKita</b> (Android 10+) atau lokasi yang dipilih (Android 8–9). Print pada kertas A4, skala 100%, lalu potong mengikuti garis putus-putus. Mode <b>4 kartu</b> memakai A4 mendatar (landscape) dengan 4 kartu A6 per halaman.</span></div>`;
    openModal('PDF kartu warga', body, true, 'KARTU IURAN');
    refreshCardExportCount();
  }
  function refreshCardExportCount() {
    const n = cardExport.ids.size,
      per = cardExport.layout === '4up' ? 4 : cardExport.layout === '2up' ? 2 : 1,
      pages = Math.ceil(n / per);
    const el = $('#ce-count');
    if (el) el.textContent = n + ' warga dipilih · ' + pages + ' halaman A4';
    const btn = $('#ce-pdf');
    if (btn) btn.disabled = !n || cardExport.busy;
  }
  async function makeCardPDF() {
    if (cardExport.busy) return;
    const ids = state.residents.filter(r => cardExport.ids.has(r.id)).map(r => r.id);
    if (!ids.length) return toast('Pilih minimal satu warga.', 'error');
    cardExport.busy = true;
    refreshCardExportCount();
    const prog = $('#ce-progress');
    if (prog) {
      prog.hidden = false;
      prog.textContent = 'Menyiapkan PDF…';
    }
    try {
      const data = await KasCards.cardsPDF(state, ids, cardExport.year, {
        layout: cardExport.layout,
        onProgress: (i, n, name) => {
          if (prog) prog.textContent = 'Membuat kartu ' + i + '/' + n + ': ' + name + '…';
        }
      });
      const rt = String(state.settings.rt || 'RT').replace(/[^\w]+/g, '');
      const name = 'kartu-iuran-rt' + rt + '-' + cardExport.year + '-' + ids.length + 'warga.pdf';
      R.download(data, name);
      toast('PDF A4 dibuat: ' + ids.length + ' kartu, ' + Math.ceil(ids.length / (cardExport.layout === '4up' ? 4 : cardExport.layout === '2up' ? 2 : 1)) + ' halaman.');
      if (prog) prog.textContent = 'Selesai. File PDF sedang diunduh/disimpan.';
    } catch (e) {
      toast(e.message || 'Gagal membuat PDF.', 'error');
      if (prog) prog.textContent = 'Gagal: ' + (e.message || 'coba lagi.');
    } finally {
      cardExport.busy = false;
      refreshCardExportCount();
    }
  }
  function printSelectedCards() {
    const ids = state.residents.filter(r => cardExport.ids.has(r.id)).map(r => r.id);
    if (!ids.length) return toast('Pilih minimal satu warga.', 'error');
    try {
      KasCards.printCards(state, ids, cardExport.year);
    } catch (e) {
      toast(e.message, 'error');
    }
  }
  function openAnnualPay(id) {
    if (!need('manage_transactions')) return;
    const r = C.residentById(state, id);
    if (!r) return;
    const year = ui.year;
    const ys = [...new Set([...years(), year, year + 1])].sort((a, b) => b - a);
    const kinds = ['wajib'];
    const rows = kinds.map(k => {
      const amt = C.fundAmount(state, k);
      return `<label class="annual-fund"><input type="checkbox" name="kind" value="${k}" checked hidden><span class="annual-fund-name">${esc(C.fundLabel(k))}</span><span class="annual-fund-input"><input name="amount-${k}" inputmode="numeric" value="${amt ? C.number(amt) : ''}" readonly placeholder="Nominal/bulan" aria-label="Nominal ${esc(C.fundLabel(k))} per bulan"></span></label>`;
    }).join('');
    openModal('Lunas 1 tahun', `<form id="annual-form" data-resident="${esc(r.id)}"><div class="resident-top" style="margin-bottom:14px">${avatar(r.name, r.id)}<div><h3>${esc(r.name)}</h3><p>Bayar sekaligus sampai lunas satu tahun. Bulan yang sudah dibayar otomatis dilewati.</p></div></div><div class="form-grid"><div class="field"><label for="annual-year">Tahun iuran</label><select id="annual-year" name="year">${ys.map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`).join('')}</select></div><div class="field"><label for="annual-date">Tanggal bayar</label><input id="annual-date" name="date" type="date" value="${C.today()}" max="${C.today()}" min="2000-01-01" required></div><div class="field"><label for="annual-method">Metode</label><select id="annual-method" name="method">${C.METHODS.map(m => `<option>${m}</option>`).join('')}</select></div><div class="field"><label for="annual-note">Catatan</label><input id="annual-note" name="note" maxlength="200" placeholder="Opsional"></div><div class="field full"><span class="field-label">Iuran bulanan</span>${rows}<small>Nominal mengikuti Pengaturan → Kas & pembayaran.</small></div></div><div id="annual-summary" class="info-box"></div><div class="form-error" id="form-error"></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-modal">Batal</button><button type="submit" class="btn btn-primary" id="annual-submit">${icon('check-circle')}Simpan pelunasan</button></div></form>`, false, 'IURAN WARGA');
    updateAnnualSummary();
  }
  function annualPlanFromForm() {
    const f = $('#annual-form');
    if (!f) return null;
    const year = +f.elements.year.value,
      residentId = f.dataset.resident;
    const items = [];
    let total = 0;
    const errors = [];
    for (const kind of ['wajib']) {
      const cb = f.querySelector(`input[name="kind"][value="${kind}"]`);
      if (!cb || !cb.checked) continue;
      const amount = C.parseAmount(f.elements['amount-' + kind].value);
      if (!Number.isInteger(amount) || amount < 1) {
        errors.push(C.fundLabel(kind) + ': isi nominal per bulan lebih dari 0.');
        continue;
      }
      const months = C.unpaidMonths(state, residentId, year, kind);
      if (!months.length) {
        items.push({
          kind,
          amount,
          months: [],
          total: 0,
          already: true
        });
        continue;
      }
      const sub = amount * months.length;
      items.push({
        kind,
        amount,
        months,
        total: sub
      });
      total += sub;
    }
    return {
      residentId,
      year,
      date: f.elements.date.value,
      method: f.elements.method.value,
      note: f.elements.note.value.trim(),
      items,
      total,
      errors
    };
  }
  function updateAnnualSummary() {
    const plan = annualPlanFromForm();
    const el = $('#annual-summary');
    const btn = $('#annual-submit');
    if (!plan || !el) return;
    const lines = plan.items.map(it => it.already ? `<div>${esc(C.fundLabel(it.kind))}: <b>sudah lunas ${plan.year}</b>, dilewati.</div>` : `<div>${esc(C.fundLabel(it.kind))}: ${it.months.length} bulan × ${money(it.amount)} = <b>${money(it.total)}</b></div>`).join('');
    const err = plan.errors.length ? `<div class="amount-out">${plan.errors.map(esc).join('<br>')}</div>` : '';
    el.innerHTML = (lines || '<div>Pilih minimal satu jenis kas.</div>') + err + `<div style="margin-top:6px">Total: <b>${money(plan.total)}</b></div>`;
    if (btn) btn.disabled = !!plan.errors.length || plan.total <= 0;
  }
  function submitAnnual(e) {
    e.preventDefault();
    if (!need('manage_transactions')) return;
    const plan = annualPlanFromForm();
    if (!plan) return;
    if (plan.errors.length) return formError(plan.errors.join(' '));
    const payable = plan.items.filter(it => it.months.length);
    if (!payable.length) return formError('Tidak ada bulan yang perlu dibayar. Jenis kas terpilih sudah lunas atau belum dipilih.');
    if (!C.validDate(plan.date)) return formError('Tanggal bayar tidak valid.');
    const r = C.residentById(state, plan.residentId);
    if (!r) return;
    const now = new Date().toISOString();
    const txs = payable.map(it => ({
      id: C.uid('t'),
      type: 'in',
      date: plan.date,
      amount: it.total,
      category: 'Iuran warga',
      residentId: r.id,
      dues: it.months.map(m => ({
        month: m,
        kind: it.kind,
        amount: it.amount
      })),
      method: plan.method,
      note: plan.note || `Lunas 1 tahun ${plan.year} - ${C.fundLabel(it.kind)}`,
      createdAt: now,
      updatedAt: now
    }));
    if (commit(s => {
      s.transactions.push(...txs);
    }, 'Pelunasan tahunan', `${r.name} ${plan.year} ${money(plan.total)}`)) {
      closeModal();
      toast(`Pelunasan ${r.name} ${plan.year} tersimpan: ${txs.length} transaksi, ${money(plan.total)}.`);
    }
  }
  async function scanImage(file) {
    if (!file) return;
    try {
      const text = await KasScanner.scanImageFile(file);
      if (text) handleScan(text);else {
        const st = $('#scanner-status');
        if (st) {
          st.textContent = 'QR tidak terbaca pada gambar. Coba foto lebih jelas atau input manual.';
          st.dataset.kind = 'error';
        }
      }
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  // ---- Events ----
  document.addEventListener('click', e => {
    var _$2;
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const a = el.dataset.action,
      id = el.dataset.id;
    switch (a) {
      case 'add':
      case 'add-in':
      case 'add-out':
      case 'add-dues':
        openTx(null, {
          type: a === 'add-out' ? 'out' : 'in'
        });
        break;
      case 'settings':
        openSettings();
        break;
      case 'settings-tab':
        openSettings(el.dataset.tab);
        break;
      case 'close-modal':
        closeModal();
        break;
      case 'dismiss-onboarding':
        commit(s => {
          s.settings.onboarded = true;
        }, 'Tutup petunjuk', '');
        break;
      case 'tx-detail':
        txDetail(id);
        break;
      case 'tx-edit':
        openTx(id);
        break;
      case 'tx-delete':
        deleteTx(id);
        break;
      case 'pay-due':
        openTx(null, {
          type: 'in',
          residentId: el.dataset.resident,
          month: el.dataset.month,
          fund: el.dataset.fund || 'wajib'
        });
        break;
      case 'resident-pay':
        {
          const r = C.residentById(state, id);
          const ar = C.arrears(state, r, C.monthOf(C.today()));
          openTx(null, {
            type: 'in',
            residentId: id,
            month: ar[0] || C.monthOf(C.today())
          });
          break;
        }
      case 'scan':
        openScanner();
        break;
      case 'scan-switch':
        KasScanner.switchCamera();
        break;
      case 'scan-torch':
        KasScanner.toggleTorch();
        break;
      case 'scan-manual':
        handleScan(((_$2 = $('#scanner-manual')) === null || _$2 === void 0 ? void 0 : _$2.value) || '');
        break;
      case 'scan-image':
        $('#scan-image-file').click();
        break;
      case 'pay-fund':
        openTx(null, {
          type: 'in',
          residentId: el.dataset.resident,
          fund: el.dataset.kind,
          month: currentMonth()
        });
        break;
      case 'annual-pay':
        openAnnualPay(id);
        break;
      case 'iuran-fund':
        ui.iuranFund = el.dataset.fund;
        render();
        break;
      case 'print-card':
        openCardExport(id ? [id] : null);
        break;
      case 'print-all-cards':
        openCardExport();
        break;
      case 'ce-all':
        state.residents.forEach(r => cardExport.ids.add(r.id));
        renderCardExport();
        break;
      case 'ce-active':
        cardExport.ids = new Set(C.activeResidents(state).map(r => r.id));
        renderCardExport();
        break;
      case 'ce-none':
        cardExport.ids = new Set();
        renderCardExport();
        break;
      case 'ce-pdf':
        makeCardPDF();
        break;
      case 'ce-print':
        printSelectedCards();
        break;
      case 'rotate-card':
        rotateCard(id);
        break;
      case 'resident-remind':
        remindResident(id);
        break;
      case 'resident-jpg':
        residentJPG(id, 'share');
        break;
      case 'add-resident':
        openResident();
        break;
      case 'edit-resident':
        openResident(id);
        break;
      case 'delete-resident':
        deleteResident(id);
        break;
      case 'tx-type':
        {
          var _$3;
          const f = $('#tx-form'),
            nt = el.dataset.type;
          if (f.elements.type.value === nt) break;
          const draft = {
            type: nt,
            date: f.elements.date.value,
            method: f.elements.method.value,
            category: nt === 'in' ? 'Iuran warga' : C.allCategories(state, 'out')[0],
            amount: C.parseAmount(f.elements.amount.value) || '',
            residentId: f.elements.residentId.value,
            dues: $$('input[name="dueMonth"]:checked', f).map(i => ({
              month: i.value,
              amount: C.parseAmount($('#dues-nominal').value) || state.settings.monthlyDue
            })),
            note: f.elements.note.value,
            id: f.dataset.id,
            fund: ((_$3 = $('#tx-fund')) === null || _$3 === void 0 ? void 0 : _$3.value) || 'wajib'
          };
          if (!draft.dues.length) draft.dues = [{
            month: currentMonth(),
            kind: draft.fund,
            amount: C.fundAmount(state, draft.fund) || 0
          }];
          openTxForm(draft, f.dataset.new === 'true', +$('#dues-form-year').value);
          break;
        }
      case 'filter-type':
        ui.txType = el.dataset.type;
        ui.txPage = 1;
        render();
        break;
      case 'clear-filters':
        ui.txType = 'all';
        ui.txQuery = '';
        ui.txMonth = 'all';
        render();
        break;
      case 'page-prev':
        ui.txPage--;
        render();
        break;
      case 'page-next':
        ui.txPage++;
        render();
        break;
      case 'go-report':
        navigate('laporan');
        break;
      case 'report-mode':
        ui.reportMode = el.dataset.mode;
        render();
        break;
      case 'backup':
        backup();
        break;
      case 'import':
        if (need('restore')) $('#import-file').click();
        break;
      case 'drive-backup':
        driveBackup();
        break;
      case 'reset-transactions':
        resetTransactions();
        break;
      case 'reset-all':
        resetAll();
        break;
      case 'raw-backup':
        if (corruptRaw) download('kaskita-data-mentah.txt', corruptRaw, 'text/plain');
        break;
      case 'export-csv':
        exportCSV();
        break;
      case 'copy-report':
        copyReport();
        break;
      case 'share-wa':
        shareWA();
        break;
      case 'print':
        window.print();
        break;
      case 'jpg-monthly-share':
        monthlyJPG('share');
        break;
      case 'jpg-monthly-download':
        monthlyJPG('download');
        break;
      case 'jpg-resident-share':
        residentJPG(id, 'share');
        break;
      case 'jpg-resident-download':
        residentJPG(id, 'download');
        break;
      case 'jpg-resident-preview':
        residentJPG(id, 'preview');
        break;
      case 'add-category':
        addCategory(el.dataset.type);
        break;
      case 'delete-category':
        deleteCategory(el.dataset.type, el.dataset.cat);
        break;
      case 'upload-logo':
        if (need('logo')) $('#logo-file').click();
        break;
      case 'remove-logo':
        if (need('logo') && commit(s => {
          s.settings.logo = '';
        }, 'Hapus logo', '')) openSettings('logo');
        break;
      case 'download-logo':
        if (state.settings.logo) R.download(state.settings.logo, 'logo-rt-512.png');
        break;
      case 'add-user':
        openUserForm();
        break;
      case 'reset-user-password':
        openUserForm(id);
        break;
      case 'delete-user':
        deleteUser(id);
        break;
      case 'account-menu':
        openAccountMenu();
        break;
      case 'go-warga':
        closeModal();
        navigate('warga');
        break;
      case 'about':
        openAbout();
        break;
      case 'change-password':
        openChangePassword(false);
        break;
      case 'logout':
        logout();
        break;
      case 'install':
        installApp();
        break;
      case 'open-external':
        openExternal();
        break;
      case 'zoom-reference':
        el.classList.toggle('zoomed');
        break;
      case 'search':
        navigate('transaksi');
        focusAfter('tx-search');
        break;
      case 'confirm-ok':
        {
          var _$4;
          if (!pendingConfirm) break;
          const p = pendingConfirm;
          if (p.typed && ((_$4 = $('#confirm-typed')) === null || _$4 === void 0 ? void 0 : _$4.value.trim()) !== p.typed) {
            $('#confirm-error').textContent = `Ketik ${p.typed}.`;
            break;
          }
          p.fn();
          break;
        }
    }
  });
  document.addEventListener('submit', e => {
    if (e.target.id === 'login-form') submitLogin(e);else if (e.target.id === 'password-form') submitPassword(e);else if (e.target.id === 'tx-form') submitTx(e);else if (e.target.id === 'resident-form') submitResident(e);else if (e.target.id === 'settings-form') submitSettings(e);else if (e.target.id === 'annual-form') submitAnnual(e);else if (e.target.id === 'user-form') submitUser(e);
  });
  document.addEventListener('change', e => {
    const id = e.target.id;
    if (id === 'period-month') {
      ui.month = +e.target.value;
      render();
    } else if (id === 'period-year') {
      ui.year = +e.target.value;
      render();
    } else if (id === 'tx-month') {
      ui.txMonth = e.target.value;
      ui.txPage = 1;
      render();
    } else if (id === 'tx-year') {
      ui.txYear = +e.target.value;
      ui.txPage = 1;
      render();
    } else if (id === 'dues-status') {
      ui.duesStatus = e.target.value;
      render();
    } else if (id === 'report-names') {
      ui.reportNames = e.target.checked;
      render();
    } else if (id === 'report-resident') {
      ui.reportResident = e.target.value;
      render();
    } else if (id === 'tx-category') {
      const dues = e.target.value === 'Iuran warga';
      $('#dues-fields').hidden = !dues;
      $('#tx-amount').readOnly = dues;
      if (dues) updateDuesAmount();else {
        $('#tx-amount').value = '';
        $('#amount-hint').textContent = 'Contoh 30.000.';
      }
    } else if (id === 'tx-fund') {
      const fund = e.target.value;
      const amt = C.fundAmount(state, fund);
      $('#dues-nominal').value = amt ? C.number(amt) : '';
      refreshMonthChecks();
    } else if (id === 'tx-resident' || id === 'dues-form-year') refreshMonthChecks();else if (e.target.name === 'dueMonth') updateDuesAmount();else if (id === 'import-file') {
      const f = e.target.files[0];
      e.target.value = '';
      importFile(f);
    } else if (id === 'logo-file') {
      const f = e.target.files[0];
      e.target.value = '';
      uploadLogo(f);
    } else if (id === 'scan-image-file') {
      const f = e.target.files[0];
      e.target.value = '';
      scanImage(f);
    } else if (id === 'ce-year') {
      cardExport.year = +e.target.value;
    } else if (id === 'ce-layout') {
      cardExport.layout = e.target.value;
      refreshCardExportCount();
    } else if (e.target.matches('#ce-list input[type=checkbox]')) {
      const id = e.target.dataset.resident;
      if (e.target.checked) cardExport.ids.add(id);else cardExport.ids.delete(id);
      refreshCardExportCount();
    } else if (e.target.closest('#annual-form')) updateAnnualSummary();
  });
  document.addEventListener('input', e => {
    const id = e.target.id;
    if (id === 'global-search') {
      ui.txQuery = e.target.value;
      ui.txPage = 1;
      if (ui.view !== 'transaksi') {
        ui.view = 'transaksi';
        history.replaceState(null, '', '#transaksi');
      }
      render();
    } else if (id === 'tx-search') {
      ui.txQuery = e.target.value;
      ui.txPage = 1;
      render();
      focusAfter('tx-search');
    } else if (id === 'dues-search') {
      ui.duesQuery = e.target.value;
      render();
      focusAfter('dues-search');
    } else if (id === 'resident-search') {
      ui.residentQuery = e.target.value;
      render();
      focusAfter('resident-search');
    } else if (id === 'ce-search') {
      cardExport.query = e.target.value;
      const list = cardExportList();
      $('#ce-list').innerHTML = list.map(r => `<label class="ce-item"><input type="checkbox" data-resident="${esc(r.id)}" ${cardExport.ids.has(r.id) ? 'checked' : ''}><span class="ce-name">${esc(r.name)}</span><span class="badge ${r.active ? 'badge-ok' : 'badge-muted'}">${r.active ? 'Aktif' : 'Nonaktif'}</span></label>`).join('') || '<p class="td-muted" style="padding:10px">Nama tidak ditemukan.</p>';
    } else if (e.target.closest('#annual-form')) updateAnnualSummary();else if (id === 'dues-nominal') updateDuesAmount();else if (['tx-amount'].includes(id)) {
      const n = C.parseAmount(e.target.value);
      if (Number.isInteger(n)) e.target.value = C.number(n);
    }
  });
  $('#modal').addEventListener('click', e => {
    if (e.target === $('#modal')) {
      const r = $('#modal').getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal();
    }
  });
  $('#modal').addEventListener('cancel', e => {
    if (forcedPassword) {
      e.preventDefault();
      logout();
    } else {
      if (window.KasScanner) KasScanner.stop();
      pendingConfirm = null;
    }
  });
  window.addEventListener('hashchange', syncRoute);
  window.addEventListener('popstate', syncRoute);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-view]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(a.dataset.view);
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !$('#modal').open && user() && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (innerWidth <= 1200) {
        navigate('transaksi');
        focusAfter('tx-search');
      } else $('#global-search').focus();
    }
  });
  window.addEventListener('storage', e => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      state = C.validateState(JSON.parse(e.newValue));
      if (!user()) {
        showLogin();
        return;
      }
      if ($('#modal').open) closeModal();
      render();
      toast('Data diperbarui dari tab lain.');
    } catch (_) {}
  });
  function connection() {
    const el = $('#connection-text');
    if (el) el.textContent = navigator.onLine ? 'Siap offline · Drive butuh internet' : 'Mode offline aktif';
  }
  addEventListener('online', connection);
  addEventListener('offline', connection);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.KasScanner) KasScanner.stop();
  });
  addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstall = e;
  });
  addEventListener('appinstalled', () => {
    deferredInstall = null;
    toast('KasKita berhasil dipasang. Buka ikonnya di layar utama.');
  });
  if ('serviceWorker' in navigator) addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      const el = $('#connection-text');
      if (el) el.textContent = 'Cache offline belum aktif';
    });
  });
  $('#login-open-external').hidden = !isEmbedded();
  hydrate();
  connection();
  if (user() && !user().mustChange) enterApp();else if (user() && user().mustChange) {
    showLogin();
    openChangePassword(true);
  } else showLogin();
})();
