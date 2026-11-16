/* KasKita — cadangan Google Drive via OAuth (scope drive.file). */
(function (root) {
  'use strict';

  let token = null,
    tokenExp = 0,
    gisPromise = null;
  function loadGIS() {
    if (root.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    if (gisPromise) return gisPromise;
    gisPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => {
        gisPromise = null;
        reject(new Error('Gagal memuat Google Identity. Periksa internet.'));
      };
      document.head.appendChild(s);
    });
    return gisPromise;
  }
  async function getToken(clientId, forceConsent = false) {
    if (!clientId) throw new Error('Isi Google OAuth Client ID di Pengaturan terlebih dahulu.');
    if (!navigator.onLine) throw new Error('Cadangan Drive membutuhkan internet.');
    if (token && Date.now() < tokenExp - 60000 && !forceConsent) return token;
    await loadGIS();
    return new Promise((resolve, reject) => {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: resp => {
            if (resp.error) {
              reject(new Error(resp.error_description || resp.error));
              return;
            }
            token = resp.access_token;
            tokenExp = Date.now() + Number(resp.expires_in || 3600) * 1000;
            resolve(token);
          },
          error_callback: err => reject(new Error(err.message || 'Otorisasi Google dibatalkan.'))
        });
        client.requestAccessToken({
          prompt: forceConsent ? 'consent' : ''
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  async function backup(state, clientId) {
    const accessToken = await getToken(clientId);
    const C = root.KasCore;
    const stamp = C.today() + '-' + new Date().toTimeString().slice(0, 5).replace(':', '');
    const name = `KasKita-RT${state.settings.rt}-${stamp}.json`;
    const metadata = {
      name,
      mimeType: 'application/json',
      appProperties: {
        app: 'kaskita',
        rt: state.settings.rt
      }
    };
    const boundary = 'kaskita' + Date.now().toString(16);
    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(state)}\r\n--${boundary}--`;
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'multipart/related; boundary=' + boundary
      },
      body
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error('Drive menolak unggahan (' + res.status + '). ' + t.slice(0, 180));
    }
    return res.json();
  }
  function signOut() {
    token = null;
    tokenExp = 0;
  }
  root.KasDrive = {
    backup,
    getToken,
    signOut,
    loadGIS
  };
})(typeof self !== 'undefined' ? self : this);
