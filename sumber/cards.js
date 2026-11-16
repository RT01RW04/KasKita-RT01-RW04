/* KasKita — kartu iuran warga dengan QR identitas (bukan QRIS). */
(function (root) {
  'use strict';
  const C = root.KasCore;
  const esc = C.esc;
  function matrix(payload) {
    if (typeof root.qrcode !== 'function') throw new Error('Pustaka QR belum dimuat.');
    const qr = root.qrcode(0, 'M');
    qr.addData(String(payload)); qr.make();
    const n = qr.getModuleCount();
    return { n, dark: (r, c) => qr.isDark(r, c) };
  }
  function qrSVG(payload, margin = 2) {
    const m = matrix(payload), size = m.n + margin * 2; let path = '';
    for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (m.dark(r, c)) path += `M${c + margin} ${r + margin}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="QR identitas kartu warga"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#10241d"/></svg>`;
  }
  function cellText(state, resident, yearData, kind, mo) {
    const x = yearData.funds[kind].months.find(x => x.month === mo);
    if (!x) return '';
    if (x.paid) return C.compact(x.amount);
    if (!x.applicable || x.future) return '–';
    return '';
  }
  function cardHTML(state, resident, year) {
    const y = C.residentYear(state, resident, year);
    const logo = state.settings.logo ? `<img class="kc-logo" src="${state.settings.logo}" alt="Logo RT">` : `<span class="kc-logo kc-logo-fallback">RT</span>`;
    const head = C.MONTHS.map((_, i) => `<th>${C.SHORT[i][0]}</th>`).join('');
    const rows = C.FUND_TYPES.map(f => {
      const fd = y.funds[f.id];
      const cells = fd.months.map(mo => `<td class="${mo.paid ? 'kc-paid' : ''}">${esc(cellText(state, resident, y, f.id, mo.month))}</td>`).join('');
      const due = f.id === 'donasi' ? 'Sukarela' : fd.amount > 0 ? C.money(fd.amount) + '/bln' : 'Sesuai kesepakatan';
      return `<tr><th>${esc(f.label)}<small>${esc(due)}</small></th>${cells}<td class="kc-total">${esc(C.compact(fd.paidTotal))}</td></tr>`;
    }).join('');
    return `<article class="kas-card" data-resident="${esc(resident.id)}">
      <header class="kc-head">${logo}<div><strong>Kartu Iuran Warga</strong><span>${esc(C.rtTitle(state))}</span></div><b>${year}</b></header>
      <div class="kc-body">
        <aside class="kc-identity"><h3>${esc(resident.name)}</h3><p>ID warga: ${esc(resident.id)}<br>Mulai: ${esc(C.monthLabel(resident.since, true))}<br>Status: ${resident.active ? 'Aktif' : 'Nonaktif'}</p><div class="kc-qr">${qrSVG(C.cardPayload(state, resident))}</div><small>Pindai dengan aplikasi KasKita.<br>QR identitas, bukan QRIS pembayaran.</small></aside>
        <section class="kc-table"><table><colgroup><col class="kc-col-fund"><col span="12"><col class="kc-col-total"></colgroup><thead><tr><th>Iuran</th>${head}<th>Total</th></tr></thead><tbody>${rows}</tbody></table><div class="kc-legend">Angka dalam ribuan rupiah. Sel kosong = belum ada pembayaran; – = belum berlaku/akan datang.</div><div class="kc-note">${esc(state.settings.paymentNote || 'Simpan kartu ini dan tunjukkan kepada petugas saat pembayaran.')}</div></section>
      </div>
      <footer class="kc-foot"><span>Dicetak ${esc(C.dateLabel(C.today()))}</span><span>Bendahara: ${esc(state.settings.officers.bendahara1 || state.settings.officers.bendahara2 || '________________')}</span><span>KasKita</span></footer>
    </article>`;
  }
  function printCards(state, ids, year) {
    const list = ids.map(id => C.residentById(state, id)).filter(Boolean);
    if (!list.length) throw new Error('Tidak ada warga untuk dicetak.');
    let rootEl = document.getElementById('card-print-root');
    if (!rootEl) { rootEl = document.createElement('div'); rootEl.id = 'card-print-root'; document.body.appendChild(rootEl); }
    rootEl.innerHTML = list.map(r => cardHTML(state, r, year)).join('');
    document.body.classList.add('print-cards');
    const cleanup = () => { document.body.classList.remove('print-cards'); window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, document.documentElement.classList.contains('native-android') ? 60000 : 2000);
  }
  function loadImage(src) { return new Promise(resolve => { if (!src) return resolve(null); const i = new Image(); i.onload = () => resolve(i); i.onerror = () => resolve(null); i.src = src; }); }
  function drawQR(ctx, payload, x, y, size) {
    const m = matrix(payload), margin = 2, total = m.n + margin * 2, cell = size / total;
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#10241d';
    for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (m.dark(r, c)) ctx.fillRect(x + (c + margin) * cell, y + (r + margin) * cell, Math.ceil(cell), Math.ceil(cell));
  }
  function txt(ctx, s, x, y, size = 24, weight = 500, color = '#173b30', align = 'left', max = null) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px "Plus Jakarta Sans", system-ui, sans-serif`; ctx.textAlign = align;
    let str = String(s ?? ''); if (max) while (ctx.measureText(str).width > max && str.length > 3) str = str.slice(0, -4) + '…';
    ctx.fillText(str, x, y);
  }
  async function cardJPG(state, residentId, year) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const r = C.residentById(state, residentId); if (!r) throw new Error('Warga tidak ditemukan.');
    const y = C.residentYear(state, r, year), logo = await loadImage(state.settings.logo);
    const W = 1600, H = 1130, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    ctx.fillStyle = '#f4f6f5'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#087764'; ctx.fillRect(0, 0, W, 170);
    if (logo) { ctx.save(); ctx.beginPath(); ctx.rect(50, 40, 90, 90); ctx.clip(); ctx.drawImage(logo, 50, 40, 90, 90); ctx.restore(); }
    else { ctx.fillStyle = '#d9ef9e'; ctx.fillRect(50, 40, 90, 90); txt(ctx, 'RT', 95, 98, 36, 800, '#0e2f29', 'center'); }
    txt(ctx, 'Kartu Iuran Warga', 165, 82, 38, 800, '#fff');
    txt(ctx, C.rtTitle(state), 165, 124, 24, 600, '#cfe8df', 'left', W - 320);
    txt(ctx, String(year), W - 60, 105, 46, 800, '#d9ef9e', 'right');
    txt(ctx, r.name, 60, 250, 40, 800, '#173b30', 'left', 360);
    txt(ctx, `ID warga: ${r.id}`, 60, 292, 22, 500, '#6f7f77');
    txt(ctx, `Mulai ${C.monthLabel(r.since, true)} · ${r.active ? 'Aktif' : 'Nonaktif'}`, 60, 326, 22, 500, '#6f7f77', 'left', 360);
    drawQR(ctx, C.cardPayload(state, r), 60, 360, 300);
    txt(ctx, 'Pindai dengan KasKita', 210, 700, 22, 700, '#087764', 'center');
    txt(ctx, 'QR identitas warga,', 210, 732, 19, 500, '#6f7f77', 'center');
    txt(ctx, 'bukan QRIS pembayaran.', 210, 760, 19, 500, '#6f7f77', 'center');
    const tx = 430, tw = W - tx - 60, first = 210, cw = (tw - first) / 13;
    txt(ctx, 'Iuran', tx, 250, 22, 800, '#087764');
    C.SHORT.forEach((s, i) => txt(ctx, s[0], tx + first + i * cw + cw / 2, 250, 20, 800, '#087764', 'center'));
    txt(ctx, 'Total', tx + tw, 250, 20, 800, '#087764', 'right');
    let yy = 285;
    for (const f of C.FUND_TYPES) {
      const fd = y.funds[f.id];
      ctx.strokeStyle = '#e3ebe6'; ctx.beginPath(); ctx.moveTo(tx, yy); ctx.lineTo(tx + tw, yy); ctx.stroke();
      txt(ctx, f.label, tx, yy + 38, 23, 800);
      const due = f.id === 'donasi' ? 'Sukarela' : fd.amount > 0 ? C.money(fd.amount) + '/bln' : 'Sesuai kesepakatan';
      txt(ctx, due, tx, yy + 66, 17, 500, '#6f7f77', 'left', first - 10);
      fd.months.forEach((mo, i) => { const cx = tx + first + i * cw + cw / 2; const val = cellText(state, r, y, f.id, mo.month); txt(ctx, val || (mo.paid ? '✓' : ''), cx, yy + 48, 20, 700, mo.paid ? '#087764' : '#9aa69f', 'center'); });
      txt(ctx, C.compact(fd.paidTotal), tx + tw, yy + 48, 21, 800, '#087764', 'right');
      yy += 92;
    }
    ctx.strokeStyle = '#e3ebe6'; ctx.beginPath(); ctx.moveTo(tx, yy); ctx.lineTo(tx + tw, yy); ctx.stroke();
    txt(ctx, 'Angka dalam ribuan rupiah. Sel kosong = belum ada pembayaran; – = belum berlaku/akan datang.', tx, yy + 36, 18, 500, '#6f7f77', 'left', tw);

    const note = state.settings.paymentNote || 'Simpan kartu ini dan tunjukkan kepada petugas saat pembayaran.';
    txt(ctx, note, tx, yy + 110, 20, 600, '#42584d', 'left', tw);
    ctx.strokeStyle = '#e3ebe6'; ctx.beginPath(); ctx.moveTo(60, H - 150); ctx.lineTo(W - 60, H - 150); ctx.stroke();
    txt(ctx, `Dicetak ${C.dateLabel(C.today())}`, 60, H - 100, 20, 500, '#6f7f77');
    txt(ctx, `Bendahara: ${state.settings.officers.bendahara1 || state.settings.officers.bendahara2 || '________________'}`, W / 2, H - 100, 20, 600, '#42584d', 'center');
    txt(ctx, 'KasKita', W - 60, H - 100, 20, 800, '#087764', 'right');
    return cv.toDataURL('image/jpeg', 0.93);
  }
  function dataURLBytes(dataUrl) {
    const b64 = String(dataUrl).split(',')[1] || '';
    const bin = atob(b64); const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // PDF A4 langsung (tanpa dialog cetak). layout: '2up' (2 kartu/A4) atau '1up' (1 kartu/A4).
  async function cardsPDF(state, ids, year, opts = {}) {
    const lib = root.PDFLib;
    if (!lib || !lib.PDFDocument) throw new Error('Pustaka PDF belum dimuat. Tutup lalu buka kembali aplikasi.');
    const list = ids.map(id => C.residentById(state, id)).filter(Boolean);
    if (!list.length) throw new Error('Pilih minimal satu warga untuk membuat PDF.');
    const layout = ['1up','2up','4up'].includes(opts.layout) ? opts.layout : '2up';
    const onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : null;
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const doc = await lib.PDFDocument.create();
    doc.setTitle('Kartu Iuran Warga ' + C.rtTitle(state) + ' ' + year);
    doc.setAuthor('KasKita - BolangCorp');
    doc.setCreator('KasKita');
    doc.setProducer('KasKita');
    doc.setCreationDate(new Date());
    const font = await doc.embedFont(lib.StandardFonts.Helvetica);
    const mm = 72 / 25.4;
    const PW = layout === '4up' ? 297 * mm : 210 * mm;
    const PH = layout === '4up' ? 210 * mm : 297 * mm;
    const CW = 148 * mm, CH = 104 * mm, GAP = 12 * mm;
    const cut = lib.rgb(0.62, 0.70, 0.66), grey = lib.rgb(0.45, 0.52, 0.49);
    const perPage = layout === '4up' ? 4 : layout === '2up' ? 2 : 1;
    const total = Math.ceil(list.length / perPage);
    let page = null;
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      if (onProgress) onProgress(i + 1, list.length, r.name);
      const jpg = await cardJPG(state, r.id, year);
      const img = await doc.embedJpg(dataURLBytes(jpg));
      let x, y;
      if (layout === '4up') {
        const slot = i % 4;
        if (slot === 0) page = doc.addPage([PW, PH]);
        const col = slot % 2, row = Math.floor(slot / 2);
        const mx = (PW - 2 * CW) / 2, my = (PH - 2 * CH) / 2;
        x = mx + col * CW;
        y = PH - my - CH - row * CH;
      } else if (layout === '2up') {
        const slot = i % 2;
        if (slot === 0) page = doc.addPage([PW, PH]);
        const block = 2 * CH + GAP, top = (PH - block) / 2;
        x = (PW - CW) / 2;
        y = slot === 0 ? PH - top - CH : top;
      } else {
        page = doc.addPage([PW, PH]);
        x = (PW - CW) / 2; y = (PH - CH) / 2;
      }
      page.drawImage(img, { x, y, width: CW, height: CH });
      page.drawRectangle({ x, y, width: CW, height: CH, borderColor: cut, borderWidth: 0.6, dashArray: [3, 3] });
      const pn = Math.floor(i / perPage) + 1;
      if (layout !== '4up') {
        const foot = 'KasKita - BolangCorp  |  Kartu iuran ' + year + '  |  Halaman ' + pn + '/' + total + '  |  ' + C.dateLabel(C.today());
        page.drawText(foot, { x: 14 * mm, y: 8 * mm, size: 7.5, font, color: grey });
      }
      await new Promise(res => setTimeout(res, 0));
    }
    const bytes = await doc.save();
    let bin = ''; const CH2 = 0x8000;
    for (let i = 0; i < bytes.length; i += CH2) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH2));
    return 'data:application/pdf;base64,' + btoa(bin);
  }
  root.KasCards = { qrSVG, cardHTML, printCards, cardJPG, cardsPDF, matrix };
})(typeof self !== 'undefined' ? self : this);
