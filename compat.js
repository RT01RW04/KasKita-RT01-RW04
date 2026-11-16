/* Fallback untuk browser lama. Tetap gunakan HTTPS. */
(function () {
  'use strict';

  if (!('flatMap' in Array.prototype)) {
    Object.defineProperty(Array.prototype, 'flatMap', {
      configurable: true,
      writable: true,
      value: function (fn, thisArg) {
        return Array.prototype.reduce.call(this, function (acc, x, i, arr) {
          return acc.concat(fn.call(thisArg, x, i, arr));
        }, []);
      }
    });
  }
  var modal = document.getElementById('modal');
  if (modal && typeof modal.showModal !== 'function') {
    document.documentElement.classList.add('dialog-compat');
    var shade = document.createElement('div');
    shade.className = 'dialog-compat-shade';
    shade.hidden = true;
    document.body.insertBefore(shade, modal);
    if (!('open' in modal)) Object.defineProperty(modal, 'open', {
      get: function () {
        return modal.hasAttribute('open');
      }
    });
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.showModal = function () {
      shade.hidden = false;
      modal.setAttribute('open', '');
    };
    modal.close = function () {
      modal.removeAttribute('open');
      shade.hidden = true;
    };
  }
  // iOS 12 belum mendukung atribut download. Tampilkan tautan yang dapat diketuk.
  var legacyIOS = /(?:iPhone|iPad|iPod).*OS 12[_\d]*/.test(navigator.userAgent);
  window.KasCompat = {
    legacyIOS: legacyIOS,
    offerFile: function (url, name) {
      var old = document.getElementById('legacy-file-offer');
      if (old) old.remove();
      var box = document.createElement('div');
      box.id = 'legacy-file-offer';
      var label = document.createElement('span');
      label.textContent = 'iOS 12: buka file, lalu pilih Bagikan → Simpan ke File jika tersedia. ';
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Buka ' + name;
      var close = document.createElement('button');
      close.textContent = 'Tutup';
      close.type = 'button';
      close.onclick = function () {
        box.remove();
      };
      box.appendChild(label);
      box.appendChild(link);
      box.appendChild(close);
      document.body.appendChild(box);
    }
  };
})();
