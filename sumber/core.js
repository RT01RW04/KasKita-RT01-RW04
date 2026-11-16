/* KasKita v3 — logika pembukuan murni, tanpa dependensi. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KasCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const SCHEMA_VERSION = 3;
  const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  const IN_CATEGORIES = ['Iuran warga','Sumbangan','Donasi','Pemasukan lain'];
  const OUT_CATEGORIES = ['Kebersihan','Keamanan','Perbaikan fasilitas','Kegiatan warga','Sosial','Administrasi','Pengeluaran lain'];
  const METHODS = ['Tunai','Transfer','QRIS'];
  const ROLES = ['admin','bendahara','viewer'];
  const FUND_TYPES = [{id:'wajib',label:'Iuran bulanan',short:'Iuran'}];
  const LEGACY_FUND_TYPES = [...FUND_TYPES,{id:'sosial',label:'Kas sosial (lama)',short:'Sosial'},{id:'jimpitan',label:'Jimpitan (lama)',short:'Jimpitan'},{id:'donasi',label:'Donasi (lama)',short:'Donasi'}];
  const SOURCE_NAMES = []; // Tidak menyertakan nama warga dalam repo publik.
  const MAX_MONEY = 1000000000000;
  // Hash PBKDF2-SHA256 100.000 iterasi untuk password awal. Semua akun wajib ganti password saat login pertama.
  const DEFAULT_USERS = [
    {id:'u-admin',username:'bendahara1',name:'Bendahara 1',role:'admin',salt:'4f3fd0f402c7e0ac520583078ac99c57',hash:'20a6457350d14a203cb6cb31476e2a49b355181e332021307c8b353a4fb60cb4',mustChange:true},
    {id:'u-bend2',username:'bendahara2',name:'Bendahara 2',role:'bendahara',salt:'46b6aa498a55a6edfc1097c49025af91',hash:'d6dfc55aad6dab3941490c6db0faaa0884450675b04b4d8bc83866dfd2534180',mustChange:true},
    {id:'u-ketua',username:'ketua',name:'Ketua RT',role:'viewer',salt:'434b95043ad417d99bc855bdfd74b76a',hash:'022ac180aadb18d688c47e7a20a1dd9cb544770421b450da06ac499f9fb95626',mustChange:true},
    {id:'u-sek',username:'sekretaris',name:'Sekretaris',role:'viewer',salt:'c8f3db9753c101afb0b968bfa6f84044',hash:'2e54042cabe124227a9c699ccca419385a25f1fa7e1f11a55fb60c9dbb3a85d2',mustChange:true}
  ];
  const pad = n => String(n).padStart(2, '0');
  const uid = (p='id') => (typeof crypto !== 'undefined' && crypto.randomUUID) ? p + '-' + crypto.randomUUID() : p + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  function today(d = new Date()) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
  function validDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const [y,m,d] = s.split('-').map(Number);
    if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return false;
    const dt = new Date(y, m-1, d);
    return dt.getFullYear() === y && dt.getMonth() === m-1 && dt.getDate() === d;
  }
  function validMonth(s) { return typeof s === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(s) && validDate(s + '-01'); }
  function monthOf(date) { return date.slice(0,7); }
  function monthLabel(key, short=false) { if (!validMonth(key)) return '—'; const [y,m] = key.split('-').map(Number); return `${(short?SHORT:MONTHS)[m-1]} ${y}`; }
  function addMonths(key, n) { const [y,m] = key.split('-').map(Number); const d = new Date(y, m-1+n, 1); return `${d.getFullYear()}-${pad(d.getMonth()+1)}`; }
  function monthRange(start, end) { const out=[]; if (!validMonth(start)||!validMonth(end)||start>end) return out; let k=start; while(k<=end && out.length<240){out.push(k);k=addMonths(k,1);} return out; }
  function money(n) { return 'Rp' + new Intl.NumberFormat('id-ID', {maximumFractionDigits:0}).format(Number(n)||0); }
  function number(n) { return new Intl.NumberFormat('id-ID', {maximumFractionDigits:0}).format(Number(n)||0); }
  function compact(n) { const a=Math.abs(n); if(a>=1e9) return (n/1e9).toLocaleString('id-ID',{maximumFractionDigits:1})+' M'; if(a>=1e6) return (n/1e6).toLocaleString('id-ID',{maximumFractionDigits:1})+' jt'; if(a>=1e3) return (n/1e3).toLocaleString('id-ID',{maximumFractionDigits:0})+' rb'; return number(n); }
  function parseAmount(v) {
    if (typeof v === 'number') return Number.isSafeInteger(v) && v >= 0 && v <= MAX_MONEY ? v : NaN;
    if (typeof v !== 'string') return NaN;
    let s = v.trim().replace(/^Rp\s*/i,'').replace(/\s|\./g,'');
    if (!/^\d+$/.test(s)) return NaN;
    const n = Number(s);
    return Number.isSafeInteger(n) && n <= MAX_MONEY ? n : NaN;
  }
  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function dateLabel(s, short=false) { if(!validDate(s)) return '—'; const [y,m,d]=s.split('-').map(Number); return `${d} ${(short?SHORT:MONTHS)[m-1]} ${y}`; }
  function normalizePhone(v) {
    let s=String(v||'').replace(/[^\d+]/g,'');
    if(s.startsWith('+')) s=s.slice(1);
    if(s.startsWith('0')) s='62'+s.slice(1);
    if(s.startsWith('8')) s='62'+s;
    return /^\d{9,15}$/.test(s)?s:'';
  }
  function randomToken(bytes=12) { const a=new Uint8Array(bytes); if(typeof crypto!=='undefined'&&crypto.getRandomValues)crypto.getRandomValues(a);else for(let i=0;i<a.length;i++)a[i]=Math.floor(Math.random()*256); return [...a].map(b=>b.toString(16).padStart(2,'0')).join(''); }
  function fundLabel(kind){return (LEGACY_FUND_TYPES.find(f=>f.id===kind)||FUND_TYPES[0]).label;}
  function fundAmount(state,kind){return kind==='wajib'?state.settings.monthlyDue:(state.settings.funds?.[kind]?.amount||0);}
  function fundRequired(state,kind){return kind!=='donasi'&&fundAmount(state,kind)>0;}
  function defaultSettings() {
    const year = new Date().getFullYear();
    return { name:'KasKita', rtId:randomToken(), rt:'00', rw:'00', neighborhood:'', singleDueMode:true, monthlyDue:10000, funds:{wajib:{amount:10000},sosial:{amount:0},jimpitan:{amount:0},donasi:{amount:0}}, openingBalance:0, startMonth:`${year}-01`, onboarded:false,
      officers:{ketua:'',sekretaris:'',bendahara1:'',bendahara2:''}, customCategories:{in:[],out:[]}, logo:'', paymentNote:'', googleClientId:'' };
  }
  function defaultState(withNames=true) {
    const startMonth = defaultSettings().startMonth;
    return {
      version: SCHEMA_VERSION,
      settings: defaultSettings(),
      residents: withNames ? SOURCE_NAMES.map((name,i)=>({id:'w'+pad(i+1), name, active:true, since:startMonth, note:'', phone:'', cardToken:randomToken()})) : [],
      transactions: [], users: DEFAULT_USERS.map(u=>({...u})), audit: [], createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
    };
  }
  function residentById(state,id) { return state.residents.find(r=>r.id===id); }
  function activeResidents(state) { return state.residents.filter(r=>r.active); }
  function allCategories(state,type) { const base=type==='in'?IN_CATEGORIES:OUT_CATEGORIES; const custom=state.settings.customCategories?.[type]||[]; return [...new Set([...base,...custom])]; }
  function dueKind(d){return d&&d.kind?d.kind:'wajib';}
  function duesMap(state,kind='wajib') { const m=new Map(); for(const tx of state.transactions) for(const d of (tx.dues||[])) if(dueKind(d)===kind) m.set(tx.residentId+'|'+d.month,{tx,due:d}); return m; }
  function findDue(state,residentId,month,excludeId,kind='wajib') { return state.transactions.find(t=>t.id!==excludeId && t.residentId===residentId && (t.dues||[]).some(d=>d.month===month&&dueKind(d)===kind)); }
  function unpaidMonths(state,residentId,year,kind='wajib') {
    if (!Number.isInteger(year) || year<2000 || year>2100) return [];
    const dm=duesMap(state,kind); const out=[];
    for(let i=1;i<=12;i++){const m=`${year}-${pad(i)}`; if(!dm.has(residentId+'|'+m)) out.push(m);}
    return out;
  }
  function fundMonthStats(state,month){const dmAll=FUND_TYPES.map(f=>({kind:f.id,map:duesMap(state,f.id)}));const eligible=state.residents.filter(r=>r.active&&r.since<=month);const out={};for(const {kind,map} of dmAll){let collected=0,paidCount=0;for(const [key,v] of map){if(key.endsWith('|'+month))collected+=v.due.amount;}for(const r of eligible){if(map.has(r.id+'|'+month))paidCount++;}const amount=fundAmount(state,kind);out[kind]={collected,paidCount,eligibleCount:eligible.length,amount,target:fundRequired(state,kind)?eligible.length*amount:0,required:fundRequired(state,kind)};}return out;}
  function cardPayload(state,resident){return JSON.stringify({app:'KasKita',v:3,rt:state.settings.rtId,w:resident.id,t:resident.cardToken});}
  function parseCardPayload(text){try{const o=JSON.parse(String(text));if(!o||o.app!=='KasKita'||o.v!==3||typeof o.rt!=='string'||typeof o.w!=='string'||typeof o.t!=='string')return null;if(o.rt.length>80||o.w.length>80||o.t.length>80)return null;return o;}catch(e){return null;}}
  function findResidentByCard(state,payload){const p=typeof payload==='string'?parseCardPayload(payload):payload;if(!p)return {ok:false,reason:'QR bukan kartu KasKita yang dikenali.'};if(p.rt!==state.settings.rtId)return {ok:false,reason:'Kartu ini milik RT lain. Gunakan data/cadangan RT yang sesuai.'};const r=residentById(state,p.w);if(!r)return {ok:false,reason:'Warga pada kartu tidak ditemukan di buku ini.'};if(r.cardToken!==p.t)return {ok:false,reason:'QR kartu sudah diganti/tidak berlaku. Cetak kartu terbaru.'};return {ok:true,resident:r};}
  function totalBalance(state) { return state.settings.openingBalance + state.transactions.reduce((s,t)=>s+(t.type==='in'?t.amount:-t.amount),0); }
  function stats(state, month) {
    const first = month+'-01';
    const next = addMonths(month,1)+'-01';
    let before=state.settings.openingBalance, income=0, expense=0, duesCash=0, otherIncome=0;
    const inCats={}, outCats={};
    for (const t of state.transactions) {
      if (t.date < first) { before += t.type==='in'?t.amount:-t.amount; continue; }
      if (t.date >= next) continue;
      if (t.type==='in') { income+=t.amount; inCats[t.category]=(inCats[t.category]||0)+t.amount; if(t.dues && t.dues.length) duesCash+=t.amount; else otherIncome+=t.amount; }
      else { expense+=t.amount; outCats[t.category]=(outCats[t.category]||0)+t.amount; }
    }
    const dm=duesMap(state);
    const eligible=state.residents.filter(r=>r.active && r.since<=month);
    const paid=eligible.filter(r=>dm.has(r.id+'|'+month));
    const unpaid=eligible.filter(r=>!dm.has(r.id+'|'+month));
    let collected=0;
    for (const [key,v] of dm) if(key.endsWith('|'+month)) collected+=v.due.amount;
    return { month, opening:before, income, expense, closing:before+income-expense, balance:totalBalance(state), inCats, outCats, duesCash, otherIncome, funds:fundMonthStats(state,month),
      target:eligible.length*state.settings.monthlyDue, collected, paidCount:paid.length, eligibleCount:eligible.length, unpaidCount:unpaid.length,
      paidResidents:paid, unpaidResidents:unpaid, rate:eligible.length?Math.round(paid.length/eligible.length*100):0 };
  }
  function yearSeries(state,year) { return Array.from({length:12},(_,i)=>{const m=`${year}-${pad(i+1)}`;let income=0,expense=0;for(const t of state.transactions)if(monthOf(t.date)===m){if(t.type==='in')income+=t.amount;else expense+=t.amount;}return {month:m,income,expense};}); }
  function fundArrears(state,resident,kind,through) {
    if(!fundRequired(state,kind))return [];
    const end = through < monthOf(today()) ? through : monthOf(today());
    const start = resident.since > state.settings.startMonth ? resident.since : state.settings.startMonth;
    const dm=duesMap(state,kind);
    return monthRange(start,end).filter(m=>!dm.has(resident.id+'|'+m));
  }
  function arrears(state,resident,through) { return fundArrears(state,resident,'wajib',through); }
  function residentYear(state,resident,year) {
    const funds={};let paidTotal=0;
    for(const f of FUND_TYPES){const dm=duesMap(state,f.id);const months=[];let total=0;for(let i=1;i<=12;i++){const m=`${year}-${pad(i)}`;const v=dm.get(resident.id+'|'+m);const applicable=resident.since<=m;const paid=!!v;if(paid)total+=v.due.amount;months.push({month:m,applicable,paid,future:m>monthOf(today()),amount:v?v.due.amount:0,txId:v?v.tx.id:null});}const ar=fundArrears(state,resident,f.id,`${year}-12`);funds[f.id]={months,paidTotal:total,arrears:ar,arrearsAmount:ar.length*fundAmount(state,f.id),required:fundRequired(state,f.id),amount:fundAmount(state,f.id)};paidTotal+=total;}
    const w=funds.wajib;
    return {year,months:w.months,paidTotal,arrears:w.arrears,arrearsAmount:w.arrearsAmount,funds};
  }
  function rtTitle(state) { const s=state.settings; return `KAS RT ${s.rt} / RW ${s.rw}${s.neighborhood ? ' · '+s.neighborhood : ''}`; }
  function officerLines(state) { const o=state.settings.officers||{}; const lines=[]; if(o.ketua)lines.push(`Ketua RT: ${o.ketua}`); if(o.sekretaris)lines.push(`Sekretaris: ${o.sekretaris}`); if(o.bendahara1)lines.push(`Bendahara 1: ${o.bendahara1}`); if(o.bendahara2)lines.push(`Bendahara 2: ${o.bendahara2}`); return lines; }
  function buildReport(state,month,includeNames=false) {
    const s=stats(state,month);
    const lines=[`*LAPORAN ${rtTitle(state)}*`, `Periode: ${monthLabel(month)}`, ...officerLines(state), '',
      '*RINGKASAN KAS*', `Saldo awal bulan: ${money(s.opening)}`, `Pemasukan: ${money(s.income)}`, `Pengeluaran: ${money(s.expense)}`, `Saldo akhir bulan: ${money(s.closing)}`, '',
      '*IURAN WARGA*', `Iuran untuk ${monthLabel(month)}: ${s.paidCount}/${s.eligibleCount} warga membayar`, `Nominal iuran periode ini: ${money(s.collected)}`, `Target iuran bulanan: ${money(s.target)}`];
    if (Object.keys(s.inCats).length) { lines.push('', '*RINCIAN PEMASUKAN*'); for(const [k,v] of Object.entries(s.inCats)) lines.push(`• ${k}: ${money(v)}`); }
    if (Object.keys(s.outCats).length) { lines.push('', '*RINCIAN PENGELUARAN*'); for(const [k,v] of Object.entries(s.outCats)) lines.push(`• ${k}: ${money(v)}`); }
    if (includeNames && s.unpaidResidents.length) { lines.push('', `*BELUM MEMBAYAR IURAN ${monthLabel(month).toUpperCase()}*`); s.unpaidResidents.forEach((r,i)=>lines.push(`${i+1}. ${r.name}`)); }
    lines.push('', 'Catatan: pemasukan/pengeluaran mengikuti tanggal transaksi; iuran dirinci menurut bulan iuran.', 'Dibuat dengan KasKita · ' + dateLabel(today()));
    return lines.join('\n');
  }
  function residentMessage(state,resident,through) {
    const end=through||monthOf(today());const lines=[`*PEMBERITAHUAN IURAN ${rtTitle(state)}*`, `Kepada Yth. Bapak/Ibu ${resident.name}`, ''];let total=0,any=false;
    for(const f of FUND_TYPES){if(!fundRequired(state,f.id))continue;const ar=fundArrears(state,resident,f.id,end);if(!ar.length)continue;any=true;const amount=ar.length*fundAmount(state,f.id);total+=amount;lines.push(`*${f.label}* — ${money(amount)}`);ar.forEach(m=>lines.push(`• ${monthLabel(m)}: ${money(fundAmount(state,f.id))}`));lines.push('');}
    if(any)lines.push(`*Total kewajiban tercatat: ${money(total)}*`);else lines.push(`Alhamdulillah, iuran bulanan tercatat lunas sampai ${monthLabel(end)}. Terima kasih.`);
    if(state.settings.paymentNote)lines.push('', state.settings.paymentNote);
    lines.push('', 'Mohon konfirmasi bila sudah membayar. Terima kasih.', ...officerLines(state).slice(0,1), 'Dikirim melalui KasKita');
    return lines.join('\n');
  }
  function csvCell(v) { let s=String(v??''); if (/^[=+\-@\t\r]/.test(s)) s="'"+s; return '"'+s.replace(/"/g,'""')+'"'; }
  function transactionsCSV(state,txs) {
    const rows=[['Tanggal','Jenis','Kategori','Jenis kas','Warga','Bulan iuran','Metode','Nominal (Rp)','Catatan','ID']];
    for(const t of [...txs].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt))) rows.push([t.date,t.type==='in'?'Pemasukan':'Pengeluaran',t.category,[...new Set((t.dues||[]).map(d=>fundLabel(dueKind(d))))].join(', '),residentById(state,t.residentId)?.name||'',(t.dues||[]).map(d=>d.month).join(', '),t.method,t.amount,t.note,t.id]);
    return '\uFEFF'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n');
  }
  function validateState(raw) {
    if (!raw || typeof raw!=='object' || ![1,2,3].includes(raw.version)) throw new Error('Format cadangan tidak dikenali. Gunakan file JSON dari KasKita.');
    const base=defaultState(false);
    const rs=raw.settings||{};
    const str=(v,max,label,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw new Error(label+' tidak valid.');return v.trim();};
    const settings={...base.settings};
    settings.name=str(rs.name??'KasKita',80,'Nama aplikasi',true);
    settings.rtId=typeof rs.rtId==='string'&&/^[a-f0-9]{24}$/.test(rs.rtId)?rs.rtId:randomToken();
    settings.rt=str(rs.rt??'00',10,'RT',true); settings.rw=str(rs.rw??'00',10,'RW',true);
    settings.neighborhood=str(rs.neighborhood??'',120,'Nama lingkungan');
    settings.monthlyDue=rs.singleDueMode === true ? parseAmount(rs.monthlyDue) : 10000; settings.singleDueMode=true; settings.openingBalance=parseAmount(rs.openingBalance);
    if(!Number.isInteger(settings.monthlyDue)||settings.monthlyDue>1000000000)throw new Error('Nominal iuran tidak valid.');
    if(!Number.isInteger(settings.openingBalance))throw new Error('Saldo awal tidak valid.');
    if(!validMonth(rs.startMonth)||rs.startMonth>monthOf(today()))throw new Error('Bulan mulai pembukuan tidak valid atau masih di masa depan.');
    settings.startMonth=rs.startMonth; settings.onboarded=!!rs.onboarded;
    const rf=rs.funds||{};settings.funds={wajib:{amount:settings.monthlyDue},sosial:{amount:0},jimpitan:{amount:0},donasi:{amount:0}};
    for(const k of ['sosial','jimpitan','donasi']){const a=parseAmount(rf[k]?.amount??0);if(!Number.isInteger(a)||a<0||a>1000000000)throw new Error('Nominal '+fundLabel(k)+' tidak valid.');settings.funds[k].amount=a;}
    const ro=rs.officers||{};
    settings.officers={ketua:str(ro.ketua??'',80,'Nama ketua RT'),sekretaris:str(ro.sekretaris??'',80,'Nama sekretaris'),bendahara1:str(ro.bendahara1??rs.treasurer??'',80,'Nama bendahara 1'),bendahara2:str(ro.bendahara2??'',80,'Nama bendahara 2')};
    settings.paymentNote=str(rs.paymentNote??'',500,'Instruksi pembayaran');
    settings.googleClientId=str(rs.googleClientId??'',200,'Google Client ID');
    settings.logo=typeof rs.logo==='string'&&rs.logo.length<=400000&&(/^data:image\/(png|jpeg|webp);base64,/.test(rs.logo)||rs.logo==='')?rs.logo:'';
    const cc=rs.customCategories||{};
    const cleanCats=(arr,type)=>{if(arr===undefined)return [];if(!Array.isArray(arr)||arr.length>50)throw new Error('Kategori tambahan tidak valid.');const baseCats=type==='in'?IN_CATEGORIES:OUT_CATEGORIES;const out=[];for(const c of arr){const s=str(c,60,'Kategori',true);if(!baseCats.includes(s)&&!out.includes(s))out.push(s);}return out;};
    settings.customCategories={in:cleanCats(cc.in,'in'),out:cleanCats(cc.out,'out')};
    if(!Array.isArray(raw.residents)||raw.residents.length>2000)throw new Error('Data warga tidak valid (maksimal 2.000).');
    const ids=new Set(), names=new Set();
    const residents=raw.residents.map(r=>{
      if(!r||typeof r!=='object')throw new Error('Data warga tidak valid.');
      const id=str(r.id,80,'ID warga',true), name=str(r.name,100,'Nama warga',true);
      if(ids.has(id))throw new Error('Ada ID warga ganda.'); ids.add(id);
      if(names.has(name.toLocaleLowerCase('id')))throw new Error('Ada nama warga ganda: '+name); names.add(name.toLocaleLowerCase('id'));
      if(!validMonth(r.since))throw new Error('Bulan mulai warga tidak valid: '+name);
      const phone=normalizePhone(r.phone||'');
      const cardToken=typeof r.cardToken==='string'&&/^[a-f0-9]{24}$/.test(r.cardToken)?r.cardToken:randomToken();
      return {id,name,active:!!r.active,since:r.since,note:str(r.note??'',300,'Catatan warga'),phone,cardToken};
    });
    if(!Array.isArray(raw.transactions)||raw.transactions.length>50000)throw new Error('Data transaksi tidak valid (maksimal 50.000).');
    const tids=new Set(), paid=new Set();
    const transactions=raw.transactions.map(t=>{
      if(!t||typeof t!=='object')throw new Error('Transaksi tidak valid.');
      const id=str(t.id,80,'ID transaksi',true); if(tids.has(id))throw new Error('Ada ID transaksi ganda.');tids.add(id);
      if(!['in','out'].includes(t.type))throw new Error('Jenis transaksi tidak valid.');
      if(!validDate(t.date)||t.date>today())throw new Error('Tanggal transaksi tidak valid atau masih di masa depan.');
      const amount=parseAmount(t.amount); if(!Number.isInteger(amount)||amount<1)throw new Error('Nominal transaksi harus lebih dari nol.');
      const category=str(t.category,60,'Kategori',true);
      if(!allCategories({settings},t.type).includes(category))throw new Error('Kategori tidak dikenali: '+category);
      const method=str(t.method,20,'Metode',true); if(!METHODS.includes(method))throw new Error('Metode pembayaran tidak dikenali.');
      const residentId=t.residentId?str(t.residentId,80,'ID warga'):null;
      if(residentId&&!ids.has(residentId))throw new Error('Transaksi merujuk ke warga yang tidak ada.');
      let dues=[];
      if(t.dues!==undefined){
        if(!Array.isArray(t.dues)||t.dues.length>120)throw new Error('Data bulan iuran tidak valid.');
        const ms=new Set(); let sum=0;
        dues=t.dues.map(d=>{if(!d||!validMonth(d.month))throw new Error('Bulan iuran tidak valid.');const kind=dueKind(d);if(!LEGACY_FUND_TYPES.some(f=>f.id===kind))throw new Error('Jenis kas tidak valid.');const a=parseAmount(d.amount);if(!Number.isInteger(a)||a<1)throw new Error('Nominal iuran tidak valid.');const key=d.month+'|'+kind;if(ms.has(key))throw new Error('Bulan/jenis kas ganda dalam satu transaksi.');ms.add(key);sum+=a;return {month:d.month,kind,amount:a};});
        if(dues.length){if(t.type!=='in'||!residentId||category!=='Iuran warga')throw new Error('Iuran harus berupa pemasukan warga dengan kategori Iuran warga.');if(sum!==amount)throw new Error('Total iuran tidak sama dengan nominal transaksi.');for(const mk of ms){const k=residentId+'|'+mk;if(paid.has(k))throw new Error('Iuran warga untuk bulan dan jenis kas yang sama tercatat dua kali.');paid.add(k);}}
      }
      if(category==='Iuran warga'&&!dues.length)throw new Error('Iuran warga wajib memiliki bulan iuran.');
      const createdAt=typeof t.createdAt==='string'&&!isNaN(Date.parse(t.createdAt))?t.createdAt:new Date().toISOString();
      const updatedAt=typeof t.updatedAt==='string'&&!isNaN(Date.parse(t.updatedAt))?t.updatedAt:createdAt;
      return {id,type:t.type,date:t.date,amount,category,residentId,dues,method,note:str(t.note??'',300,'Catatan'),createdAt,updatedAt};
    });
    const rawUsers=Array.isArray(raw.users)&&raw.users.length?raw.users:DEFAULT_USERS;
    if(rawUsers.length>20)throw new Error('Maksimal 20 akun.');
    const uids=new Set(),unames=new Set();
    const users=rawUsers.map(u=>{
      if(!u||typeof u!=='object')throw new Error('Akun tidak valid.');
      const id=str(u.id,80,'ID akun',true),username=str(u.username,32,'Username',true).toLowerCase();
      if(!/^[a-z0-9._-]{3,32}$/.test(username))throw new Error('Username harus 3–32 karakter huruf/angka/._-');
      if(uids.has(id)||unames.has(username))throw new Error('Akun ganda.');uids.add(id);unames.add(username);
      if(!ROLES.includes(u.role))throw new Error('Role akun tidak valid.');
      if(!/^[a-f0-9]{32}$/.test(u.salt)||!/^[a-f0-9]{64}$/.test(u.hash))throw new Error('Hash password akun tidak valid.');
      return {id,username,name:str(u.name||username,80,'Nama akun',true),role:u.role,salt:u.salt,hash:u.hash,mustChange:!!u.mustChange};
    });
    if(!users.some(u=>u.role==='admin'))throw new Error('Harus ada minimal satu akun admin.');
    const audit=Array.isArray(raw.audit)?raw.audit.slice(0,100).filter(a=>a&&typeof a.action==='string'&&typeof a.detail==='string').map(a=>({id:String(a.id||uid('a')).slice(0,80),at:String(a.at||'').slice(0,40),action:a.action.slice(0,60),detail:a.detail.slice(0,300)})):[];
    const state={version:SCHEMA_VERSION,settings,residents,transactions,users,audit,createdAt:typeof raw.createdAt==='string'?raw.createdAt:base.createdAt,updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:base.updatedAt};
    if(totalBalance(state)<0)throw new Error('Saldo akhir negatif. Periksa saldo awal, pemasukan, dan pengeluaran pada cadangan.');
    return state;
  }
  return {SCHEMA_VERSION,MONTHS,SHORT,IN_CATEGORIES,OUT_CATEGORIES,METHODS,ROLES,FUND_TYPES,SOURCE_NAMES,DEFAULT_USERS,MAX_MONEY,pad,uid,today,validDate,validMonth,monthOf,monthLabel,addMonths,monthRange,money,number,compact,parseAmount,esc,dateLabel,normalizePhone,randomToken,fundLabel,fundAmount,fundRequired,defaultSettings,defaultState,residentById,activeResidents,allCategories,dueKind,duesMap,findDue,fundMonthStats,fundArrears,cardPayload,parseCardPayload,findResidentByCard,totalBalance,stats,yearSeries,arrears,residentYear,unpaidMonths,rtTitle,officerLines,buildReport,residentMessage,transactionsCSV,validateState};
});
