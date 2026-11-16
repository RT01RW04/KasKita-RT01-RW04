/* KasKita — pembuat laporan JPG (canvas) untuk grup WA dan per rumah. */
(function (root) {
  'use strict';

  const C = root.KasCore;
  const GREEN = '#087764',
    DARK = '#173b30',
    MUTED = '#6f7f77',
    LINE = '#e3ebe6',
    LIME = '#d9ef9e';
  function loadImage(src) {
    return new Promise(resolve => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function text(ctx, str, x, y, {
    size = 24,
    weight = 500,
    color = DARK,
    align = 'left',
    max = null
  } = {}) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    let s = String(str !== null && str !== void 0 ? str : '');
    if (max) {
      while (ctx.measureText(s).width > max && s.length > 3) s = s.slice(0, -4) + '…';
    }
    ctx.fillText(s, x, y);
    return ctx.measureText(s).width;
  }
  function wrap(ctx, str, x, y, max, lh, opts = {}) {
    const words = String(str).split(/\s+/);
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > max && line) {
        text(ctx, line, x, y, opts);
        y += lh;
        line = w;
      } else line = test;
    }
    if (line) {
      text(ctx, line, x, y, opts);
      y += lh;
    }
    return y;
  }
  async function header(ctx, state, title, subtitle, logo, W) {
    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, W, 190);
    ctx.fillStyle = 'rgba(255,255,255,.07)';
    ctx.beginPath();
    ctx.arc(W - 60, 20, 150, 0, Math.PI * 2);
    ctx.fill();
    if (logo) {
      ctx.save();
      rr(ctx, 48, 48, 94, 94, 22);
      ctx.clip();
      ctx.drawImage(logo, 48, 48, 94, 94);
      ctx.restore();
    } else {
      ctx.fillStyle = LIME;
      rr(ctx, 48, 48, 94, 94, 22);
      ctx.fill();
      text(ctx, 'RT', 95, 108, {
        size: 38,
        weight: 800,
        color: DARK,
        align: 'center'
      });
    }
    text(ctx, state.settings.name || 'KasKita', 166, 84, {
      size: 30,
      weight: 800,
      color: '#fff'
    });
    text(ctx, C.rtTitle(state), 166, 122, {
      size: 21,
      weight: 600,
      color: '#cfe8df',
      max: W - 220
    });
    text(ctx, 'Laporan kas digital · transparan dan tercatat', 166, 154, {
      size: 17,
      color: '#a9d2c4'
    });
    text(ctx, title, 48, 250, {
      size: 38,
      weight: 800
    });
    text(ctx, subtitle, 48, 286, {
      size: 22,
      color: MUTED
    });
  }
  function row(ctx, label, value, y, W, {
    bold = false,
    color = DARK
  } = {}) {
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(48, y + 16);
    ctx.lineTo(W - 48, y + 16);
    ctx.stroke();
    text(ctx, label, 56, y - 4, {
      size: 23,
      weight: bold ? 800 : 500,
      color: bold ? DARK : MUTED
    });
    text(ctx, value, W - 56, y - 4, {
      size: 23,
      weight: 800,
      color,
      align: 'right'
    });
    return y + 52;
  }
  function signatures(ctx, state, y, W) {
    const o = state.settings.officers || {};
    const cols = [['Ketua RT', o.ketua], ['Sekretaris', o.sekretaris], ['Bendahara', o.bendahara1 || o.bendahara2]];
    const cw = (W - 96) / 3;
    cols.forEach(([label, name], i) => {
      const x = 48 + i * cw + cw / 2;
      text(ctx, label, x, y, {
        size: 20,
        color: MUTED,
        align: 'center'
      });
      ctx.strokeStyle = '#b9c8c0';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x - 90, y + 78);
      ctx.lineTo(x + 90, y + 78);
      ctx.stroke();
      ctx.setLineDash([]);
      text(ctx, name || '(........................)', x, y + 108, {
        size: 21,
        weight: 700,
        align: 'center',
        max: cw - 20
      });
    });
    return y + 150;
  }
  async function monthlyJPG(state, month) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const W = 1080;
    const s = C.stats(state, month);
    const logo = await loadImage(state.settings.logo);
    const inRows = Object.entries(s.inCats),
      outRows = Object.entries(s.outCats);
    const H = 1380 + Math.max(inRows.length, outRows.length) * 34 + (state.settings.paymentNote ? 70 : 0);
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#f4f6f5';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    rr(ctx, 24, 210, W - 48, H - 240, 24);
    ctx.fill();
    await header(ctx, state, 'Laporan Kas Bulanan', `Periode ${C.monthLabel(month)} · Dibuat ${C.dateLabel(C.today())}`, logo, W);
    let y = 350;
    y = row(ctx, 'Saldo awal bulan', C.money(s.opening), y, W);
    y = row(ctx, 'Total pemasukan', '+ ' + C.money(s.income), y, W, {
      color: GREEN
    });
    y = row(ctx, 'Total pengeluaran', '− ' + C.money(s.expense), y, W, {
      color: '#c4534f'
    });
    y = row(ctx, 'Saldo akhir bulan', C.money(s.closing), y, W, {
      bold: true
    });
    y += 24;
    text(ctx, 'IURAN WARGA', 56, y, {
      size: 20,
      weight: 800,
      color: GREEN
    });
    y += 40;
    y = row(ctx, 'Iuran bulanan — warga membayar', `${s.paidCount} / ${s.eligibleCount} warga`, y, W);
    y = row(ctx, 'Iuran bulanan — terkumpul', C.money(s.collected), y, W);
    y = row(ctx, 'Target iuran bulanan', C.money(s.target), y, W);
    for (const f of C.FUND_TYPES.filter(f => f.id !== 'wajib')) {
      const x = s.funds[f.id];
      y = row(ctx, f.label + (x.required ? ` — ${x.paidCount}/${x.eligibleCount} warga` : ''), C.money(x.collected), y, W);
    }
    y += 24;
    const colW = (W - 112) / 2;
    text(ctx, 'RINCIAN PEMASUKAN', 56, y, {
      size: 19,
      weight: 800,
      color: GREEN
    });
    text(ctx, 'RINCIAN PENGELUARAN', 56 + colW + 24, y, {
      size: 19,
      weight: 800,
      color: '#c4534f'
    });
    let yy = y + 36;
    const maxRows = Math.max(inRows.length, outRows.length, 1);
    for (let i = 0; i < maxRows; i++) {
      if (inRows[i]) {
        text(ctx, inRows[i][0], 56, yy, {
          size: 20,
          color: MUTED,
          max: colW - 140
        });
        text(ctx, C.money(inRows[i][1]), 56 + colW, yy, {
          size: 20,
          weight: 700,
          align: 'right'
        });
      } else if (i === 0) text(ctx, 'Belum ada', 56, yy, {
        size: 20,
        color: MUTED
      });
      if (outRows[i]) {
        text(ctx, outRows[i][0], 56 + colW + 24, yy, {
          size: 20,
          color: MUTED,
          max: colW - 140
        });
        text(ctx, C.money(outRows[i][1]), W - 56, yy, {
          size: 20,
          weight: 700,
          align: 'right'
        });
      } else if (i === 0) text(ctx, 'Belum ada', 56 + colW + 24, yy, {
        size: 20,
        color: MUTED
      });
      yy += 34;
    }
    y = yy + 20;
    if (state.settings.paymentNote) {
      y = wrap(ctx, 'Info pembayaran: ' + state.settings.paymentNote, 56, y, W - 112, 28, {
        size: 19,
        color: MUTED
      }) + 10;
    }
    y = signatures(ctx, state, y + 10, W);
    text(ctx, 'Pemasukan/pengeluaran mengikuti tanggal transaksi; iuran menurut bulan iuran.', W / 2, y, {
      size: 17,
      color: MUTED,
      align: 'center'
    });
    text(ctx, 'Dibuat dengan KasKita', W / 2, y + 30, {
      size: 17,
      weight: 700,
      color: GREEN,
      align: 'center'
    });
    return cv.toDataURL('image/jpeg', 0.92);
  }
  async function residentJPG(state, residentId, year) {
    if (root.KasCards && root.KasCards.cardJPG) return root.KasCards.cardJPG(state, residentId, year);
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const r = C.residentById(state, residentId);
    if (!r) throw new Error('Warga tidak ditemukan.');
    const data = C.residentYear(state, r, year);
    const logo = await loadImage(state.settings.logo);
    const W = 1080,
      H = 1600;
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#f4f6f5';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    rr(ctx, 24, 210, W - 48, H - 240, 24);
    ctx.fill();
    await header(ctx, state, 'Kartu Iuran Warga', `Tahun ${year} · ${C.rtTitle(state)}`, logo, W);
    text(ctx, r.name, 56, 350, {
      size: 34,
      weight: 800,
      max: W - 112
    });
    text(ctx, `Mulai iuran ${C.monthLabel(r.since)} · ${r.active ? 'Aktif' : 'Nonaktif'}${r.phone ? ' · WA ' + r.phone : ''}`, 56, 386, {
      size: 20,
      color: MUTED
    });
    let y = 440;
    const colX = [56, 330, 560, 820];
    text(ctx, 'Bulan', colX[0], y, {
      size: 20,
      weight: 800,
      color: GREEN
    });
    text(ctx, 'Status', colX[1], y, {
      size: 20,
      weight: 800,
      color: GREEN
    });
    text(ctx, 'Nominal', colX[3], y, {
      size: 20,
      weight: 800,
      color: GREEN,
      align: 'right'
    });
    y += 20;
    for (const m of data.months) {
      ctx.strokeStyle = LINE;
      ctx.beginPath();
      ctx.moveTo(48, y + 14);
      ctx.lineTo(W - 48, y + 14);
      ctx.stroke();
      text(ctx, C.monthLabel(m.month), colX[0], y + 44, {
        size: 21
      });
      const status = !m.applicable ? 'Belum berlaku' : m.paid ? 'Lunas' : m.future ? 'Akan datang' : 'Belum bayar';
      const color = !m.applicable || m.future ? '#9aa69f' : m.paid ? GREEN : '#b7791f';
      text(ctx, status, colX[1], y + 44, {
        size: 21,
        weight: 700,
        color
      });
      text(ctx, m.paid ? C.money(m.amount) : m.applicable && !m.future ? C.money(state.settings.monthlyDue) : '—', colX[3], y + 44, {
        size: 21,
        weight: 700,
        align: 'right',
        color: m.paid ? GREEN : MUTED
      });
      y += 54;
    }
    y += 24;
    y = row(ctx, 'Total dibayar tahun ini', C.money(data.paidTotal), y, W, {
      bold: true,
      color: GREEN
    });
    y = row(ctx, 'Tunggakan s.d. bulan berjalan', `${data.arrears.length} bulan · ${C.money(data.arrearsAmount)}`, y, W, {
      color: data.arrears.length ? '#b7791f' : GREEN
    });
    if (data.arrears.length) {
      y = wrap(ctx, 'Bulan tertunggak: ' + data.arrears.map(m => C.monthLabel(m, true)).join(', '), 56, y + 8, W - 112, 28, {
        size: 19,
        color: MUTED
      });
    }
    if (state.settings.paymentNote) {
      y = wrap(ctx, 'Info pembayaran: ' + state.settings.paymentNote, 56, y + 12, W - 112, 28, {
        size: 19,
        color: MUTED
      });
    }
    y = signatures(ctx, state, Math.max(y + 30, 1230), W);
    text(ctx, 'Kartu ini dihasilkan otomatis dari buku kas. Mohon konfirmasi bila ada perbedaan.', W / 2, Math.min(y, H - 60), {
      size: 17,
      color: MUTED,
      align: 'center'
    });
    return cv.toDataURL('image/jpeg', 0.92);
  }
  function download(dataUrl, filename) {
    if (window.KasCompat && window.KasCompat.legacyIOS) {
      window.KasCompat.offerFile(dataUrl, filename);
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  async function shareJPG(dataUrl, filename, text) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], filename, {
        type: 'image/jpeg'
      });
      if (navigator.canShare && navigator.canShare({
        files: [file]
      })) {
        await navigator.share({
          files: [file],
          title: filename,
          text
        });
        return true;
      }
    } catch (e) {/* batal atau tidak didukung */}
    download(dataUrl, filename);
    return false;
  }
  root.KasReports = {
    monthlyJPG,
    residentJPG,
    download,
    shareJPG
  };
})(typeof self !== 'undefined' ? self : this);
