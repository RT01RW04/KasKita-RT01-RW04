/* KasKita — kunci aplikasi lokal. Bukan pengganti keamanan server. */
(function (root) {
  'use strict';

  const ITER = 100000;
  const SESSION_KEY = 'kaskita.session.v2';
  const enc = new TextEncoder();
  function hexToBytes(hex) {
    const a = new Uint8Array(hex.length / 2);
    for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return a;
  }
  function bytesToHex(buf) {
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function available() {
    return !!(root.crypto && crypto.subtle);
  }
  async function hash(password, saltHex) {
    if (!available()) throw new Error('Kunci aplikasi membutuhkan HTTPS atau localhost.');
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: hexToBytes(saltHex),
      iterations: ITER,
      hash: 'SHA-256'
    }, key, 256);
    return bytesToHex(bits);
  }
  function randomSalt() {
    return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  }
  async function verify(user, password) {
    if (!user) return false;
    const h = await hash(password, user.salt);
    return h === user.hash;
  }
  function session() {
    try {
      return sessionStorage.getItem(SESSION_KEY) || '';
    } catch (e) {
      return '';
    }
  }
  function setSession(username) {
    try {
      sessionStorage.setItem(SESSION_KEY, username);
    } catch (e) {}
  }
  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }
  function currentUser(state) {
    const u = session();
    return state.users.find(x => x.username === u) || null;
  }
  const PERMS = {
    admin: ['view', 'manage_transactions', 'manage_residents', 'settings', 'users', 'backup', 'restore', 'reset', 'drive', 'categories', 'logo'],
    bendahara: ['view', 'manage_transactions', 'manage_residents', 'backup', 'drive'],
    viewer: ['view']
  };
  function can(user, perm) {
    return !!user && (PERMS[user.role] || []).includes(perm);
  }
  function roleLabel(role) {
    return role === 'admin' ? 'Admin penuh' : role === 'bendahara' ? 'Bendahara' : 'Hanya lihat';
  }
  root.KasAuth = {
    ITER,
    hash,
    randomSalt,
    verify,
    session,
    setSession,
    clearSession,
    currentUser,
    can,
    roleLabel,
    available
  };
})(typeof self !== 'undefined' ? self : this);
