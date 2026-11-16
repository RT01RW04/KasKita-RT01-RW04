/* KasKita — pemindai QR kartu warga. Kamera hanya aktif setelah izin pengguna. */
(function (root) {
  'use strict';

  let stream = null,
    timer = null,
    active = false,
    detector = null,
    facing = 'environment',
    generation = 0;
  let videoEl = null,
    statusEl = null,
    callback = null,
    lastText = '',
    lastAt = 0,
    torchOn = false;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true
  });
  function setStatus(msg, kind = '') {
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.dataset.kind = kind;
    }
  }
  async function initDetector() {
    detector = null;
    try {
      if ('BarcodeDetector' in root) {
        const formats = await root.BarcodeDetector.getSupportedFormats();
        if (formats.includes('qr_code')) detector = new root.BarcodeDetector({
          formats: ['qr_code']
        });
      }
    } catch (e) {
      detector = null;
    }
  }
  function decodeWithJsQR(source, w, h) {
    if (typeof root.jsQR !== 'function') return null;
    const scale = Math.min(1, 720 / Math.max(w, h));
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const res = root.jsQR(img.data, canvas.width, canvas.height, {
      inversionAttempts: 'dontInvert'
    });
    return res ? res.data : null;
  }
  async function tick() {
    if (!active || !videoEl) return;
    try {
      if (videoEl.readyState >= 2 && videoEl.videoWidth) {
        let text = null;
        if (detector) {
          try {
            const codes = await detector.detect(videoEl);
            if (codes && codes.length) text = codes[0].rawValue;
          } catch (e) {
            detector = null;
          }
        }
        if (!text) text = decodeWithJsQR(videoEl, videoEl.videoWidth, videoEl.videoHeight);
        if (text) {
          const now = Date.now();
          if (text !== lastText || now - lastAt > 3500) {
            lastText = text;
            lastAt = now;
            if (callback) callback(text);
          }
        }
      }
    } catch (e) {/* lanjutkan pemindaian */}
    if (active) timer = setTimeout(tick, 180);
  }
  async function start(video, status, onDetect) {
    stop();
    const run = ++generation;
    videoEl = video;
    statusEl = status;
    callback = onDetect;
    lastText = '';
    lastAt = 0;
    torchOn = false;
    if (!root.isSecureContext) {
      setStatus('Kamera membutuhkan HTTPS atau localhost.', 'error');
      return false;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('Browser ini tidak mendukung kamera. Gunakan input manual atau unggah foto kartu.', 'error');
      return false;
    }
    setStatus('Meminta izin kamera…');
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: {
            ideal: facing
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        }
      });
      if (run !== generation) {
        media.getTracks().forEach(t => t.stop());
        return false;
      }
      stream = media;
      videoEl.srcObject = stream;
      await videoEl.play();
      if (run !== generation) {
        stop(false);
        return false;
      }
      active = true;
      await initDetector();
      if (run !== generation) {
        stop(false);
        return false;
      }
      setStatus(detector ? 'Arahkan kamera ke QR pada kartu warga.' : 'Arahkan kamera ke QR pada kartu warga (mode kompatibel).');
      tick();
      return true;
    } catch (e) {
      if (run !== generation) return false;
      const map = {
        NotAllowedError: 'Izin kamera ditolak. Izinkan kamera di situs ini, atau gunakan input manual/unggah foto.',
        NotFoundError: 'Kamera tidak ditemukan. Gunakan input manual atau unggah foto kartu.',
        NotReadableError: 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.',
        SecurityError: 'Kamera diblokir. Buka aplikasi lewat HTTPS.'
      };
      setStatus(map[e.name] || 'Kamera tidak dapat dibuka: ' + e.message, 'error');
      stop(false);
      return false;
    }
  }
  function stop(clearStatus = true) {
    generation++;
    active = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if (videoEl) {
      try {
        videoEl.pause();
        videoEl.srcObject = null;
      } catch (e) {}
    }
    if (clearStatus) setStatus('Kamera dimatikan.');
  }
  async function switchCamera() {
    facing = facing === 'environment' ? 'user' : 'environment';
    if (videoEl && callback) return start(videoEl, statusEl, callback);
  }
  async function toggleTorch() {
    if (!stream) return false;
    const track = stream.getVideoTracks()[0];
    if (!track) return false;
    try {
      const cap = track.getCapabilities ? track.getCapabilities() : {};
      if (!cap.torch) {
        setStatus('Lampu kamera tidak didukung perangkat ini.', 'error');
        return false;
      }
      torchOn = !torchOn;
      await track.applyConstraints({
        advanced: [{
          torch: torchOn
        }]
      });
      return torchOn;
    } catch (e) {
      setStatus('Lampu kamera tidak dapat diubah.', 'error');
      return false;
    }
  }
  async function scanImageFile(file) {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error('Gagal membaca gambar.'));
        i.src = url;
      });
      if (detector) {
        try {
          const codes = await detector.detect(img);
          if (codes && codes.length) return codes[0].rawValue;
        } catch (e) {}
      }
      return decodeWithJsQR(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  function isActive() {
    return active;
  }
  root.KasScanner = {
    start,
    stop,
    switchCamera,
    toggleTorch,
    scanImageFile,
    isActive
  };
})(typeof self !== 'undefined' ? self : this);
